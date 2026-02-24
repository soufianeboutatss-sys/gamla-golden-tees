import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import tshirt1 from "@/assets/tshirt-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";
import tshirt3 from "@/assets/tshirt-3.jpg";

const tshirts = [
  { image: tshirt1, name: "Essential Tee", price: "€29", description: "100% Cotton • Custom Print", tag: "Classic" },
  { image: tshirt2, name: "Statement Tee", price: "€29", description: "100% Cotton • Custom Print", tag: "Popular" },
  { image: tshirt3, name: "Sunset Tee", price: "€29", description: "100% Cotton • Custom Print" },
];

const Tshirts = () => (
  <Layout>
    <section className="px-6 lg:px-10 pt-16 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-4xl md:text-5xl text-center text-foreground mb-3">All T-Shirts</h1>
        <p className="text-center text-xs font-mono text-muted-foreground mb-16 tracking-wider">YOUR DESIGN • YOUR RULES</p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 max-w-5xl mx-auto">
        {tshirts.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 25 }}
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
