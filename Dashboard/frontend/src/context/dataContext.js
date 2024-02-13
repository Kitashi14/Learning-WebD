/** @format */

import { createContext, useEffect, useState } from "react";
import {
  child_parent_map,
  parent_child_map,
  tableData,
  userdId_fullName_map,
} from "../data/mockData";

//creating global variables that can be used anywhere inside the react-app
const DataContext = createContext({
  dplTable: [],
  jiraTable: [],
  childParentMap: new Map(),
  parentChildMap: new Map(),
  userFullNameMap: new Map(),
});

export const DataContextProvider = (props) => {
  const [dplTable, setDplTable] = useState([]);
  const [jiraTable, setJiraTable] = useState([]);
  const [childParentMap, setChildParentMap] = useState(new Map());
  const [parentChildMap, setParentChildMap] = useState(new Map());
  const [userFullNameMap, setUserFullNameMap] = useState(new Map());

  //storing the fetch api responses
  useEffect(() => {
    const fetchData = async () => {
      //use fetch api's here
      const dlpResponseData = tableData;
      const jiraResponseData = tableData;
      const childParentMapResponse = child_parent_map;

      const parentChildData = parent_child_map;
      const userFullNameData = userdId_fullName_map;

      setDplTable(dlpResponseData);
      setJiraTable(jiraResponseData);
      setChildParentMap(childParentMapResponse);
      setParentChildMap(parentChildData);
      setUserFullNameMap(userFullNameData);
    };

    fetchData();
  }, []);

  const context = {
    dplTable: dplTable,
    jiraTable: jiraTable,
    childParentMap: childParentMap,
    parentChildMap: parentChildMap,
    userFullNameMap: userFullNameMap,
  };

  return (
    <DataContext.Provider value={context}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContext;
