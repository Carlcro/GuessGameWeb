import Document, { Html, Head, Main, NextScript } from "next/document";

const APP_NAME = "next-pwa example";
const APP_DESCRIPTION = "This is an example of using next-pwa plugin";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#232946" />
          <meta name="apple-mobile-web-app-title" content="Mind Merge" />
          <meta name="application-name" content="Mind Merge" />
          <meta name="msapplication-TileColor" content="#232946" />
          <meta name="theme-color" content="#232946" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
