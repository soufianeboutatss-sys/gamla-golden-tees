import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import heroBanner from "@/assets/hero-banner.jpg";
import hoodie1 from "@/assets/hoodie-1.jpg";
import hoodie2 from "@/assets/hoodie-2.jpg";
import tshirt1 from "@/assets/tshirt-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";

const Index = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[85vh] overflow-hidden">
        <img
          src={heroBanner}
          alt="Gamla Stan street with custom clothing"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative z-10 container mx-auto px-6 h-full flex flex-col justify-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <p className="text-xs tracking-[0.3em] font-mono text-primary-foreground/80 mb-4">
              CUSTOM STREETWEAR
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground leading-[0.95] max-w-3xl">
              Your Style,<br />
              <span className="italic">Your Story</span>
            </h1>
            <p className="mt-6 text-sm font-mono text-primary-foreground/70 max-w-md leading-relaxed">
              Custom hoodies & t-shirts crafted with care. Add your text, upload your logo — we bring your vision to life.
            </p>
            <div className="flex gap-4 mt-8">
              <Link
                to="/hoodies"
                className="inline-block px-8 py-3 text-xs tracking-[0.2em] font-mono bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                SHOP HOODIES
              </Link>
              <Link
                to="/tshirts"
                className="inline-block px-8 py-3 text-xs tracking-[0.2em] font-mono border border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 transition-colors"
              >
                SHOP T-SHIRTS
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured products */}
      <section className="container mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs tracking-[0.3em] font-mono text-muted-foreground mb-2">FEATURED</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Best Sellers
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard image={hoodie1} name="Classic Hoodie" price="€49.00" color="TERRACOTTA" />
          <ProductCard image={hoodie2} name="Urban Hoodie" price="€49.00" color="NAVY" />
          <ProductCard image={tshirt1} name="Essential Tee" price="€29.00" color="CREAM" />
          <ProductCard image={tshirt2} name="Statement Tee" price="€29.00" color="BLACK" />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-card py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground italic mb-4">
            Make It Yours
          </h2>
          <p className="text-sm font-mono text-muted-foreground max-w-lg mx-auto leading-relaxed mb-8">
            Add your custom text or upload your logo. We print it on premium hoodies and t-shirts, made just for you.
          </p>
          <Link
            to="/checkout"
            className="inline-block px-10 py-4 text-xs tracking-[0.2em] font-mono bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            START YOUR ORDER
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
