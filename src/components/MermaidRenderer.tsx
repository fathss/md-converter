import { useEffect, useRef, useId } from "react";
import mermaid from "mermaid";
import type { MermaidRendererProps } from "../types/components";

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  securityLevel: "loose",
});

function MermaidRenderer({ chart }: MermaidRendererProps) {
  const ref = useRef<HTMLDivElement>(null);
  const uId = useId();
  const cleanId = uId.replace(/:/g, "m");

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      if (!ref.current || !chart) return;

      try {
        ref.current.innerHTML = "";

        const { svg } = await mermaid.render(`mermaid-${cleanId}`, chart);

        if (isMounted && ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (error) {
        console.error("Mermaid error:", error);
        if (isMounted && ref.current) {
          ref.current.innerHTML =
            '<p class="text-red-400 text-[10px] italic">Mermaid syntax error</p>';
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, cleanId]);

  return (
    <div className="flex justify-center my-6 w-full">
      <div
        ref={ref}
        className="mermaid-container bg-[#0d1117] p-4 rounded-lg border border-[#30363d] overflow-x-auto w-full flex justify-center"
      />
    </div>
  );
}

export default MermaidRenderer;
