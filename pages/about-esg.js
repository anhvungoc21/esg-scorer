import NavBar from "../components/NavBar";
import Head from "next/head";

export default function HowToUse() {
  return (
    <div className="h-screen w-screen grid grid-rows-6 bg-white">
      <Head>
        <title>About ESG</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NavBar />
      AboutESG
    </div>
  );
}
