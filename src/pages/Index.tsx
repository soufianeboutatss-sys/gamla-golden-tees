import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { useLanguage } from "@/i18n/LanguageContext";
import heroBanner from "@/assets/hero-banner.jpg";
import hoodie1 from "@/assets/hoodie-1.jpg";
import hoodie2 from "@/assets/hoodie-2.jpg";
import hoodie3 from "@/assets/hoodie-3.jpg";
import hoodie4 from "@/assets/hoodie-4.jpg";
import hoodie5 from "@/assets/hoodie-5.jpg";
import tshirt1 from "@/assets/tshirt-1.jpg";
import tshirt2 from "@/assets/tshirt-2.jpg";
import tshirt3 from "@/assets/tshirt-3.jpg";
import tshirt4 from "@/assets/tshirt-4.jpg";
import tshirt5 from "@/assets/tshirt-5.jpg";

const Index = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[75vh] md:h-[85vh] overflow-hidden">
        <img src={heroBanner} alt="Gamla Stan street with custom clothing" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="max-w-lg">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-background leading-tight">
              {t("heroTitle1")}
              <br />
              {t("heroTitle2")}<span className="italic">{t("heroTitle2Italic")}</span>
            </h1>
            <Link to="/hoodies" className="inline-block mt-8 px-8 py-3 text-[11px] tracking-[0.15em] font-mono bg-gamla-orange text-white rounded-md hover:bg-gamla-orange/90 transition-colors">
              {t("shopNow")}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Hoodies */}
      <section className="px-6 lg:px-10 py-20">
        <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-4">{t("hoodiesTitle")}</h2>
        <p className="text-center text-xs font-mono text-muted-foreground mb-12 tracking-wider">{t("hoodiesSub")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 max-w-5xl mx-auto">
          <ProductCard id="classic-hoodie" image={hoodie1} name={t("classicHoodie")} price="490 MAD" description={t("premiumCotton")} tag={t("bestseller")} />
          <ProductCard id="urban-hoodie" image={hoodie2} name={t("urbanHoodie")} price="490 MAD" description={t("premiumCotton")} tag={t("new")} />
          <ProductCard id="forest-hoodie" image={hoodie3} name={t("forestHoodie")} price="490 MAD" description={t("premiumCotton")} />
          <ProductCard id="midnight-hoodie" image={hoodie4} name={t("midnightHoodie")} price="490 MAD" description={t("premiumCotton")} tag={t("exclusive")} />
          <ProductCard id="sand-hoodie" image={hoodie5} name={t("sandHoodie")} price="490 MAD" description={t("premiumCotton")} />
        </div>
      </section>

      {/* T-shirts */}
      <section className="px-6 lg:px-10 py-20 bg-secondary">
        <h2 className="font-display text-3xl md:text-4xl text-center text-foreground mb-4">{t("tshirtsTitle")}</h2>
        <p className="text-center text-xs font-mono text-muted-foreground mb-12 tracking-wider">{t("tshirtsSub")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 max-w-5xl mx-auto">
          <ProductCard id="essential-tee" image={tshirt1} name={t("essentialTee")} price="290 MAD" description={t("fullCotton")} tag={t("classic")} />
          <ProductCard id="statement-tee" image={tshirt2} name={t("statementTee")} price="290 MAD" description={t("fullCotton")} tag={t("popular")} />
          <ProductCard id="sunset-tee" image={tshirt3} name={t("sunsetTee")} price="290 MAD" description={t("fullCotton")} />
          <ProductCard id="burgundy-tee" image={tshirt4} name={t("burgundyTee")} price="290 MAD" description={t("fullCotton")} tag={t("limited")} />
          <ProductCard id="olive-tee" image={tshirt5} name={t("oliveTee")} price="290 MAD" description={t("fullCotton")} />
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <h2 className="font-display text-3xl md:text-5xl text-foreground mb-4">
          {t("ctaTitle")}<span className="italic">{t("ctaTitleItalic")}</span>
        </h2>
        <p className="text-xs font-mono text-muted-foreground max-w-md mx-auto leading-relaxed mb-10">{t("ctaDesc")}</p>
        <Link to="/checkout" className="inline-block px-10 py-3.5 text-[11px] tracking-[0.15em] font-mono bg-gamla-red text-white rounded-md hover:bg-gamla-red/90 transition-colors">
          {t("startOrder")}
        </Link>
      </section>
    </Layout>
  );
};

export default Index;
