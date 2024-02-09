import { SelectPicker } from "rsuite";
import { tableData, userdId_fullName_map } from "../data/mockData";

// a set for storing all unique users 
const s = new Set();

//adding unique users from feature table
tableData.forEach((elem)=>{
    s.add(elem.assigned_to)
})

//adding users from user tree
userdId_fullName_map.forEach((v,k)=>{
    s.add(k)})

// mapping unique user with their full names
const data = [];
s.forEach((e)=>data.push({label: `${userdId_fullName_map.get(e)} (${e})`, value: e}))
data.unshift({label : 'All', value: 'all'});

// user profile search bar component
const ProfileSearchBar = (props) => {
  const selectUser = (e) => {
    props.selectUserId(e==null? "all":e);
  };


  return (
    <>
      <SelectPicker
        className="w-fit px-4 z-10"
        label="User"
        data={data}
        onChange={selectUser}
        value={props.userId}    //default value
      />
    </>
  );
};

export default ProfileSearchBar;
