import "../styles/globals.css";
import Header from "@components/Header";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import store from "../app/store";
import Head from "next/head";
import Loading from "@components/Loading";
import RouteGuard from "@features/routeGuard/RouteGuard";
import PingServer from "@features/pingServer/PingServer";
import Footer from "@components/Footer";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>Resource-based Checklist Generation</title>
      </Head>
      <div className="flex flex-col min-h-screen justify-between">
        <Header />
        <div className="mb-auto lg:px-32 px-8 py-4">
          <RouteGuard>
            <Component {...pageProps} />
          </RouteGuard>
        </div>
        <Footer />
      </div>
      <PingServer />
      <Loading />
    </Provider>
  );
}

export default MyApp;
