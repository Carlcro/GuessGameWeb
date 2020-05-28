import "../styles/index.css";
import React, { useEffect, useState } from "react";
import { firebase, auth } from "../firebase/index";
import { useRouter } from "next/router";
import * as Sentry from "@sentry/browser";
import Nav from "../components/nav";

Sentry.init({
  dsn:
    "https://1c97145d29324ee1949710bc94a1075f@o390538.ingest.sentry.io/5234007",
});

export const AuthContext = React.createContext(null);

function MyApp({ Component, pageProps }) {
  const [authUser, setAuthUser] = useState(null);
  const [user, setUser] = useState(null);

  const router = useRouter();

  function onAuthStateChanged(result) {
    setAuthUser(result);
  }

  useEffect(() => {
    if (authUser) {
      router.push("/home");
      return firebase
        .firestore()
        .collection("users")
        .doc(authUser.uid)
        .onSnapshot((querySnapshot) => {
          if (querySnapshot.exists) {
            const {
              name,
              email,
              userId,
              friends,
              friendRequests,
            } = querySnapshot.data();
            Promise.all([
              getUserInfo(friends),
              getUserInfo(friendRequests),
            ]).then(([friendsData, friendsRequestData]) =>
              setUser({
                name,
                email,
                userId,
                friends: friendsData,
                friendRequests: friendsRequestData,
                emailVerified:
                  process.env.NODE_ENV === "production"
                    ? authUser.emailVerified
                    : true,
              })
            );
          }
        });
    } else {
      setUser(null);
      router.push("/");
    }
  }, [authUser]);

  useEffect(() => {
    const authSubscriber = firebase
      .auth()
      .onAuthStateChanged(onAuthStateChanged);

    // unsubscribe on unmount
    return authSubscriber;
  }, []);

  const logout = async () => {
    await auth.signOut();
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      <div className="flex flex-col min-h-screen ">
        <Nav></Nav>
        <Component {...pageProps} />
      </div>
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
                const { name, email, userId } = user.data();
                usersArray.push({ name, userId, email });
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
