import NavBar from "../components/NavBar";
import Head from "next/head";

export default function Documentation() {
  return (
    <div className="flex flex-col h-screen w-screen bg-white">
      <Head>
        <title>How to use</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NavBar />
      <div
        id="documentation-main"
        className="flex flex-col h-full w-1/2 items-center pt-8 gap-12 self-center"
      >
        <div id="how-to" className="flex">
          <span> </span>
          <div id="model-1">
            <span className=""></span>
          </div>
        </div>
      </div>
    </div>
  );
}
