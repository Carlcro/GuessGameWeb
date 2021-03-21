import { useRouter } from "next/router";
import React, { useContext, useEffect, useState, useRef } from "react";
import { firebase } from "../../firebase/index";
import { AuthContext } from "../_app";

function ChatScreen() {
  const { user } = useContext(AuthContext);
  const isOwnMessage = (id) => id === user.userId;

  const router = useRouter();
  const { chatId } = router.query;

  const container = useRef(null);

  useEffect(() => {
    if (chatId) {
      return firebase
        .firestore()
        .collection("chats")
        .doc(chatId)
        .onSnapshot((doc) => {
          if (doc.exists) {
            const { messages, users } = doc.data();

            const friend =
              users.user1.userId === user.userId ? users.user2 : users.user1;

            setFriend(friend);
            setChat(messages);

            container.current.scrollTo(0, document.body.scrollHeight);
          }
        });
    }
  }, [chatId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log(chatInput);

    await firebase
      .firestore()
      .collection("chats")
      .doc(chatId)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          content: chatInput,
          userId: user.userId,
          sentAt: firebase.firestore.Timestamp.now(),
        }),
      });
    setChatInput("");
  };
  const [chatInput, setChatInput] = useState("");
  const [chatData, setChat] = useState([]);
  const [friend, setFriend] = useState({ name: "" });
  return (
    <div className="flex flex-col max-h-screen justify-between items-center py-8 flex-1">
      <h1 className="text-3xl text-headline">{friend.name}</h1>
      <div
        className="flex flex-col w-2/3 lg:w-48  overflow-scroll text-white"
        ref={container}
        style={{ height: "65vh" }}
      >
        {chatData.map((message) => {
          const side = isOwnMessage(message.userId) ? "self-end" : "self-start";
          const bgColor = isOwnMessage(message.userId)
            ? "bg-paragraph"
            : "bg-button";
          return (
            <div
              key={message.id}
              className={`${side} ${bgColor} py-3 px-5 rounded-full mb-2`}
            >
              {message.content}
            </div>
          );
        })}
      </div>
      <form className="flex flex-col" onSubmit={sendMessage}>
        <input
          className="mt-3 p-2 rounded text-stroke w-48"
          value={chatInput}
          onChange={({ target }) => setChatInput(target.value)}
          type="text"
        ></input>
        <input
          className="bg-button text-buttonText p-3 mt-3 w-48 rounded text-sm"
          type="submit"
          value="Send"
        />
      </form>
    </div>
  );
}

export default ChatScreen;
