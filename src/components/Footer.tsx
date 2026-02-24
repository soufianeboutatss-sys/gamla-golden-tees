import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-foreground text-background py-12">
    <div className="px-8 md:px-16">
      <div className="flex flex-col md:flex-row items-start justify-between gap-8">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          GAMLA <span className="text-primary italic">Stan</span>
        </Link>
        <nav className="flex gap-8">
          <Link to="/hoodies" className="text-[10px] tracking-[0.2em] font-mono text-background/60 hover:text-background transition-colors">HOODIES</Link>
          <Link to="/tshirts" className="text-[10px] tracking-[0.2em] font-mono text-background/60 hover:text-background transition-colors">T-SHIRTS</Link>
          <Link to="/checkout" className="text-[10px] tracking-[0.2em] font-mono text-background/60 hover:text-background transition-colors">ORDER</Link>
        </nav>
        <p className="text-[10px] text-background/40 font-mono tracking-wider">© 2026 GAMLA STAN CUSTOMS</p>
      </div>
    </div>
  </footer>
);

export default Footer;
