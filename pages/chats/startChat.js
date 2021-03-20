import { useRouter } from "next/router";
import React, { useContext } from "react";
import { AuthContext } from "../_app";
import { firebase } from "../../firebase/index";

function NewChatScreen() {
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const startNewChat = async (friend) => {
    const user1 = { userId: user.userId, name: user.name, email: user.email };
    const user2 = { ...friend };

    const newChat = {
      userIds: [user1.userId, user2.userId],
      users: {
        user1,
        user2,
      },
      messages: [],

      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const chatId = await firebase.firestore().collection("chats").add(newChat);

    router.push(`/chats/[chatId]`, `/chats/${chatId.id}`);
  };

  return (
    <div className="flex flex-col items-center">
      {user &&
        user.friends.map((friend) => (
          <button
            onClick={() => startNewChat(friend)}
            className="w-48 bg-paragrah border-highlight border-2 border-solid rounded text-center p-2 mt-3"
            key={friend.userId}
          >
            <div className="flex">
              <div className="flex flex-col flex-1">
                <div className="text-white">{`${friend.name}`}</div>
                <div className="text-xs">{`${friend.email || ""}`}</div>
              </div>
            </div>
          </button>
        ))}
    </div>
  );
}

export default NewChatScreen;
