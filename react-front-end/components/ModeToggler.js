export default function ModeToggler({ modeState, setModeState }) {
  return (
    <div className="flex bg-black items-center border-black border-2">
      <button
        id="mode-1"
        className={`flex h-full w-1/2 p-4 text-black bg-white hover:[opacity:0.5] transition-all ${
          modeState ? "active-mode" : ""
        }`}
        onClick={() => setModeState(true)}
      >
        Examine companies' ESG score based on historical data?
      </button>
      <button
        id="mode-2"
        className={`flex h-full w-1/2 p-4 text-black bg-white hover:[opacity:0.5] transition-all ${
          modeState ? "" : "active-mode"
        }`}
        onClick={() => setModeState(false)}
      >
        Analyze an ESG score of a text snippet?
      </button>
    </div>
  );
}
