import Link from "next/link";
import { useState, useEffect } from "react";
import { firebase } from "../firebase/index";
import { useRouter } from "next/router";
import Head from "next/head";

export default function IndexPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = (event) => {
    event.preventDefault();

    if (!name.length) {
      setError("Name is missing");
      return;
    }

    if (password != rePassword) {
      setError("Passwords do not match");
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        createUser(user);
      })
      .then(() => router.push("/home"))
      .catch((error) => setError(error.message));
  };

  const createUser = ({ user }) => {
    return firebase.firestore().collection("users").doc(user.uid).set({
      userId: user.uid,
      email: user.email,
      name: name,
      friends: [],
      friendRequests: [],
      created: firebase.firestore.FieldValue.serverTimestamp(),
    });
  };

  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>Mind Merge - Merge your brains!</title>
      </Head>
      <section>
        <div id="container" className="h-full px-8">
          <div className="flex justify-center content-center  items-center">
            <div className="w-full lg:w-4/5 flex flex-col sm:flex-row">
              <div>
                <h1 className="text-headline text-5xl">
                  Welcome to Mind Merge!
                </h1>
                <h2 className="text-paragraph text-3xl md:w-3/5">
                  The game where you work together to merge your brains 🤯. Join
                  up with a friend, work your way to reach the same word and win
                  🚀!
                </h2>
              </div>
              <div className="flex flex-col h-full mt-5 bg-paragraph rounded p-3">
                <div className="flex flex-col">
                  <form className="flex flex-col text-stroke">
                    <label for="email">Email</label>
                    <input
                      id="email"
                      className="p-2 rounded"
                      type="email"
                      onChange={({ target }) => setEmail(target.value)}
                    ></input>
                    <label className="mt-2" for="name">
                      First Name
                    </label>
                    <input
                      id="name"
                      className="p-2 rounded"
                      type="text"
                      onChange={({ target }) => setName(target.value)}
                    ></input>
                    <label className="mt-2" for="password">
                      Password
                    </label>
                    <input
                      id="password"
                      className="p-2 rounded"
                      type="password"
                      onChange={({ target }) => setPassword(target.value)}
                    ></input>
                    <label className="mt-2" for="repeatPassword">
                      Repeat Password
                    </label>
                    <input
                      id="repeatPassword"
                      className="p-2 rounded"
                      type="password"
                      onChange={({ target }) => setRePassword(target.value)}
                    ></input>
                    <button
                      id="submit"
                      className="bg-button text-buttonText p-3 mt-3 rounded"
                      type="submit"
                      onClick={handleSignUp}
                    >
                      Sign Up
                    </button>
                  </form>
                  <span className="text-stroke mt-4">{error}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
