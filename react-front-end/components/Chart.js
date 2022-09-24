import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Format for a single data entry
// Data from the backend should be JSON of multiple entries
const dataEntryFormat = {
  companyName: "",
  soc: 0,
  gov: 0,
  env: 0,
};

// Returns a well-formatted array of objects for graphing
const parseGraphData = (data) => {
  // Input array length 1
  if (data.length == 1) {
    const thisObj = data[0];
    return [
      {
        criteria: "Social",
        mark_1: thisObj.soc,
        fullMark: 10,
      },
      {
        criteria: "Governance",
        mark_1: thisObj.gov,
        fullMark: 10,
      },
      {
        criteria: "Environment",
        mark_1: thisObj.env,
        fullMark: 10,
      },
    ];

    // Input array length 2
  } else if (data.length == 2) {
    const [obj1, obj2] = data;
    return [
      {
        criteria: "Social",
        mark_1: obj1.soc,
        mark_2: obj2.soc,
        fullMark: 10,
      },
      {
        criteria: "Governance",
        mark_1: obj1.gov,
        mark_2: obj2.gov,
        fullMark: 10,
      },
      {
        criteria: "Environment",
        mark_1: obj1.env,
        mark_2: obj2.env,
        fullMark: 10,
      },
    ];
    // Invalid input
  } else {
    return [];
  }
};

// 90 730 250
export default function Chart({ data }) {
  if (!data) return null;

  const colors = ["#8884d8", "#82ca9d"];
  const parsedData = parseGraphData(data);
  console.log(parsedData);

  return parsedData.length != 0 ? (
    <ResponsiveContainer width="100%" height={400}>
      <RadarChart
        outerRadius={135}
        width={1095}
        height={400}
        cx="50%"
        data={parsedData}
      >
        <PolarGrid />
        <PolarAngleAxis dataKey="criteria" />
        <PolarRadiusAxis angle={30} domain={[0, 10]} />
        {data.map((e, i) => {
          return (
            <Radar
              key={`radar-${i}`}
              name={e.companyName}
              dataKey={`mark_${i + 1}`}
              stroke={colors[i]}
              fill={colors[i]}
              fillOpacity={0.8}
            ></Radar>
          );
        })}
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  ) : null;
}
