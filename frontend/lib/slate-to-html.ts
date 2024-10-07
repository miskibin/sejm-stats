// Define types for Slate nodes
type TextNode = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  code?: boolean;
};

type ElementNode = {
  type: string;
  children: Node[];
  url?: string;
  alt?: string;
  align?: "left" | "center" | "right" | "justify";
  className?: string;
};

type Node = TextNode | ElementNode;

// Function to convert Slate JSON to HTML with Tailwind classes
export const slateToHtml = (nodes: Node[]): string => {
  return nodes
    .map((node: Node) => {
      if ("text" in node) {
        let text = node.text;
        if (node.bold) text = `<strong class="font-bold">${text}</strong>`;
        if (node.italic) text = `<em class="italic">${text}</em>`;
        if (node.underline) text = `<u class="underline">${text}</u>`;
        if (node.code)
          text = `<code class="font-mono  rounded px-1">${text}</code>`;
        return text;
      }

      const children = slateToHtml(node.children);
      let alignClass = "";
      if (node.align) {
        switch (node.align) {
          case "left":
            alignClass = "text-left";
            break;
          case "center":
            alignClass = "text-center";
            break;
          case "right":
            alignClass = "text-right";
            break;
          case "justify":
            alignClass = "text-justify";
            break;
        }
      }

      const classes = [alignClass, node.className].filter(Boolean).join(" ");

      switch (node.type) {
        case "paragraph":
          return `<p class="mb-4 ${classes}">${children}</p>`;
        case "heading-one":
          return `<h1 class="text-4xl font-bold mb-4 ${classes}">${children}</h1>`;
        case "heading-two":
          return `<h2 class="text-3xl font-semibold mb-3 ${classes}">${children}</h2>`;
        case "block-quote":
          return `<blockquote class="border-l-4 pl-4 italic mb-4 ${classes}">${children}</blockquote>`;
        case "numbered-list":
          return `<ol class="list-decimal list-inside mb-4 ${classes}">${children}</ol>`;
        case "bulleted-list":
          return `<ul class="list-disc list-inside mb-4 ${classes}">${children}</ul>`;
        case "list-item":
          return `<li class="${classes}">${children}</li>`;
        case "image":
          return `<img src="${node.url || ""}" alt="${
            node.alt || ""
          }" class="max-w-full h-auto mb-4 ${classes}" />`;
        default:
          return children;
      }
    })
    .join("");
};
