import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import hoodie1 from "@/assets/hoodie-1.jpg";
import hoodie2 from "@/assets/hoodie-2.jpg";
import hoodie3 from "@/assets/hoodie-3.jpg";

const hoodies = [
  { id: "classic-hoodie", image: hoodie1, name: "Classic Hoodie", price: "€49", description: "Premium Cotton • Custom Print", tag: "Bestseller" },
  { id: "urban-hoodie", image: hoodie2, name: "Urban Hoodie", price: "€49", description: "Premium Cotton • Custom Print", tag: "New" },
  { id: "forest-hoodie", image: hoodie3, name: "Forest Hoodie", price: "€49", description: "Premium Cotton • Custom Print" },
];

const Hoodies = () => (
  <Layout>
    <section className="px-6 lg:px-10 pt-16 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-4xl md:text-5xl text-center text-foreground mb-3">All Hoodies</h1>
        <p className="text-center text-xs font-mono text-muted-foreground mb-16 tracking-wider">CUSTOM PRINTED • PREMIUM QUALITY</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 max-w-5xl mx-auto">
        {hoodies.map((h, i) => (
          <motion.div
            key={h.name}
            initial={{ opacity: 0, y: 25 }}
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
