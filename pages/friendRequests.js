import React, { useContext } from "react";
import { AuthContext } from "./_app";
import Button from "../components/button";
import { firebase } from "../firebase/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";

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

  const declineRequest = async (friend) => {
    firebase
      .firestore()
      .collection("users")
      .doc(user.userId)
      .update({
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
            {!user.friendRequests.length &&
              "You have currently no friend requests"}
          </div>
          {user.friendRequests.map((friend) => (
            <div className="flex">
              <div className="text-3xl mr-3 text-headline">{friend.name}</div>
              <FontAwesomeIcon
                className=" mr-3 cursor-pointer text-green-500 pt-1"
                onClick={() => acceptRequest(friend)}
                size="2x"
                icon={faCheck}
              />
              <FontAwesomeIcon
                className="cursor-pointer text-red-500 pt-1"
                onClick={() => declineRequest(friend)}
                size="2x"
                icon={faTimes}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
