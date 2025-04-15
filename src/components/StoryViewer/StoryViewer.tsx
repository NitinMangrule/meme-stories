import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Story } from "../../types/Story";

interface StoryViewerProps {
  story: Story;
  storyIndex?: number;
  currentImageIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  setCurrentImageIndex: (index: number) => void;
  totalStories: number;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  story,
  currentImageIndex,
  onNext,
  onPrev,
  onClose,
  setCurrentImageIndex,
  storyIndex = 0,
  totalStories,
}) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500); // Time to complete the fade-out and fade-in transition
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    setIsImageLoading(true); // reset loader when image index changes

    if (currentImageIndex < story.preview.length) {
      timerRef.current = setTimeout(() => {
        if (currentImageIndex === story.preview.length - 1) {
          onNext();
        } else {
          setCurrentImageIndex(currentImageIndex + 1);
        }
      }, 5000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentImageIndex, story]);

  const handleClick = (e: React.MouseEvent) => {
    const clickX = e.clientX;
    const width = window.innerWidth;
    if (clickX < width / 2) {
      if (currentImageIndex > 0) {
        setIsTransitioning(true);
        setCurrentImageIndex(currentImageIndex - 1);
      } else {
        onPrev();
      }
    } else {
      if (currentImageIndex < story.preview.length - 1) {
        setIsTransitioning(true);
        setCurrentImageIndex(currentImageIndex + 1);
      } else {
        onNext();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
      <div className="relative h-full w-full" onClick={handleClick}>
        {/* Top header */}
        <div className="absolute top-0 left-0 right-0 flex flex-col px-4 pt-4 z-10">
          {/* Progress bars */}
          <div className="flex gap-1 mb-2">
            {Array.from({ length: totalStories }).map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded bg-white/30 overflow-hidden"
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    i < storyIndex
                      ? "bg-white w-full"
                      : i === storyIndex
                      ? "bg-white animate-pulse w-full"
                      : "bg-transparent"
                  }`}
                ></div>
              </div>
            ))}
          </div>

          {/* Author and close */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={story.url} // using first image as avatar
                alt="author"
                className="w-8 h-8 rounded-full object-cover border border-white"
              />
              <div>
                <p className="text-sm font-semibold">{story.author}</p>
                <p className="text-xs text-gray-300">2h ago</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent triggering the handleClick on background
                onClose();
              }}
              className="absolute top-3 right-4 z-50 text-white bg-black/50 p-2 rounded-full"
            >
              ×
            </button>
          </div>
        </div>

        {/* Image + Loader */}
        <div className="w-full h-full flex items-center justify-center relative">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60">
              <div className="loader border-4 border-white border-t-transparent rounded-full w-8 h-8 animate-spin"></div>
            </div>
          )}
          <div
            className={`transition-all duration-500 ease-in-out relative flex items-center justify-center w-full h-full ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            <img
              src={story.preview[currentImageIndex]}
              alt="story"
              loading="lazy"
              onLoad={() => setIsImageLoading(false)}
              onError={() => {
                setIsImageLoading(false); // fallback case
              }}
              className={`max-w-full max-h-full object-contain mx-auto my-auto transition-opacity duration-300 ${
                isImageLoading ? "opacity-0" : "opacity-100"
              }`}
            />
          </div>
        </div>

        {/* Arrows */}
        <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-20">
          <ArrowLeft onClick={onPrev} />
        </div>
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-20">
          <ArrowRight onClick={onNext} />
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
