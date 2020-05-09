import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../_app";
import { firebase } from "../../firebase/index";
import Link from "next/link";

export default function History() {
  const { user } = useContext(AuthContext);
  const [games, setGames] = useState([]);

  const getLastWord = (guesses) => {
    if (guesses.slice(-2)[0].player1 === guesses.slice(-2)[0].player2) {
      return guesses.slice(-2)[0].player1;
    } else {
      return `${guesses.slice(-2)[0].player1}/${guesses.slice(-2)[0].player2}`;
    }
  };

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
            const { players, finishedAt, guesses } = doc.data();

            const opponentName =
              players.player1.userId === user.userId
                ? players.player2.name
                : players.player1.name;

            list.push({
              gameId: doc.id,
              opponentName,
              title: getLastWord(guesses),
              finishedAt: finishedAt ? finishedAt.toDate().toDateString() : "",
            });
          });

          setGames(list);
        });
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center py-8 h-screen">
      <Head>
        <title>History</title>
      </Head>
      <h1 className="text-3xl text-headline">History</h1>

      {games.map((game) => (
        <div className="flex">
          <Link
            href="/history/[gameId]"
            as={`/history/${game.gameId}`}
            key={game.gameId}
          >
            <a className="w-48 bg-paragrah border-highlight border-2 border-solid rounded text-center p-3 mt-3">
              {game.title}
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
