"use client";
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import Image from "next/image";
import { createEditor, Transforms, Range, Editor, Descendant } from "slate";
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  useSlateStatic,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { withHistory } from "slate-history";
import isHotkey from "is-hotkey";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/lib/api";
import { Portal } from "@/components/ui/portal";
import { CustomEditor, HOTKEYS, CustomElement } from "./types";
import { withImages, withMentions } from "./plugins";
import { Element, Leaf } from "./elements";
import { Toolbar } from "./toolbar";
import { toggleMark, insertMention } from "./utils";

const CreateArticle: React.FC = () => {
  const [editor] = useState(() =>
    withImages(withMentions(withHistory(withReact(createEditor()))))
  );
  const ref = useRef<HTMLDivElement | null>(null);
  const [target, setTarget] = useState<Range | null>(null);
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [mentionItems, setMentionItems] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const { data, isLoading, error } = useFetchData<any>("/create-article/");

  useEffect(() => {
    if (data) {
      const allItems = [...data.envoys, ...data.clubs, ...data.committees];
      setMentionItems(allItems);
    }
  }, [data]);

  const chars = useMemo(
    () =>
      mentionItems
        .filter((c) => c.toLowerCase().startsWith(search.toLowerCase()))
        .slice(0, 10),
    [mentionItems, search]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (target && chars.length > 0) {
        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            setIndex((index + 1) % chars.length);
            break;
          case "ArrowUp":
            event.preventDefault();
            setIndex((index - 1 + chars.length) % chars.length);
            break;
          case "Tab":
          case "Enter":
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(editor, chars[index]);
            setTarget(null);
            break;
          case "Escape":
            event.preventDefault();
            setTarget(null);
            break;
        }
      }

      for (const hotkey in HOTKEYS) {
        if (isHotkey(hotkey, event as any)) {
          event.preventDefault();
          const mark = HOTKEYS[hotkey];
          toggleMark(editor, mark);
        }
      }
    },
    [chars, editor, index, target]
  );

  useEffect(() => {
    if (target && chars.length > 0) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, target);
      const rect = domRange.getBoundingClientRect();
      if (el) {
        el.style.top = `${rect.top + window.scrollY + 24}px`;
        el.style.left = `${rect.left + window.scrollX}px`;
      }
    }
  }, [chars.length, editor, target]);

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );

  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [
        { text: "Zacznij pisać swój artykuł i użyj @ do wzmianki..." },
      ],
    },
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        setImage(imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) return <div className="text-center">Ładowanie...</div>;
  if (error) return <div>Błąd: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Utwórz artykuł</h1>

      {/* Pole tytułu */}
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Wprowadź tytuł artykułu..."
          className="text-3xl font-bold w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Pole obrazu */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Grafika</h3>
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mb-2 block w-full text-sm text-gray-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-blue-50 file:text-blue-700
        hover:file:bg-blue-100"
          />
          {image ? (
            <div className="mt-4 relative">
              <Image
                src={image}
                width={600}
                height={300}
                alt="Obraz artykułu"
                className="max-w-full h-auto rounded-lg shadow-md"
              />
              <button
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 focus:outline-none"
                aria-label="Usuń obraz"
              >
                X
              </button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={() => {
          const { selection } = editor;

          if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection);
            const wordBefore = Editor.before(editor, start, { unit: "word" });
            const before = wordBefore && Editor.before(editor, wordBefore);
            const beforeRange = before && Editor.range(editor, before, start);
            const beforeText =
              beforeRange && Editor.string(editor, beforeRange);
            const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
            const after = Editor.after(editor, start);
            const afterRange = Editor.range(editor, start, after);
            const afterText = Editor.string(editor, afterRange);
            const afterMatch = afterText.match(/^(\s|$)/);

            if (beforeMatch && afterMatch) {
              setTarget(beforeRange);
              setSearch(beforeMatch[1]);
              setIndex(0);
              return;
            }
          }

          setTarget(null);
        }}
      >
        <Toolbar />
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyDown={onKeyDown}
          placeholder="Zacznij pisać swój artykuł..."
          className="min-h-[300px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {target && chars.length > 0 && (
          <Portal>
            <div
              ref={ref}
              className="absolute z-10 p-1 bg-white rounded-md shadow-lg"
              style={{
                top: "-9999px",
                left: "-9999px",
                position: "absolute",
              }}
            >
              {chars.map((char, i) => (
                <div
                  key={char}
                  className={`p-1 cursor-pointer ${
                    i === index ? "bg-blue-200" : "bg-transparent"
                  }`}
                  onClick={() => {
                    Transforms.select(editor, target);
                    insertMention(editor, char);
                    setTarget(null);
                  }}
                >
                  {char}
                </div>
              ))}
            </div>
          </Portal>
        )}
      </Slate>
      <div className="mt-6">
        <Button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Opublikuj artykuł
        </Button>
      </div>
    </div>
  );
};

export default CreateArticle;
