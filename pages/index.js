import Link from "next/link";

export default function IndexPage() {
  return (
    <div>
      <section>
        <div id="container" className="h-screen px-8">
          <div
            id="header"
            className="text-headline flex justify-end text-xl my-3"
          >
            <Link href="/login">
              <a>Login</a>
            </Link>
          </div>
          <div className="flex justify-center content-center  items-center">
            <div className="w-full lg:w-4/5 flex flex-col sm:flex-row">
              <div>
                <h1 className="text-headline text-5xl">
                  Welcome to Mind Merge!
                  {process.env.FIREBASE_PROJECT_ID}
                </h1>
                <h2 className="text-paragraph text-3xl md:w-3/5">
                  The game where you work together to merge your brains 🤯. Join
                  up with a friend, work your way to reach the same word and win
                  🚀!
                </h2>
              </div>
              <div className="flex flex-col h-full mt-5 bg-paragraph rounded p-3">
                <div className="flex flex-col">
                  <form className="flex flex-col text-stroke">
                    <input
                      placeholder="Email"
                      className="mt-3 p-2 rounded"
                      type="email"
                    ></input>
                    <input
                      placeholder="Password"
                      className="mt-3 p-2 rounded"
                      type="password"
                    ></input>
                    <input
                      placeholder="Repeat Password"
                      className="mt-3 p-2 rounded"
                      type="password"
                    ></input>
                    <button
                      className="bg-button text-buttonText p-3 mt-3 rounded"
                      type="submit"
                    >
                      Sign Up
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
