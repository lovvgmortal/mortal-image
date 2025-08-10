import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { PromptInput } from './components/PromptInput';
import { PixelArtButton } from './components/PixelArtButton';
import { PixelArtButtonGroup } from './components/PixelArtButtonGroup';
import { PixelArtInput } from './components/PixelArtInput';
import { PixelArtTextarea } from './components/PixelArtTextarea';
import { ImageCard } from './components/ImageCard';
import { ImagePreview } from './components/ImagePreview';
import { SettingsModal } from './components/SettingsModal';
import { InfoModal } from './components/InfoModal';
import { PlusIcon } from './components/icons/PlusIcon';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { InfoIcon } from './components/icons/InfoIcon';
import { generateImage } from './services/geminiService';
import { addImage, getAllImages, deleteImage as deleteImageFromDb, deleteImagesByIds } from './services/dbService';
import type { Prompt, GeneratedImage, AspectRatio, GenerationMode } from './types';
import { ASPECT_RATIOS, GENERATION_MODES, STYLE_PREFIXES, GENERATION_DELAY_MS, API_KEYS_STORAGE_KEY } from './constants';

const App: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([{ id: Date.now(), text: '', count: 1 }]);
  const [promptMode, setPromptMode] = useState<'single' | 'bulk'>('single');
  const [bulkPrompts, setBulkPrompts] = useState<string>('');
  const [generationMode, setGenerationMode] = useState<GenerationMode>('pixel');
  const [customStyle, setCustomStyle] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImages, setSelectedImages] = useState(new Set<number>());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<{ src: string; prompt: string } | null>(null);
  const [apiKeys, setApiKeys] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
        // Load images from IndexedDB
        try {
            const images = await getAllImages();
            setGeneratedImages(images);
        } catch (error) {
            console.error("Failed to load images from IndexedDB", error);
            setStatusMessage('Error: Could not load saved images.');
            setTimeout(() => setStatusMessage(''), 5000);
        }

        // Load API keys from localStorage
        try {
          const storedKeys = localStorage.getItem(API_KEYS_STORAGE_KEY);
          if (storedKeys) {
            const parsedKeys: string[] = JSON.parse(storedKeys);
            if(Array.isArray(parsedKeys) && parsedKeys.every(k => typeof k === 'string')) {
              setApiKeys(parsedKeys);
            } else {
              console.warn("Malformed API key data in localStorage, clearing.");
              localStorage.removeItem(API_KEYS_STORAGE_KEY);
            }
          }
        } catch (error) {
          console.error("Failed to parse API keys from localStorage, clearing data.", error);
          localStorage.removeItem(API_KEYS_STORAGE_KEY);
        }
    };
    
    loadData();
  }, []);

  const handleSaveKeys = useCallback((keys: string[]) => {
    setApiKeys(keys);
    try {
        if (keys.length > 0) {
            localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(keys));
        } else {
            localStorage.removeItem(API_KEYS_STORAGE_KEY);
        }
        setStatusMessage(`Saved ${keys.length} API key(s).`);
        setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
        console.error("Failed to save API keys to localStorage", error);
        setStatusMessage('Error saving API keys.');
        setTimeout(() => setStatusMessage(''), 3000);
    }
  }, []);

  const addPrompt = useCallback(() => {
    setPrompts(prev => [...prev, { id: Date.now(), text: '', count: 1 }]);
  }, []);

  const removePrompt = useCallback((id: number) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
  }, []);

  const updatePrompt = useCallback((id: number, newValues: Partial<Omit<Prompt, 'id'>>) => {
    setPrompts(prev => prev.map(p => p.id === id ? { ...p, ...newValues } : p));
  }, []);

  const toggleSelectImage = useCallback((id: number) => {
    setSelectedImages(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        return newSet;
    });
  }, []);

  const deleteImageCallback = useCallback(async (id: number) => {
      const imageToDelete = generatedImages.find(img => img.id === id);
      if (!imageToDelete) return;

      if (window.confirm(`Are you sure you want to delete the image for prompt: "${imageToDelete.prompt}"?`)) {
        try {
            await deleteImageFromDb(id);
            setGeneratedImages(prev => prev.filter(img => img.id !== id));
            setSelectedImages(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });
        } catch (error) {
             console.error("Failed to delete image from db", error);
             setStatusMessage('Error deleting image.');
             setTimeout(() => setStatusMessage(''), 3000);
        }
      }
  }, [generatedImages]);

  const downloadImage = useCallback((src: string, prompt: string) => {
      const link = document.createElement('a');
      link.href = src;
      const safePrompt = prompt.replace(/[^a-z0-9_]/gi, '_').slice(0, 50);
      link.download = `${safePrompt || 'generated_image'}.jpeg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }, []);

  const deleteSelected = useCallback(async () => {
    if (selectedImages.size === 0) {
        setStatusMessage('No images selected to delete.');
        setTimeout(() => setStatusMessage(''), 3000);
        return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedImages.size} selected image(s)?`)) {
        const idsToDelete = Array.from(selectedImages);
        try {
            await deleteImagesByIds(idsToDelete);
            const deletedCount = selectedImages.size;
            setGeneratedImages(prev => prev.filter(img => !selectedImages.has(img.id)));
            setSelectedImages(new Set());
            setStatusMessage(`Successfully deleted ${deletedCount} image(s).`);
            setTimeout(() => setStatusMessage(''), 3000);
        } catch (error) {
            console.error("Failed to delete selected images from db", error);
            setStatusMessage('Error deleting selected images.');
            setTimeout(() => setStatusMessage(''), 3000);
        }
    }
  }, [selectedImages]);

  const selectAll = useCallback(() => {
      if (selectedImages.size === generatedImages.length && generatedImages.length > 0) {
          setSelectedImages(new Set());
      } else {
          setSelectedImages(new Set(generatedImages.map(img => img.id)));
      }
  }, [generatedImages, selectedImages.size]);

  const downloadSelected = useCallback(async () => {
    if (selectedImages.size === 0) {
        setStatusMessage('No images selected to download.');
        setTimeout(() => setStatusMessage(''), 3000);
        return;
    }

    const imagesToDownloadWithIndex = generatedImages
        .map((img, index) => ({ ...img, displayIndex: generatedImages.length - index }))
        .filter(img => selectedImages.has(img.id));

    if (imagesToDownloadWithIndex.length === 0) {
        return; // Should not happen if selectedImages is not empty
    }

    if (imagesToDownloadWithIndex.length === 1) {
        const image = imagesToDownloadWithIndex[0];
        const cardIndex = image.promptIndex ?? image.displayIndex;
        downloadImage(image.src, `${cardIndex}-${image.prompt}`);
        return;
    }

    setStatusMessage(`Creating zip file for ${imagesToDownloadWithIndex.length} images...`);
    const zip = new JSZip();
    const filenameCounts = new Map<string, number>();

    imagesToDownloadWithIndex.forEach(image => {
      const base64Data = image.src.split(',')[1];
      const cardIndex = image.promptIndex ?? image.displayIndex;
      const safePrompt = image.prompt.replace(/[^a-z0-9_]/gi, '_').slice(0, 50) || 'generated_image';
      
      const baseFilename = `${cardIndex}-${safePrompt}`;
      
      const count = filenameCounts.get(baseFilename) || 0;
      const filename = count > 0 ? `${baseFilename}_(${count}).jpeg` : `${baseFilename}.jpeg`;
      filenameCounts.set(baseFilename, count + 1);

      zip.file(filename, base64Data, { base64: true });
    });

    try {
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = 'gemini-pixel-images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      setStatusMessage(`Downloaded ${imagesToDownloadWithIndex.length} images as a zip file.`);
    } catch (error) {
      console.error("Failed to create zip file", error);
      setStatusMessage('Error creating zip file.');
    } finally {
      setTimeout(() => setStatusMessage(''), 5000);
    }
  }, [generatedImages, selectedImages, downloadImage]);

  const handleGenerate = async () => {
    if (apiKeys.length === 0) {
        setStatusMessage('Please add at least one Gemini API key in Settings.');
        setIsSettingsOpen(true);
        setTimeout(() => setStatusMessage(''), 5000);
        return;
    }
  
    let allTasks: { originalPrompt: string; promptIndex: number }[] = [];
    let promptCounter = 0;
    
    if (promptMode === 'single') {
        prompts.forEach(prompt => {
            if (prompt.text.trim()) {
                promptCounter++;
                for (let i = 0; i < prompt.count; i++) {
                    allTasks.push({ originalPrompt: prompt.text.trim(), promptIndex: promptCounter });
                }
            }
        });
    } else { // bulk mode
        const bulkLines = bulkPrompts.split('\n').filter(line => line.trim() !== '');
        if (bulkLines.length === 0) {
            setStatusMessage('Please enter at least one prompt in the text area.');
            setTimeout(() => setStatusMessage(''), 3000);
            return;
        }
        allTasks = bulkLines.map(line => {
            promptCounter++;
            return { originalPrompt: line.trim(), promptIndex: promptCounter };
        });
    }

    if (isLoading || allTasks.length === 0) {
      if (!isLoading) {
        setStatusMessage('Please enter at least one valid prompt.');
        setTimeout(() => setStatusMessage(''), 3000);
      }
      return;
    }
    
    setIsLoading(true);
    setSelectedImages(new Set());
    
    const totalTasks = allTasks.length;
    let processedCount = 0;

    // --- Single Key Logic (Sequential) ---
    if (apiKeys.length <= 1) {
      const currentKey = apiKeys[0];
      for (const task of allTasks) {
        processedCount++;
        setStatusMessage(`[Key 1] Generating image ${processedCount}/${totalTasks}: "${task.originalPrompt}"`);
        try {
          let finalPrompt = task.originalPrompt;
          const stylePrefix = STYLE_PREFIXES[generationMode] || (customStyle.trim() ? customStyle.trim() : '');
          if (stylePrefix) {
            finalPrompt = `${stylePrefix}, ${task.originalPrompt}`;
          }
          const imagesBase64 = await generateImage(finalPrompt, aspectRatio, 1, currentKey);
          if (imagesBase64 && imagesBase64.length > 0) {
            const newImage: GeneratedImage = {
              id: Date.now() + Math.random(),
              src: `data:image/jpeg;base64,${imagesBase64[0]}`,
              prompt: task.originalPrompt,
              promptIndex: task.promptIndex,
            };
            await addImage(newImage);
            setGeneratedImages(prev => [newImage, ...prev]);
          }
          if (processedCount < totalTasks) {
            setStatusMessage(`Waiting ${GENERATION_DELAY_MS / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, GENERATION_DELAY_MS));
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
          setStatusMessage(`Error on prompt #${task.promptIndex}: "${task.originalPrompt}". ${errorMessage}`);
          if (processedCount < totalTasks) {
            await new Promise(resolve => setTimeout(resolve, GENERATION_DELAY_MS));
          }
        }
      }
    } else {
      // --- Multiple Keys Logic (Parallel) ---
      const tasksQueue = [...allTasks];
      
      const processTask = async (task: { originalPrompt: string; promptIndex: number }, keyIndex: number) => {
        const apiKey = apiKeys[keyIndex];
        let finalPrompt = task.originalPrompt;
        const stylePrefix = STYLE_PREFIXES[generationMode] || (customStyle.trim() ? customStyle.trim() : '');
        if (stylePrefix) {
            finalPrompt = `${stylePrefix}, ${task.originalPrompt}`;
        }

        try {
          const imagesBase64 = await generateImage(finalPrompt, aspectRatio, 1, apiKey);
          if (imagesBase64 && imagesBase64.length > 0) {
              const newImage: GeneratedImage = {
                  id: Date.now() + Math.random(),
                  src: `data:image/jpeg;base64,${imagesBase64[0]}`,
                  prompt: task.originalPrompt,
                  promptIndex: task.promptIndex,
              };
              await addImage(newImage);
              setGeneratedImages(prev => [newImage, ...prev]);
              return { success: true };
          }
          throw new Error("No image data returned from API.");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            return Promise.reject({ prompt: task.originalPrompt, message: errorMessage, keyIndex, promptIndex: task.promptIndex });
        }
      };
      
      let batchNum = 0;
      const totalBatches = Math.ceil(tasksQueue.length / apiKeys.length);

      while (tasksQueue.length > 0) {
          batchNum++;
          const batchTasks = tasksQueue.splice(0, apiKeys.length);
          processedCount += batchTasks.length;
          
          setStatusMessage(`Processing batch ${batchNum}/${totalBatches} (${processedCount}/${totalTasks} images)...`);

          const batchPromises = batchTasks.map((task, index) => processTask(task, index));
          
          const results = await Promise.allSettled(batchPromises);

          results.forEach(result => {
              if (result.status === 'rejected') {
                  const { prompt, message, keyIndex, promptIndex } = result.reason;
                  console.error(`[Key ${keyIndex + 1}] Error on prompt #${promptIndex} "${prompt}": ${message}`);
                  setStatusMessage(`Error with key ${keyIndex + 1} on prompt #${promptIndex}. Check console.`);
              }
          });
      }
    }

    setStatusMessage('Complete!');
    setIsLoading(false);
    setTimeout(() => setStatusMessage(''), 5000);
  };

  const aspectRatioOptions = ASPECT_RATIOS.map(ratio => ({ value: ratio, label: ratio }));
  const promptModeOptions = [
      { value: 'single', label: 'Single Prompts'},
      { value: 'bulk', label: 'Bulk Prompts'},
  ];

  return (
    <div className="h-screen flex flex-col p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-6 flex-shrink-0 relative">
        <div className="inline-flex items-center justify-center">
          <img src="/logo.png" alt="App Logo" className="h-12 w-12 md:h-16 md:w-16 mr-4" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <h1 className="text-3xl md:text-5xl text-gray-100 tracking-wider">MORTAL GENERATOR</h1>
        </div>
        <div className="absolute top-0 right-0 flex gap-2">
            <PixelArtButton onClick={() => setIsInfoOpen(true)} aria-label="Show info" title="Info">
                <InfoIcon />
            </PixelArtButton>
             <PixelArtButton onClick={() => setIsSettingsOpen(true)} aria-label="Open settings" title="Settings">
                <SettingsIcon />
            </PixelArtButton>
        </div>
      </header>

      <main className="w-full flex-grow overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-gray-800 rounded-lg p-6 flex flex-col h-full overflow-hidden">
            <h2 className="text-2xl mb-6 border-b-2 border-gray-600 pb-2 flex-shrink-0">Controls</h2>
            
            <div className="flex-grow overflow-y-auto pr-3 -mr-3 space-y-6">
              <div className="mb-6">
                 <PixelArtButtonGroup
                  label="Prompt Mode"
                  options={promptModeOptions}
                  selectedValue={promptMode}
                  onChange={(value) => setPromptMode(value as 'single' | 'bulk')}
              />
            </div>
            
            {promptMode === 'single' ? (
                <div>
                    <div className="space-y-4 mb-6">
                      {prompts.map((prompt) => (
                        <PromptInput
                          key={prompt.id}
                          prompt={prompt}
                          onTextChange={(text) => updatePrompt(prompt.id, { text })}
                          onCountChange={(count) => updatePrompt(prompt.id, { count })}
                          onRemove={() => removePrompt(prompt.id)}
                          isRemoveDisabled={prompts.length <= 1}
                        />
                      ))}
                    </div>
                    <PixelArtButton onClick={addPrompt} className="w-full">
                      <PlusIcon />
                      Add Prompt
                    </PixelArtButton>
                </div>
            ) : (
                <div>
                    <label className="block mb-2 text-sm" htmlFor="bulk-prompts">Enter Prompts (one per line)</label>
                    <PixelArtTextarea
                        id="bulk-prompts"
                        value={bulkPrompts}
                        onChange={(e) => setBulkPrompts(e.target.value)}
                        placeholder="a cat wearing a cowboy hat...
a dog playing chess...
a robot surfing on a rainbow..."
                    />
                </div>
            )}


            <div className="space-y-6">
              <PixelArtButtonGroup
                  label="Generation Mode"
                  options={GENERATION_MODES}
                  selectedValue={generationMode}
                  onChange={(value) => setGenerationMode(value as GenerationMode)}
              />

              {generationMode === 'custom' && (
                <div>
                  <label className="block mb-2 text-sm" htmlFor="custom-style">Custom Style</label>
                  <PixelArtInput 
                    id="custom-style"
                    type="text"
                    value={customStyle}
                    onChange={(e) => setCustomStyle(e.target.value)}
                    placeholder="e.g., In the style of vaporwave..."
                  />
                </div>
              )}

              <PixelArtButtonGroup
                  label="Aspect Ratio"
                  options={aspectRatioOptions}
                  selectedValue={aspectRatio}
                  onChange={(value) => setAspectRatio(value as AspectRatio)}
              />
            </div>
            </div>

            <div className="flex-shrink-0 mt-6">
                <PixelArtButton onClick={handleGenerate} disabled={isLoading} className="w-full !bg-blue-500 hover:!bg-blue-600 !text-white text-lg py-4">
                {isLoading ? 'Generating...' : 'Generate'}
                </PixelArtButton>
                
                {statusMessage && (
                <div className="mt-4 p-3 bg-gray-700 text-white text-xs text-center break-words rounded-md">
                    {statusMessage}
                </div>
                )}
            </div>
          </div>

          {/* Image Display Panel */}
          <div className="lg:col-span-2 bg-gray-800 rounded-lg p-6 flex flex-col h-full overflow-hidden">
            <div className="flex-shrink-0 flex flex-wrap gap-4 justify-between items-center mb-4 pb-4 border-b-2 border-gray-600">
                <h2 className="text-2xl">Results</h2>
                <div className="flex flex-wrap gap-2">
                    <PixelArtButton onClick={selectAll} disabled={generatedImages.length === 0}>
                        {selectedImages.size === generatedImages.length && generatedImages.length > 0 ? 'Deselect All' : 'Select All'}
                    </PixelArtButton>
                    <PixelArtButton onClick={downloadSelected} disabled={selectedImages.size === 0}>
                        Download ({selectedImages.size})
                    </PixelArtButton>
                    <PixelArtButton onClick={deleteSelected} disabled={selectedImages.size === 0} className="!bg-red-500 hover:!bg-red-600 !text-white">
                        Delete ({selectedImages.size})
                    </PixelArtButton>
                </div>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {isLoading && generatedImages.length === 0 && (
                     <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 border-8 border-gray-600 border-t-white rounded-full animate-spin"></div>
                        <p className="mt-4 text-center">Initializing...</p>
                     </div>
                )}
                {!isLoading && generatedImages.length === 0 && (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Your generated images will appear here.
                    </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {generatedImages.map((image, index) => (
                    <ImageCard 
                        key={image.id}
                        image={image} 
                        displayIndex={generatedImages.length - index}
                        isSelected={selectedImages.has(image.id)}
                        onSelect={toggleSelectImage}
                        onDelete={deleteImageCallback}
                        onDownload={downloadImage}
                        onPreview={(src, prompt) => setPreviewImage({ src, prompt })}
                    />
                  ))}
                </div>
            </div>
          </div>
        </div>
      </main>
      {previewImage && (
        <ImagePreview
          src={previewImage.src}
          prompt={previewImage.prompt}
          onClose={() => setPreviewImage(null)}
        />
      )}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialKeys={apiKeys}
        onSave={handleSaveKeys}
      />
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </div>
  );
};

export default App;
