import React, { useContext } from "react";
import { AuthContext } from "./_app";
import Button from "../components/button";
import { firebase } from "../firebase/index";

export default function FriendRequests() {
  const { user } = useContext(AuthContext);

  const acceptRequest = async (friend) => {
    await firebase
      .firestore()
      .collection("users")
      .doc(friend.userId)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion(user.userId),
      });

    await firebase
      .firestore()
      .collection("users")
      .doc(user.userId)
      .update({
        friends: firebase.firestore.FieldValue.arrayUnion(friend.userId),
        friendRequests: firebase.firestore.FieldValue.arrayRemove(
          friend.userId
        ),
      });
  };

  if (!user) {
    return <div></div>;
  }

  return (
    <div>
      <div className="flex flex-col items-center h-screen">
        <h1 className="text-4xl text-headline">Friend Requests</h1>
        <div className="flex flex-col justify-center items-center flex-1">
          <div>
            {user.friendRequests.length
              ? "Add friends by pressing on their name!"
              : "You have currently no friend requests"}
          </div>
          {user.friendRequests.map((friend) => (
            <Button onClick={() => acceptRequest(friend)}>{friend.name}</Button>
          ))}
        </div>
      </div>
    </div>
  );
}
