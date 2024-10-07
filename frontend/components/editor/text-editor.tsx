import React, { useCallback, useMemo, useState } from "react";
import isHotkey from "is-hotkey";
import imageExtensions from "image-extensions";
import isUrl from "is-url";
import axios from "axios";
import {
  Editable,
  withReact,
  useSlate,
  Slate,
  useSelected,
  useFocused,
  ReactEditor,
  RenderElementProps,
} from "slate-react";
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
  BaseEditor,
  Range,
} from "slate";
import { withHistory } from "slate-history";

import { Button } from "@/components/ui/button";
import Image from "next/image";

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
  X,
  Save,
} from "lucide-react";
import { initialValue } from "./initial-value";
import { sendArticleToApi } from "@/lib/api";
import { useSession } from "next-auth/react";

// Define custom types
type CustomElement =
  | { type: "paragraph"; children: CustomText[]; align?: string }
  | { type: "heading-one"; children: CustomText[]; align?: string }
  | { type: "heading-two"; children: CustomText[]; align?: string }
  | { type: "block-quote"; children: CustomText[]; align?: string }
  | { type: "numbered-list"; children: CustomElement[]; align?: string }
  | { type: "bulleted-list"; children: CustomElement[]; align?: string }
  | { type: "list-item"; children: CustomText[]; align?: string }
  | { type: "image"; url: string; children: CustomText[]; align?: string };

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  underline?: boolean;
};

type CustomEditor = BaseEditor & ReactEditor;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
  }
}

const HOTKEYS: { [key: string]: string } = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
  "mod+`": "code",
};

const LIST_TYPES = ["numbered-list", "bulleted-list"];
const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

const RichTextEditor: React.FC = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const { data: session, status } = useSession();
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  );
  const saveContent = async () => {
    try {
      // Convert images to base64
      const contentWithBase64 = await Promise.all(
        value.map(async (node) => {
          if (
            SlateElement.isElement(node) &&
            (node.type as string) === "image"
          ) {
            const response = await fetch((node as any).url);
            const blob = await response.blob();
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () =>
                resolve({
                  ...node,
                  url: reader.result,
                });
              reader.readAsDataURL(blob);
            });
          }
          return node;
        })
      );

      // Find the first image in the content to use as the article image
      const firstImage = contentWithBase64.find(
        (node) =>
          SlateElement.isElement(node) && (node.type as string) === "image"
      ) as { url: string } | undefined;
      const title = contentWithBase64.find(
        (node): node is CustomElement & { children: CustomText[] } =>
          SlateElement.isElement(node) && (node.type as string) === "heading-one"
      )?.children[0].text;
      const articleData = {
        title: title || "Untitled",
        content: contentWithBase64,
        image: firstImage ? firstImage.url : null,
        author: session?.user?.email || "Anonymous",
      };

      const response = await sendArticleToApi(articleData);
      window.alert("Article saved successfully");
    } catch (error) {
      console.error("Error saving article:", error);
      window.alert(error);
    }
  };

  const renderLeaf = useCallback(
    (
      props: JSX.IntrinsicAttributes & {
        attributes: any;
        children: any;
        leaf: CustomText;
      }
    ) => <Leaf {...props} />,
    []
  );
  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    []
  );

  return (
    <Slate
      editor={editor}
      initialValue={initialValue as Descendant[]}
      onChange={setValue}
    >
      <div className="mb-4 rounded-md border p-2 flex flex-wrap gap-1">
        <MarkButton format="bold" icon={<Bold className="h-4 w-4" />} />
        <MarkButton format="italic" icon={<Italic className="h-4 w-4" />} />
        <MarkButton
          format="underline"
          icon={<Underline className="h-4 w-4" />}
        />
        <MarkButton format="code" icon={<Code className="h-4 w-4" />} />
        <BlockButton format="heading-one" icon="H1" />
        <BlockButton format="heading-two" icon="H2" />
        <BlockButton
          format="block-quote"
          icon={<Quote className="h-4 w-4" />}
        />
        <BlockButton
          format="numbered-list"
          icon={<ListOrdered className="h-4 w-4" />}
        />
        <BlockButton
          format="bulleted-list"
          icon={<List className="h-4 w-4" />}
        />
        <BlockButton format="left" icon={<AlignLeft className="h-4 w-4" />} />
        <BlockButton
          format="center"
          icon={<AlignCenter className="h-4 w-4" />}
        />
        <BlockButton format="right" icon={<AlignRight className="h-4 w-4" />} />
        <BlockButton
          format="justify"
          icon={<AlignJustify className="h-4 w-4" />}
        />

        <InsertImageButton />
        <Button onClick={saveContent} className="ml-auto">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>
      <Editable
        className="min-h-[200px] rounded-md border p-4"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>) => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

const withImages = (editor: CustomEditor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) =>
    (element as CustomElement).type === "image"
      ? true
      : isVoid(element as SlateElement);

  editor.insertData = (data: DataTransfer) => {
    const text = data.getData("text/plain");
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        const reader = new FileReader();
        const [mime] = file.type.split("/");

        if (mime === "image") {
          reader.addEventListener("load", () => {
            const url = reader.result as string;
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

const insertImage = (editor: CustomEditor, url: string) => {
  const text = { text: "" };
  const image: CustomElement = { type: "image", url, children: [text] };
  Transforms.insertNodes(editor, image as unknown as Descendant);
};

const toggleBlock = (editor: CustomEditor, format: string) => {
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
    } as Partial<SlateElement>;
  } else {
    newProperties = {
      type: isActive ? "paragraph" : isList ? "list-item" : format,
    } as Partial<SlateElement>;
  }
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] } as CustomElement;
    Transforms.wrapNodes(editor, block as unknown as SlateElement);
  }
};

const toggleMark = (editor: CustomEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (
  editor: CustomEditor,
  format: string,
  blockType = "type"
) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType as keyof typeof n] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor: CustomEditor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format as keyof typeof marks] === true : false;
};

const Element: React.FC<RenderElementProps> = ({
  attributes,
  children,
  element,
}) => {
  const style = { textAlign: (element as CustomElement).align };
  switch (element.type as string) {
    case "block-quote":
      return (
        <blockquote
          className="border-l-4 border-gray-300 pl-4 italic"
          style={style as React.CSSProperties}
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul
          className="list-disc pl-5"
          style={style as React.CSSProperties}
          {...attributes}
        >
          {children}
        </ul>
      );
    case "heading-one":
      return (
        <h1
          className="text-3xl font-bold"
          style={style as React.CSSProperties}
          {...attributes}
        >
          {children}
        </h1>
      );
    case "heading-two":
      return (
        <h2
          className="text-2xl font-bold"
          style={style as React.CSSProperties}
          {...attributes}
        >
          {children}
        </h2>
      );
    case "list-item":
      return (
        <li style={style as React.CSSProperties} {...attributes}>
          {children}
        </li>
      );
    case "numbered-list":
      return (
        <ol
          className="list-decimal pl-5"
          style={style as React.CSSProperties}
          {...attributes}
        >
          {children}
        </ol>
      );
    case "image":
      return (
        <ImageElement
          attributes={attributes}
          element={
            element as unknown as CustomElement & { type: "image"; url: string }
          }
        >
          {children}
        </ImageElement>
      );
    default:
      return (
        <p style={style as React.CSSProperties} {...attributes}>
          {children}
        </p>
      );
  }
};

const ImageElement: React.FC<{
  attributes: any;
  children: React.ReactNode;
  element: CustomElement & { type: "image"; url: string };
}> = ({ attributes, children, element }) => {
  const editor = useSlate();
  const selected = useSelected();
  const focused = useFocused();
  return (
    <div {...attributes}>
      <div contentEditable={false} className="relative">
        <Image
          src={element.url}
          alt="Inserted image"
          width={400}
          height={300}
          className={`block max-w-full max-h-80 ${
            selected && focused ? "ring-2 ring-blue-500" : "ring-0"
          }`}
        />
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            const path = ReactEditor.findPath(
              editor,
              element as unknown as SlateElement
            );
            Transforms.removeNodes(editor, { at: path });
          }}
          className={`absolute top-2 left-2 ${
            selected && focused ? "opacity-100" : "opacity-0"
          } transition-opacity duration-200`}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </div>
  );
};

const Leaf: React.FC<{
  attributes: any;
  children: React.ReactNode;
  leaf: CustomText;
}> = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code className="bg-gray-200 rounded px-1">{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const BlockButton: React.FC<{ format: string; icon: React.ReactNode }> = ({
  format,
  icon,
}) => {
  const editor = useSlate();
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`px-2 ${
        isBlockActive(
          editor,
          format,
          TEXT_ALIGN_TYPES.includes(format) ? "align" : "type"
        )
          ? "text-blue-500"
          : "text-gray-600"
      }`}
      onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

const MarkButton: React.FC<{ format: string; icon: React.ReactNode }> = ({
  format,
  icon,
}) => {
  const editor = useSlate();
  return (
    <Button
      variant="ghost"
      size="sm"
      className={`px-2 ${
        isMarkActive(editor, format) ? "text-blue-500" : "text-gray-600"
      }`}
      onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      {icon}
    </Button>
  );
};

const InsertImageButton: React.FC = () => {
  const editor = useSlate();
  return (
    <Button
      variant="ghost"
      size="sm"
      onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const url = window.prompt("Enter the URL of the image:");
        if (url && !isImageUrl(url)) {
          alert("URL is not an image");
          return;
        }
        url && insertImage(editor, url);
      }}
    >
      <ImageIcon className="h-4 w-4" />
    </Button>
  );
};

const isImageUrl = (url: string): boolean => {
  if (!url) return false;
  if (!isUrl(url)) return false;
  const ext = new URL(url).pathname.split(".").pop();
  return ext ? imageExtensions.includes(ext) : false;
};

export default RichTextEditor;
