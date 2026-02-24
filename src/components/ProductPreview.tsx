import { useState, useRef, useCallback, useEffect } from "react";

interface DraggableItem {
  x: number;
  y: number;
}

interface ProductPreviewProps {
  productImage: string;
  productName: string;
  customText: string;
  logoPreview: string | null;
}

const ProductPreview = ({ productImage, productName, customText, logoPreview }: ProductPreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [textPos, setTextPos] = useState<DraggableItem>({ x: 50, y: 50 });
  const [logoPos, setLogoPos] = useState<DraggableItem>({ x: 50, y: 30 });
  const [dragging, setDragging] = useState<"text" | "logo" | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const getPercentPos = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return { x: 50, y: 50 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    return { x, y };
  }, []);

  const handlePointerDown = useCallback((type: "text" | "logo", e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(type);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const pos = getPercentPos(e.clientX, e.clientY);
    if (dragging === "text") setTextPos(pos);
    else setLogoPos(pos);
  }, [dragging, getPercentPos]);

  const handlePointerUp = useCallback(() => {
    setDragging(null);
  }, []);

  const hasContent = customText.trim() || logoPreview;

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative w-full aspect-square overflow-hidden bg-secondary select-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: "none" }}
      >
        <img
          src={productImage}
          alt={productName}
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* Custom text overlay */}
        {customText.trim() && (
          <div
            className={`absolute cursor-grab active:cursor-grabbing px-3 py-1.5 rounded bg-white/80 backdrop-blur-sm border border-border shadow-md ${dragging === "text" ? "ring-2 ring-primary" : ""}`}
            style={{
              left: `${textPos.x}%`,
              top: `${textPos.y}%`,
              transform: "translate(-50%, -50%)",
              maxWidth: "80%",
            }}
            onPointerDown={(e) => handlePointerDown("text", e)}
          >
            <p className="text-sm font-mono text-foreground whitespace-pre-wrap break-words leading-tight">
              {customText}
            </p>
          </div>
        )}

        {/* Logo overlay */}
        {logoPreview && (
          <div
            className={`absolute cursor-grab active:cursor-grabbing rounded bg-white/60 backdrop-blur-sm border border-border shadow-md p-1 ${dragging === "logo" ? "ring-2 ring-primary" : ""}`}
            style={{
              left: `${logoPos.x}%`,
              top: `${logoPos.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onPointerDown={(e) => handlePointerDown("logo", e)}
          >
            <img
              src={logoPreview}
              alt="Logo"
              className="h-20 w-20 object-contain pointer-events-none"
              draggable={false}
            />
          </div>
        )}
      </div>

      {hasContent && (
        <p className="text-xs font-mono text-muted-foreground mt-2 text-center italic">
          ↕ ↔ Glissez pour repositionner
        </p>
      )}
    </div>
  );
};

export default ProductPreview;
