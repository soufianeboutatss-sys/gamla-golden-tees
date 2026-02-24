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
      {/* Hero — full bleed dark, like drinkpouch */}
      <section className="relative h-screen overflow-hidden -mt-[80px]">
        <img
          src={heroBanner}
          alt="Gamla Stan street with custom clothing"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/50" />

        {/* Vertical brand text on left */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
          <p className="font-display text-[120px] font-bold text-background/10 leading-none [writing-mode:vertical-lr] tracking-tight select-none">
            GAMLA
          </p>
        </div>

        {/* Bottom-left content */}
        <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="max-w-xl"
          >
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-background leading-[0.95]">
              Your Style,<br />
              <span className="italic">Your Story</span>
            </h1>
            <p className="mt-5 text-sm font-mono text-background/70 max-w-md leading-relaxed">
              Custom hoodies & t-shirts crafted with care. Add your text, upload your logo — we bring your vision to life.
            </p>
            <Link
              to="/hoodies"
              className="inline-flex items-center gap-2 mt-8 px-8 py-3 text-[11px] tracking-[0.2em] font-mono border border-background/40 text-background hover:bg-background/10 transition-colors"
            >
              EXPLORE THE RANGE <span className="text-base">↗</span>
            </Link>
          </motion.div>

          {/* Bottom-right tagline */}
          <p className="absolute bottom-16 right-8 md:right-16 text-[10px] tracking-[0.25em] font-mono text-background/50 hidden md:block">
            CUSTOM STREETWEAR™
          </p>
        </div>
      </section>

      {/* Section divider */}
      <section className="py-20 px-8 md:px-16">
        <div className="flex items-start justify-between flex-wrap gap-8">
          <div>
            <p className="text-[10px] tracking-[0.3em] font-mono text-muted-foreground mb-3">01 / OUR COLLECTIONS</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              Shop by Style
            </h2>
          </div>
          <p className="text-xs font-mono text-muted-foreground max-w-sm leading-relaxed">
            Streetwear that adapts to you. Each piece is made-to-order with your custom text or logo, 
            so you can express exactly who you are.
          </p>
        </div>
      </section>

      {/* Featured products — 4 col grid like drinkpouch */}
      <section className="px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProductCard image={hoodie1} name="Classic Hoodie" price="€49" color="Terracotta" tag="BESTSELLER" />
          <ProductCard image={hoodie2} name="Urban Hoodie" price="€49" color="Navy" tag="NEW" />
          <ProductCard image={tshirt1} name="Essential Tee" price="€29" color="Cream" />
          <ProductCard image={tshirt2} name="Statement Tee" price="€29" color="Black" tag="POPULAR" />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-card border-t border-b border-border py-24 px-8 md:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.3em] font-mono text-muted-foreground mb-4">02 / CUSTOMIZE</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground italic mb-4">
            Make It Yours
          </h2>
          <p className="text-sm font-mono text-muted-foreground max-w-lg mx-auto leading-relaxed mb-10">
            Add your custom text or upload your logo. We print it on premium hoodies and t-shirts, made just for you.
          </p>
          <Link
            to="/checkout"
            className="inline-flex items-center gap-2 px-10 py-4 text-[11px] tracking-[0.2em] font-mono bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            START YOUR ORDER <span className="text-base">↗</span>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
