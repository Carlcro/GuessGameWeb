import React, { useState } from "react";
import { firebase } from "../firebase/index";
import Router from "next/router";
import Link from "next/link";
import Head from "next/head";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => Router.push("/home"))
      .catch((error) => setError(error.message));
  };
  return (
    <div className="h-screen">
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex justify-center items-center h-full ">
        <div className="flex flex-col w-64 bg-paragraph rounded p-3">
          <div className="flex flex-col">
            <form className="flex flex-col text-stroke">
              <label className="mt-2" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                className="p-2 rounded"
                type="email"
              ></input>
              <label className="mt-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                onChange={({ target }) => setPassword(target.value)}
                value={password}
                className="p-2 rounded"
                type="password"
              ></input>
              <button
                onClick={handleLogin}
                className="bg-button text-buttonText p-3 mt-3 rounded"
                type="submit"
              >
                Login
              </button>
            </form>
            <div className="flex flex-col mt-2">
              <Link href="resetPassword" as={"reset-password"}>
                <a className="text-stroke text-center hover:opacity-75">
                  I forgot my password
                </a>
              </Link>
              {error && <div className="text-buttonText mt-1">{error}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
