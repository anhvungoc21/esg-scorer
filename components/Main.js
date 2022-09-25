import { useState, useEffect, useMemo, useRef } from "react";
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

  // Automatically scroll to bottom
  const endRef = useRef(null);
  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when new proofs manifest
  useEffect(() => {
    if (!loadingState) return;
    scrollToBottom();
  }, [loadingState]);

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

  if (modeState) {
    return (
      <div className="flex flex-col h-full w-1/2 items-center pt-8 gap-12 self-center">
        <div
          id="description"
          className="w-full justify-center text-3xl text-center"
        >
          Explore how{" "}
          <span className="[font-weight:var(--extra-bold)]">
            socially responsible
          </span>{" "}
          companies are based on{" "}
          <span className="[font-weight:var(--extra-bold)]">
            sentiment analysis
          </span>{" "}
          with historical data using{" "}
          <span className="[font-weight:var(--extra-bold)]">
            Machine Learning
          </span>
          .
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
          <div id="result-wrapper" className="flex flex-col w-full gap-8">
            <div id="results" className="flex flex-col gap-2">
              <span className="[font-weight:var(--extra-bold)] text-4xl">
                Scores
              </span>
              <div className="w-full grid grid-rows-3 rounded-sm border-black border-2 p-1">
                <div
                  id="score-category"
                  className="grid row-span-1 grid-cols-4 [font-weight:var(--extra-bold)] p-1"
                >
                  <div className="flex items-center justify-center">
                    Company
                  </div>
                  <div className="flex items-center justify-center">
                    Environmental
                  </div>
                  <div className="flex items-center justify-center">Social</div>
                  <div className="flex items-center justify-center">
                    Governance
                  </div>
                </div>
                {graphDataState.map((obj, i) => (
                  <div
                    id="score"
                    className="grid row-span-1 grid-cols-4"
                    key={`score-row-${i}`}
                  >
                    <div className="flex items-center justify-center">
                      {obj.companyName}
                    </div>
                    <div className="flex items-center justify-center">
                      {obj.env}
                    </div>
                    <div className="flex items-center justify-center">
                      {obj.soc}
                    </div>
                    <div className="flex items-center justify-center">
                      {obj.gov}
                    </div>
                  </div>
                ))}
              </div>
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
          className="w-full justify-center text-3xl text-center"
        >
          Explore how{" "}
          <span className="[font-weight:var(--extra-bold)]">
            socially responsible
          </span>{" "}
          companies are based on{" "}
          <span className="[font-weight:var(--extra-bold)]">
            sentiment analysis
          </span>{" "}
          with historical data using{" "}
          <span className="[font-weight:var(--extra-bold)]">
            Machine Learning
          </span>
          .
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

        <div id="result-wrapper" className="flex flex-col w-full gap-2">
          <span className="[font-weight:var(--extra-bold)] text-4xl">
            Scores
          </span>
          <div className="w-full grid grid-rows-3 rounded-sm border-black border-2 p-1">
            <div
              id="score-category"
              className="grid row-span-1 grid-cols-4 [font-weight:var(--extra-bold)] p-1"
            >
              <div className="flex items-center justify-center">Overall</div>
              <div className="flex items-center justify-center">
                Environmental
              </div>
              <div className="flex items-center justify-center">Social</div>
              <div className="flex items-center justify-center">Governance</div>
            </div>
            <div id="score" className="grid row-span-1 grid-cols-4">
              <div className="flex items-center justify-center">
                {textResultState.total}
              </div>
              <div className="flex items-center justify-center">
                {textResultState.env}
              </div>
              <div className="flex items-center justify-center">
                {textResultState.soc}
              </div>
              <div className="flex items-center justify-center">
                {textResultState.gov}
              </div>
            </div>
          </div>
        </div>

        <div ref={endRef} />
      </div>
    );
  }
}