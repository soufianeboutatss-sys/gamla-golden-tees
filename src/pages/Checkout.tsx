import { useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Upload, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/i18n/LanguageContext";
import hoodie1 from "@/assets/hoodie-1.jpg";
import hoodie2 from "@/assets/hoodie-2.jpg";
import hoodie3 from "@/assets/hoodie-3.jpg";
import tshirt1 from "@/assets/tshirt-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";
import tshirt3 from "@/assets/tshirt-3.jpg";

const productData = [
  { id: "classic-hoodie", image: hoodie1, nameKey: "classicHoodie" as const, price: "€49", category: "hoodie" },
  { id: "urban-hoodie", image: hoodie2, nameKey: "urbanHoodie" as const, price: "€49", category: "hoodie" },
  { id: "forest-hoodie", image: hoodie3, nameKey: "forestHoodie" as const, price: "€49", category: "hoodie" },
  { id: "essential-tee", image: tshirt1, nameKey: "essentialTee" as const, price: "€29", category: "tshirt" },
  { id: "statement-tee", image: tshirt2, nameKey: "statementTee" as const, price: "€29", category: "tshirt" },
  { id: "sunset-tee", image: tshirt3, nameKey: "sunsetTee" as const, price: "€29", category: "tshirt" },
];

const Checkout = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  const selectedProduct = productData.find((p) => p.id === productId);

  const [form, setForm] = useState({
    name: "", address: "", city: "", phone: "", size: "M", color: "terracotta", customText: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim() || !form.city.trim() || !form.phone.trim()) { toast.error(t("fillRequired")); return; }
    if (!selectedProduct) { toast.error(t("noProductSelected")); return; }
    if (!form.customText.trim() && !logoFile) { toast.error(t("addCustom")); return; }
    toast.success(t("orderSuccess"));
  };

  const inputClass = "w-full px-4 py-3 text-sm font-mono bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground placeholder:text-muted-foreground";
  const labelClass = "block text-xs tracking-[0.15em] font-mono text-muted-foreground mb-2";

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
          <p className="text-xs tracking-[0.3em] font-mono text-muted-foreground mb-2">{t("checkout")}</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">{t("placeOrder")}</h1>
          <p className="text-sm font-mono text-muted-foreground leading-relaxed mb-12">{t("fillDetails")}</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Summary */}
          <div className="pb-6">
            <p className="text-xs tracking-[0.3em] font-mono text-muted-foreground mb-4">{t("yourProduct")}</p>
            <div className="flex gap-4 items-center">
              <div className="w-56 h-56 overflow-hidden bg-secondary flex-shrink-0">
                <img src={selectedProduct.image} alt={t(selectedProduct.nameKey)} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-foreground">{t(selectedProduct.nameKey)}</p>
                <p className="text-sm font-mono text-muted-foreground">{selectedProduct.price}</p>
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
              <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+33 6 00 00 00 00" maxLength={20} />
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

          {/* Size & Color */}
          <div className="border-t border-border pt-6">
            <p className="text-xs tracking-[0.3em] font-mono text-muted-foreground mb-4">{t("options")}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t("size")}</label>
                <select name="size" value={form.size} onChange={handleChange} className={inputClass}>
                  {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t("color")}</label>
                <select name="color" value={form.color} onChange={handleChange} className={inputClass}>
                  <option value="terracotta">{t("terracotta")}</option>
                  <option value="navy">{t("navy")}</option>
                  <option value="forest">{t("forestGreen")}</option>
                  <option value="black">{t("black")}</option>
                  <option value="cream">{t("cream")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customization */}
          <div className="border-t border-border pt-6">
            <p className="text-xs tracking-[0.3em] font-mono text-muted-foreground mb-4">{t("customization")}</p>
            <div>
              <label className={labelClass}>{t("customText")}</label>
              <textarea name="customText" value={form.customText} onChange={handleChange} className={`${inputClass} min-h-[100px] resize-y`} placeholder={t("customTextPlaceholder")} maxLength={200} />
            </div>
            <div className="mt-4">
              <label className={labelClass}>{t("uploadLogo")}</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
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
          </div>

          <button type="submit" className="w-full py-4 text-xs tracking-[0.2em] font-mono bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mt-8">
            {t("submitOrder")}
          </button>
        </form>
      </section>
    </Layout>
  );
};

export default Checkout;
