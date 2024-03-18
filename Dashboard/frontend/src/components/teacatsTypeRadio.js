import { Radio, RadioGroup } from "rsuite";

const RadioLabel = ({ children }) => (
  <label style={{ padding: 7 }}>{children}</label>
);

//select feature tag radio component
const TeacatsTypeRadio = (props) => {
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
        <Radio value="AMINO">{"Outstanding (AMINO)"}</Radio>
        <Radio value="RJDCU">{"Resolved (RJDCU)"}</Radio>
        {(props.value.length === 1) ? (
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

export default TeacatsTypeRadio;
