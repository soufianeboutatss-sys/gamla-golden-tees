import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ProductCardProps {
  image: string;
  name: string;
  price: string;
  description: string;
  tag?: string;
}

const ProductCard = ({ image, name, price, description, tag }: ProductCardProps) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ duration: 0.3 }}
    className="group cursor-pointer text-center"
  >
    <Link to="/checkout">
      <div className="relative">
        {/* Tag badge */}
        {tag && (
          <span className="absolute top-3 left-3 z-10 text-[10px] tracking-[0.12em] font-mono border border-primary text-primary px-3 py-1 rounded-full bg-background">
            {tag}
          </span>
        )}

        {/* Image */}
        <div className="aspect-[3/4] overflow-hidden bg-secondary flex items-center justify-center mb-5">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* Info — centered like evervessel */}
        <h3 className="text-[11px] font-mono tracking-[0.2em] uppercase text-foreground font-bold">{name}</h3>
        <p className="text-base font-display text-foreground mt-1">{price}</p>
        <p className="text-[11px] font-mono text-muted-foreground mt-1 leading-relaxed">{description}</p>
      </div>
    </Link>
  </motion.div>
);

export default ProductCard;
