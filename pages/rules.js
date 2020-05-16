export default function Rules() {
  return (
    <div className="flex items-center justify-center">
      <div className="max-w-lg px-4">
        <h1 className="text-center text-headline text-3xl">Rules</h1>
        <p className="mt-3">
          Start with each player writing a word. It can be any word you like.
        </p>
        <p className="mt-3">
          When the players are done, the words are displayed for both players.
        </p>
        <p className="mt-3">
          The objective now is for the players to come up with a word that they
          "feel" lie between the words written. Both players submit their
          contribution. If both players writes the same word the game ends and
          both players win.
        </p>
        <p className="mt-3">
          If the words are not the same, the game continues with the two new
          words. The players now have to come up with a word that lie between
          those.
        </p>
        <p className="mt-3">
          The game continues like this until both players write the same word.
        </p>
        <p className="mt-3">
          If you feel that both players wrote the same word but with a slight
          difference (one with plural for example) you can press end game and
          the game will still be saved in history
        </p>
      </div>
    </div>
  );
}
