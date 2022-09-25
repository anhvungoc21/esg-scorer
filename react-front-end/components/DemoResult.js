import Chart from "./Chart";

const demoData = [
  {
    companyName: "Company A",
    soc: 8,
    gov: 9,
    env: 10,
  },
  {
    companyName: "Company B",
    soc: 5,
    gov: 8,
    env: 7,
  },
];

export default function DemoResult() {
  return (
    <div id="result-wrapper" className="flex flex-col w-full gap-16">
      <div id="results" className="w-full">
        <span className="[font-weight:var(--extra-bold)] text-4xl">
          Results
        </span>
      </div>
      <div id="visualization-wrapper" className="w-full">
        <span className="[font-weight:var(--extra-bold)] text-4xl">
          Visualization
        </span>
        <Chart data={demoData} />
      </div>
    </div>
  );
}
