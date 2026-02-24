import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

const Checkout = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    phone: "",
    product: "hoodie",
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
    if (!form.customText.trim() && !logoFile) {
      toast.error("Please add custom text or upload a logo");
      return;
    }
    toast.success("Order submitted! We'll contact you soon 🎉");
  };

  const inputClass =
    "w-full px-4 py-3 text-sm font-mono bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-foreground placeholder:text-muted-foreground";
  const labelClass = "block text-xs tracking-[0.15em] font-mono text-muted-foreground mb-2";

  return (
    <Layout>
      <section className="container mx-auto px-6 py-16 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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

          {/* Product options */}
          <div className="border-t border-border pt-6">
            <p className="text-xs tracking-[0.3em] font-mono text-muted-foreground mb-4">PRODUCT</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>TYPE</label>
                <select name="product" value={form.product} onChange={handleChange} className={inputClass}>
                  <option value="hoodie">Hoodie — €49</option>
                  <option value="tshirt">T-Shirt — €29</option>
                </select>
              </div>
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
