import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import hoodie1 from "@/assets/hoodie-1.jpg";
import hoodie2 from "@/assets/hoodie-2.jpg";
import hoodie3 from "@/assets/hoodie-3.jpg";

const hoodies = [
  { image: hoodie1, name: "Classic Hoodie", price: "€49.00", color: "TERRACOTTA" },
  { image: hoodie2, name: "Urban Hoodie", price: "€49.00", color: "NAVY" },
  { image: hoodie3, name: "Forest Hoodie", price: "€49.00", color: "FOREST GREEN" },
];

const Hoodies = () => (
  <Layout>
    <section className="container mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-xs tracking-[0.3em] font-mono text-muted-foreground mb-2">COLLECTION</p>
        <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
          Hoodies
        </h1>
        <p className="text-sm font-mono text-muted-foreground max-w-lg leading-relaxed mb-12">
          Premium custom hoodies — add your text or logo and make them uniquely yours.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {hoodies.map((h, i) => (
          <motion.div
            key={h.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <ProductCard {...h} />
          </motion.div>
        ))}
      </div>
    </section>
  </Layout>
);

export default Hoodies;
