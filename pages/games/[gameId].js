import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Button from "../../components/button";

import { firebase } from "../../firebase/index";
import { AuthContext } from "../_app";
import Link from "next/link";

export default function GameScreen() {
  const user = useContext(AuthContext);

  const router = useRouter();
  const { gameId } = router.query;

  const [text, setText] = useState("");
  const [players, setPlayers] = useState({
    player1: { name: "", userId: "" },
    player2: { name: "", userId: "" },
  });

  const [guesses, setGuesses] = useState([
    { round: 1, player1: "Varg", player2: "Tiger" },
  ]);
  const [round, setRound] = useState(1);
  const [gameFinished, setGameFinished] = useState(false);

  const isPlayer1 = () => players.player1.userId === user.userId;

  const canGuess = () => {
    if (guesses[round - 1]) {
      if (isPlayer1()) {
        return guesses[round - 1].player1 === "";
      }
      return guesses[round - 1].player2 === "";
    }
  };

  const nextRound = async (currentGuesses) => {
    const newRound = round + 1;

    const guesses = [
      ...currentGuesses,
      { round: newRound, player1: "", player2: "" },
    ];
    setRound(newRound);
    setGuesses(guesses);

    await firebase.firestore().collection("guessGames").doc(gameId).set(
      {
        guesses: guesses,
        round: newRound,
      },
      { merge: true }
    );
  };

  const formatGuess = (guess) => {
    const formatedGuess = guess.trim().toLowerCase();
    return formatedGuess.charAt(0).toUpperCase() + formatedGuess.slice(1);
  };

  const handleGuess = async () => {
    setText("");
    const currentGuesses = [...guesses];
    const guess = formatGuess(text);

    if (!guess) return;

    if (isPlayer1()) {
      currentGuesses[round - 1].player1 = guess;
    } else {
      currentGuesses[round - 1].player2 = guess;
    }
    setGuesses(currentGuesses);

    await firebase.firestore().collection("guessGames").doc(gameId).set(
      {
        guesses: currentGuesses,
      },
      { merge: true }
    );

    if (
      currentGuesses[round - 1].player1 &&
      currentGuesses[round - 1].player2
    ) {
      if (isSameWord(currentGuesses)) {
        endGame();
      }
      nextRound(currentGuesses);
    }
  };

  const endGame = async () => {
    await firebase.firestore().collection("guessGames").doc(gameId).set(
      {
        isFinished: true,
      },
      { merge: true }
    );
  };

  const isSameWord = (currentGuesses) => {
    return (
      currentGuesses[round - 1].player1.toLowerCase() ===
      currentGuesses[round - 1].player2.toLowerCase()
    );
  };

  useEffect(() => {
    if (gameId) {
      return firebase
        .firestore()
        .collection("guessGames")
        .doc(gameId)
        .onSnapshot((doc) => {
          const { guesses, round, isFinished, players } = doc.data();
          setGuesses(guesses);
          setRound(round);
          setPlayers(players);
          setGameFinished(isFinished);
        });
    }
  }, [gameId]);

  if (!user) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col items-center h-screen py-8 justify-between">
      <div className="w-full">
        <Link href="/home">
          <a className="ml-5">{"< Home"}</a>
        </Link>
        <div className="flex justify-around my-3 text-headline text-xl">
          <div>{players.player1.name}</div>
          <div>{players.player2.name}</div>
        </div>
        {guesses
          .filter((guess) => guess.round != round)
          .map((guess) => (
            <div className="flex justify-around mt-1" key={guess.round}>
              <div>{guess.player1}</div>
              <div>{guess.player2}</div>
            </div>
          ))}
        <div className="flex bg-paragraph text-stroke mx-10 rounded py-2 px-10 justify-between mt-3">
          <div>{isPlayer1() && guesses.slice(-1)[0].player1}</div>
          <div>{!isPlayer1() && guesses.slice(-1)[0].player2}</div>
        </div>
      </div>
      <div className="flex flex-col">
        <input
          onChange={({ target }) => setText(target.value)}
          type="text"
          value={text}
          className="mt-3 p-2 rounded text-stroke"
        ></input>
        <Button className="text-sm" onClick={handleGuess}>
          {canGuess() ? "Guess" : "Waiting for other player..."}
        </Button>
      </div>
    </div>
  );
}
