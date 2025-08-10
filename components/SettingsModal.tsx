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
    onSave(keys);
    onClose();
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
        className="bg-gray-200 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl relative"
        onClick={handleContentClick}
      >
        <h2 id="settings-modal-title" className="text-2xl mb-4 border-b-4 border-black pb-2">API Key Settings</h2>
        
        <div className="space-y-4">
            <div>
                <label htmlFor="new-api-key" className="block mb-2 text-sm">Add New Gemini API Key</label>
                <div className="flex gap-2">
                    <PixelArtInput 
                        id="new-api-key"
                        type="password"
                        value={newKey}
                        onChange={(e) => setNewKey(e.target.value)}
                        placeholder="Enter your API key here"
                    />
                    <PixelArtButton onClick={handleAddKey} aria-label="Add API Key">
                        <PlusIcon />
                    </PixelArtButton>
                </div>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                <h3 className="text-sm font-bold">Saved Keys ({keys.length})</h3>
                {keys.length === 0 ? (
                    <p className="text-gray-500 text-sm">No API keys saved.</p>
                ) : (
                    keys.map((key, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 border-2 border-black text-sm">
                            <span>Key {index + 1}: ••••••••{key.slice(-4)}</span>
                            <button
                                onClick={() => handleDeleteKey(index)}
                                className="p-2 bg-red-500 hover:bg-red-600 border-2 border-black"
                                aria-label={`Delete key ${index + 1}`}
                            >
                                <TrashIcon />
                            </button>
                        </div>
                    ))
                )}
            </div>
             <p className="text-xs text-gray-600">Your keys are saved securely in your browser's local storage.</p>
        </div>
        
        <PixelArtButton onClick={handleSaveAndClose} className="mt-6 w-full !bg-blue-500 hover:!bg-blue-600 !text-white">
          Save and Close
        </PixelArtButton>
        <button
          onClick={handleSaveAndClose}
          className="absolute -top-5 -right-5 p-2 bg-red-500 border-2 border-black rounded-full text-white hover:bg-red-600"
          aria-label="Close"
        >
          <CloseIcon className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
};