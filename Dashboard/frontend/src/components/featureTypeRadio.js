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
      <Radio value="S">S</Radio>
      <Radio value="M">M</Radio>
      <Radio value="L">L</Radio>
      <Radio value="XL">XL</Radio>
      <Radio value="XXL">XXL</Radio>
    </RadioGroup>
)};

export default FeatureTypeRadio