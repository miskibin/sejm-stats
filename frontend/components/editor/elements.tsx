"use client"
import React, { useState } from "react";
import { useSelected, useFocused } from "slate-react";
import {
  RenderElementProps,
  RenderLeafProps,
  useSlateStatic,
} from "slate-react";
import { Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { Button } from "@/components/ui/button";
import { ImageIcon } from "lucide-react";
const TitleElement = ({ attributes, children, element }: RenderElementProps) => {
    const editor = useSlateStatic();
    const path = ReactEditor.findPath(editor, element);
    const [title, setTitle] = useState((element as any).title || '');
  
    return (
      <div {...attributes} contentEditable={false} className="mb-4">
        <input
          className="text-3xl font-bold w-full p-2 border rounded"
          type="text"
          value={title}
          onChange={(e) => {
            const newTitle = e.target.value;
            setTitle(newTitle);
            Transforms.setNodes(editor, { title: newTitle }, { at: path });
          }}
          placeholder="Wprowadź tytuł artykułu..."
        />
        {children}
      </div>
    );
  };
  
  const ImageElement = ({ attributes, children, element }: RenderElementProps) => {
    const editor = useSlateStatic();
    const path = ReactEditor.findPath(editor, element);
    const [image, setImage] = useState<string | null>((element as any).url || null);
  
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageDataUrl = reader.result as string;
          setImage(imageDataUrl);
          Transforms.setNodes(editor, { url: imageDataUrl }, { at: path });
        };
        reader.readAsDataURL(file);
      }
    };
  
    return (
      <div {...attributes} contentEditable={false} className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-2"
        />
        {image && (
          <img src={image} alt="Obraz artykułu" className="mt-2 max-w-full h-auto" />
        )}
        {children}
      </div>
    );
  };
export const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case "title":
      return <TitleElement {...props} />;
    case "image":
      return <ImageElement {...props} />;
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
    case "block-quote":
      return (
        <blockquote
          style={{
            textAlign: element.align as React.CSSProperties["textAlign"],
          }}
          {...attributes}
          className="border-l-4 border-gray-300 pl-4 italic"
        >
          {children}
        </blockquote>
      );
    default:
      return (
        <p
          style={{
            textAlign: element.align as React.CSSProperties["textAlign"],
          }}
          {...attributes}
        >
          {children}
        </p>
      );
  }
};
export const Image = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div {...attributes}>
      {children}
      <div contentEditable={false} className="relative">
        <img
          src={(element as any).url}
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

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
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
