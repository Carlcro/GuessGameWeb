import React, { useState, useContext } from "react";
import { firebase } from "../firebase/index";
import { AuthContext } from "./_app";
import Button from "../components/button";

export default function AddFriends() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [requestSent, setRequestSent] = useState(false);

  const { user } = useContext(AuthContext);

  const sentToggle = () => {
    setEmail("");
    setRequestSent(true);
    setTimeout(() => {
      setRequestSent(false);
    }, 2000);
  };

  const sendFriendsRequest = () => {
    setError("");
    firebase
      .firestore()
      .collection("users")
      .where("email", "==", email)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          setError("User not found");
        } else {
          snapshot.forEach((doc) => {
            doc.ref
              .update({
                friendRequests: firebase.firestore.FieldValue.arrayUnion(
                  user.userId
                ),
              })
              .catch((e) => {
                error(e.message);
              });
            sentToggle();
          });
        }
      });
  };
  return (
    <div className="flex flex-col items-center h-screen">
      <h1 className="text-4xl text-headline">Add Friends</h1>
      <div className="flex flex-col justify-center flex-1">
        <input
          placeholder="Email"
          className="mt-3 p-2 rounded text-background w-48"
          type="email"
          value={email}
          onChange={({ target }) => setEmail(target.value)}
        ></input>
        <Button disabled={requestSent} onClick={sendFriendsRequest}>
          {requestSent ? "Request Sent!" : "Send Friend Request"}
        </Button>
        <span>{error}</span>
      </div>
    </div>
  );
}
