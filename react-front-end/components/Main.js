import { useState, useEffect } from "react";
import useFirstRender from "../helpers/useFirstRender";
import LoadingSpinner from "./LoadingSpinner";
import DemoResult from "./DemoResult";
import Dropdown from "../components/Dropdown";
import dynamic from "next/dynamic";

export default function Main() {
  // Inputs states
  const [inputState, setInputState] = useState("");
  const [inputCompareState, setInputCompareState] = useState("");

  // Loading/Rendering states
  const [loadingState, setLoadingState] = useState(false);
  const [demoState, setDemoState] = useState(true);
  const firstRender = useFirstRender();

  // Visualization states
  const [graphDataState, setGraphDataState] = useState([]);
  const Chart = dynamic(import("../components/Chart"), { ssr: false });

  // Handle querying back-end
  const handleQuery = () => {
    setDemoState(false);
    setLoadingState(true);
    // Query data from back-end then setLoadingState to false
  };

  return (
    <div className="flex flex-col h-full w-1/2 row-span-5 items-center pt-8 gap-12 self-center">
      <div
        id="description"
        className="flex w-full justify-center text-3xl text-center"
      >
        Explore how socially responsible companies are
        <br />
        based on historical data and sentiment analysis
        <br />
        with the help of Machine Learning.
      </div>

      {/* Dropdown */}
      <div id="inputs-wrapper" className="w-full">
        <div id="input" className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span>Which company are you interested in?</span>
            <Dropdown inputHandler={setInputState} />
          </div>

          <div className="flex flex-col gap-2">
            <span> (Optional) Which other company do you want to compare?</span>
            <Dropdown inputHandler={setInputCompareState} />
          </div>
          <button
            className="w-1/6 p-2 bg-black rounded-sm text-white self-center hover:[opacity:0.5] transition-all"
            onClick={handleQuery}
          >
            Get ESG data
          </button>
        </div>
      </div>

      {/* <div id="results-wrapper" className="w-1/2">
        <div id="results" className="flex flex-col gap-2">
          <span>What our web scrapper found:</span>
          <div className="rounded-sm border-black border-2 p-2"></div>
        </div>
      </div> */}

      {demoState ? (
        <DemoResult />
      ) : loadingState ? (
        <LoadingSpinner />
      ) : (
        <div id="result-wrapper" className="w-full">
          <div id="visualization-wrapper" className="w-full">
            <span className="[font-weight:var(--extra-bold)] text-4xl">
              Visualization
            </span>
            {graphDataState.length != 0 ? (
              <Chart data={graphDataState} />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
