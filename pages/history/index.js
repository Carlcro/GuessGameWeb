import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../_app";
import { firebase } from "../../firebase/index";
import Link from "next/link";
import Head from "next/head";
import Button from "../../components/button";
import { usePaginatedQuery } from "react-query";

export default function History() {
  const { user } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [last, setLast] = useState(0);

  const [lastDocument, setLastDocument] = useState(null);
  const [queryParam, setQueryParam] = useState(null);

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
            setLastDocument(doc);
            const { players, guesses, round } = doc.data();
            const title = getLastWord(guesses);

            if (title) {
              const opponentName =
                players.player1.userId === user.userId
                  ? players.player2.name
                  : players.player1.name;

              const opponentEmail =
                players.player1.userId === user.userId
                  ? players.player2.email
                  : players.player1.email;

              list.push({
                gameId: doc.id,
                opponentName,
                title,
                opponentEmail,
              });
            }
          });

          setGames(list);
        });
    }
  }, [user]);
  const fetchProjects = (key, last = 0) => loadMore2(last);

  const {
    isLoading,
    isError,
    error,
    resolvedData,
    latestData,
    isFetching,
    list,
  } = usePaginatedQuery(["guessGames", queryParam], fetchProjects, {
    staleTime: Infinity,
  });

  console.log(
    isLoading,
    isError,
    error,
    resolvedData,
    latestData,
    isFetching,
    list
  );

  /* const loadMore = () => {
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

          const { players, guesses } = doc.data();
          const title = getLastWord(guesses);

          if (title.length) {
            const opponentName =
              players.player1.userId === user.userId
                ? players.player2.name
                : players.player1.name;

            const opponentEmail =
              players.player1.userId === user.userId
                ? players.player2.email
                : players.player1.email;

            list.push({
              gameId: doc.id,
              opponentName,
              opponentEmail,
              title,
            });
          }
        });

        setGames([...games, ...list]);
      });
  }; */
  const loadMore2 = (lastDoc) => {
    const list = [];

    console.log(lastDoc);

    const data = firebase
      .firestore()
      .collection("guessGames")
      .where("playerIds", "array-contains", user.userId)
      .where("isFinished", "==", true)
      .orderBy("finishedAt", "desc")
      .startAfter(1)
      .limit(5)
      .get()
      .then((data) => {
        console.log("load more");
        data.forEach((doc) => {
          const { players, guesses } = doc.data();
          const title = getLastWord(guesses);

          if (title.length) {
            const opponentName =
              players.player1.userId === user.userId
                ? players.player2.name
                : players.player1.name;

            const opponentEmail =
              players.player1.userId === user.userId
                ? players.player2.email
                : players.player1.email;

            list.push({
              gameId: doc.id,
              opponentName,
              opponentEmail,
              title,
            });

            console.log(list);
          }
        });

        return list;
      });

    return data;
  };

  if (isLoading || isError) {
    return <div>Loading</div>;
  }

  return (
    <div className="flex flex-col items-center py-8 min-h-screen">
      <Head>
        <title>History</title>
      </Head>
      <h1 className="text-3xl text-headline">History</h1>

      {latestData.map((game) => (
        <Link
          href="/history/[gameId]"
          as={`/history/${game.gameId}`}
          key={game.gameId}
        >
          <a className="w-48 bg-paragrah border-highlight border-2 border-solid rounded text-center p-3 mt-3">
            <div className="flex flex-col flex-1">
              <div className="text-white">{`${game.title}`}</div>
              <div className="text-xs">{`${game.opponentEmail || ""}`}</div>
            </div>
          </a>
        </Link>
      ))}
      <Button onClick={() => setQueryParam(lastDocument)}>Load more</Button>
    </div>
  );
}
