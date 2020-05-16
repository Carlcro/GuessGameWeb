import Link from "next/link";
import { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../pages/_app";

export default function Nav() {
  const { user, logout } = useContext(AuthContext);

  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-1 navbar-expand-lg bg-background">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between md:w-auto md:static md:block md:justify-start">
            <Link href={user ? "/home" : "/"}>
              <a className="text-xl font-bold leading-relaxed inline-block mr-4 py-2 whitespace-no-wrap text-white">
                Mind Merge
              </a>
            </Link>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block md:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <FontAwesomeIcon size="xs" icon={faBars} />
            </button>
          </div>
          <div
            className={
              "md:flex flex-grow justify-end items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            {user ? (
              <ul className="flex flex-col md:flex-row list-none md:ml-auto">
                <li className="nav-item">
                  <Link href="/history">
                    <a className="px-3 py-2 flex items-center text-lg font-bold leading-snug text-white hover:opacity-75">
                      <span className="ml-2">History</span>
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/rules">
                    <a className="px-3 py-2 flex items-center text-lg font-bold leading-snug text-white hover:opacity-75">
                      <span className="ml-2">Rules</span>
                    </a>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/addFriends" as="add-friends">
                    <a className="px-3 py-2 flex items-center text-lg font-bold leading-snug text-white hover:opacity-75">
                      <span className="ml-2">Add Friends</span>
                    </a>
                  </Link>
                </li>
                {user.friendRequests.length > 0 && (
                  <li className="nav-item">
                    <Link href="/friendRequests" as="friend-requests">
                      <a className="px-3 py-2 flex items-center text-lg font-bold leading-snug text-white hover:opacity-75">
                        <span className="ml-2">Friend Requests</span>
                      </a>
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className="px-3 py-2 flex items-center text-lg ml-2 font-bold leading-snug text-white hover:opacity-75"
                    type="button"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            ) : (
              <Link href="/login">
                <a className="px-3 py-2 flex items-center text-lg font-bold leading-snug text-white hover:opacity-75">
                  Log in
                </a>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
