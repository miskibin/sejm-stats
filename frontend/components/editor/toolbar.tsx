import React from 'react';
import { useSlate, useSlateStatic } from 'slate-react';
import { Button } from '@/components/ui/button';
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
  ImageIcon,
} from 'lucide-react';
import { toggleBlock, toggleMark, isBlockActive, isMarkActive, insertImage, isImageUrl } from './utils';
import { TEXT_ALIGN_TYPES } from './types';

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
          TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
        )
          ? 'bg-gray-200'
          : 'bg-white'
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
        isMarkActive(editor, format) ? 'bg-gray-200' : 'bg-white'
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

const InsertImageButton = () => {
  const editor = useSlateStatic();
  return (
    <Button
      variant="ghost"
      onMouseDown={(event) => {
        event.preventDefault();
        const url = window.prompt('Enter the URL of the image:');
        if (url && !isImageUrl(url)) {
          alert('URL is not an image');
          return;
        }
        url && insertImage(editor, url);
      }}
    >
      <ImageIcon size={16} />
    </Button>
  );
};


interface ToolbarProps {
  children?: React.ReactNode;
}

export const Toolbar: React.FC<ToolbarProps> = ({ children }) => {
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
      {children}
    </div>
  );
};