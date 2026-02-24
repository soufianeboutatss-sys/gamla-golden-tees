import { useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Upload, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import hoodie1 from "@/assets/hoodie-1.jpg";
import hoodie2 from "@/assets/hoodie-2.jpg";
import hoodie3 from "@/assets/hoodie-3.jpg";
import tshirt1 from "@/assets/tshirt-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";
import tshirt3 from "@/assets/tshirt-3.jpg";

const products = [
  { id: "classic-hoodie", image: hoodie1, name: "Classic Hoodie", price: "€49", category: "hoodie" },
  { id: "urban-hoodie", image: hoodie2, name: "Urban Hoodie", price: "€49", category: "hoodie" },
  { id: "forest-hoodie", image: hoodie3, name: "Forest Hoodie", price: "€49", category: "hoodie" },
  { id: "essential-tee", image: tshirt1, name: "Essential Tee", price: "€29", category: "tshirt" },
  { id: "statement-tee", image: tshirt2, name: "Statement Tee", price: "€29", category: "tshirt" },
  { id: "sunset-tee", image: tshirt3, name: "Sunset Tee", price: "€29", category: "tshirt" },
];

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  const selectedProduct = products.find((p) => p.id === productId);

  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    size: "M",
    color: "terracotta",
    customText: "",
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
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File must be under 5MB");
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim() || !form.city.trim() || !form.phone.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!selectedProduct) {
      toast.error("No product selected");
      return;
    }
    if (!form.customText.trim() && !logoFile) {
      toast.error("Please add custom text or upload a logo");
      return;
    }
    toast.success("Order submitted! We'll contact you soon 🎉");
  };

  const inputClass =
    "w-full px-4 py-3 text-sm font-mono bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground placeholder:text-muted-foreground";
  const labelClass = "block text-xs tracking-[0.15em] font-mono text-muted-foreground mb-2";

  if (!selectedProduct) {
    return (
      <Layout>
        <section className="container mx-auto px-6 py-16 max-w-2xl text-center">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">No Product Selected</h1>
          <p className="text-sm font-mono text-muted-foreground mb-8">Please choose a product first.</p>
          <Link to="/hoodies" className="inline-flex items-center gap-2 text-sm font-mono text-primary hover:underline">
            <ArrowLeft size={16} /> Browse Products
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container mx-auto px-6 py-16 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to={selectedProduct.category === "hoodie" ? "/hoodies" : "/tshirts"} className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft size={14} /> Back to {selectedProduct.category === "hoodie" ? "Hoodies" : "T-Shirts"}
          </Link>
          <p className="text-xs tracking-[0.3em] font-mono text-muted-foreground mb-2">CHECKOUT</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
            Place Your Order
          </h1>
          <p className="text-sm font-mono text-muted-foreground leading-relaxed mb-12">
            Fill in your details and customize your piece.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>FULL NAME *</label>
              <input name="name" value={form.name} onChange={handleChange} className={inputClass} placeholder="Your name" maxLength={100} />
            </div>
            <div>
              <label className={labelClass}>PHONE *</label>
              <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} placeholder="+33 6 00 00 00 00" maxLength={20} />
            </div>
          </div>
          <div>
            <label className={labelClass}>ADDRESS *</label>
            <input name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="Your address" maxLength={200} />
          </div>
          <div>
            <label className={labelClass}>CITY *</label>
            <input name="city" value={form.city} onChange={handleChange} className={inputClass} placeholder="City" maxLength={100} />
          </div>

          {/* Selected Product Summary */}
          <div className="border-t border-border pt-6">
            <p className="text-xs tracking-[0.3em] font-mono text-muted-foreground mb-4">YOUR PRODUCT</p>
            <div className="flex gap-4 items-center">
              <div className="w-20 h-20 overflow-hidden bg-secondary flex-shrink-0">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-mono font-bold text-foreground">{selectedProduct.name}</p>
                <p className="text-sm font-mono text-muted-foreground">{selectedProduct.price}</p>
              </div>
            </div>
          </div>

          {/* Size & Color */}
          <div className="border-t border-border pt-6">
            <p className="text-xs tracking-[0.3em] font-mono text-muted-foreground mb-4">OPTIONS</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>SIZE</label>
                  <select name="size" value={form.size} onChange={handleChange} className={inputClass}>
                    {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>COLOR</label>
                  <select name="color" value={form.color} onChange={handleChange} className={inputClass}>
                    <option value="terracotta">Terracotta</option>
                    <option value="navy">Navy</option>
                    <option value="forest">Forest Green</option>
                    <option value="black">Black</option>
                    <option value="cream">Cream</option>
                  </select>
                </div>
              </div>
            </div>

          {/* Customization */}
          <div className="border-t border-border pt-6">
            <p className="text-xs tracking-[0.3em] font-mono text-muted-foreground mb-4">CUSTOMIZATION</p>
            <div>
              <label className={labelClass}>CUSTOM TEXT</label>
              <textarea
                name="customText"
                value={form.customText}
                onChange={handleChange}
                className={`${inputClass} min-h-[100px] resize-y`}
                placeholder="Text to print on your garment..."
                maxLength={200}
              />
            </div>
            <div className="mt-4">
              <label className={labelClass}>OR UPLOAD YOUR LOGO</label>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {logoPreview ? (
                <div className="relative inline-block">
                  <img src={logoPreview} alt="Logo preview" className="h-32 object-contain border border-border p-2" />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-3 border border-dashed border-border text-sm font-mono text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Upload size={16} />
                  UPLOAD IMAGE
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 text-xs tracking-[0.2em] font-mono bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mt-8"
          >
            SUBMIT ORDER
          </button>
        </form>
      </section>
    </Layout>
  );
};

export default Checkout;
