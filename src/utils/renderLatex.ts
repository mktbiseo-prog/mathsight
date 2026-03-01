import katex from "katex";

export function renderLatex(latex: string, displayMode = false): string {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      trust: true,
      strict: false,
    });
  } catch {
    return `<code>${latex}</code>`;
  }
}
