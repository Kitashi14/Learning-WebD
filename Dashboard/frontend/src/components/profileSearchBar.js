import { SelectPicker } from "rsuite";
import { useContext } from "react";
import DataContext from "../context/dataContext";

// user profile search bar component
const ProfileSearchBar = (props) => {

  const contextData = useContext(DataContext);

  // a set for storing all unique users
  const s = new Set();

  //adding unique users from feature table
  const callParent = (node)=>{
    s.add(node);
    if(contextData.childParentMap.has(node)) callParent(contextData.childParentMap.get(node));
    return;
  }
  props.table.forEach((elem) => {
    callParent(elem.assigned_to)
  });

  //adding users from user tree
  // contextData.userFullNameMap.forEach((v, k) => {
  //   s.add(k);
  // });

  // mapping unique user with their full names
  const data = [];
  s.forEach((e) =>
    data.push({ label: `${contextData.userFullNameMap.get(e)} (${e})`, value: e })
  );
  data.unshift({ label: "All", value: "all" });

  const selectUser = (e) => {
    props.selectUserId(e == null ? "all" : e);
  };

  return (
    <>
      <SelectPicker
        className="w-fit px-4 z-10"
        label="User"
        data={data}
        onChange={selectUser}
        value={props.userId} //default value
      />
    </>
  );
};

export default ProfileSearchBar;