import { useEffect, useRef } from "react";
import { marked } from "marked";
import katex from "katex";

export default function ItemContent({ text }: { text: string }): JSX.Element {
  const myRef = useRef(null);
  /*  text = 'sss: \\[ \\text{间接费用} = 80 \\text{万元} \\times 20\\% = 16 \\text{万元} \\]'*/
  // text = '$ \\text{平均数} = \\frac{\\text{总和}}{\\text{数量}} $ other code '
  const htmlContent = marked.parse(text);
  type Delimiter = { left: string; right: string; display: boolean };
  type Options = {
    delimiters: Delimiter[];
    [key: string]: unknown;
  };
  const delimiters: Delimiter[] = [
    { left: "\\$\\$", right: "\\$\\$", display: true },
    { left: "\\$", right: "\\$", display: false },
    { left: "\\[", right: "\\]", display: true },
    { left: "\\(", right: "\\)", display: true },
  ];
  // 定义renderMathInElement函数，用于渲染元素中的LaTeX公式
  function renderMathInElement(element: HTMLElement, options: Options) {
    const delimiters = options.delimiters || [];
    delimiters.forEach((delimiter) => {
      const regex = new RegExp(delimiter.left + "(.*?)" + delimiter.right, "g");
      element.innerHTML = element.innerHTML.replace(regex, (match, math) => {
        const tex = math;
        const node = document.createElement("span");
        node.className = "katex";
        node.setAttribute("data-latex", tex);
        options.output = "html";
        katex.render(tex, node, options as never);
        return node.outerHTML;
      });
    });
  }
  useEffect(() => {
    // 使用KaTeX渲染LaTeX公式
    renderMathInElement(myRef.current as unknown as HTMLElement, {
      delimiters,
    });
  });

  return (
    <div>
      <div ref={myRef} dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
      {/*<br/>*/}
      {/*<h2>html:</h2>*/}
      {/*<div>{htmlContent}</div>*/}

      {/*<br/>*/}
      {/*<h2>md:</h2>*/}
      {/*<div>{text}</div>*/}
    </div>
  );
}
