import React, { useEffect, useState } from "react";
import "./index.css";
import { Story } from "./types/Story";
import StoriesList from "./components/StoriesList/StoriesList";
import StoryViewer from "./components/StoryViewer/StoryViewer";

const CACHE_KEY = "cached_stories";
const CACHE_EXPIRY_KEY = "cached_stories_expiry";
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

const preloadImage = (src: string): Promise<void> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => reject();
  });

const App: React.FC = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(
    null
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  useEffect(() => {
    const fetchAndCache = async () => {
      try {
        const now = Date.now();
        const cached = localStorage.getItem(CACHE_KEY);
        const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);

        let storiesToUse: Story[] | null = null;

        if (cached && expiry && now < Number(expiry)) {
          storiesToUse = JSON.parse(cached);
        } else {
          const res = await fetch("https://meme-api.com/gimme/39");
          const data = await res.json();

          storiesToUse = data.memes.map((meme: Story) => ({
            url: meme.url,
            preview: [meme.url],
            author: meme.author || "Unknown",
            ups: meme.ups,
          }));

          localStorage.setItem(CACHE_KEY, JSON.stringify(storiesToUse));
          localStorage.setItem(
            CACHE_EXPIRY_KEY,
            (now + CACHE_DURATION_MS).toString()
          );
        }

        if (storiesToUse) {
          // Show stories immediately
          setStories(storiesToUse);
          setLoading(false);

          // Preload first few images
          const firstFew = storiesToUse.slice(0, 3);
          await preloadAll(firstFew);

          // Preload remaining images (non-blocking)
          const rest = storiesToUse.slice(3);
          preloadAll(rest);
        }
      } catch (err) {
        console.error("Error fetching or preloading stories:", err);
        setLoading(false); // fail gracefully
      }
    };

    const preloadAll = async (stories: Story[]) => {
      const promises = stories.flatMap((story) =>
        story.preview.map(preloadImage)
      );
      await Promise.all(promises);
    };

    fetchAndCache();
  }, []);

  const openStory = (index: number) => {
    setCurrentStoryIndex(index);
    setCurrentImageIndex(0);
  };

  const closeViewer = () => setCurrentStoryIndex(null);

  const goToNextStory = () => {
    if (currentStoryIndex !== null && currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setCurrentImageIndex(0);
    } else {
      closeViewer();
    }
  };

  const goToPrevStory = () => {
    if (currentStoryIndex !== null && currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setCurrentImageIndex(0);
    } else {
      closeViewer();
    }
  };

  return (
    <div className="ms:max-w-[480px] w-full mx-auto bg-black text-white min-h-screen relative overflow-hidden">
      {loading ? (
        <div className="flex justify-center items-center h-screen text-lg">
          Loading stories...
        </div>
      ) : (
        <>
          <StoriesList stories={stories} onSelect={openStory} />
          {currentStoryIndex !== null && (
            <StoryViewer
              story={stories[currentStoryIndex]}
              storyIndex={currentStoryIndex}
              currentImageIndex={currentImageIndex}
              onNext={goToNextStory}
              onPrev={goToPrevStory}
              onClose={closeViewer}
              setCurrentImageIndex={setCurrentImageIndex}
              totalStories={stories.length}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
