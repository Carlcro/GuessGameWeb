import React, { useContext } from "react";
import { AuthContext } from "./_app";
import Button from "../components/button";
import { useRouter } from "next/router";
import { firebase } from "../firebase/index";
import Link from "next/link";

export default function NewGame() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const startNewGame = async (friend) => {
    const player1 = { userId: user.userId, name: user.name };
    const player2 = { ...friend };

    const newGame = {
      playerIds: [player1.userId, player2.userId],
      players: {
        player1,
        player2,
      },
      guesses: [{ round: 1, player1: "", player2: "" }],
      round: 1,
      isFinished: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const gameId = await firebase
      .firestore()
      .collection("guessGames")
      .add(newGame);

    router.push(`/games/[gameId]`, `/games/${gameId.id}`);
  };

  if (!user) {
    return <div></div>;
  }

  return (
    <div>
      <div className="flex flex-col items-center h-screen">
        <h1 className="text-4xl text-headline">New Game</h1>
        <div className="flex flex-col justify-center flex-1">
          {user.friends.length > 0 ? (
            user.friends.map((friend) => (
              <button
                className="w-48 bg-paragrah border-highlight border-2 border-solid rounded text-center p-2 mt-3"
                key={friend.userId}
                onClick={() => startNewGame(friend)}
              >
                <div className="flex flex-col">
                  <div className="text-white">{friend.name}</div>
                  <div className="text-sm">{friend.email}</div>
                </div>
              </button>
            ))
          ) : (
            <div>
              <span className="text-headline">
                You need to add friends in order to play. Send a friend request{" "}
              </span>
              <Link href="/addFriends">Here.</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
