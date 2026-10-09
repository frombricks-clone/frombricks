declare module "prismjs" {
  const Prism: {
    highlightAll: () => void;
    highlightElement: (element: Element) => void;
    highlight: (text: string, grammar: unknown, language: string) => string;
    languages: Record<string, unknown>;
  };
  console.log(Prism);
  const components: Record<string, unknown>;
  export default components;
}

declare module "prismjs/themes/prism.css";
