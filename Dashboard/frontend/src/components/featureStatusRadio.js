import { Radio, RadioGroup } from "rsuite";

const RadioLabel = ({ children }) => (
  <label style={{ padding: 7 }}>{children}</label>
);

//select feature release radio component
const FeatureStatusRadio = (props) => {
  //finding all unique release under the user
  const diffStatus = props.userData
    .map((elem) => elem.feature_status)
    .filter((x, i, a) => a.indexOf(x) === i)
    .sort();

  const selectStatus = (e) => {
    props.selectFeatureStatus(e);
  };
  return (
    <>
      <RadioGroup
        className="hover:bg-gray-100 bg-white  justify-center"
        name="radioList"
        inline
        appearance="picker"
        value={props.value}
        onChange={selectStatus}
      >
        <RadioLabel>Workflow State: </RadioLabel>
        <Radio value="all">All</Radio>
        {diffStatus.map((elem) => (
          <>
            <Radio value={elem}>{elem}</Radio>
          </>
        ))}
      </RadioGroup>
    </>
  );
};

export default FeatureStatusRadio;
