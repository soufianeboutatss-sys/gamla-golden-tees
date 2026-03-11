import { useState, useRef, useCallback } from "react";
import { Sparkles, Loader2, Minus, Plus } from "lucide-react";
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
  const [textSize, setTextSize] = useState(16); // px
  const [logoSize, setLogoSize] = useState(80); // px

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

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  // Compose product + text + logo on a Canvas at exact positions, then send to AI
  const createCompositeImage = async (): Promise<string> => {
    const productImg = await loadImage(productImage);
    const canvas = document.createElement("canvas");
    const size = 1024; // square output
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Draw product image (cover fit)
    const imgRatio = productImg.width / productImg.height;
    let sx = 0, sy = 0, sw = productImg.width, sh = productImg.height;
    if (imgRatio > 1) {
      sx = (productImg.width - productImg.height) / 2;
      sw = productImg.height;
    } else {
      sy = (productImg.height - productImg.width) / 2;
      sh = productImg.width;
    }
    ctx.drawImage(productImg, sx, sy, sw, sh, 0, 0, size, size);

    // Draw custom text at exact position
    if (customText.trim()) {
      const scaledFontSize = (textSize / (containerRef.current?.offsetWidth || 400)) * size;
      ctx.font = `bold ${Math.round(scaledFontSize)}px monospace`;
      ctx.fillStyle = textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const tx = (textPos.x / 100) * size;
      const ty = (textPos.y / 100) * size;
      // Handle multi-line
      const lines = customText.split("\n");
      const lineHeight = scaledFontSize * 1.2;
      const startY = ty - ((lines.length - 1) * lineHeight) / 2;
      lines.forEach((line, i) => {
        ctx.fillText(line, tx, startY + i * lineHeight, size * 0.8);
      });
    }

    // Draw logo at exact position
    if (logoPreview && logoPlacement === selectedSide) {
      const logoImg = await loadImage(logoPreview);
      const scaledLogoSize = (logoSize / (containerRef.current?.offsetWidth || 400)) * size;
      const lx = (logoPos.x / 100) * size - scaledLogoSize / 2;
      const ly = (logoPos.y / 100) * size - scaledLogoSize / 2;
      ctx.drawImage(logoImg, lx, ly, scaledLogoSize, scaledLogoSize);
    }

    return canvas.toDataURL("image/jpeg", 0.9);
  };

  const handleAiMagic = async () => {
    if (!hasContent) {
      toast.error(t("aiMagicHint"));
      return;
    }

    setIsGenerating(true);
    try {
      // Create composite with exact positions using Canvas
      const compositeBase64 = await createCompositeImage();

      const { data, error } = await supabase.functions.invoke("ai-magic-preview", {
        body: {
          compositeImageBase64: compositeBase64,
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
              className="font-mono whitespace-pre-wrap break-words leading-tight font-bold"
              style={{ color: textColor, fontSize: `${textSize}px` }}
            >
              {customText}
            </p>
          </div>
        )}

        {/* Logo overlay */}
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
              style={{ height: `${logoSize}px`, width: `${logoSize}px` }}
              className="object-contain pointer-events-none"
              draggable={false}
            />
          </div>
        )}

        {/* Indicator when logo is on the other side */}
        {!aiImage && logoPreview && logoPlacement !== selectedSide && (
          <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded text-xs font-mono text-white">
            Logo → {logoPlacement === "back" ? "Back" : "Front"}
          </div>
        )}
      </div>

      {/* Size controls */}
      {hasContent && !aiImage && (
        <div className="mt-3 space-y-2">
          {/* Text size control */}
          {customText.trim() && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground w-24 shrink-0">{t("textSizeLabel")}</span>
              <button type="button" onClick={() => setTextSize(Math.max(10, textSize - 2))} className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
                <Minus size={12} />
              </button>
              <input
                type="range"
                min={10}
                max={40}
                value={textSize}
                onChange={(e) => setTextSize(Number(e.target.value))}
                className="flex-1 accent-primary h-1"
              />
              <button type="button" onClick={() => setTextSize(Math.min(40, textSize + 2))} className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
                <Plus size={12} />
              </button>
              <span className="text-xs font-mono text-muted-foreground w-8 text-right">{textSize}px</span>
            </div>
          )}

          {/* Logo size control */}
          {showLogoOnPreview && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground w-24 shrink-0">{t("logoSizeLabel")}</span>
              <button type="button" onClick={() => setLogoSize(Math.max(30, logoSize - 10))} className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
                <Minus size={12} />
              </button>
              <input
                type="range"
                min={30}
                max={200}
                value={logoSize}
                onChange={(e) => setLogoSize(Number(e.target.value))}
                className="flex-1 accent-primary h-1"
              />
              <button type="button" onClick={() => setLogoSize(Math.min(200, logoSize + 10))} className="w-7 h-7 flex items-center justify-center border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors">
                <Plus size={12} />
              </button>
              <span className="text-xs font-mono text-muted-foreground w-8 text-right">{logoSize}px</span>
            </div>
          )}
        </div>
      )}

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
          ↕ ↔ {t("dragToReposition")}
        </p>
      )}

      {aiImage && (
        <button
          type="button"
          onClick={() => { setAiImage(null); onAiImageChange?.(null); }}
          className="w-full mt-1 py-2 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {t("backToManual")}
        </button>
      )}
    </div>
  );
};

export default ProductPreview;
