"use client"
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { createEditor, Transforms, Range, Editor, Element as SlateElement, Descendant } from 'slate';
import { Slate, Editable, ReactEditor, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { Button } from "@/components/ui/button";
import { useFetchData } from '@/lib/api';
import { Portal } from '@/components/ui/portal';

const CreateArticle: React.FC = () => {
  const [editor] = useState(() => withMentions(withReact(withHistory(createEditor()))));
  const ref = useRef<HTMLDivElement | null>(null);
  const [target, setTarget] = useState<Range | null>(null);
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [mentionItems, setMentionItems] = useState<string[]>([]);

  const { data, isLoading, error } = useFetchData<any>('/create-article/');

  useEffect(() => {
    if (data) {
      const allItems = [
        ...data.envoys,
        ...data.clubs,
        ...data.committees,
        ...data.votings.map((v: string) => v.substring(0, 50) + '...'),
        ...data.processes.map((p: string) => p.substring(0, 50) + '...'),
        ...data.interpellations.map((i: string) => i.substring(0, 50) + '...'),
      ];
      setMentionItems(allItems);
    }
  }, [data]);

  const chars = useMemo(
    () => mentionItems.filter(c => c.toLowerCase().startsWith(search.toLowerCase())).slice(0, 10),
    [mentionItems, search]
  );

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (target && chars.length > 0) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            setIndex((index + 1) % chars.length);
            break;
          case 'ArrowUp':
            event.preventDefault();
            setIndex((index - 1 + chars.length) % chars.length);
            break;
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(editor, chars[index]);
            setTarget(null);
            break;
          case 'Escape':
            event.preventDefault();
            setTarget(null);
            break;
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

  const initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [{ text: 'Start typing your article and use @ to mention...' }],
    },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Create Article</h1>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={() => {
          const { selection } = editor;

          if (selection && Range.isCollapsed(selection)) {
            const [start] = Range.edges(selection);
            const wordBefore = Editor.before(editor, start, { unit: 'word' });
            const before = wordBefore && Editor.before(editor, wordBefore);
            const beforeRange = before && Editor.range(editor, before, start);
            const beforeText = beforeRange && Editor.string(editor, beforeRange);
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
        <Editable
          renderElement={renderElement}
          onKeyDown={onKeyDown}
          placeholder="Start typing your article..."
          className="min-h-[300px] p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {target && chars.length > 0 && (
          <Portal>
            <div
              ref={ref}
              className="absolute z-10 p-1 bg-white rounded-md shadow-lg"
              style={{
                top: '-9999px',
                left: '-9999px',
                position: 'absolute',
              }}
            >
              {chars.map((char, i) => (
                <div
                  key={char}
                  className={`p-1 cursor-pointer ${i === index ? 'bg-blue-200' : 'bg-transparent'}`}
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
          Publish Article
        </Button>
      </div>
    </div>
  );
};

const withMentions = (editor: Editor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = element =>
    element.type === 'mention' ? true : isInline(element);

  editor.isVoid = element =>
    element.type === 'mention' ? true : isVoid(element);

  return editor;
};

const insertMention = (editor: Editor, character: string) => {
  const mention: any = {
    type: 'mention',
    character,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};

const Element = (props: any) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case 'mention':
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
    default:
      return <p {...attributes}>{children}</p>;
  }
};

export default CreateArticle;