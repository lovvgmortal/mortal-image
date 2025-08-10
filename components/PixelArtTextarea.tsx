import React from 'react';

interface PixelArtTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const PixelArtTextarea: React.FC<PixelArtTextareaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={`
        w-full bg-white p-3 border-2 border-b-4 border-r-4 border-black 
        text-gray-800 text-sm
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 focus:ring-blue-500
        placeholder-gray-500
        disabled:bg-gray-300
        resize-y
        min-h-[108px]
        ${className}
      `}
      {...props}
    />
  );
};
