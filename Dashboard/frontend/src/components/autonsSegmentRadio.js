import { useContext } from "react";
import { Radio, RadioGroup } from "rsuite";
import DataContext from "../context/dataContext";

const RadioLabel = ({ children }) => (
  <label style={{ padding: 7 }}>{children}</label>
);

//select feature tag radio component
const AutonsSegmentRadio = (props) => {
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
        {"RJDCU".includes(contextData.autons_states.bugType)?<>
        <Radio value="week">Last 7 days</Radio>
        <Radio value="month">Monthly</Radio>
        <Radio value="quarter">Quarterly</Radio>
        <Radio value="semi">Semi Annually</Radio>
            
        </>:<>
        <Radio value="all">All</Radio>
        <Radio value="lte7">Less than or equal to 7 days</Radio>
        <Radio value="gt7">Older than 7 days</Radio>
            
        </>}
        
      </RadioGroup>
    </>
  );
};

export default AutonsSegmentRadio;
