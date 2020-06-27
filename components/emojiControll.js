import React from "react";

const emojis = ["👍", "😍", "😂", "😱", "😡", "💡", "🤔"];

export default function EmojiControl({
  onReactionSelected,
  selectedPlayer,
  selectedRound,
  show,
  xPos,
  yPos,
}) {
  if (!show) return <div></div>;

  const selectReaction = (reaction) => {
    onReactionSelected(selectedRound, selectedPlayer, reaction);
  };

  return (
    <div
      style={{
        position: "absolute",
        left: selectedPlayer === "player1" ? xPos : xPos - 200,
        top: yPos,
      }}
      className="bg-background  border-highlight border-2 border-solid px-3 py-2 flex text-lg cursor-pointer"
    >
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
