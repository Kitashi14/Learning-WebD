import { useContext } from "react";
import { Radio, RadioGroup } from "rsuite";
import DataContext from "../context/dataContext";

const RadioLabel = ({ children }) => (
  <label style={{ padding: 7 }}>{children}</label>
);

//select feature tag radio component
const DevMetricsSegmentTypeRadio = (props) => {
  const segmentMap = props.data;
  const segmentFullNameMap = [];
  segmentMap.forEach((v, k) => {
    if (k != "custom") segmentFullNameMap.push([k, v]);
  });
  if (props.type === "dev") segmentFullNameMap.reverse();

  const contextData = useContext(DataContext);
  const selectType = (e) => {
    props.selectSegment(e == null ? "annual" : e);
  };

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
        {props.type === "dev"
          ? segmentFullNameMap.map((e) => (
              <>
                <Radio value={e[0]}>
                  <span className="flex flex-col justify-center items-center">
                    <span>
                      {" "}
                      {contextData.devMetricsTable[e[0]]["lower limit"]}
                      {" to "}
                    </span>
                    <span>
                      {contextData.devMetricsTable[e[0]]["upper limit"]}
                    </span>
                    <span>
                      {" "}
                      {"("}
                      {e[1]}
                      {")"}
                    </span>
                  </span>
                </Radio>
              </>
            ))
          : segmentFullNameMap.map((e) => (
              <>
                <Radio value={e[0]}>
                  <span className=" space-x-2 justify-center items-center">
                    {contextData.locTable.dates[e[0]]["lower limit"]}
                    {" to "}
                    {contextData.locTable.dates[e[0]]["upper limit"]} {"("}
                    {e[1]}
                    {")"}
                  </span>
                </Radio>
              </>
            ))}
      </RadioGroup>
    </>
  );
};

export default DevMetricsSegmentTypeRadio;
