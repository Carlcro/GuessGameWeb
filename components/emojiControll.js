import React from "react";

const emojis = ["👍", "😍", "😂", "😱", "😡", "💡", "🤔"];

export default function EmojiControl({
  onReactionSelected,
  selectedPlayer,
  selectedRound,
}) {
  const selectReaction = (reaction) => {
    onReactionSelected(selectedRound, selectedPlayer, reaction);
  };

  return (
    <div className="bg-background flex cursor-pointer border-headline border-2 py-1  px-2">
      {emojis.map((emoji) => (
        <div onClick={() => selectReaction(emoji)} className="mr-2">
          {emoji}
        </div>
      ))}
      <div className="ml-3" onClick={() => selectReaction("")}>
        ❌
      </div>
    </div>
  );
}
