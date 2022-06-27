import "../styles/globals.css";
import Header from "@components/Header";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../app/store";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>Resource-based Checklist Generation</title>
      </Head>
      <div className="select-none">
        <Header />
        <div className="lg:px-32 px-8 py-4">
          <Component {...pageProps} />
        </div>
      </div>
    </Provider>
  );
}

export default MyApp;
