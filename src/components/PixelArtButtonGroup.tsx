import React from 'react';
import { PixelArtButton } from './PixelArtButton';

interface Option {
  value: string;
  label: string;
}

interface PixelArtButtonGroupProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onChange: (value: string) => void;
}

export const PixelArtButtonGroup: React.FC<PixelArtButtonGroupProps> = ({
  label,
  options,
  selectedValue,
  onChange,
}) => {
  return (
    <div>
      <h3 className="block mb-2 text-sm">{label}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <PixelArtButton
              key={option.value}
              onClick={() => onChange(option.value)}
              // Apply "pressed" styles if this button is selected
              className={
                isSelected 
                  ? '!bg-yellow-400 hover:!bg-yellow-500 !text-black !translate-y-1 !border-b-2 !border-r-2' 
                  : 'bg-gray-50'
              }
              aria-pressed={isSelected}
            >
              {option.label}
            </PixelArtButton>
          );
        })}
      </div>
    </div>
  );
};