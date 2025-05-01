import React from "react";

interface StoryItemProps {
  preview: string;
  onClick: () => void;
}

const StoryItem: React.FC<StoryItemProps> = ({ preview, onClick }) => {
  return (
    <div className="shrink-0 px-1 cursor-pointer" onClick={onClick}>
      <div className="w-16 h-16 rounded-full border-2 border-pink-500 bg-gradient-to-tr from-yellow-400 to-pink-500 p-[2px]">
        <img
          src={preview}
          alt="story preview"
          className="w-full h-full object-cover rounded-full border-2 border-black"
        />
      </div>
    </div>
  );
};

export default StoryItem;
