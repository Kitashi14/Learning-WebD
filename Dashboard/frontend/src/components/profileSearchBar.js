import { SelectPicker } from "rsuite";
import { useContext } from "react";
import DataContext from "../context/dataContext";

// user profile search bar component
const ProfileSearchBar = (props) => {
  const contextData = useContext(DataContext);

  // a set for storing all unique users
  const s = new Set();

  //adding unique users from feature table
  const callParent = (node) => {
    s.add(node);
    if (contextData.childParentMap.has(node))
      callParent(contextData.childParentMap.get(node));
    return;
  };
  props.type === "dpl"
    ? props.table.forEach((elem) => {
        callParent(elem.assigned_to);
      })
    : props.type === "active"
    ? props.table.forEach((elem) => {
        const uniqueManagers = [];
        elem.test_managers.forEach((manager) => {
          uniqueManagers.push(manager);
        });
        elem.dev_managers.forEach((manager) => {
          uniqueManagers.push(manager);
        });
        uniqueManagers
          .filter((x, i, a) => a.indexOf(x) === i)
          .forEach((manager) => callParent(manager));
      })
    : (props.type === "dev" || props.type==="testbugs")
    ? props.table.forEach((elem) => {
        if ("OAIRMVJDCUN".includes(elem.state))
          callParent(
            elem.emp_id === "" || !contextData.userFullNameMap.has(elem.emp_id)
              ? elem.mgr_id
              : elem.emp_id
          );
      })
    : props.type === "autons"
    ? props.table.forEach((elem) => {
        elem=elem.bug_info;
        callParent(
          elem.emp_id === "" || !contextData.userFullNameMap.has(elem.emp_id)
            ? elem.mgr_id
            : elem.emp_id
        );
      })
    : props.type === "teacats"
    ? props.table.forEach((elem) => {
        elem=elem.bug_info;
        callParent(
          elem.emp_id === "" || !contextData.userFullNameMap.has(elem.emp_id)
            ? elem.mgr_id
            : elem.emp_id
        );
      })
    :props.table.forEach((elem) => {
        callParent(elem.emp_id);
      });

  // mapping unique user with their full names
  const data = [];
  s.forEach((e) =>
    data.push({
      label: `${contextData.userFullNameMap.get(e)} (${e})`,
      value: e,
    })
  );
  data.unshift({ label: "All", value: "all" });

  const selectUser = (e) => {
    props.selectUserId(e == null ? "all" : e);
  };

  if(s.has(props.userId) || props.userId==="all"){
    props.setInvalidUserSelected(true);
  }else{
    props.setInvalidUserSelected(false);
  }

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
