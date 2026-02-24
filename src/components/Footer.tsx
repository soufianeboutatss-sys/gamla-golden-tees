import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border bg-card py-12">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <Link to="/" className="font-display text-xl font-bold tracking-tight text-foreground">
          GAMLA <span className="text-primary italic">Stan</span>
        </Link>
        <nav className="flex gap-8">
          <Link to="/hoodies" className="text-xs tracking-[0.2em] font-mono text-muted-foreground hover:text-foreground transition-colors">HOODIES</Link>
          <Link to="/tshirts" className="text-xs tracking-[0.2em] font-mono text-muted-foreground hover:text-foreground transition-colors">T-SHIRTS</Link>
          <Link to="/checkout" className="text-xs tracking-[0.2em] font-mono text-muted-foreground hover:text-foreground transition-colors">ORDER</Link>
        </nav>
        <p className="text-xs text-muted-foreground font-mono">© 2026 GAMLA STAN CUSTOMS</p>
      </div>
    </div>
  </footer>
);

export default Footer;
