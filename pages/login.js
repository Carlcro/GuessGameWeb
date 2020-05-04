import React, { useState } from "react";
import { firebase } from "../firebase/index";
import Router from "next/router";

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
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col w-64  bg-paragraph rounded p-3">
        <div className="flex flex-col">
          <form className="flex flex-col text-stroke">
            <input
              placeholder="Email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              className="mt-3 p-2 rounded"
              type="email"
            ></input>
            <input
              placeholder="Password"
              onChange={({ target }) => setPassword(target.value)}
              value={password}
              className="mt-3 p-2 rounded"
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
          <div className="text-buttonText mt-3">{error}</div>
        </div>
      </div>
    </div>
  );
}
