import React from 'react';

interface PixelArtInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const PixelArtInput: React.FC<PixelArtInputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`
        w-full bg-gray-700 p-3 border-2 border-b-4 border-r-4 border-gray-400 
        text-gray-100 text-sm
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500
        placeholder-gray-400
        disabled:bg-gray-800
        ${className}
      `}
      {...props}
    />
  );
};