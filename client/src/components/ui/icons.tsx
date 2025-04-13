import { Star } from 'lucide-react';

export const StarIcon = ({ size = 16, className = '' }) => (
  <Star size={size} className={`fill-current ${className}`} />
);