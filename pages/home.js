import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./_app";
import { firebase, auth } from "../firebase/index";
import Link from "next/link";
import Router from "next/router";

export default function Home() {
  const user = useContext(AuthContext);
  const [games, setGames] = useState([]);

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
            const { players } = doc.data();

            const opponentName =
              players.player1.userId === user.userId
                ? players.player2.name
                : players.player1.name;
            list.push({ gameId: doc.id, opponentName });
          });
          setGames(list);
        });
    }
  }, [user]);

  const logout = () => {
    auth.signOut();
    Router.push("/");
  };

  if (!user) {
    return <div></div>;
  }

  return (
    <div className="flex flex-col justify-between items-center py-8 h-screen">
      <div className="text-3xl text-headline">Home</div>
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
                {game.opponentName}
              </a>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex flex-col">
        <button
          className="bg-button text-buttonText p-3 mt-3 w-48 rounded"
          type="button"
        >
          New Game
        </button>
        <button
          className="bg-button text-buttonText p-3 mt-3 w-48 rounded"
          type="button"
        >
          Add Friends
        </button>
        <button
          className="bg-button text-buttonText p-3 mt-3 w-48 rounded"
          type="button"
        >
          {`Friend Requests (${user.friendRequests.length})`}
        </button>
        <button
          className="bg-button text-buttonText p-3 mt-3 w-48 rounded"
          type="button"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
