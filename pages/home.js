import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./_app";
import { firebase } from "../firebase/index";
import Link from "next/link";

export default function Home() {
  const { user, logout } = useContext(AuthContext);
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
