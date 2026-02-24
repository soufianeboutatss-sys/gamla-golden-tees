import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ShoppingCart, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground text-center py-2.5">
        <p className="text-[10px] tracking-[0.2em] font-mono uppercase">
          Free shipping on orders over €100
        </p>
      </div>

      {/* Main nav */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <nav className="flex items-center justify-between px-6 lg:px-10 py-4">
          {/* Left nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/hoodies"
              className={`text-[11px] tracking-[0.18em] font-mono uppercase flex items-center gap-1 transition-colors ${
                location.pathname === "/hoodies" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              HOODIES <ChevronDown size={12} />
            </Link>
            <Link
              to="/tshirts"
              className={`text-[11px] tracking-[0.18em] font-mono uppercase flex items-center gap-1 transition-colors ${
                location.pathname === "/tshirts" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              T-SHIRTS <ChevronDown size={12} />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Center logo */}
          <Link to="/" className="absolute left-1/2 -translate-x-1/2 font-display text-2xl md:text-3xl font-bold tracking-wide text-foreground">
            GAMLA<span className="italic font-normal">Stan</span>
          </Link>

          {/* Right utils */}
          <div className="flex items-center gap-5">
            <Link
              to="/checkout"
              className="text-foreground hover:text-muted-foreground transition-colors"
              aria-label="Cart"
            >
              <ShoppingCart size={20} strokeWidth={1.5} />
            </Link>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[92px] z-40 bg-background border-b border-border py-8 flex flex-col items-center gap-6"
          >
            <Link to="/" onClick={() => setMobileOpen(false)} className="text-[11px] tracking-[0.2em] font-mono text-muted-foreground hover:text-foreground">HOME</Link>
            <Link to="/hoodies" onClick={() => setMobileOpen(false)} className="text-[11px] tracking-[0.2em] font-mono text-muted-foreground hover:text-foreground">HOODIES</Link>
            <Link to="/tshirts" onClick={() => setMobileOpen(false)} className="text-[11px] tracking-[0.2em] font-mono text-muted-foreground hover:text-foreground">T-SHIRTS</Link>
            <Link to="/checkout" onClick={() => setMobileOpen(false)} className="text-[11px] tracking-[0.2em] font-mono text-muted-foreground hover:text-foreground">ORDER</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
