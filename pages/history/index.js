import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../_app";
import { firebase } from "../../firebase/index";
import Link from "next/link";
import Head from "next/head";
import Button from "../../components/button";

export default function History() {
  const { user } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [last, setLast] = useState(null);

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
        .orderBy("finishedAt", "desc")
        .limit(5)
        .get()
        .then((data) => {
          const list = [];
          data.forEach((doc) => {
            setLast(doc);
            const { players, guesses, round } = doc.data();
            const title = getLastWord(guesses);

            if (title) {
              const opponentName =
                players.player1.userId === user.userId
                  ? players.player2.name
                  : players.player1.name;

              list.push({
                gameId: doc.id,
                opponentName,
                title,
              });
            }
          });

          setGames(list);
        });
    }
  }, [user]);

  const loadMore = () => {
    firebase
      .firestore()
      .collection("guessGames")
      .where("playerIds", "array-contains", user.userId)
      .where("isFinished", "==", true)
      .orderBy("finishedAt", "desc")
      .startAfter(last)
      .limit(5)
      .get()
      .then((data) => {
        const list = [];
        data.forEach((doc) => {
          setLast(doc);

          const { players, guesses, round } = doc.data();
          const title = getLastWord(guesses);

          if (title.length) {
            const opponentName =
              players.player1.userId === user.userId
                ? players.player2.name
                : players.player1.name;

            list.push({
              gameId: doc.id,
              opponentName,
              title,
            });
          }
        });

        setGames([...games, ...list]);
      });
  };

  return (
    <div className="flex flex-col items-center py-8 min-h-screen">
      <Head>
        <title>History</title>
      </Head>
      <h1 className="text-3xl text-headline">History</h1>

      {games.map((game) => (
        <Link
          href="/history/[gameId]"
          as={`/history/${game.gameId}`}
          key={game.gameId}
        >
          <a className="w-48 bg-paragrah border-highlight border-2 border-solid rounded text-center p-3 mt-3">
            {game.title}
          </a>
        </Link>
      ))}
      <Button onClick={loadMore}>Load more</Button>
    </div>
  );
}
