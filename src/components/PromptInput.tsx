import React from 'react';
import type { Prompt } from '../types';
import { PixelArtInput } from './PixelArtInput';
import { TrashIcon } from './icons/TrashIcon';

interface PromptInputProps {
  prompt: Prompt;
  onTextChange: (text: string) => void;
  onCountChange: (count: number) => void;
  onRemove: () => void;
  isRemoveDisabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  onTextChange,
  onCountChange,
  onRemove,
  isRemoveDisabled
}) => {
  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val > 0) {
      onCountChange(val);
    } else if (e.target.value === '') {
        onCountChange(1);
    }
  };
  
  return (
    <div className="flex items-start space-x-2">
      <div className="flex-grow">
        <PixelArtInput
          type="text"
          value={prompt.text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="e.g., a cat wearing a cowboy hat"
          aria-label="Prompt text"
        />
      </div>
      <div className="w-20">
         <PixelArtInput
          type="number"
          value={prompt.count}
          onChange={handleCountChange}
          min="1"
          className="text-center"
          aria-label="Number of images"
        />
      </div>
      <button
        onClick={onRemove}
        disabled={isRemoveDisabled}
        className="
          p-3 border-2 border-b-4 border-r-4 border-gray-400
          bg-red-500 hover:bg-red-600
          active:translate-y-1 active:border-b-2 active:border-r-2
          disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:border-gray-500
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
        aria-label="Remove prompt"
      >
        <TrashIcon />
      </button>
    </div>
  );
};