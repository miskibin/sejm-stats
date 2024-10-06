import { Descendant } from "slate";

type CustomElement = 
  | { type: 'heading-one'; children: CustomText[] }
  | { type: 'paragraph'; children: CustomText[] }
  | { type: 'numbered-list'; children: CustomElement[] }
  | { type: 'list-item'; children: CustomText[]; className?: string }
  | { type: 'heading-two'; children: CustomText[] };
type CustomText = { text: string };

declare module "slate" {
  interface CustomTypes {
    Element: CustomElement;
    Text: CustomText;
  }
}

export const initialValue: Descendant[] = [
  {
    type: "heading-one",
    children: [{ text: "Wprowadź tytuł artykułu tutaj" }],
  },
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Najpierw dodaj tytuł (powyżej) i obrazek do artykułu.",
      },
    ],
  },
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
  {
    type: "heading-two",
    children: [{ text: "Pamiętaj:" }],
  },
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
  {
    type: "numbered-list",
    children: [
      {
        type: "list-item",
        children: [
          {
            text: "Bądź obiektywny i bezstronny. Nie faworyzuj żadnej opcji politycznej.",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Korzystaj z oficjalnych danych dostępnych na sejm-stats do weryfikacji informacji.",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Możesz pisać o głosowaniach posłów, ustawach, i innych aspektach pracy sejmu.",
          },
        ],
      },
      {
        type: "list-item",
        children: [
          {
            text: "Pamiętaj, że czytelnicy mogą łatwo zweryfikować informacje podane w artykule.",
          },
        ],
        className: "mb-2"
      },
      {
        type: "list-item",
        children: [
          {
            text: "Staraj się przedstawiać informacje w sposób przejrzysty i zrozumiały.",
          },
        ],
        className: "mb-2"
      },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text: "Pisz swój artykuł poniżej, korzystając z dostępnych narzędzi formatowania.",
      },
    ],
  },
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];