import Link from "next/link";
import { useState, useContext, useEffect } from "react";
import { firebase } from "../firebase/index";
import { useRouter } from "next/router";
import { AuthContext } from "./_app";

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
    });
  };

  return (
    <div>
      <section>
        <div id="container" className="h-screen px-8">
          <div
            id="header"
            className="text-headline flex justify-end text-xl my-3"
          >
            <Link href="/login">
              <a>Login</a>
            </Link>
          </div>
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
                    <input
                      placeholder="Email"
                      className="mt-3 p-2 rounded"
                      type="email"
                      onChange={({ target }) => setEmail(target.value)}
                    ></input>
                    <input
                      placeholder="First Name"
                      className="mt-3 p-2 rounded"
                      type="text"
                      onChange={({ target }) => setName(target.value)}
                    ></input>
                    <input
                      placeholder="Password"
                      className="mt-3 p-2 rounded"
                      type="password"
                      onChange={({ target }) => setPassword(target.value)}
                    ></input>
                    <input
                      placeholder="Repeat Password"
                      className="mt-3 p-2 rounded"
                      type="password"
                      onChange={({ target }) => setRePassword(target.value)}
                    ></input>
                    <button
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
