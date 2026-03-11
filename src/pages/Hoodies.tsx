import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { useLanguage } from "@/i18n/LanguageContext";
import hoodie1 from "@/assets/hoodie-1.jpg";
import hoodie2 from "@/assets/hoodie-2.jpg";
import hoodie3 from "@/assets/hoodie-3.jpg";
import hoodie4 from "@/assets/hoodie-4.jpg";
import hoodie5 from "@/assets/hoodie-5.jpg";

const Hoodies = () => {
  const { t } = useLanguage();

  const hoodies = [
    { id: "classic-hoodie", image: hoodie1, name: t("classicHoodie"), price: "490 MAD", description: t("premiumCotton"), tag: t("bestseller") },
    { id: "urban-hoodie", image: hoodie2, name: t("urbanHoodie"), price: "490 MAD", description: t("premiumCotton"), tag: t("new") },
    { id: "forest-hoodie", image: hoodie3, name: t("forestHoodie"), price: "490 MAD", description: t("premiumCotton") },
    { id: "midnight-hoodie", image: hoodie4, name: t("midnightHoodie"), price: "490 MAD", description: t("premiumCotton"), tag: t("exclusive") },
    { id: "sand-hoodie", image: hoodie5, name: t("sandHoodie"), price: "490 MAD", description: t("premiumCotton") },
  ];

  return (
    <Layout>
      <section className="px-6 lg:px-10 pt-16 pb-24">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-4xl md:text-5xl text-center text-foreground mb-3">{t("allHoodies")}</h1>
          <p className="text-center text-xs font-mono text-muted-foreground mb-16 tracking-wider">{t("hoodiesSub")}</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 max-w-5xl mx-auto">
          {hoodies.map((h, i) => (
            <motion.div key={h.id} initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}>
              <ProductCard {...h} />
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Hoodies;
