import { CustomEditor } from './types';
import { insertImage, isImageUrl } from './utils';

export const withMentions = (editor: CustomEditor) => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) =>
    element.type === 'mention' ? true : isInline(element);

  editor.isVoid = (element) =>
    element.type === 'mention' ? true : isVoid(element);

  return editor;
};

export const withImages = (editor: CustomEditor) => {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) =>
    element.type === 'image' ? true : isVoid(element);

  editor.insertData = (data: DataTransfer) => {
    const text = data.getData('text/plain');
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of Array.from(files)) {
        const reader = new FileReader();
        const [mime] = file.type.split('/');

        if (mime === 'image') {
          reader.addEventListener('load', () => {
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