import { Radio, RadioGroup } from "rsuite";

const RadioLabel = ({ children }) => (
  <label style={{ padding: 7 }}>{children}</label>
);

//select feature tag radio component
const PrecommitsMetricsStateRadio = (props) => {
  const selectState = (e) => {
    props.selectBugState(e);
  };
  return (
    <>
      <RadioGroup
        className="hover:bg-gray-100 bg-white  justify-center"
        name="radioList"
        inline
        appearance="picker"
        value={props.value}
        onChange={selectState}
      >
        <RadioLabel>State: </RadioLabel>
        <Radio value="all">All</Radio>
        {props.states.map(e=>{

          return <>
            <Radio value={e}>{e}</Radio>
          </>
        })}
      </RadioGroup>
    </>
  );
};

export default PrecommitsMetricsStateRadio;
