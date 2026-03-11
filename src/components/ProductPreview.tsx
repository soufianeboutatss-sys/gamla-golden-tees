import { useState, useRef, useCallback } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";

interface DraggableItem {
  x: number;
  y: number;
}

interface ProductPreviewProps {
  productImage: string;
  productName: string;
  customText: string;
  textColor?: string;
  logoPreview: string | null;
  logoPlacement?: "front" | "back";
  selectedSide?: "front" | "back";
  onAiImageChange?: (image: string | null) => void;
}

const ProductPreview = ({ productImage, productName, customText, textColor = "#FFFFFF", logoPreview, logoPlacement = "front", selectedSide = "front", onAiImageChange }: ProductPreviewProps) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [textPos, setTextPos] = useState<DraggableItem>({ x: 50, y: 50 });
  const [logoPos, setLogoPos] = useState<DraggableItem>({ x: 50, y: 30 });
  const [dragging, setDragging] = useState<"text" | "logo" | null>(null);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  const imageToBase64 = async (src: string): Promise<string> => {
    const response = await fetch(src);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleAiMagic = async () => {
    if (!hasContent) {
      toast.error(t("aiMagicHint"));
      return;
    }

    setIsGenerating(true);
    try {
      const productImageBase64 = await imageToBase64(productImage);

      const { data, error } = await supabase.functions.invoke("ai-magic-preview", {
        body: {
          productImageBase64,
          customText: customText.trim() || null,
          textColor,
          logoBase64: logoPreview || null,
          logoPlacement,
          textPosition: customText.trim() ? textPos : null,
          logoPosition: logoPreview ? logoPos : null,
          productName,
        },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.image) {
        setAiImage(data.image);
        onAiImageChange?.(data.image);
      }
    } catch (err: any) {
      console.error("AI Magic error:", err);
      toast.error(t("aiMagicError"));
    } finally {
      setIsGenerating(false);
    }
  };

  // Show logo on preview when current view matches the placement side
  const showLogoOnPreview = logoPreview && logoPlacement === selectedSide;

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
          src={aiImage || productImage}
          alt={productName}
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />

        {/* Custom text overlay */}
        {!aiImage && customText.trim() && (
          <div
            className={`absolute cursor-grab active:cursor-grabbing px-3 py-1.5 rounded bg-black/30 backdrop-blur-sm border border-white/20 shadow-md ${dragging === "text" ? "ring-2 ring-primary" : ""}`}
            style={{
              left: `${textPos.x}%`,
              top: `${textPos.y}%`,
              transform: "translate(-50%, -50%)",
              maxWidth: "80%",
            }}
            onPointerDown={(e) => handlePointerDown("text", e)}
          >
            <p
              className="text-sm font-mono whitespace-pre-wrap break-words leading-tight font-bold"
              style={{ color: textColor }}
            >
              {customText}
            </p>
          </div>
        )}

        {/* Logo overlay - only shown for front placement */}
        {!aiImage && showLogoOnPreview && (
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

        {/* Back placement indicator */}
        {!aiImage && logoPreview && logoPlacement === "back" && (
          <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded text-xs font-mono text-white">
            Logo → Verso (dos)
          </div>
        )}
      </div>

      {/* AI Magic Button */}
      {hasContent && (
        <button
          type="button"
          onClick={handleAiMagic}
          disabled={isGenerating}
          className="w-full mt-3 py-3 flex items-center justify-center gap-2 text-sm tracking-[0.15em] font-mono bg-accent text-accent-foreground hover:bg-accent/80 disabled:opacity-60 transition-colors border border-border"
        >
          {isGenerating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {t("aiMagicGenerating")}
            </>
          ) : (
            <>
              <Sparkles size={16} />
              {t("aiMagic")}
            </>
          )}
        </button>
      )}

      {hasContent && !aiImage && (
        <p className="text-xs font-mono text-muted-foreground mt-2 text-center italic">
          ↕ ↔ Glissez pour repositionner
        </p>
      )}

      {aiImage && (
        <button
          type="button"
          onClick={() => { setAiImage(null); onAiImageChange?.(null); }}
          className="w-full mt-1 py-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Revenir à l'aperçu manuel
        </button>
      )}
    </div>
  );
};

export default ProductPreview;
