import { Radio, RadioGroup } from "rsuite";

const RadioLabel = ({ children }) => (
  <label style={{ padding: 7 }}>{children}</label>
);

//select feature tag radio component
const ActiveFeatureTypeRadio = (props) => {
  const selectType = (e) => {
    props.selectFeatureType(e);
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
        <RadioLabel>Field: </RadioLabel>
        <Radio value="all">All</Radio>
        <Radio value="dev">Only as Dev</Radio>
        <Radio value="test">Only as Test</Radio>
        <Radio value="combined">Combined</Radio>
      </RadioGroup>
    </>
  );
};

export default ActiveFeatureTypeRadio;
