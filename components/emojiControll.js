import React from "react";

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
      style={{ position: "absolute", left: xPos, top: yPos }}
      className="bg-background  border-highlight border-2 border-solid px-3 py-2 flex text-lg cursor-pointer"
    >
      <div onClick={() => selectReaction("😍")} className="mr-2">
        😍
      </div>
      <div onClick={() => selectReaction("😂")} className="mr-2">
        😂
      </div>
      <div onClick={() => selectReaction("😱")} className="mr-2">
        😱
      </div>
      <div onClick={() => selectReaction("😡")}>😡</div>
      <div className="ml-3" onClick={() => selectReaction("")}>
        ❌
      </div>
    </div>
  );
}
