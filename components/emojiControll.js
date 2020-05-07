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

  const Hej = (reaction) => {
    onReactionSelected(selectedRound, selectedPlayer, reaction);
  };

  return (
    <div
      style={{ position: "absolute", left: xPos, top: yPos }}
      className="bg-background bg-paragrah border-highlight border-2 border-solid px-3 py-2 flex"
    >
      <div onClick={() => Hej("😍")} className="mr-2">
        😍
      </div>
      <div onClick={() => Hej("❤️")} className="mr-2">
        ❤️
      </div>
      <div onClick={() => Hej("😡")}>😡</div>
    </div>
  );
}
