import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./_app";
import { firebase } from "../firebase/index";
import Link from "next/link";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [recentlyFinishedGame, setRecentlyFinishedGame] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

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

            const opponentEmail = isPlayer1
              ? players.player2.email
              : players.player1.email;

            list.push({
              gameId: doc.id,
              opponentName,
              canGuess,
              opponentEmail,
            });
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
        .orderBy("finishedAt", "desc")
        .limit(1)
        .onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const { players, finishedAt } = doc.data();

            const isPlayer1 = getIsPlayer1(players);

            const opponentName = isPlayer1
              ? players.player2.name
              : players.player1.name;

            const opponentEmail = isPlayer1
              ? players.player2.email
              : players.player1.email;

            setRecentlyFinishedGame({
              gameId: doc.id,
              opponentName,
              finishedAt,
              opponentEmail,
            });
          });
        });
    }
  }, [user]);

  const sendVerificationMail = () => {
    firebase.auth().currentUser.sendEmailVerification();
    setEmailSent(true);
  };

  if (!user) {
    return <div></div>;
  }

  /* if (!user.emailVerified) {
    return (
      <>
        <Head>
          <title>Home</title>
        </Head>
        <div className="flex flex-col justify-center items-center py-8 flex-1">
          <div className="flex flex-col items-center px-10">
            <div className="text-headline text-center">
              {emailSent
                ? "Email Sent!"
                : "Before you can play, you need to verify your account by following the link your the email."}
            </div>
            {!emailSent && (
              <Button onClick={sendVerificationMail}>Send email again</Button>
            )}
          </div>
        </div>
      </>
    );
  } */

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
                  <a className="w-48 bg-paragrah border-highlight border-2 border-solid rounded text-center p-2 mt-3">
                    <div className="flex">
                      <div className="flex flex-col flex-1">
                        <div className="text-white">{`${game.opponentName}`}</div>
                        <div className="text-xs">{`${
                          game.opponentEmail || ""
                        }`}</div>
                      </div>
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
        {recentlyFinishedGame && (
          <div>
            <div className="text-center mt-3">Recently finished game</div>
            <div className="flex flex-col">
              <Link
                href="/games/[gameId]"
                as={`/games/${recentlyFinishedGame.gameId}`}
              >
                <a className="w-48 bg-paragrah border-highlight border-2 border-solid rounded text-center p-2 mt-3">
                  <div className="flex flex-col flex-1">
                    <div className="text-white">{`${recentlyFinishedGame.opponentName}`}</div>
                    <div className="text-xs">{`${
                      recentlyFinishedGame.opponentEmail || ""
                    }`}</div>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <Link href="/history">
          <a className="bg-button text-buttonText text-center p-3 mt-3  w-48 rounded">
            History
          </a>
        </Link>
        <Link href="/newGame" as="new-game">
          <a className="bg-button text-buttonText text-center p-3 mt-3 mb-12 w-48 rounded">
            New Game
          </a>
        </Link>
      </div>
    </div>
  );
}
