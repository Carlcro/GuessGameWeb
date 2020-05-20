import React from "react";
import { auth } from "../firebase/index";
import { useState } from "react";
import Head from "next/head";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const resetPassword = async () => {
    try {
      await auth.sendPasswordResetEmail(email);
      setMessage("Reset Password has been sent to your mail");
      setEmail("");
    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="h-screen">
      <Head>
        <title>Reset Password</title>
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
                className="mt-3 p-2 rounded"
                type="email"
              ></input>

              <button
                onClick={resetPassword}
                className="bg-button text-buttonText p-3 mt-3 rounded"
              >
                Reset Password
              </button>
            </form>
            <div>{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
