import { Radio, RadioGroup } from "rsuite";

const RadioLabel = ({ children }) => (
  <label style={{ padding: 7 }}>{children}</label>
);

//select feature tag radio component
const DevMetricsTypeRadio = (props) => {
  const selectType = (e) => {
    props.selectBugType(e);
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
        <RadioLabel>State: </RadioLabel>
        <Radio value="all">All</Radio>
        <Radio value="N">N</Radio>
        <Radio value="OAI">OAI</Radio>
        <Radio value="RMV">RMV</Radio>
        <Radio value="JDCU">JDCU</Radio>
        {(props.value.length === 1) && (props.value!=="N") ? (
          <>
            <Radio value={props.value}>{`Only ${props.value}`}</Radio>
          </>
        ) : (
          <></>
        )}
      </RadioGroup>
    </>
  );
};

export default DevMetricsTypeRadio;
