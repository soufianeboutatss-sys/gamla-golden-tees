import { Link } from "react-router-dom";
import { useLanguage } from "@/i18n/LanguageContext";
import logo from './stock-removebg-preview.png';
const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border py-14 px-6 lg:px-10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" className="font-display text-xl font-bold tracking-wide text-foreground">
         <img src={logo} width={100} />
        </Link>
        <nav className="flex gap-8">
          <Link to="/hoodies" className="text-[10px] tracking-[0.2em] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase">{t("hoodies")}</Link>
          <Link to="/tshirts" className="text-[10px] tracking-[0.2em] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase">{t("tshirts")}</Link>
          <Link to="/checkout" className="text-[10px] tracking-[0.2em] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase">{t("order")}</Link>
        </nav>
        <p className="text-[10px] text-muted-foreground font-mono tracking-wider">{t("copyright")}</p>
      </div>
    </footer>
  );
};

export default Footer;
