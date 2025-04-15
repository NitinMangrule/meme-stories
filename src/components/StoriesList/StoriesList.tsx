import React from "react";
import { Story } from "../../types/Story";
import StoryItem from "../StoryItem/StoryItem";

interface StoriesListProps {
  stories: Story[];
  onSelect: (index: number) => void;
}

const StoriesList: React.FC<StoriesListProps> = ({ stories, onSelect }) => {
  return (
    <div className="fixed top-0 left-0 w-full bg-black z-50 px-2 py-4">
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
