import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AuthContext } from "../_app";
import { firebase } from "../../firebase/index";

function Index() {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);

  const getIsUser1 = (users) => users.user1.userId === user.userId;

  useEffect(() => {
    if (user) {
      return firebase
        .firestore()
        .collection("chats")
        .where("userIds", "array-contains", user.userId)
        .onSnapshot((querySnapshot) => {
          const list = [];
          querySnapshot.forEach((doc) => {
            const { users } = doc.data();

            const isUser1 = getIsUser1(users);

            const friendName = isUser1 ? users.user2.name : users.user1.name;

            const friendEmail = isUser1 ? users.user2.email : users.user1.email;

            list.push({
              chatId: doc.id,
              friendName,
              friendEmail,
            });
          });
          setChats(list);
        });
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center py-8 flex-1">
      <h1 className="text-3xl text-headline">Chats</h1>
      {chats.map((chat) => (
        <Link
          href="/chats/[chatId]"
          as={`/chats/${chat.chatId}`}
          key={chat.chatId}
        >
          <a className="w-48 bg-paragrah border-highlight border-2 border-solid rounded text-center p-2 mt-3">
            <div className="flex">
              <div className="flex flex-col flex-1">
                <div className="text-white">{`${chat.friendName}`}</div>
                <div className="text-xs">{`${chat.friendEmail || ""}`}</div>
              </div>
            </div>
          </a>
        </Link>
      ))}
      <Link href="/chats/startChat" as="start-chat">
        <a className="bg-button text-buttonText text-center p-3 mt-3 mb-12 w-48 rounded">
          Start new chat
        </a>
      </Link>
    </div>
  );
}

export default Index;
