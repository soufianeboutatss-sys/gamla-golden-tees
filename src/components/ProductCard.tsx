import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface ProductCardProps {
  image: string;
  name: string;
  price: string;
  color: string;
}

const ProductCard = ({ image, name, price, color }: ProductCardProps) => (
  <motion.div
    whileHover={{ y: -6 }}
    transition={{ duration: 0.3 }}
    className="group cursor-pointer"
  >
    <Link to="/checkout">
      <div className="overflow-hidden bg-card shadow-warm">
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3 className="font-display text-lg font-semibold text-foreground">{name}</h3>
          <p className="text-xs font-mono text-muted-foreground tracking-wider mt-1">{color}</p>
          <p className="text-sm font-mono text-primary font-bold mt-2">{price}</p>
        </div>
      </div>
    </Link>
  </motion.div>
);

export default ProductCard;
