import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../_app";
import { firebase } from "../../firebase/index";
import Link from "next/link";

export default function History() {
  const { user } = useContext(AuthContext);
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (user) {
      firebase
        .firestore()
        .collection("guessGames")
        .where("playerIds", "array-contains", user.userId)
        .where("isFinished", "==", true)
        .where("round", ">", 1)
        .get()
        .then((data) => {
          const list = [];
          data.forEach((doc) => {
            const { players, finishedAt } = doc.data();

            const opponentName =
              players.player1.userId === user.userId
                ? players.player2.name
                : players.player1.name;
            list.push({
              gameId: doc.id,
              opponentName,
              finishedAt: finishedAt ? finishedAt.toDate().toDateString() : "",
            });
          });
          setGames(list);
        });
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center py-8 h-screen">
      <h1 className="text-3xl text-headline">History</h1>

      {games.map((game) => (
        <div className="flex">
          <span className="mt-6 mr-4">{game.finishedAt}</span>
          <Link
            href="/history/[gameId]"
            as={`/history/${game.gameId}`}
            key={game.gameId}
          >
            <a className="w-48 bg-paragrah border-highlight border-2 border-solid rounded text-center p-3 mt-3">
              {game.opponentName}
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
