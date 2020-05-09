import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { firebase } from "../../firebase/index";
import { AuthContext } from "../_app";
import Link from "next/link";
import Spinner from "../../components/spinner";

export default function HistoryGame() {
  const { user } = useContext(AuthContext);

  const router = useRouter();
  const { gameId } = router.query;

  const [players, setPlayers] = useState({
    player1: { name: "", userId: "" },
    player2: { name: "", userId: "" },
  });

  const [guesses, setGuesses] = useState([
    { round: 1, player1: "", player2: "" },
  ]);
  const [round, setRound] = useState(1);

  useEffect(() => {
    if (gameId) {
      return firebase
        .firestore()
        .collection("guessGames")
        .doc(gameId)
        .onSnapshot((doc) => {
          const { guesses, round, players } = doc.data();
          setGuesses(guesses);
          setRound(round);
          setPlayers(players);
        });
    }
  }, [gameId]);

  const Guess = ({ children, reactions }) => {
    return (
      <div style={{ display: "flex" }}>
        <div>{children}</div>
        <div className="ml-2">
          <div>{reactions?.player1}</div>
          <div>{reactions?.player2}</div>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner></Spinner>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center h-screen py-8 justify-between">
        <div className="max-w-md w-full">
          <div className="flex justify-between">
            <Link href="/home">
              <a className="ml-5">{"< Home"}</a>
            </Link>
          </div>
          <div className="flex justify-around my-3 text-headline text-xl">
            <div>{players.player1.name}</div>
            <div>{players.player2.name}</div>
          </div>
          {guesses
            .filter((guess) => guess.round != round)
            .map((guess) => (
              <div className="flex justify-around mt-1" key={guess.round}>
                <Guess reactions={guess.reactions?.player1}>
                  {guess.player1}
                </Guess>
                <Guess reactions={guess.reactions?.player2}>
                  {guess.player2}
                </Guess>
              </div>
            ))}
          <div className="flex items-center border-headline border-t-2 border-b-2 border-solid  mx-10 h-10  py-1 px-10 justify-between mt-3">
            <div>{guesses.slice(-1)[0].player1}</div>
            <div>{guesses.slice(-1)[0].player2}</div>
          </div>
        </div>
        <div>Finished</div>
      </div>
    </>
  );
}
