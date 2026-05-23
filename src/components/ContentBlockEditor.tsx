import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Video, Type, Grid, Trash2, ChevronUp, ChevronDown, Play, Layout, MonitorPlay, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

export type BlockType = 'paragraph' | 'heading' | 'image' | 'video' | 'gallery' | 'quote' | 'list' | 'divider';

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  content: string;
}

export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  text: string;
  level: 1 | 2 | 3;
}

export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  text: string;
  author?: string;
}

export interface ListBlock extends BaseBlock {
  type: 'list';
  items: string[];
  ordered: boolean;
}

export interface DividerBlock extends BaseBlock {
  type: 'divider';
}

export interface ImageBlock extends BaseBlock {
  type: 'image';
  url: string;
  caption?: string;
  alignment: 'left' | 'center' | 'right' | 'full';
}

export interface GalleryBlock extends BaseBlock {
  type: 'gallery';
  images: string[];
}

export interface VideoBlock extends BaseBlock {
  type: 'video';
  url: string;
  videoType: 'upload' | 'youtube' | 'shorts' | 'reel' | 'facebook' | 'vimeo';
  size: 'small' | 'medium' | 'large' | 'full' | 'custom';
  customWidth?: string;
  customHeight?: string;
  alignment: 'left' | 'center' | 'right';
}

export type Block = ParagraphBlock | HeadingBlock | QuoteBlock | ListBlock | DividerBlock | ImageBlock | GalleryBlock | VideoBlock;

interface ContentBlockEditorProps {
  content: string;
  onChange: (content: string) => void;
  previewMode?: boolean;
}

export function ContentBlockEditor({ content, onChange }: ContentBlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);

  useEffect(() => {
    try {
      if (content && (content.startsWith('[') || content.startsWith('{'))) {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          setBlocks(parsed);
          return;
        }
      }
    } catch (e) {
      // Not JSON
    }
    
    if (content && (!blocks.length || content !== JSON.stringify(blocks))) {
       setBlocks([{ id: Date.now().toString(), type: 'paragraph', content: content }]);
    }
  }, []);

  const updateBlocks = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
    onChange(JSON.stringify(newBlocks));
  };

  const addBlock = (type: BlockType, index: number) => {
    const newBlock = createEmptyBlock(type);
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    updateBlocks(newBlocks);
  };

  const removeBlock = (id: string) => {
    updateBlocks(blocks.filter(b => b.id !== id));
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    updateBlocks(blocks.map(b => (b.id === id ? { ...b, ...updates } as Block : b)));
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === blocks.length - 1)) return;
    
    const newBlocks = [...blocks];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[swapIndex]] = [newBlocks[swapIndex], newBlocks[index]];
    updateBlocks(newBlocks);
  };

  const createEmptyBlock = (type: BlockType): Block => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    switch (type) {
      case 'paragraph': return { id, type, content: '' };
      case 'heading': return { id, type, text: '', level: 2 };
      case 'quote': return { id, type, text: '', author: '' };
      case 'list': return { id, type, items: [''], ordered: false };
      case 'divider': return { id, type };
      case 'image': return { id, type, url: '', alignment: 'center' };
      case 'gallery': return { id, type, images: [] };
      case 'video': return { id, type, url: '', videoType: 'youtube', size: 'full', alignment: 'center' };
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateBlock(id, { [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateListItem = (blockId: string, itemIndex: number, newValue: string) => {
    const block = blocks.find(b => b.id === blockId) as ListBlock;
    const newItems = [...block.items];
    newItems[itemIndex] = newValue;
    updateBlock(blockId, { items: newItems });
  };

  const addListItem = (blockId: string, index: number) => {
    const block = blocks.find(b => b.id === blockId) as ListBlock;
    const newItems = [...block.items];
    newItems.splice(index + 1, 0, '');
    updateBlock(blockId, { items: newItems });
  };

  const removeListItem = (blockId: string, index: number) => {
    const block = blocks.find(b => b.id === blockId) as ListBlock;
    if (block.items.length <= 1) return;
    const newItems = [...block.items];
    newItems.splice(index, 1);
    updateBlock(blockId, { items: newItems });
  };

  return (
    <div className="space-y-6">
      {blocks.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-[#1E2536] rounded-xl bg-[#0B0F19]">
          <h3 className="text-gray-400 mb-4">Start your article by adding a block</h3>
          <div className="flex justify-center gap-2">
            <BlockAddButtons onAdd={(type) => addBlock(type, -1)} />
          </div>
        </div>
      )}

      {blocks.map((block, index) => (
        <div key={block.id} className="relative group bg-[#0B0F19] rounded-xl border border-[#1E2536] transition-colors focus-within:border-indigo-500 hover:border-gray-600">
          
          {/* Block Controls */}
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex bg-[#1E2536] rounded-lg shadow-lg overflow-hidden z-10">
            <button onClick={() => moveBlock(block.id, 'up')} className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white" title="Move Up"><ChevronUp className="w-4 h-4" /></button>
            <button onClick={() => moveBlock(block.id, 'down')} className="p-1.5 hover:bg-white/10 text-gray-400 hover:text-white" title="Move Down"><ChevronDown className="w-4 h-4" /></button>
            <button onClick={() => removeBlock(block.id)} className="p-1.5 hover:bg-red-500/20 text-gray-400 hover:text-red-400" title="Delete"><Trash2 className="w-4 h-4" /></button>
          </div>

          <div className="p-4 pt-8">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 opacity-60">
              {block.type} Block
            </div>
            
            {block.type === 'paragraph' && (
              <textarea
                value={block.content}
                onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                className="w-full bg-transparent text-gray-200 outline-none resize-y min-h-[100px] text-base"
                placeholder="Write your paragraph..."
              />
            )}

            {block.type === 'heading' && (
              <div className="flex gap-4 items-start">
                <select 
                  value={block.level} 
                  onChange={(e) => updateBlock(block.id, { level: parseInt(e.target.value) as any })}
                  className="bg-[#131927] border border-[#1E2536] rounded-lg px-2 py-1 text-xs text-indigo-400 outline-none"
                >
                  <option value={1}>H1</option>
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                </select>
                <input
                  type="text"
                  value={block.text}
                  onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                  className={`w-full bg-transparent text-white outline-none font-bold ${block.level === 1 ? 'text-2xl' : block.level === 2 ? 'text-xl' : 'text-lg'}`}
                  placeholder="Enter heading text..."
                />
              </div>
            )}

            {block.type === 'quote' && (
              <div className="border-l-4 border-indigo-500 pl-4 space-y-2">
                <textarea
                  value={block.text}
                  onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                  className="w-full bg-transparent text-gray-200 italic outline-none resize-none pt-1"
                  placeholder="Enter quote text..."
                />
                <input
                  type="text"
                  value={block.author}
                  onChange={(e) => updateBlock(block.id, { author: e.target.value })}
                  className="w-full bg-transparent text-gray-400 text-sm outline-none"
                  placeholder="- Author name"
                />
              </div>
            )}

            {block.type === 'list' && (
              <div className="space-y-2">
                <div className="flex gap-2 mb-2">
                   <button onClick={() => updateBlock(block.id, { ordered: false })} className={`px-2 py-1 text-[10px] rounded border ${!block.ordered ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-[#1E2536] text-gray-400'}`}>Bulleted</button>
                   <button onClick={() => updateBlock(block.id, { ordered: true })} className={`px-2 py-1 text-[10px] rounded border ${block.ordered ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-[#1E2536] text-gray-400'}`}>Numbered</button>
                </div>
                {block.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 group/item">
                    <span className="text-gray-600 mt-2">{block.ordered ? `${idx + 1}.` : '•'}</span>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => updateListItem(block.id, idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); addListItem(block.id, idx); }
                        if (e.key === 'Backspace' && item === '') { e.preventDefault(); removeListItem(block.id, idx); }
                      }}
                      className="flex-1 bg-transparent text-gray-200 outline-none"
                      placeholder="List item..."
                      autoFocus={idx === block.items.length - 1 && item === ''}
                    />
                    <button onClick={() => removeListItem(block.id, idx)} className="opacity-0 group-hover/item:opacity-100 text-gray-600 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            )}

            {block.type === 'divider' && (
              <div className="py-4">
                <div className="h-px bg-[#1E2536] w-full"></div>
              </div>
            )}

            {block.type === 'image' && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input type="url" value={block.url} onChange={(e) => updateBlock(block.id, { url: e.target.value })} placeholder="Image URL..." className="w-full bg-[#131927] border border-[#1E2536] rounded-lg px-3 py-2 text-sm text-white" />
                  </div>
                  <label className="px-4 py-2 bg-[#131927] border border-[#1E2536] rounded-lg text-sm cursor-pointer hover:bg-white/5 whitespace-nowrap">
                    Upload
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, block.id, 'url')} className="hidden" />
                  </label>
                  <select value={block.alignment} onChange={(e) => updateBlock(block.id, { alignment: e.target.value as any })} className="bg-[#131927] border border-[#1E2536] rounded-lg px-3 py-2 text-sm text-white outline-none">
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="full">Full Width</option>
                  </select>
                </div>
                {block.url && (
                  <div className={`mt-2 ${block.alignment === 'center' || block.alignment === 'full' ? 'mx-auto' : block.alignment === 'left' ? 'mr-auto' : 'ml-auto'}`}>
                    <img src={block.url} alt="" className="max-h-64 rounded-lg object-contain bg-black/20" />
                  </div>
                )}
              </div>
            )}

            {block.type === 'video' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <input type="text" value={block.url} onChange={(e) => updateBlock(block.id, { url: e.target.value })} placeholder="Video URL or Embed Code..." className="w-full bg-[#131927] border border-[#1E2536] rounded-lg px-3 py-2 text-sm text-white" />
                  </div>
                  <label className="px-4 py-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-sm cursor-pointer hover:bg-indigo-600/30 whitespace-nowrap flex items-center justify-center gap-2">
                    <Video className="w-4 h-4" /> Upload Video
                    <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, block.id, 'url')} className="hidden" />
                  </label>
                  <select value={block.videoType} onChange={(e) => updateBlock(block.id, { videoType: e.target.value as any })} className="bg-[#131927] border border-[#1E2536] rounded-lg px-3 py-2 text-sm text-white outline-none">
                    <option value="youtube">YouTube Long</option>
                    <option value="shorts">YouTube Shorts</option>
                    <option value="reel">Instagram Reel</option>
                    <option value="facebook">Facebook Video</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="upload">Custom Upload</option>
                  </select>
                </div>
                
                <div className="bg-[#131927] border border-[#1E2536] p-4 rounded-xl">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Layout & Positioning</h4>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex-1 min-w-[150px]">
                        <label className="text-xs text-gray-500 block mb-1">Video Size</label>
                        <select value={block.size} onChange={(e) => updateBlock(block.id, { size: e.target.value as any })} className="w-full bg-[#0B0F19] border border-[#1E2536] rounded-lg px-3 py-2 text-sm text-white outline-none">
                          <option value="full">Full Width</option>
                          <option value="large">Large (80%)</option>
                          <option value="medium">Medium (50%)</option>
                          <option value="small">Small (30%)</option>
                          <option value="custom">Custom Size</option>
                        </select>
                      </div>
                      <div className="flex-1 min-w-[150px]">
                        <label className="text-xs text-gray-500 block mb-1">Alignment</label>
                        <select value={block.alignment} onChange={(e) => updateBlock(block.id, { alignment: e.target.value as any })} className="w-full bg-[#0B0F19] border border-[#1E2536] rounded-lg px-3 py-2 text-sm text-white outline-none">
                          <option value="center">Center</option>
                          <option value="left">Left Align (Text Wraps)</option>
                          <option value="right">Right Align (Text Wraps)</option>
                        </select>
                      </div>
                    </div>
                </div>

                {/* Video Live Preview */}
                {block.url && (
                  <div className="mt-4 p-4 border border-[#1E2536] rounded-lg bg-[#0B0F19] flex justify-center">
                    <VideoPreview block={block} />
                  </div>
                )}
              </div>
            )}

            {block.type === 'gallery' && (
              <div className="text-gray-400 text-sm">
                Gallery functionality placeholder.
              </div>
            )}
          </div>
          
          {/* Add Block Below */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-[#1E2536] px-2 py-1 rounded-full shadow-lg z-20 scale-90">
             <span className="text-[10px] uppercase font-bold text-gray-400 mr-1 hidden md:inline">Insert:</span>
             <BlockAddButtons onAdd={(type) => addBlock(type, index)} size="sm" />
          </div>
        </div>
      ))}
      
      {blocks.length > 0 && (
         <div className="flex justify-center mt-8 pb-4">
             <div className="bg-[#1E2536]/50 p-2 rounded-xl border border-[#1E2536]">
               <BlockAddButtons onAdd={(type) => addBlock(type, blocks.length - 1)} />
             </div>
         </div>
      )}
    </div>
  );
}

function BlockAddButtons({ onAdd, size = 'md' }: { onAdd: (type: BlockType) => void, size?: 'sm' | 'md' }) {
  const iconBase = size === 'sm' ? "w-3 h-3" : "w-4 h-4";
  const btnBase = size === 'sm' ? "p-1.5" : "p-2";
  
  return (
    <>
      <button onClick={() => onAdd('paragraph')} className={`bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors ${btnBase}`} title="Add Paragraph"><Type className={iconBase} /></button>
      <button onClick={() => onAdd('image')} className={`bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors ${btnBase}`} title="Add Image"><ImageIcon className={iconBase} /></button>
      <button onClick={() => onAdd('video')} className={`bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-900/20 ${btnBase}`} title="Add Video"><Video className={iconBase} /></button>
      <button onClick={() => onAdd('gallery')} className={`bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors ${btnBase}`} title="Add Gallery"><Grid className={iconBase} /></button>
    </>
  );
}

export function VideoPreview({ block, readOnly = false }: { block: VideoBlock, readOnly?: boolean }) {
  if (!block.url) return null;
  // Try to parse URL/Embed
  let renderUrl = block.url;
  
  // Basic YouTube URL parsing
  if (block.videoType === 'youtube' && renderUrl.includes('youtube.com/watch?v=')) {
    const v = renderUrl.split('v=')[1]?.split('&')[0];
    renderUrl = `https://www.youtube.com/embed/${v}`;
  } else if (block.videoType === 'youtube' && renderUrl.includes('youtu.be/')) {
    const v = renderUrl.split('youtu.be/')[1]?.split('?')[0];
    renderUrl = `https://www.youtube.com/embed/${v}`;
  }
  
  // Shorts parsing
  if (block.videoType === 'shorts' && renderUrl.includes('youtube.com/shorts/')) {
     const v = renderUrl.split('shorts/')[1]?.split('?')[0];
     renderUrl = `https://www.youtube.com/embed/${v}`;
  }

  // Calculate width
  let widthClasses = 'w-full';
  if (block.size === 'large') widthClasses = 'w-4/5';
  if (block.size === 'medium') widthClasses = 'w-1/2';
  if (block.size === 'small') widthClasses = 'w-1/3';

  // Calculate aspect ratio
  let aspectRatio = 'aspect-video';
  if (block.videoType === 'shorts' || block.videoType === 'reel') {
     aspectRatio = 'aspect-[9/16]';
     if (block.size === 'full') widthClasses = 'w-full md:w-[400px]'; // capped for portrait on large screens
  }

  const containerClasses = `relative overflow-hidden rounded-xl bg-black ${widthClasses} ${aspectRatio} shadow-xl border border-white/10`;
  
  return (
    <div className={`flex w-full ${block.alignment === 'center' ? 'justify-center' : block.alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
      <div className={containerClasses}>
        {(block.videoType === 'upload' || renderUrl.startsWith('data:video')) ? (
           <video src={renderUrl} controls={!readOnly} autoPlay={false} playsInline className="absolute top-0 left-0 w-full h-full object-cover" />
        ) : (
           <iframe 
             src={renderUrl} 
             title="Video player"
             className="absolute top-0 left-0 w-full h-full"
             frameBorder="0" 
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
             allowFullScreen 
           />
        )}
      </div>
    </div>
  );
}
