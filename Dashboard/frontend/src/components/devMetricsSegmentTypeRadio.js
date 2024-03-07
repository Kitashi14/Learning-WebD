import { useContext } from "react";
import { Radio, RadioGroup, SelectPicker } from "rsuite";
import DataContext from "../context/dataContext";

const RadioLabel = ({ children }) => (
  <label style={{ padding: 7 }}>{children}</label>
);

//select feature tag radio component
const DevMetricsSegmentTypeRadio = (props) => {
  const segmentFullNameMap = [
    ["week-0", "Current Week"],
    ["week-1", "Week 1"],
    ["week-2", "Week 2"],
    ["week-3", "Week 3"],
    ["week-4", "Week 4"],
    ["quarter", "Quarterly"],
    ["semi", "Semi Annually"],
    ["annual", "Annually"],
  ];
  segmentFullNameMap.reverse();

  const contextData = useContext(DataContext);
  const selectType = (e) => {
    props.selectBugSegment(e == null ? "annual" : e);
  };

  const data = segmentFullNameMap.map((e) => ({
    label:
      contextData.devMetricsTable[e[0]]["lower limit df"] +
      " - " +
      contextData.devMetricsTable[e[0]]["upper limit df"] +
      " (" +
      e[1] +
      ")",
    value: e[0],
  }));

  console.log(data);

  return (
    <>
      <RadioGroup
        className="hover:bg-gray-100 bg-white  justify-center"
        name="radioList"
        inline
        appearance="picker"
        value={props.value}
        onChange={selectType}
      >
        <RadioLabel>Segment: </RadioLabel>
        {/* <Radio value="annual">Annually</Radio>
        <Radio value="semi">Semi Annually</Radio>
        <Radio value="quarter">Quarterly</Radio>
        <Radio value="week-4">Week 4</Radio>
        <Radio value="week-3">Week 3</Radio>
        <Radio value="week-2">Week 2</Radio>
        <Radio value="week-1">Week 1</Radio>
        <Radio value="week-0">Current Week</Radio> */}
        {segmentFullNameMap.map((e) => (
          <>
            <Radio value={e[0]}>
              <span className="flex flex-col justify-center items-center">
                <span>
                  {" "}
                  {contextData.devMetricsTable[e[0]]["lower limit"]}
                  {" to "}
                </span>
                <span>{contextData.devMetricsTable[e[0]]["upper limit"]}</span>
                <span>
                  {" "}
                  {"("}
                  {e[1]}
                  {")"}
                </span>
              </span>
            </Radio>
          </>
        ))}
      </RadioGroup>
      {/* <SelectPicker
        className="w-fit px-4 z-40"
        label="Segment"
        data={data}
        onChange={selectType}
        value={props.value}
      /> */}
    </>
  );
};

export default DevMetricsSegmentTypeRadio;
