import React, { useState } from 'react';
import { Utensils } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  objectPosition?: string;
  fallbackTitle?: string;
  onClick?: () => void;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  objectPosition = 'center center',
  fallbackTitle,
  onClick,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        onClick={onClick}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#2B1215] via-[#1D1614] to-[#120E0D] text-[#E6D5B8] p-6 text-center select-none ${className}`}
      >
        <Utensils className="w-8 h-8 text-[#C59B27] mb-2 opacity-80" />
        <span className="font-display text-base font-medium tracking-wide">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      onClick={onClick}
      style={{ objectPosition }}
      className={`object-cover ${className}`}
    />
  );
};
