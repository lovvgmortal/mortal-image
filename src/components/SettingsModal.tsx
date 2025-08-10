import React, { useState, useEffect } from 'react';
import { PixelArtButton } from './PixelArtButton';
import { PixelArtInput } from './PixelArtInput';
import { TrashIcon } from './icons/TrashIcon';
import { CloseIcon } from './icons/CloseIcon';
import { PlusIcon } from './icons/PlusIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialKeys: string[];
  onSave: (keys: string[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, initialKeys, onSave }) => {
  const [keys, setKeys] = useState<string[]>(initialKeys);
  const [newKey, setNewKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      setKeys(initialKeys);
      setNewKey(''); // Reset input field when modal opens
    }
  }, [isOpen, initialKeys]);
  
  const handleAddKey = () => {
    const trimmedKey = newKey.trim();
    if (trimmedKey && !keys.includes(trimmedKey)) {
      setKeys([...keys, trimmedKey]);
      setNewKey('');
    }
  };
  
  const handleDeleteKey = (keyIndex: number) => {
    setKeys(keys.filter((_, index) => index !== keyIndex));
  };

  const handleSaveAndClose = () => {
    const trimmedKey = newKey.trim();
    let finalKeys = [...keys];
    if (trimmedKey && !finalKeys.includes(trimmedKey)) {
      finalKeys.push(trimmedKey);
    }
    onSave(finalKeys);
    onClose();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.preventDefault();
          handleAddKey();
      }
  };

  if (!isOpen) {
    return null;
  }

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={handleSaveAndClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
    >
      <div
        className="bg-gray-800 border-4 border-gray-500 rounded-lg p-6 shadow-lg w-full max-w-2xl relative text-gray-200"
        onClick={handleContentClick}
      >
        <h2 id="settings-modal-title" className="text-2xl mb-4 border-b-4 border-gray-600 pb-2">API Key Settings</h2>
        
        <div className="space-y-4">
            <div>
                <label htmlFor="new-api-key" className="block mb-2 text-sm">Add New Gemini API Key</label>
                <div className="flex gap-2">
                    <PixelArtInput 
                        id="new-api-key"
                        type="password"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter your API key here"
                    />
                    <PixelArtButton onClick={handleAddKey} aria-label="Add API Key">
                        <PlusIcon />
                    </PixelArtButton>
                </div>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 -mr-2">
                <h3 className="text-sm font-bold">Saved Keys ({keys.length})</h3>
                {keys.length === 0 ? (
                    <p className="text-gray-400 text-sm">No API keys saved.</p>
                ) : (
                    keys.map((key, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-700 p-2 border-2 border-gray-500 text-sm rounded">
                            <span>Key {index + 1}: ••••••••{key.slice(-4)}</span>
                            <button
                                onClick={() => handleDeleteKey(index)}
                                className="p-2 bg-red-500 hover:bg-red-600 border-2 border-gray-400"
                                aria-label={`Delete key ${index + 1}`}
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    ))
                )}
            </div>
             <p className="text-xs text-gray-400">Your keys are saved securely in your browser's local storage.</p>
        </div>
        
        <PixelArtButton onClick={handleSaveAndClose} className="mt-6 w-full !bg-blue-500 hover:!bg-blue-600 !text-white">
          Save and Close
        </PixelArtButton>
        <button
          onClick={handleSaveAndClose}
          className="absolute -top-4 -right-4 p-2 bg-red-500 border-2 border-gray-400 rounded-full text-white hover:bg-red-600 transition-transform hover:scale-110"
          aria-label="Close"
        >
          <CloseIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
};