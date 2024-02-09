import { Radio, RadioGroup } from 'rsuite';

const RadioLabel = ({ children }) => <label style={{ padding: 7 }}>{children}</label>;

//select feature type radio component
const FeatureTypeRadio = (props) => {

    const selectType = (e)=>{
        props.selectFeatureType(e);
    }
    
    return (
    <RadioGroup className="hover:bg-gray-100 bg-white  justify-center" name="radioList" inline appearance="picker" value={props.value} onChange={selectType}>
      <RadioLabel>Feature Type: </RadioLabel>
      <Radio  value="all">All</Radio>
      <Radio value="small">Small</Radio>
      <Radio value="mid">Mid</Radio>
      <Radio value="large">Large</Radio>
    </RadioGroup>
)};

export default FeatureTypeRadio