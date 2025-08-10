import React from 'react';
import type { GeneratedImage } from '../types';

const CardTrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const CardDownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const CardSelectIcon: React.FC<{isSelected: boolean}> = ({isSelected}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-black'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
      {isSelected ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h12v12H6z" />
      )}
    </svg>
);

interface ImageCardProps {
  image: GeneratedImage;
  index: number;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onDownload: (src: string, prompt: string) => void;
  onPreview: (src: string, prompt: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image, index, isSelected, onSelect, onDelete, onDownload, onPreview }) => {
  const { id, src, prompt } = image;
  
  const buttonBaseStyle = `flex items-center justify-center p-2 border-2 border-b-4 border-r-4 border-black 
    transform transition-transform duration-75 ease-in-out
    active:translate-y-0.5 active:border-b-2 active:border-r-2
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50`;

  return (
    <div className="bg-gray-50 border-2 border-b-4 border-r-4 border-black p-2 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className="bg-black text-white text-xs font-bold px-2 py-1">
          #{index}
        </div>
        <div className="flex gap-1.5">
           <button
             onClick={() => onSelect(id)}
             className={`${buttonBaseStyle} ${isSelected ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-200 hover:bg-gray-300'}`}
             aria-label={isSelected ? 'Deselect Image' : 'Select Image'}
             title={isSelected ? 'Deselect' : 'Select'}
           >
             <CardSelectIcon isSelected={isSelected} />
           </button>
           <button
             onClick={() => onDownload(src, `${index}-${prompt}`)}
             className={`${buttonBaseStyle} bg-blue-500 hover:bg-blue-600`}
             aria-label="Download Image"
             title="Download"
           >
             <CardDownloadIcon />
           </button>
           <button
             onClick={() => onDelete(id)}
             className={`${buttonBaseStyle} bg-red-500 hover:bg-red-600`}
             aria-label="Delete Image"
             title="Delete"
           >
             <CardTrashIcon />
           </button>
        </div>
      </div>
      
      <div 
        className="border-2 border-black relative cursor-pointer"
        onClick={() => onPreview(src, prompt)}
      >
        <img
          src={src}
          alt={prompt}
          className="w-full h-auto object-cover aspect-square bg-gray-300 transition-all pointer-events-none"
          loading="lazy"
        />
         {isSelected && <div className="absolute inset-0 ring-4 ring-green-500 pointer-events-none"></div>}
      </div>
      
      <p 
        className="text-xs p-1 bg-gray-200 text-gray-700 break-words line-clamp-2"
        title={prompt}
      >
        {prompt}
      </p>
    </div>
  );
};
