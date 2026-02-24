import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import tshirt1 from "@/assets/tshirt-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";
import tshirt3 from "@/assets/tshirt-3.jpg";
import heroBanner from "@/assets/hero-banner.jpg";

const tshirts = [
  { image: tshirt1, name: "Essential Tee", price: "€29", color: "Cream", tag: "CLASSIC" },
  { image: tshirt2, name: "Statement Tee", price: "€29", color: "Black", tag: "POPULAR" },
  { image: tshirt3, name: "Sunset Tee", price: "€29", color: "Terracotta" },
];

const Tshirts = () => (
  <Layout>
    {/* Collection banner */}
    <section className="relative h-[45vh] overflow-hidden -mt-[80px] flex items-end">
      <img
        src={heroBanner}
        alt="T-shirts collection"
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
              Find Your Tee
            </h1>
            <p className="text-xs font-mono text-background/70 mt-2 max-w-sm leading-relaxed">
              Premium custom t-shirts — your design, your rules.
            </p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] tracking-[0.2em] font-mono text-background/50">ALL T-SHIRTS ARE:</p>
            <p className="text-[10px] tracking-[0.2em] font-mono text-background/50 mt-1">01</p>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Product grid */}
    <section className="px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tshirts.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <ProductCard {...t} />
          </motion.div>
        ))}
      </div>
    </section>
  </Layout>
);

export default Tshirts;
