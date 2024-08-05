"use client";
import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  createEditor,
  Transforms,
  Range,
  Editor,
  Element as SlateElement,
  Descendant,
} from "slate";
import {
  Slate,
  Editable,
  ReactEditor,
  withReact,
  useSlate,
  useSlateStatic,
  useSelected,
  useFocused,
} from "slate-react";
import { withHistory } from "slate-history";
import isHotkey from "is-hotkey";
import isUrl from "is-url";
import imageExtensions from "image-extensions";
import { Button } from "@/components/ui/button";
import { useFetchData } from "@/lib/api";
import { Portal } from "@/components/ui/portal";
import {
  Bold,
  Italic,
  Underline,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
} from "lucide-react";
const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const CreateArticle: React.FC = () => {
  const [editor] = useState(() =>
    withImages(withMentions(withHistory(withReact(createEditor()))))
  );
  const ref = useRef<HTMLDivElement | null>(null);
  const [target, setTarget] = useState<Range | null>(null);
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState("");
  const [mentionItems, setMentionItems] = useState<string[]>([]);

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
        el.style.top = `${rect.top + window.pageYOffset + 24}px`;
        el.style.left = `${rect.left + window.pageXOffset}px`;
      }
    }
  }, [chars.length, editor, target]);

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [
        { text: "Zacznij pisać swój artykuł i użyj @ do wzmianki..." },
      ],
    },
  ];

  if (isLoading) return <div>Ładowanie...</div>;
  if (error) return <div>Błąd: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Utwórz artykuł</h1>
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

const withMentions = (editor: Editor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) =>
    element.type === "mention" ? true : isInline(element);

  editor.isVoid = (element) =>
    element.type === "mention" ? true : isVoid(element);

  return editor;
};

const insertMention = (editor: Editor, character: string) => {
  const mention: any = {
    type: "mention",
    character,
    children: [{ text: "" }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};

const withImages = (editor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) =>
    element.type === "image" ? true : isVoid(element);

  editor.insertData = (data) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result;
            insertImage(editor, url);
          });

          reader.readAsDataURL(file);
        }
      }
    } else if (isImageUrl(text)) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
};

const insertImage = (editor, url) => {
  const text = { text: "" };
  const image = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image);
};

const isImageUrl = (url) => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  return imageExtensions.includes(ext);
};

const Element = (props) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case "mention":
      return (
        <span
          {...attributes}
          contentEditable={false}
          className="bg-blue-200 px-1 rounded inline-block"
        >
          @{element.character}
          {children}
        </span>
      );
    case "image":
      return <Image {...props} />;
    case "block-quote":
      return (
        <blockquote
          style={{ textAlign: element.align }}
          {...attributes}
          className="border-l-4 border-gray-300 pl-4 italic"
        >
          {children}
        </blockquote>
      );
    // ... (other element cases remain the same)
    default:
      return (
        <p style={{ textAlign: element.align }} {...attributes}>
          {children}
        </p>
      );
  }
};

const Image = ({ attributes, children, element }) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div {...attributes}>
      {children}
      <div contentEditable={false} className="relative">
        <img
          src={element.url}
          className={`block max-w-full max-h-80 ${
            selected && focused ? "shadow-outline" : ""
          }`}
        />
        <Button
          variant="ghost"
          onClick={() => Transforms.removeNodes(editor, { at: path })}
          className={`absolute top-2 left-2 bg-white ${
            selected && focused ? "block" : "hidden"
          }`}
        >
          <ImageIcon size={16} />
        </Button>
      </div>
    </div>
  );
};

const InsertImageButton = () => {
  const editor = useSlateStatic();
  return (
    <Button
      variant="ghost"
      onMouseDown={(event) => {
        event.preventDefault();
        const url = window.prompt("Enter the URL of the image:");
        if (url && !isImageUrl(url)) {
          alert("URL is not an image");
          return;
        }
        url && insertImage(editor, url);
      }}
    >
      <ImageIcon size={16} />
    </Button>
  );
};

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code className="bg-gray-100 rounded px-1">{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton = ({
  format,
  icon,
}: {
  format: string;
  icon: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <Button
      variant="ghost"
      className={`mr-2 ${
        isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
        )
          ? "bg-gray-200"
          : "bg-white"
      }`}
      onMouseDown={(event: React.MouseEvent) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

const MarkButton = ({
  format,
  icon,
}: {
  format: string;
  icon: React.ReactNode;
}) => {
  const editor = useSlate();
  return (
    <Button
      variant="ghost"
      className={`mr-2 ${
        isMarkActive(editor, format) ? "bg-gray-200" : "bg-white"
      }`}
      onMouseDown={(event: React.MouseEvent) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

const Toolbar = () => {
  const editor = useSlate();
  return (
    <div className="mb-2 flex flex-wrap">
      <MarkButton format="bold" icon={<Bold size={16} />} />
      <MarkButton format="italic" icon={<Italic size={16} />} />
      <MarkButton format="underline" icon={<Underline size={16} />} />
      <MarkButton format="code" icon={<Code size={16} />} />
      <BlockButton format="heading-one" icon="H1" />
      <BlockButton format="heading-two" icon="H2" />
      <BlockButton format="block-quote" icon={<Quote size={16} />} />
      <BlockButton format="numbered-list" icon={<ListOrdered size={16} />} />
      <BlockButton format="bulleted-list" icon={<List size={16} />} />
      <BlockButton format="left" icon={<AlignLeft size={16} />} />
      <BlockButton format="center" icon={<AlignCenter size={16} />} />
      <BlockButton format="right" icon={<AlignRight size={16} />} />
      <BlockButton format="justify" icon={<AlignJustify size={16} />} />
      <InsertImageButton />
    </div>
  );
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties: Partial<SlateElement>;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    };
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string, blockType = "type") => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

export default CreateArticle;
