import React from 'react';
import { 
  Block, 
  ParagraphBlock, 
  ImageBlock, 
  GalleryBlock, 
  VideoBlock,
  HeadingBlock,
  QuoteBlock,
  ListBlock 
} from './ContentBlockEditor';
import { getAdsConfig } from '../services/firebase';
import { AdBanner } from './AdBanner';

export function ContentRenderer({ content }: { content: string }) {
  const [config, setConfig] = React.useState<any>(null);
  
  React.useEffect(() => {
    getAdsConfig()
      .then(setConfig)
      .catch((e) => console.error("Error loading config inside story content renderer", e));
  }, []);

  let blocks: Block[] = [];
  try {
    if (content.startsWith('[')) {
      blocks = JSON.parse(content);
    }
  } catch (e) {
    // legacy text content
  }

  if (!blocks.length && content) {
    return <p className="whitespace-pre-wrap">{content}</p>;
  }

  let paragraphCounter = 0;
  let videoCounter = 0;

  return (
    <div className="space-y-8">
      {blocks.map((block) => {
        let injectAd = false;

        if (block.type === 'paragraph') {
          paragraphCounter++;
          if (paragraphCounter === 1 && config?.articlePlacements?.showAfterParagraph1) {
            injectAd = true;
          } else if (paragraphCounter === 2 && config?.articlePlacements?.showAfterParagraph2) {
            injectAd = true;
          }
        } else if (block.type === 'video') {
          videoCounter++;
          if (config?.articlePlacements?.showAfterVideo) {
            injectAd = true;
          }
        } else if (config?.articlePlacements?.showBetweenBlocks && Math.random() < 0.1) {
          injectAd = true;
        }

        return (
          <React.Fragment key={block.id}>
            <div>
              {block.type === 'paragraph' && (
                 <p className="whitespace-pre-wrap leading-relaxed text-gray-700 text-lg">{(block as ParagraphBlock).content}</p>
              )}

              {block.type === 'heading' && (
                <HeadingRenderer block={block as HeadingBlock} />
              )}

              {block.type === 'quote' && (
                <QuoteRenderer block={block as QuoteBlock} />
              )}

              {block.type === 'list' && (
                <ListRenderer block={block as ListBlock} />
              )}

              {block.type === 'divider' && (
                <hr className="my-12 border-gray-100" />
              )}

              {block.type === 'image' && (
                 <ImageRenderer block={block as ImageBlock} />
              )}

              {block.type === 'video' && (
                 <VideoRenderer block={block as VideoBlock} />
              )}

              {block.type === 'gallery' && (
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Gallery implementation placeholder */}
                 </div>
              )}
            </div>

            {injectAd && (
              <div className="my-8 animate-in fade-in zoom-in-95 duration-500">
                <AdBanner placement="blog-middle" />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function HeadingRenderer({ block }: { block: HeadingBlock }) {
  const Tag = `h${block.level}` as any;
  const classes = {
    h1: 'text-4xl font-bold text-gray-900 mb-6',
    h2: 'text-3xl font-bold text-gray-900 mb-4 mt-10',
    h3: 'text-2xl font-semibold text-gray-800 mb-3 mt-8',
  };
  return <Tag className={classes[`h${block.level}` as keyof typeof classes]}>{block.text}</Tag>;
}

function QuoteRenderer({ block }: { block: QuoteBlock }) {
  return (
    <blockquote className="border-l-4 border-indigo-500 pl-6 py-4 my-10 bg-indigo-50/30 rounded-r-xl">
      <p className="text-xl italic text-gray-800 leading-relaxed">"{block.text}"</p>
      {block.author && <cite className="block mt-4 text-sm font-semibold text-indigo-600 not-italic">— {block.author}</cite>}
    </blockquote>
  );
}

function ListRenderer({ block }: { block: ListBlock }) {
  const Tag = block.ordered ? 'ol' : 'ul';
  return (
    <Tag className={`${block.ordered ? 'list-decimal' : 'list-disc'} pl-6 space-y-3 my-6 text-gray-700 text-lg`}>
      {block.items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Tag>
  );
}

function ImageRenderer({ block }: { block: ImageBlock }) {
  if (!block.url) return null;
  const alignments = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
    full: 'w-full'
  };
  return (
    <div className={`flex ${block.alignment === 'full' ? 'w-full' : 'my-8'}`}>
      <img src={block.url} alt={block.caption || ''} className={`rounded-xl shadow-lg border border-gray-100 ${alignments[block.alignment] || 'mx-auto'} ${block.alignment === 'full' ? 'w-full' : 'max-w-full'}`} />
    </div>
  );
}

function VideoRenderer({ block }: { block: VideoBlock }) {
  if (!block.url) return null;

  let renderUrl = block.url;
  
  // Basic parsing
  if (block.videoType === 'youtube' && renderUrl.includes('youtube.com/watch?v=')) {
    const v = renderUrl.split('v=')[1]?.split('&')[0];
    renderUrl = `https://www.youtube.com/embed/${v}`;
  } else if (block.videoType === 'youtube' && renderUrl.includes('youtu.be/')) {
    const v = renderUrl.split('youtu.be/')[1]?.split('?')[0];
    renderUrl = `https://www.youtube.com/embed/${v}`;
  }
  
  if (block.videoType === 'shorts' && renderUrl.includes('youtube.com/shorts/')) {
     const v = renderUrl.split('shorts/')[1]?.split('?')[0];
     renderUrl = `https://www.youtube.com/embed/${v}`;
  }

  // Size mapping
  let widthClasses = 'w-full';
  if (block.size === 'large') widthClasses = 'w-11/12 md:w-10/12';
  if (block.size === 'medium') widthClasses = 'w-3/4 md:w-2/3';
  if (block.size === 'small') widthClasses = 'w-1/2 md:w-1/3';
  if (block.size === 'custom' && block.customWidth) {
      // allow inline style override below
  }

  // Mobile overrides for shorts/reels (always vertical cards)
  let aspectRatio = 'aspect-video';
  if (block.videoType === 'shorts' || block.videoType === 'reel') {
     aspectRatio = 'aspect-[9/16]';
     // On mobile, shorts look better slightly constrained or full-width portrait, depending on design
     if (block.size === 'full') widthClasses = 'w-full sm:w-[400px] hover:shadow-xl transition-shadow';
  }

  const containerClasses = `relative overflow-hidden rounded-2xl bg-black ${widthClasses} ${aspectRatio} shadow-lg`;
  
  const alignContainer = {
    left: 'flex justify-start my-6',
    center: 'flex justify-center my-8',
    right: 'flex justify-end my-6 float-right ml-6 mb-6'
  };

  return (
    <div className={alignContainer[block.alignment || 'center']}>
      <div 
        className={containerClasses}
        style={block.size === 'custom' && block.customWidth ? { width: block.customWidth } : {}}
      >
         {(block.videoType === 'upload' || renderUrl.startsWith('data:video') || renderUrl.endsWith('.mp4')) ? (
           <video 
             src={renderUrl} 
             controls 
             preload="metadata"
             playsInline 
             onPlay={() => {
               fetch('/api/analytics/track-video', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ videoId: block.id })
               }).catch(e => console.error("Error tracking video play:", e));
             }}
             className="absolute top-0 left-0 w-full h-full object-cover" 
           />
        ) : (
           <iframe 
             src={renderUrl} 
             title="Video player"
             className="absolute top-0 left-0 w-full h-full border-0"
             loading="lazy"
             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
             allowFullScreen 
           />
        )}
      </div>
    </div>
  );
}
