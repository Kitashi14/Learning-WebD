import { Radio, RadioGroup } from "rsuite";

const RadioLabel = ({ children }) => (
  <label style={{ padding: 7 }}>{children}</label>
);

//select feature release radio component
const FeatureReleaseRadio = (props) => {

  //finding all unique release under the user
  const diffRelease = props.userData.map(elem=>elem.release_name).filter((x,i,a)=> a.indexOf(x)===i).sort()

  const selectTag = (e) => {
    props.selectFeatureRelease(e);
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
        <RadioLabel>Release Name: </RadioLabel>
        <Radio value="all">All</Radio>
        {
          
          diffRelease.map(elem=>(
            <><Radio value={elem}>{elem}</Radio></>
          ))
        }
      </RadioGroup>
    </>
  );
};

export default FeatureReleaseRadio;
