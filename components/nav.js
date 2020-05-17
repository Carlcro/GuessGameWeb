import Link from "next/link";
import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../pages/_app";
import { useRouter } from "next/router";

export default function Nav() {
  const { user, logout } = useContext(AuthContext);
  const router = useRouter();

  const [navbarOpen, setNavbarOpen] = useState(false);

  const handleRouteClick = (route) => {
    router.push(route);
    setNavbarOpen(false);
  };

  const handleLogout = () => {
    logout();
    setNavbarOpen(false);
  };

  return (
    <>
      <nav className="md:static flex flex-wrap items-center justify-between px-2 py-1 navbar-expand-lg bg-background">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between relative">
          <div className="w-full relative flex justify-between md:w-auto md:static md:block md:justify-start">
            <button
              onClick={() => handleRouteClick(user ? "/home" : "/")}
              className="text-xl font-bold leading-relaxed inline-block mr-4 py-2 whitespace-no-wrap text-white hover:opacity-75"
            >
              Mind Merge
            </button>
            {user ? (
              <button
                className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block md:hidden outline-none focus:outline-none"
                type="button"
                onClick={() => setNavbarOpen(!navbarOpen)}
              >
                <FontAwesomeIcon size="md" icon={faBars} />
              </button>
            ) : (
              <button
                onClick={() => handleRouteClick("/login")}
                className="px-3 py-2 flex items-center text-md font-bold leading-snug text-white hover:opacity-75 md:hidden"
              >
                Log in
              </button>
            )}
          </div>
          <div
            style={navbarOpen ? { top: 40, right: 1 } : {}}
            className={
              "bg-background  md:flex flex-grow justify-end items-center absolute md:static" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            {user ? (
              <ul className="flex flex-col md:flex-row list-none md:ml-auto">
                <li className="nav-item">
                  <button
                    onClick={() => handleRouteClick("/rules")}
                    className="px-3 py-2 flex items-center text-md font-bold leading-snug text-white hover:opacity-75"
                  >
                    <span className="ml-2">Rules</span>
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    onClick={() => handleRouteClick("/addFriends")}
                    className="px-3 py-2 flex items-center text-md font-bold leading-snug text-white hover:opacity-75"
                  >
                    <span className="ml-2">Add Friends</span>
                  </button>
                </li>
                {user.friendRequests.length > 0 && (
                  <li className="nav-item">
                    <button
                      onClick={() => handleRouteClick("/friendRequests")}
                      className="px-3 py-2 flex items-center text-md font-bold leading-snug text-white hover:opacity-75"
                    >
                      <span className="ml-2">Friend Requests</span>
                    </button>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className="px-3 py-2 flex items-center text-md ml-2 font-bold leading-snug text-white hover:opacity-75"
                    type="button"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            ) : (
              <button
                onClick={() => handleRouteClick("/login")}
                className="px-3 py-2 flex items-center text-md font-bold leading-snug text-white hover:opacity-75"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
