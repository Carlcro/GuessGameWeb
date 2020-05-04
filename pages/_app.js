import "../styles/index.css";
import React, { useEffect, useState } from "react";
import { firebase } from "../firebase/index";

export const AuthContext = React.createContext(null);

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  function onAuthStateChanged(result) {
    if (result) {
      return firebase
        .firestore()
        .collection("users")
        .doc(result.uid)
        .onSnapshot((querySnapshot) => {
          const {
            name,
            email,
            userId,
            friends,
            friendRequests,
          } = querySnapshot.data();

          Promise.all([getUserInfo(friends), getUserInfo(friendRequests)]).then(
            ([friendsData, friendsRequestData]) =>
              setUser({
                name,
                email,
                userId,
                friends: friendsData,
                friendRequests: friendsRequestData,
              })
          );
        });
    }
  }
  useEffect(() => {
    const authSubscriber = firebase
      .auth()
      .onAuthStateChanged(onAuthStateChanged);

    // unsubscribe on unmount
    return authSubscriber;
  }, []);

  return (
    <AuthContext.Provider value={user}>
      <Component {...pageProps} />
    </AuthContext.Provider>
  );
}

function getUserInfo(allUsers) {
  const split = splitArray(allUsers);

  return Promise.all(
    split.map((users) => {
      const usersArray = [];
      return users.length
        ? firebase
            .firestore()
            .collection("users")
            .where(firebase.firestore.FieldPath.documentId(), "in", users)
            .get()
            .then((data) => {
              data.forEach((user) => {
                const { name, userId } = user.data();
                usersArray.push({ name, userId });
              });
              return Promise.resolve(usersArray);
            })
            .then((data) => Promise.resolve(data))
        : Promise.resolve(usersArray);
    })
  ).then((values) => Promise.resolve(values.flat()));
}

function splitArray(longArray) {
  var perChunk = 10; // items per chunk

  var result = longArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);

  return result;
}

export default MyApp;
