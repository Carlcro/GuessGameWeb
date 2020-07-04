import React, { useContext, useState } from "react";
import { AuthContext } from "../_app";
import { firebase } from "../../firebase/index";
import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function History() {
  const { user } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [lastDocumentArray, setLastDocumentArray] = useState({});

  const pageSize = 5;

  const getLastWord = (guesses) => {
    if (guesses.slice(-2)[0].player1 === guesses.slice(-2)[0].player2) {
      return guesses.slice(-2)[0].player1;
    } else {
      if (!guesses.slice(-2)[0].player1 || !guesses.slice(-2)[0].player2) {
        return `${guesses.slice(-3)[0].player1}/${
          guesses.slice(-3)[0].player2
        }`;
      }
      return `${guesses.slice(-2)[0].player1}/${guesses.slice(-2)[0].player2}`;
    }
  };

  const { data = [] } = useSWR(page, getFinishedGames, {
    revalidateOnFocus: false,
    dedupingInterval: 2 * 60 * 1000,
  });

  return (
    <div className="flex flex-col items-center py-8 min-h-screen">
      <Head>
        <title>History</title>
      </Head>
      <h1 className="text-3xl text-headline">History</h1>

      {data.map((game) => (
        <Link
          href="/history/[gameId]"
          as={`/history/${game.gameId}`}
          key={game.gameId}
        >
          <a className="w-48 bg-paragrah border-highlight border-2 border-solid rounded text-center p-3 mt-3">
            <div className="flex flex-col flex-1">
              <div className="flex justify-between text-white">
                <div></div>
                <div>{`${game.title}`}</div>
                <div>{game.nrOfRounds}</div>
              </div>
              <div className="text-xs">{`${game.opponentEmail || ""}`}</div>
            </div>
          </a>
        </Link>
      ))}
      <div className="w-48 flex justify-between mt-3 px-4">
        {page === 1 ? (
          <div />
        ) : (
          <FontAwesomeIcon
            size="lg"
            className="cursor-pointer"
            icon={faChevronLeft}
            onClick={() => setPage(page - 1)}
          />
        )}
        <span className="text-headline text-lg">{page}</span>
        {data.length < 0 ? (
          <div />
        ) : (
          <FontAwesomeIcon
            size="lg"
            className="cursor-pointer"
            icon={faChevronRight}
            onClick={() => setPage(page + 1)}
          />
        )}
      </div>
    </div>
  );

  async function getFinishedGames(page) {
    if (Number(page) !== 1) {
      const previousPage = lastDocumentArray[Number(page) - 1];

      const docs = await firebase
        .firestore()
        .collection("guessGames")
        .where("playerIds", "array-contains", user.userId)
        .where("isFinished", "==", true)
        .orderBy("finishedAt", "desc")
        .startAfter(previousPage)
        .limit(pageSize)
        .get();

      if (docs.size > 0) {
        return getListOfGames(docs);
      }

      return [];
    } else {
      const docs = await firebase
        .firestore()
        .collection("guessGames")
        .where("playerIds", "array-contains", user.userId)
        .where("isFinished", "==", true)
        .orderBy("finishedAt", "desc")
        .limit(pageSize)
        .get();

      if (docs.size > 0) {
        return getListOfGames(docs);
      }

      return [];
    }
  }

  function getListOfGames(docs) {
    let temp = { ...lastDocumentArray };

    const list = [];

    docs.forEach((doc) => {
      temp[Number(page)] = doc;
      const { players, guesses } = doc.data();
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
          nrOfRounds: guesses.length - 1,
        });
      }
    });

    setLastDocumentArray(temp);

    return list;
  }
}
