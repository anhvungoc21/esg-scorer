import Head from "next/head";
import NavBar from "../components/NavBar";
import Main from "../components/Main";

export default function MyApp() {
  return (
    <div className="flex flex-col w-screen bg-white [font-weight:var(--normal)] overflow-y-scroll scrollbar-hide pb-8">
      <Head>
        <title>ESG Scorer</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NavBar />
      <Main />
    </div>
  );
}
