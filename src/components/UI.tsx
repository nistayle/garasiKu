/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 active:scale-95";
  
  const variants = {
    primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20",
    secondary: "bg-slate-950 text-white hover:bg-slate-800 shadow-xl shadow-slate-950/20",
    outline: "border-2 border-slate-200 text-slate-900 hover:bg-white hover:border-emerald-600/50 hover:text-emerald-700 backdrop-blur-md shadow-sm transition-all duration-300",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; glass?: boolean }> = ({ children, className = '', glass }) => (
  <div className={`${glass ? 'glass' : 'bg-white'} rounded-3xl overflow-hidden shadow-sm border border-white/60 ${className}`}>
    {children}
  </div>
);

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  fallbackSrc = 'https://via.placeholder.com/800x600/059669/FFFFFF?text=GarasiKu+Spot', 
  alt, 
  className = '',
  ...props 
}) => {
  const [imgSrc, setImgSrc] = React.useState(src);

  // Update internal state if src prop changes
  React.useEffect(() => {
    setImgSrc(src);
  }, [src]);

  const handleError = () => {
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      onError={handleError} 
      className={`object-cover w-full h-full ${className}`}
      referrerPolicy="no-referrer"
      {...props} 
    />
  );
};

export const SectionHeading: React.FC<{ title: string; subtitle?: string; light?: boolean }> = ({ title, subtitle, light }) => (
  <div className="mb-12 text-center">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-3xl md:text-4xl font-bold mb-4 ${light ? 'text-white' : 'text-gray-900'}`}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`max-w-2xl mx-auto text-lg ${light ? 'text-emerald-100' : 'text-gray-500'}`}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);
