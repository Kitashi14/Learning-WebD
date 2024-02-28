import { Radio, RadioGroup } from "rsuite";

const RadioLabel = ({ children }) => (
  <label style={{ padding: 7 }}>{children}</label>
);

//select feature tag radio component
const DevMetricsSegmentTypeRadio = (props) => {
  const selectType = (e) => {
    props.selectBugSegment(e);
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
        <Radio value="annual">Annually</Radio>
        <Radio value="semi">Semi Annually</Radio>
        <Radio value="quarter">Quarterly</Radio>
        <Radio value="week-4">Week 4</Radio>
        <Radio value="week-3">Week 3</Radio>
        <Radio value="week-2">Week 2</Radio>
        <Radio value="week-1">Week 1</Radio>
        <Radio value="week-0">Current Week</Radio>
      </RadioGroup>
    </>
  );
};

export default DevMetricsSegmentTypeRadio;
