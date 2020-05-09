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

  return (
    <div className="flex flex-col justify-between items-center py-8 h-screen">
      <Head>
        <title>Home</title>
      </Head>
      <h1 className="text-3xl text-headline">Home</h1>
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
      <div className="flex flex-col">
        <Link href="/history">
          <a className="bg-button text-buttonText text-center p-3 mt-3 w-48 rounded">
            History
          </a>
        </Link>
        <Link href="/newGame" as="new-game">
          <a className="bg-button text-buttonText text-center p-3 mt-3 w-48 rounded">
            New Game
          </a>
        </Link>
        <Link href="/addFriends" as="add-friends">
          <a className="bg-button text-buttonText text-center  p-3 mt-3 w-48 rounded">
            Add Friends
          </a>
        </Link>
        {user && user.friendRequests.length > 0 && (
          <Link href="/friendRequests" as="friend-requests">
            <a
              className="bg-button text-buttonText text-center  p-3 mt-3 w-48 rounded"
              type="button"
            >{`Friend Requests (${user.friendRequests.length})`}</a>
          </Link>
        )}
        <button
          className="bg-button text-buttonText text-center  p-3 mt-3 w-48 rounded"
          type="button"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
