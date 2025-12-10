import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Play } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Story {
  id: number;
  title: string;
  image: string;
  video?: string;
  category: string;
  isLive?: boolean;
}

const stories: Story[] = [
  {
    id: 1,
    title: 'Match Day Vlog',
    image:
      'https://images.unsplash.com/photo-1522778119026-d647f0565c6a?q=80&w=800&auto=format&fit=crop',
    category: 'Behind the Scenes',
    isLive: true,
  },
  {
    id: 2,
    title: 'New Kit Reveal',
    image:
      'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?q=80&w=800&auto=format&fit=crop',
    category: 'Merch',
  },
  {
    id: 3,
    title: 'Training Session',
    image:
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=800&auto=format&fit=crop',
    category: 'Training',
  },
  {
    id: 4,
    title: 'Coach Interview',
    image:
      'https://images.unsplash.com/photo-1516731238428-0017d0066226?q=80&w=800&auto=format&fit=crop',
    category: 'Interview',
  },
  {
    id: 5,
    title: 'Fan Chants',
    image:
      'https://images.unsplash.com/photo-1504159506876-f8338247a14a?q=80&w=800&auto=format&fit=crop',
    category: 'Fans',
  },
];

export const StoriesSection = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="w-2 h-8 bg-red-600 rounded-full" />
          Kaysar Stories
        </h2>
        <button className="text-sm text-gray-400 hover:text-white transition-colors">
          View Archive
        </button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex gap-4">
          {/* Add Story Button (Mock) */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative w-32 h-56 flex-shrink-0 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gray-800 rounded-2xl border-2 border-dashed border-gray-600 flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-white hover:border-white transition-colors">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase">Add Story</span>
            </div>
          </motion.div>

          {stories.map(story => (
            <StoryCard key={story.id} story={story} onClick={() => setSelectedStory(story)} />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="bg-white/10" />
      </ScrollArea>

      {/* Full Screen Story View */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            style={{ willChange: 'opacity' }} // Safari fix for layout animation + backdrop-blur
            onClick={() => setSelectedStory(null)}
          >
            <motion.div
              layoutId={`story-${selectedStory.id}`}
              className="relative w-full max-w-md aspect-[9/16] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selectedStory.image}
                alt={selectedStory.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

              {/* Header */}
              <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-start">
                <div>
                  <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-bold rounded mb-2">
                    {selectedStory.category}
                  </span>
                  <h3 className="text-xl font-bold text-white">{selectedStory.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-sm transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Progress Bar (Mock) */}
              <div className="absolute top-2 left-2 right-2 flex gap-1">
                <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 5, ease: 'linear' }}
                    className="h-full bg-white"
                    onAnimationComplete={() => setSelectedStory(null)}
                  />
                </div>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const StoryCard = ({ story, onClick }: { story: Story; onClick: () => void }) => {
  return (
    <motion.div
      layoutId={`story-${story.id}`}
      whileHover={{ scale: 1.05, y: -5 }}
      onClick={onClick}
      className="relative w-32 h-56 flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden group"
    >
      <img
        src={story.image}
        alt={story.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div
          className={`w-8 h-8 rounded-full border-2 ${story.isLive ? 'border-red-500 p-0.5' : 'border-white mb-2'}`}
        >
          <img src={story.image} className="w-full h-full rounded-full object-cover" />
        </div>
        <p className="text-xs font-bold text-white leading-tight line-clamp-2">{story.title}</p>
      </div>

      {story.isLive && (
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold uppercase rounded animate-pulse">
          Live
        </div>
      )}
    </motion.div>
  );
};
