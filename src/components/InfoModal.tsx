import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { PixelArtButton } from './PixelArtButton';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
    >
      <div
        className="bg-gray-800 border-4 border-gray-500 rounded-lg p-6 shadow-lg w-full max-w-2xl relative text-sm text-gray-200"
        onClick={handleContentClick}
      >
        <h2 id="info-modal-title" className="text-2xl mb-4 border-b-4 border-gray-600 pb-2">About This App</h2>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <p>Welcome to the Gemini Pixel Generator! This tool allows you to generate images using Google's powerful Gemini models with a fun, retro-inspired interface.</p>
            
            <h3 className="text-lg font-bold mt-4">API Key Management</h3>
            <p>You can add your Gemini API keys via the Settings (gear icon). The keys are saved locally in your browser and are never sent anywhere else.</p>
            <ul className="list-disc list-inside space-y-2 pl-4 text-gray-300">
                <li><span className="font-bold text-gray-100">Single API Key:</span> When one key is provided, a 3-second delay is added between generation requests to prevent rate-limiting errors.</li>
                <li><span className="font-bold text-gray-100">Multiple API Keys:</span> Add two or more keys to enable parallel generation. This distributes requests across your keys, removing the 3-second delay for much faster bulk generation.</li>
            </ul>

            <h3 className="text-lg font-bold mt-4">Features</h3>
            <ul className="list-disc list-inside space-y-2 pl-4 text-gray-300">
                <li><span className="font-bold text-gray-100">Single & Bulk Prompts:</span> Add prompts one-by-one or paste a list for large jobs.</li>
                <li><span className="font-bold text-gray-100">Generation Modes:</span> Quickly apply styles like Pixel Art, Stick Figure, and Realistic, or write your own custom style prompt.</li>
                <li><span className="font-bold text-gray-100">Image Management:</span> Select, deselect, download, and delete images individually or in bulk. Downloading multiple images will automatically create a zip file.</li>
            </ul>
        </div>
        
        <PixelArtButton onClick={onClose} className="mt-6 w-full !bg-blue-500 hover:!bg-blue-600 !text-white">
          Close
        </PixelArtButton>

        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 p-2 bg-red-500 border-2 border-gray-400 rounded-full text-white hover:bg-red-600 transition-transform hover:scale-110"
          aria-label="Close"
        >
          <CloseIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
};