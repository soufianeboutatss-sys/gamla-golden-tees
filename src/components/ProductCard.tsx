import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ProductCardProps {
  image: string;
  name: string;
  price: string;
  color: string;
  tag?: string;
}

const ProductCard = ({ image, name, price, color, tag }: ProductCardProps) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ duration: 0.3 }}
    className="group cursor-pointer"
  >
    <Link to="/checkout">
      <div className="border border-border bg-card overflow-hidden relative">
        {/* Tag badge */}
        {tag && (
          <span className="absolute top-3 left-3 z-10 text-[10px] tracking-[0.15em] font-mono bg-primary text-primary-foreground px-3 py-1">
            {tag}
          </span>
        )}

        {/* Image */}
        <div className="aspect-square overflow-hidden flex items-center justify-center bg-muted/30 p-6">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Info bar */}
        <div className="border-t border-border px-4 py-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground">{name}</h3>
              <p className="text-[10px] font-mono tracking-[0.2em] text-muted-foreground mt-1 uppercase">{color}</p>
            </div>
            <p className="text-xs font-mono text-foreground tracking-wider">{price}</p>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default ProductCard;
