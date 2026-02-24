import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import hoodie1 from "@/assets/hoodie-1.jpg";
import hoodie2 from "@/assets/hoodie-2.jpg";
import hoodie3 from "@/assets/hoodie-3.jpg";
import heroBanner from "@/assets/hero-banner.jpg";

const hoodies = [
  { image: hoodie1, name: "Classic Hoodie", price: "€49", color: "Terracotta", tag: "BESTSELLER" },
  { image: hoodie2, name: "Urban Hoodie", price: "€49", color: "Navy", tag: "NEW" },
  { image: hoodie3, name: "Forest Hoodie", price: "€49", color: "Forest Green" },
];

const Hoodies = () => (
  <Layout>
    {/* Collection banner — like drinkpouch /collections page */}
    <section className="relative h-[45vh] overflow-hidden -mt-[80px] flex items-end">
      <img
        src={heroBanner}
        alt="Hoodies collection"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-foreground/40" />
      <div className="relative z-10 px-8 md:px-16 pb-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between"
        >
          <div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-background">
              Find Your Hoodie
            </h1>
            <p className="text-xs font-mono text-background/70 mt-2 max-w-sm leading-relaxed">
              Premium custom hoodies — add your text or logo and make them uniquely yours.
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] tracking-[0.2em] font-mono text-background/50">ALL HOODIES ARE:</p>
            <p className="text-[10px] tracking-[0.2em] font-mono text-background/50 mt-1">01</p>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Product grid */}
    <section className="px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hoodies.map((h, i) => (
          <motion.div
            key={h.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <ProductCard {...h} />
          </motion.div>
        ))}
      </div>
    </section>
  </Layout>
);

export default Hoodies;
