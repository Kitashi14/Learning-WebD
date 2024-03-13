import { Radio, RadioGroup } from "rsuite";

const RadioLabel = ({ children }) => (
  <label style={{ padding: 7 }}>{children}</label>
);

//select feature tag radio component
const DevMetricsCategoryRadio = (props) => {
  const selectCategory = (e) => {
    props.selectBugCategory(e);
  };
  return (
    <>
      <RadioGroup
        className="hover:bg-gray-100 bg-white  justify-center"
        name="radioList"
        inline
        appearance="picker"
        value={props.value}
        onChange={selectCategory}
      >
        <RadioLabel>Category: </RadioLabel>
        <Radio value="all">All</Radio>
        <Radio value="IFD">IFD</Radio>
        <Radio value="CFD">CFD</Radio>
      </RadioGroup>
    </>
  );
};

export default DevMetricsCategoryRadio;
