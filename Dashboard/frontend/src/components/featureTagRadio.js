import { Radio, RadioGroup } from "rsuite";

const RadioLabel = ({ children }) => (
  <label style={{ padding: 7 }}>{children}</label>
);

//select feature tag radio component
const FeatureTagRadio = (props) => {
  const selectTag = (e) => {
    props.selectFeatureTag(e);
  };
  return (
    <>
      <RadioGroup
        className="hover:bg-gray-100 bg-white  justify-center"
        name="radioList"
        inline
        appearance="picker"
        value={props.value}
        onChange={selectTag}
      >
        <RadioLabel>Feature Tag: </RadioLabel>
        <Radio value="all">All</Radio>
        <Radio value="wireless plm">Wireless PLM</Radio>
        <Radio value="wireless tech debt">Wireless Tech Debt</Radio>
        <Radio value="wireless serviceability">Wireless Serviceability</Radio>
      </RadioGroup>
    </>
  );
};

export default FeatureTagRadio;
