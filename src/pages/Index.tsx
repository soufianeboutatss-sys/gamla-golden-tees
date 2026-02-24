import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import heroBanner from "@/assets/hero-banner.jpg";
import hoodie1 from "@/assets/hoodie-1.jpg";
import hoodie2 from "@/assets/hoodie-2.jpg";
import hoodie3 from "@/assets/hoodie-3.jpg";
import tshirt1 from "@/assets/tshirt-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";
import tshirt3 from "@/assets/tshirt-3.jpg";

const Index = () => {
  return (
    <Layout>
      {/* Hero — full width image like evervessel */}
      <section className="relative h-[75vh] md:h-[85vh] overflow-hidden">
        <img
          src={heroBanner}
          alt="Gamla Stan street with custom clothing"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-lg"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight">
              The Ultimate Customs.
              <br />
              Easy to <span className="italic">wear.</span>
            </h1>
            <Link
              to="/hoodies"
              className="inline-block mt-8 px-8 py-3 text-[11px] tracking-[0.15em] font-mono bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Products section — category heading + grid */}
      <section className="px-6 lg:px-10 py-20">
        <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-4">Hoodies</h2>
        <p className="text-center text-xs font-mono text-muted-foreground mb-12 tracking-wider">CUSTOM PRINTED • PREMIUM QUALITY</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 max-w-5xl mx-auto">
          <ProductCard image={hoodie1} name="Classic Hoodie" price="€49" description="Premium Cotton • Custom Print" tag="Bestseller" />
          <ProductCard image={hoodie2} name="Urban Hoodie" price="€49" description="Premium Cotton • Custom Print" tag="New" />
          <ProductCard image={hoodie3} name="Forest Hoodie" price="€49" description="Premium Cotton • Custom Print" />
        </div>
      </section>

      {/* T-shirts section */}
      <section className="px-6 lg:px-10 py-20 bg-secondary">
        <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-4">T-Shirts</h2>
        <p className="text-center text-xs font-mono text-muted-foreground mb-12 tracking-wider">YOUR DESIGN • YOUR RULES</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 max-w-5xl mx-auto">
          <ProductCard image={tshirt1} name="Essential Tee" price="€29" description="100% Cotton • Custom Print" tag="Classic" />
          <ProductCard image={tshirt2} name="Statement Tee" price="€29" description="100% Cotton • Custom Print" tag="Popular" />
          <ProductCard image={tshirt3} name="Sunset Tee" price="€29" description="100% Cotton • Custom Print" />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">
          Make It <span className="italic">Yours</span>
        </h2>
        <p className="text-xs font-mono text-muted-foreground max-w-md mx-auto leading-relaxed mb-10">
          Add your custom text or upload your logo. We print it on premium hoodies and t-shirts, made just for you.
        </p>
        <Link
          to="/checkout"
          className="inline-block px-10 py-3.5 text-[11px] tracking-[0.15em] font-mono bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Start Your Order
        </Link>
      </section>
    </Layout>
  );
};

export default Index;
