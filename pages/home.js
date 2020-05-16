import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./_app";
import { firebase } from "../firebase/index";
import Link from "next/link";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const { user, logout } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [recentlyFinishedGames, setRecentlyFinishedGames] = useState([]);

  const getCanGuess = (guesses, round, isPlayer1) => {
    if (isPlayer1) {
      return guesses[round - 1].player1 === "";
    }
    return guesses[round - 1].player2 === "";
  };

  const getIsPlayer1 = (players) => players.player1.userId === user.userId;

  useEffect(() => {
    if (user) {
      return firebase
        .firestore()
        .collection("guessGames")
        .where("playerIds", "array-contains", user.userId)
        .where("isFinished", "==", false)
        .onSnapshot((querySnapshot) => {
          const list = [];
          querySnapshot.forEach((doc) => {
            const { players, guesses, round } = doc.data();

            const isPlayer1 = getIsPlayer1(players);

            const canGuess = getCanGuess(guesses, round, isPlayer1);

            const opponentName = isPlayer1
              ? players.player2.name
              : players.player1.name;
            list.push({ gameId: doc.id, opponentName, canGuess });
          });
          setGames(list);
        });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      return firebase
        .firestore()
        .collection("guessGames")
        .where("playerIds", "array-contains", user.userId)
        .where("isFinished", "==", true)
        .onSnapshot((querySnapshot) => {
          const list = [];
          querySnapshot.forEach((doc) => {
            const { players, finishedAt } = doc.data();

            if (finishedAt) {
              const isPlayer1 = getIsPlayer1(players);

              const opponentName = isPlayer1
                ? players.player2.name
                : players.player1.name;
              list.push({ gameId: doc.id, opponentName, finishedAt });
            }
          });

          const topOne = list
            .sort((a, b) => b.finishedAt.seconds - a.finishedAt.seconds)
            .slice(0, 1);

          setRecentlyFinishedGames(topOne);
        });
    }
  }, [user]);

  return (
    <div className="flex flex-col justify-between items-center py-8 flex-1">
      <Head>
        <title>Home</title>
      </Head>
      <h1 className="text-3xl text-headline">Home</h1>
      <div>
        {games.length > 0 && (
          <div>
            <div className="text-center">Games in progress</div>
            <div className="flex flex-col">
              {games.map((game) => (
                <Link
                  href="/games/[gameId]"
                  as={`/games/${game.gameId}`}
                  key={game.gameId}
                >
                  <a className="w-48 bg-paragrah border-highlight border-2 border-solid rounded text-center p-3 mt-3">
                    <div className="flex">
                      <div className="flex-1">{`${game.opponentName}`}</div>
                      {game.canGuess && (
                        <FontAwesomeIcon size="xs" icon={faCircle} />
                      )}
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}
        {recentlyFinishedGames.length > 0 && (
          <div>
            <div className="text-center mt-3">Recently finished game</div>
            <div className="flex flex-col">
              {recentlyFinishedGames.map((game) => (
                <Link
                  href="/games/[gameId]"
                  as={`/games/${game.gameId}`}
                  key={game.gameId}
                >
                  <a className="w-48 bg-paragrah border-highlight border-2 border-solid rounded text-center p-3 mt-3">
                    <div className="flex">
                      <div className="flex-1">{`${game.opponentName}`}</div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <Link href="/newGame" as="new-game">
          <a className="bg-button text-buttonText text-center p-3 mt-3 mb-10 w-48 rounded">
            New Game
          </a>
        </Link>
      </div>
    </div>
  );
}
