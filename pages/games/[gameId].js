import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Button from "../../components/button";

import { firebase } from "../../firebase/index";
import { AuthContext } from "../_app";
import Link from "next/link";
import Spinner from "../../components/spinner";
import EmojiControl from "../../components/emojiControll";
import produce from "immer";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";

export default function GameScreen() {
  const { user } = useContext(AuthContext);

  const router = useRouter();
  const { gameId } = router.query;

  const [text, setText] = useState("");
  const [players, setPlayers] = useState({
    player1: { name: "", userId: "" },
    player2: { name: "", userId: "" },
  });

  const [guesses, setGuesses] = useState([
    { round: 1, player1: "", player2: "" },
  ]);
  const [round, setRound] = useState(1);
  const [gameFinished, setGameFinished] = useState(false);

  const [reactionPosition, setReactionPosition] = useState({
    show: false,
    x: 0,
    y: 0,
  });

  const isPlayer1 = () => players.player1.userId === user.userId;

  const hasGuessed = () => {
    if (guesses[round - 1]) {
      if (isPlayer1()) {
        return guesses[round - 1].player1 != "";
      }
      return guesses[round - 1].player2 != "";
    }
  };

  const nextRound = async (currentGuesses) => {
    const newRound = round + 1;

    const guesses = [
      ...currentGuesses,
      { round: newRound, player1: "", player2: "" },
    ];

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
        finishedAt: firebase.firestore.FieldValue.serverTimestamp(),
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

  const friendHasAnswered = () => {
    if (isPlayer1()) {
      return guesses[round - 1]?.player2.length != 0;
    } else {
      return guesses[round - 1]?.player1.length != 0;
    }
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

  const Guess = ({ children, selectedRound, selectedPlayer, reactions }) => {
    return (
      <div style={{ display: "flex" }}>
        <div
          onClick={(event) =>
            handleReaction(selectedRound, selectedPlayer, event)
          }
        >
          {children}
        </div>
        <div className="ml-2">
          <div>{reactions?.player1}</div>
          <div>{reactions?.player2}</div>
        </div>
      </div>
    );
  };

  const handleReaction = (selectedRound, selectedPlayer, event) => {
    setReactionPosition({
      selectedRound,
      selectedPlayer,
      show: true,
      x: event.clientX,
      y: event.clientY,
    });
  };

  const handleReactionSelected = async (
    selectedRound,
    selectedPlayer,
    reaction
  ) => {
    const newGuesses = produce(guesses, (draftState) => {
      if (isPlayer1()) {
        draftState[selectedRound - 1].reactions = {
          ...draftState[selectedRound - 1].reactions,
          [selectedPlayer]: { player1: reaction },
        };
      } else {
        draftState[selectedRound - 1].reactions = {
          ...draftState[selectedRound - 1].reactions,
          [selectedPlayer]: { player2: reaction },
        };
      }
    });

    setReactionPosition({ show: false, x: 0, y: 0 });

    await firebase.firestore().collection("guessGames").doc(gameId).set(
      {
        guesses: newGuesses,
      },
      { merge: true }
    );
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Head>
          <title>Game</title>
        </Head>
        <Spinner></Spinner>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {isPlayer1() ? players.player2.name : players.player1.name}
        </title>
      </Head>
      <EmojiControl
        onReactionSelected={handleReactionSelected}
        selectedPlayer={reactionPosition.selectedPlayer}
        selectedRound={reactionPosition.selectedRound}
        show={reactionPosition.show}
        yPos={reactionPosition.y}
        xPos={reactionPosition.x}
      ></EmojiControl>
      <div className="flex flex-col items-center h-screen py-8 justify-between">
        <div className="max-w-md w-full">
          <div className="flex justify-end">
            {!gameFinished ? (
              <button
                onClick={endGame}
                className="bg-button text-buttonText text-center py-1 px-3 mr-4  
          rounded"
              >
                End
              </button>
            ) : (
              <div></div>
            )}
          </div>
          {gameFinished && (
            <div
              style={{
                color: "#DABDD2",
                position: "relative",
                top: 38,
                left: 206,
              }}
            >
              <FontAwesomeIcon className="bigBrain" size="2x" icon={faBrain} />
            </div>
          )}
          {gameFinished && (
            <div className="flex justify-between my-3">
              <div className="text-paragraph brainP1">
                <FontAwesomeIcon size="lg" icon={faBrain} />
              </div>
              <div className="text-button brainP2 ">
                <FontAwesomeIcon size="lg" icon={faBrain} />
              </div>
            </div>
          )}
          <div className="flex justify-around my-3 text-headline text-xl">
            <div>{players.player1.name}</div>
            <div>{players.player2.name}</div>
          </div>
          {guesses
            .filter((guess) => guess.round != round)
            .map((guess) => (
              <div className="flex justify-around mt-1" key={guess.round}>
                <Guess
                  reactions={guess.reactions?.player1}
                  selectedPlayer="player1"
                  selectedRound={guess.round}
                  reactionClicked={handleReactionSelected}
                >
                  {guess.player1}
                </Guess>
                <Guess
                  reactions={guess.reactions?.player2}
                  selectedPlayer="player2"
                  selectedRound={guess.round}
                  reactionClicked={handleReactionSelected}
                >
                  {guess.player2}
                </Guess>
              </div>
            ))}
          <div className="flex items-center border-headline border-t-2 border-b-2 border-solid  mx-10 h-10  py-1 px-10 justify-between mt-3">
            <div>{isPlayer1() && guesses.slice(-1)[0].player1}</div>
            <div>{!isPlayer1() && guesses.slice(-1)[0].player2}</div>
          </div>
        </div>
        {!gameFinished ? (
          <div className="flex flex-col items-center px-8  mb-12">
            {friendHasAnswered() && <span>Other player has answered</span>}
            {hasGuessed() && (
              <span>
                Waiting for other player, you can still change your answer
              </span>
            )}
            <input
              onChange={({ target }) => setText(target.value)}
              type="text"
              value={text}
              className="mt-3 p-2 rounded text-stroke w-48"
            ></input>
            <Button className="text-sm" onClick={handleGuess}>
              Guess
            </Button>
          </div>
        ) : (
          <div>Finished</div>
        )}
      </div>
    </>
  );
}
