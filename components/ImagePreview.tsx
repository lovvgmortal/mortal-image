import React from 'react';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

interface ImagePreviewProps {
  src: string;
  prompt: string;
  onClose: () => void;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ src, prompt, onClose }) => {
  // Prevent clicks on the content from closing the modal
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:opacity-75 transition-opacity z-10"
        aria-label="Close image preview"
      >
        <CloseIcon />
      </button>
      
      <div className="flex flex-col items-center gap-4" onClick={handleContentClick}>
          <div className="relative">
              <img 
                src={src} 
                alt={prompt} 
                className="max-w-[90vw] max-h-[80vh] object-contain shadow-lg border-4 border-white"
              />
          </div>
          {prompt && (
            <p className="text-white text-base text-center max-w-[90vw] break-words">
                {prompt}
            </p>
          )}
      </div>
    </div>
  );
};
