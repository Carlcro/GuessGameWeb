import React, { useContext, useState } from "react";
import { AuthContext } from "./_app";
import { firebase } from "../firebase/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
  const { user } = useContext(AuthContext);

  const [openConfirmBox, setOpenConfirmBox] = useState(null);

  const removeFriend = async (friend) => {
    await firebase
      .firestore()
      .collection("users")
      .doc(user.userId)
      .update({
        friends: firebase.firestore.FieldValue.arrayRemove(friend.userId),
      });
  };

  const ConfirmBox = ({ friend }) => (
    <div className="text-lg flex">
      <span>Remove?</span>
      <div
        className="ml-2 cursor-pointer text-headline hover:opacity-75"
        onClick={() => removeFriend(friend)}
      >
        Yes
      </div>
      <div
        className="ml-4 cursor-pointer text-headline  hover:opacity-75"
        onClick={() => setOpenConfirmBox(null)}
      >
        No
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full justify-center items-center px-12 ">
      <div className="max-w-sm w-full">
        <h1 className="text-3xl text-headline text-center">Profile</h1>
        <div className="flex justify-between w-full">
          <div>
            <h2 className="text-2xl text-headline">Name</h2>
            <div className="text-xl">{user.name}</div>
          </div>
          <div>
            <h2 className="text-2xl text-headline">Friends</h2>
            <ul>
              {user.friends.map((friend) => (
                <li className="flex text-xl" key={friend.userId}>
                  {openConfirmBox === friend.userId ? (
                    <ConfirmBox friend={friend.userId} />
                  ) : (
                    <div className="flex">
                      <FontAwesomeIcon
                        className=" mr-3 cursor-pointer text-headline"
                        onClick={() => setOpenConfirmBox(friend.userId)}
                        size="sm"
                        icon={faTimes}
                      />
                      <div>{friend.name}</div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
