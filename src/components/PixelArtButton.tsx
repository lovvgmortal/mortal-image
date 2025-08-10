
import React from 'react';

interface PixelArtButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PixelArtButton: React.FC<PixelArtButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`
        flex items-center justify-center gap-2
        bg-gray-700 text-gray-100 text-sm 
        p-3 border-2 border-b-4 border-r-4 border-gray-400 
        transform transition-transform duration-75 ease-in-out
        hover:bg-yellow-400 hover:text-gray-900
        active:translate-y-1 active:border-b-2 active:border-r-2
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500
        disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:border-gray-500
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};