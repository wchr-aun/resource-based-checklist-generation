import "../styles/globals.css";
import Header from "../components/header";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Header />
      <div className="lg:px-32 px-8 py-8">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
