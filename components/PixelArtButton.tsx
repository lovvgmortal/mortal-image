
import React from 'react';

interface PixelArtButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PixelArtButton: React.FC<PixelArtButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`
        flex items-center justify-center gap-2
        bg-gray-50 text-gray-800 text-sm 
        p-3 border-2 border-b-4 border-r-4 border-black 
        transform transition-transform duration-75 ease-in-out
        hover:bg-yellow-300
        active:translate-y-1 active:border-b-2 active:border-r-2
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 focus:ring-blue-500
        disabled:bg-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed disabled:transform-none disabled:border-b-4
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
