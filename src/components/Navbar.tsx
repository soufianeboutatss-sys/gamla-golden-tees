import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "HOME" },
  { to: "/hoodies", label: "HOODIES" },
  { to: "/tshirts", label: "T-SHIRTS" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Announcement bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-foreground text-background text-center py-2">
        <p className="text-[10px] tracking-[0.25em] font-mono uppercase">
          Free shipping on orders over €100
        </p>
      </div>

      {/* Main nav */}
      <header className="fixed top-[32px] left-0 right-0 z-50 px-5 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-display text-xl font-bold tracking-tight text-foreground z-10">
            GAMLA <span className="text-primary italic">Stan</span>
          </Link>

          {/* Center pill nav — desktop */}
          <nav className="hidden md:flex items-center border border-border bg-background/90 backdrop-blur-md rounded-full px-2 py-1.5 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-[11px] tracking-[0.18em] font-mono px-5 py-2 rounded-full transition-all duration-300 ${
                  location.pathname === link.to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right utils */}
          <div className="hidden md:flex items-center gap-6 z-10">
            <span className="text-[11px] tracking-[0.15em] font-mono text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              SEARCH_
            </span>
            <Link
              to="/checkout"
              className="text-[11px] tracking-[0.15em] font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              BAG [0]
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-foreground z-10"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center gap-8"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`text-sm tracking-[0.25em] font-mono transition-colors ${
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/checkout"
              onClick={() => setMobileOpen(false)}
              className="text-sm tracking-[0.25em] font-mono text-muted-foreground hover:text-foreground transition-colors"
            >
              ORDER
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
