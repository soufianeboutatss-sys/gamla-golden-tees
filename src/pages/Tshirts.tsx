import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import tshirt1 from "@/assets/tshirt-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";
import tshirt3 from "@/assets/tshirt-3.jpg";

const tshirts = [
  { image: tshirt1, name: "Essential Tee", price: "€29.00", color: "CREAM" },
  { image: tshirt2, name: "Statement Tee", price: "€29.00", color: "BLACK" },
  { image: tshirt3, name: "Sunset Tee", price: "€29.00", color: "TERRACOTTA" },
];

const Tshirts = () => (
  <Layout>
    <section className="container mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs tracking-[0.3em] font-mono text-muted-foreground mb-2">COLLECTION</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
          T-Shirts
        </h1>
        <p className="text-sm font-mono text-muted-foreground max-w-lg leading-relaxed mb-12">
          Premium custom t-shirts — your design, your rules.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {tshirts.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <ProductCard {...t} />
          </motion.div>
        ))}
      </div>
    </section>
  </Layout>
);

export default Tshirts;
