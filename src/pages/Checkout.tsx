import { useState, useRef, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import ProductPreview from "@/components/ProductPreview";
import { Upload, X, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import hoodie1 from "@/assets/hoodie-1.jpg";
import hoodie2 from "@/assets/hoodie-2.jpg";
import hoodie3 from "@/assets/hoodie-3.jpg";
import tshirt1 from "@/assets/tshirt-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";
import tshirt3 from "@/assets/tshirt-3.jpg";
import hoodie1Alt from "@/assets/hoodie-1-alt.jpg";
import hoodie2Alt from "@/assets/hoodie-2-alt.jpg";
import hoodie3Alt from "@/assets/hoodie-3-alt.jpg";
import tshirt1Alt from "@/assets/tshirt-1-alt.jpg";
import tshirt2Alt from "@/assets/tshirt-2-alt.jpg";
import tshirt3Alt from "@/assets/tshirt-3-alt.jpg";
import hoodie4 from "@/assets/hoodie-4.jpg";
import hoodie4Alt from "@/assets/hoodie-4-alt.jpg";
import hoodie5 from "@/assets/hoodie-5.jpg";
import hoodie5Alt from "@/assets/hoodie-5-alt.jpg";
import tshirt4 from "@/assets/tshirt-4.jpg";
import tshirt4Alt from "@/assets/tshirt-4-alt.jpg";
import tshirt5 from "@/assets/tshirt-5.jpg";
import tshirt5Alt from "@/assets/tshirt-5-alt.jpg";

const productData = [
  { id: "classic-hoodie", image: hoodie1, images: [hoodie1, hoodie1Alt], nameKey: "classicHoodie" as const, basePrice: 490, category: "hoodie" },
  { id: "urban-hoodie", image: hoodie2, images: [hoodie2, hoodie2Alt], nameKey: "urbanHoodie" as const, basePrice: 490, category: "hoodie" },
  { id: "forest-hoodie", image: hoodie3, images: [hoodie3, hoodie3Alt], nameKey: "forestHoodie" as const, basePrice: 490, category: "hoodie" },
  { id: "midnight-hoodie", image: hoodie4, images: [hoodie4, hoodie4Alt], nameKey: "midnightHoodie" as const, basePrice: 490, category: "hoodie" },
  { id: "sand-hoodie", image: hoodie5, images: [hoodie5, hoodie5Alt], nameKey: "sandHoodie" as const, basePrice: 490, category: "hoodie" },
  { id: "essential-tee", image: tshirt1, images: [tshirt1, tshirt1Alt], nameKey: "essentialTee" as const, basePrice: 290, category: "tshirt" },
  { id: "statement-tee", image: tshirt2, images: [tshirt2, tshirt2Alt], nameKey: "statementTee" as const, basePrice: 290, category: "tshirt" },
  { id: "sunset-tee", image: tshirt3, images: [tshirt3, tshirt3Alt], nameKey: "sunsetTee" as const, basePrice: 290, category: "tshirt" },
  { id: "burgundy-tee", image: tshirt4, images: [tshirt4, tshirt4Alt], nameKey: "burgundyTee" as const, basePrice: 290, category: "tshirt" },
  { id: "olive-tee", image: tshirt5, images: [tshirt5, tshirt5Alt], nameKey: "oliveTee" as const, basePrice: 290, category: "tshirt" },
];

const TEXT_COLORS = [
  { value: "#FFFFFF", label: "Blanc" },
  { value: "#000000", label: "Noir" },
  { value: "#C62828", label: "Rouge" },
  { value: "#1565C0", label: "Bleu" },
  { value: "#F9A825", label: "Jaune" },
  { value: "#2E7D32", label: "Vert" },
  { value: "#E65100", label: "Orange" },
  { value: "#6A1B9A", label: "Violet" },
];

const CUSTOMIZATION_SURCHARGE = 50;

const Checkout = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  const selectedProduct = productData.find((p) => p.id === productId);

  const [form, setForm] = useState({
    name: "", address: "", city: "", phone: "", size: "M", color: "terracotta", customText: "",
  });
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [logoPlacement, setLogoPlacement] = useState<"front" | "back">("front");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  // index 0 = front (recto), index 1 = back (verso)
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [aiDesignImage, setAiDesignImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const hasCustomization = !!(form.customText.trim() || logoFile);
  const totalPrice = useMemo(() => {
    if (!selectedProduct) return 0;
    return selectedProduct.basePrice + (hasCustomization ? CUSTOMIZATION_SURCHARGE : 0);
  }, [selectedProduct, hasCustomization]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast.error(t("fileTooLarge")); return; }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => { setLogoFile(null); setLogoPreview(null); if (fileRef.current) fileRef.current.value = ""; };

  const imageToBase64 = (src: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d")!.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = src;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim() || !form.city.trim() || !form.phone.trim()) { toast.error(t("fillRequired")); return; }
    if (!selectedProduct) { toast.error(t("noProductSelected")); return; }
    if (!form.customText.trim() && !logoFile) { toast.error(t("addCustom")); return; }

    setIsSubmitting(true);
    try {
      const productImageBase64 = await imageToBase64(selectedProduct.images[selectedImageIdx]);

      const { error } = await supabase.functions.invoke("send-order-to-sheets", {
        body: {
          productName: t(selectedProduct.nameKey),
          price: `${totalPrice} MAD`,
          size: form.size,
          color: form.color,
          customerName: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          customText: form.customText,
          textColor,
          logoPlacement,
          productImage: productImageBase64,
          aiDesignImage: aiDesignImage || null,
        },
      });
      if (error) throw error;
      toast.success(t("orderSuccess"));
    } catch (err) {
      console.error("Order submission error:", err);
      toast.error(t("orderError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 text-base font-mono bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground placeholder:text-muted-foreground";
  const labelClass = "block text-sm tracking-[0.15em] font-mono text-muted-foreground mb-2";

  if (!selectedProduct) {
    return (
      <Layout>
        <section className="container mx-auto px-6 py-16 max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">{t("noProduct")}</h1>
          <p className="text-sm font-mono text-muted-foreground mb-8">{t("chooseFirst")}</p>
          <Link to="/hoodies" className="inline-flex items-center gap-2 text-sm font-mono text-primary hover:underline">
            <ArrowLeft size={16} /> {t("browseProducts")}
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container mx-auto px-6 py-16 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link to={selectedProduct.category === "hoodie" ? "/hoodies" : "/tshirts"} className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft size={14} /> {t("backTo")}{selectedProduct.category === "hoodie" ? t("hoodies") : t("tshirts")}
          </Link>
          <p className="text-sm tracking-[0.3em] font-mono text-muted-foreground mb-2">{t("checkout")}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">{t("placeOrder")}</h1>
          <p className="text-base font-mono text-muted-foreground leading-relaxed mb-12">{t("fillDetails")}</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Summary */}
          <div className="pb-6">
            <p className="text-sm tracking-[0.3em] font-mono text-muted-foreground mb-4">{t("yourProduct")}</p>
            <div className="max-w-[448px]">
              <ProductPreview
                productImage={selectedProduct.images[selectedImageIdx]}
                productName={t(selectedProduct.nameKey)}
                customText={form.customText}
                textColor={textColor}
                logoPreview={logoPreview}
                logoPlacement={logoPlacement}
                selectedSide={selectedImageIdx === 0 ? "front" : "back"}
                onAiImageChange={setAiDesignImage}
              />
              {/* Thumbnail gallery: Recto / Verso */}
              <div className="flex gap-2 mt-3">
                {selectedProduct.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-20 h-20 border-2 overflow-hidden transition-colors ${
                      idx === selectedImageIdx ? "border-primary" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <img src={img} alt={`${t(selectedProduct.nameKey)} ${idx === 0 ? "recto" : "verso"}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] font-mono text-center py-0.5">
                      {idx === 0 ? t("front") : t("back")}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xl font-mono font-bold text-foreground mt-3">{t(selectedProduct.nameKey)}</p>
              {/* Price with surcharge */}
              <div className="mt-1">
                <p className="text-lg font-mono text-muted-foreground">{selectedProduct.basePrice} MAD</p>
                {hasCustomization && (
                  <p className="text-sm font-mono text-gamla-orange">+ {CUSTOMIZATION_SURCHARGE} MAD ({t("customSurcharge")})</p>
                )}
                <p className="text-xl font-mono font-bold text-foreground mt-1">{t("totalPrice")}: {totalPrice} MAD</p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>{t("fullName")}</label>
              <input name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="" maxLength={100} />
            </div>
            <div>
              <label className={labelClass}>{t("phone")}</label>
              <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+212 6 00 00 00 00" maxLength={20} />
            </div>
          </div>
          <div>
            <label className={labelClass}>{t("address")}</label>
            <input name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="" maxLength={200} />
          </div>
          <div>
            <label className={labelClass}>{t("city")}</label>
            <input name="city" value={form.city} onChange={handleChange} className={inputClass} placeholder="" maxLength={100} />
          </div>

          {/* Size */}
          <div className="border-t border-border pt-6">
            <p className="text-sm tracking-[0.3em] font-mono text-muted-foreground mb-4">{t("options")}</p>
            <div>
              <label className={labelClass}>{t("size")}</label>
              <select name="size" value={form.size} onChange={handleChange} className={inputClass}>
                {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
          </div>

          {/* Customization */}
          <div className="border-t border-border pt-6">
            <p className="text-sm tracking-[0.3em] font-mono text-muted-foreground mb-4">
              {t("customization")} <span className="text-gamla-orange text-xs">(+{CUSTOMIZATION_SURCHARGE} MAD)</span>
            </p>

            {/* Custom text */}
            <div>
              <label className={labelClass}>{t("customText")}</label>
              <textarea name="customText" value={form.customText} onChange={handleChange} className={`${inputClass} min-h-[100px] resize-y`} placeholder={t("customTextPlaceholder")} maxLength={200} />
            </div>

            {/* Text color picker */}
            {form.customText.trim() && (
              <div className="mt-4">
                <label className={labelClass}>{t("textColor")}</label>
                <div className="flex flex-wrap gap-2">
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setTextColor(c.value)}
                      className={`w-9 h-9 rounded-full border-2 transition-all ${
                        textColor === c.value ? "border-primary scale-110 ring-2 ring-primary/30" : "border-border hover:border-muted-foreground"
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Logo upload */}
            <div className="mt-4">
              <label className={labelClass}>{t("uploadLogo")}</label>
              <input ref={fileRef} type="file" accept=".png,.svg,.webp" onChange={handleFileChange} className="hidden" />
              {logoPreview ? (
                <div className="relative inline-block">
                  <img src={logoPreview} alt="Logo preview" className="h-32 object-contain border border-border p-2" />
                  <button type="button" onClick={removeLogo} className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"><X size={14} /></button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 px-6 py-3 border border-dashed border-border text-sm font-mono text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <Upload size={16} /> {t("uploadImage")}
                </button>
              )}
            </div>

            {/* Logo placement: front or back */}
            {logoPreview && (
              <div className="mt-4">
                <label className={labelClass}>{t("logoPlacement")}</label>
                <div className="flex gap-3">
                  {(["front", "back"] as const).map((side) => (
                    <button
                      key={side}
                      type="button"
                      onClick={() => {
                        setLogoPlacement(side);
                        // Auto-switch to the matching view
                        setSelectedImageIdx(side === "front" ? 0 : 1);
                      }}
                      className={`px-5 py-2.5 text-sm font-mono border transition-all ${
                        logoPlacement === side
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border text-muted-foreground hover:border-primary hover:text-foreground"
                      }`}
                    >
                      {t(side)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 text-sm tracking-[0.2em] font-mono bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors mt-8 flex items-center justify-center gap-2">
            {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> {t("orderSending")}</> : `${t("submitOrder")} — ${totalPrice} MAD`}
          </button>
        </form>
      </section>
    </Layout>
  );
};

export default Checkout;
