import { useState, useEffect, useMemo } from "react";
import useFirstRender from "../helpers/useFirstRender";
import LoadingSpinner from "./LoadingSpinner";
import DemoResult from "./DemoResult";
import Dropdown from "./Dropdown";
import ModeToggler from "./ModeToggler";
import dynamic from "next/dynamic";

export default function Main() {
  // State for rendering the two functionalities
  const [modeState, setModeState] = useState(true);

  // Inputs states
  const [inputState, setInputState] = useState("");
  const [inputCompareState, setInputCompareState] = useState("");
  const [textInputState, setTextInputState] = useState("");

  // Loading/Rendering states
  const [loadingState, setLoadingState] = useState(false);
  const [demoState, setDemoState] = useState(true);
  const [loadingTextState, setLoadingTextState] = useState(false);
  // const firstRender = useFirstRender();

  // Visualization states
  const [graphDataState, setGraphDataState] = useState([]);
  const Chart = useMemo(
    () => dynamic(import("./Chart"), { ssr: false }),
    [graphDataState]
  );

  // Text visualization states
  const [wordDictState, setWordDictState] = useState({});
  const [textResultState, setTextResultState] = useState([]);

  // Handle querying back-end for model 1
  const handleQuery = () => {
    if (inputState == "") return;

    setGraphDataState([]);
    setDemoState(false);
    setLoadingState(true);
  };

  const handleQueryText = () => {
    if (textInputState == "") return;

    setLoadingTextState(true);
  };

  useEffect(() => {
    if (!loadingState) return;
    (async () => {
      setLoadingState(false);
      let res;
      if (inputState != "" && inputCompareState != "") {
        res = await fetch(
          `http://127.0.0.1:5000/get-dow-30?ticker1=${inputState}&ticker2=${inputCompareState}`,
          {
            method: "GET",
          }
        );
      } else {
        res = await fetch(
          `http://127.0.0.1:5000/get-dow-30?ticker1=${inputState}`,
          {
            method: "GET",
          }
        );
      }

      const dataArr = await res.json();
      if (!dataArr) return;
      setGraphDataState(dataArr);
    })();
  }, [loadingState]);

  useEffect(() => {
    if (!loadingTextState) return;
    (async () => {
      setLoadingTextState(false);
      const res = await fetch(`http://127.0.0.1:5000/get-esg-visual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(textInputState),
      });

      const data = await res.json();
      if (!data) return;
      setTextResultState([data.total, data.gov, data.env, data.soc]);
      setWordDictState(data.dict);
    })();
  }, [loadingTextState]);

  console.log(textResultState);
  console.log(wordDictState);

  if (modeState) {
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

        <div id="mode-toggler-wrapper" className="w-full">
          <div className="flex flex-col gap-2">
            <span>Do you want to...</span>
            <ModeToggler modeState={modeState} setModeState={setModeState} />
          </div>
        </div>

        <div id="inputs-wrapper" className="w-full">
          <div id="input" className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span>Which company are you interested in?</span>
              <Dropdown inputHandler={setInputState} />
            </div>

            <div className="flex flex-col gap-2">
              <span>
                (Optional) Which other company do you want to compare?
              </span>
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

        {demoState ? (
          <DemoResult />
        ) : loadingState ? (
          <LoadingSpinner />
        ) : (
          <div id="result-wrapper" className="w-full">
            <div id="results" className="flex flex-col gap-2">
              <span> </span>
              <div className="rounded-sm border-black border-2 p-2"></div>
            </div>

            <div id="visualization-wrapper" className="w-full">
              <span className="[font-weight:var(--extra-bold)] text-4xl">
                ESG Visualization
              </span>
              {graphDataState.length != 0 ? (
                <Chart data={graphDataState} />
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  } else {
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

        <div id="mode-toggler-wrapper" className="w-full">
          <div className="flex flex-col gap-2">
            <span>Do you want to...</span>
            <ModeToggler modeState={modeState} setModeState={setModeState} />
          </div>
        </div>

        <div id="input-wrapper" className="w-full">
          <div id="input" className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span>Enter text to be ESG-analyzed:</span>
              <span
                id="text-input"
                className="border-black rounded-sm border-2 p-2"
                spellCheck="false"
                contentEditable
                onInput={(e) => setTextInputState(e.target.innerText)}
              ></span>
            </div>

            <button
              className="w-1/6 p-2 bg-black rounded-sm text-white self-center hover:[opacity:0.5] transition-all"
              onClick={handleQueryText}
            >
              Analyze ESG
            </button>
          </div>
        </div>
      </div>
    );
  }
}
