import { useMemo } from "react";
import { renderLatex } from "@/utils/renderLatex";
import { cn } from "@/utils/cn";

interface KaTeXProps {
  latex: string;
  display?: boolean;
  className?: string;
}

export function KaTeX({ latex, display = false, className }: KaTeXProps) {
  const html = useMemo(() => renderLatex(latex, display), [latex, display]);

  return (
    <span
      className={cn("katex-container", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
