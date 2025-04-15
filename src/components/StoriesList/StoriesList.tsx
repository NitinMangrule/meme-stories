import React from "react";
import { Story } from "../../types/Story";
import StoryItem from "../StoryItem/StoryItem";

interface StoriesListProps {
  stories: Story[];
  onSelect: (index: number) => void;
}

const StoriesList: React.FC<StoriesListProps> = ({ stories, onSelect }) => {
  return (
    <div className="fixed top-0 left-0 w-full bg-black z-50  py-4">
      <h1
        className="w-full text-center text-2xl font-bold mb-5 mt-[-15px] text-white tracking-wide border-b-4 bg-gradient-to-tr from-yellow-400 to-pink-500 p-4 shadow-lg"
        style={{ fontFamily: "'Billabong', cursive" }}
      >
        Meme Stories
      </h1>
      <div className="flex overflow-x-auto no-scrollbar">
        {stories.map((story, idx) => (
          <StoryItem
            key={idx}
            preview={story.preview[0]}
            onClick={() => onSelect(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default StoriesList;
