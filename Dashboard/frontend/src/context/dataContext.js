/** @format */

import { createContext, useEffect, useState } from "react";
import {
  //   activeReleaseTable,
  child_parent_map,
  parent_child_map,
  //   tableData,
  userdId_fullName_map,
} from "../data/mockData";

//creating global variables that can be used anywhere inside the react-app
const DataContext = createContext({
  isLoading: true,
  setLoading: () => {},
  dplTable: [],
  jiraTable: [],
  childParentMap: new Map(),
  parentChildMap: new Map(),
  userFullNameMap: new Map(),
});

export const DataContextProvider = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dplTable, setDplTable] = useState([]);
  const [jiraTable, setJiraTable] = useState([]);
  const [childParentMap, setChildParentMap] = useState(new Map());
  const [parentChildMap, setParentChildMap] = useState(new Map());
  const [userFullNameMap, setUserFullNameMap] = useState(new Map());

  const setLoading = (value) => {
    setIsLoading(value);
  };

  //storing the fetch api responses
  useEffect(() => {
    const fetchData = async () => {
      //use fetch api's here
      try {
        //active release api
        try {
          const activeReleaseResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/active`
          );
          const activeReleaseResponseData = await activeReleaseResponse.json();

          const activeReleaseArray = [];
          activeReleaseResponseData.data.forEach((elem) => {
            const obj = {
              feature_name: elem.summary,
              jira_id: elem.feature_key,
              feature_status: elem.feature_workflow_state,
              release_name: elem.release,
              test_managers: new Set(elem.poc_test_manager.split(",")),
              dev_managers: new Set(elem.poc_dev_manager.split(",")),
            };
            activeReleaseArray.push(obj);
          });
          setJiraTable(activeReleaseArray);
        } catch (err) {
          console.log(err);
          alert("Can't fetch active release data at the moment");
        }

        //dpl metric api
        try {
          const dplMetricResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/dpl`
          );

          const dplMetricResponseData = await dplMetricResponse.json();
          const dplArray = [];
          const smallLimit = 5;
          const midLimit = 15;
          dplMetricResponseData.plm.forEach((elem) => {
            const obj = {
              feature_reference: elem.feature_reference,
              feature_name: elem.feature_name,
              jira_id: elem.jira_id,
              feature_status: elem.feature_status,
              feature_tag: "wireless plm",
              pin: elem.pin,
              no_tie_rank: elem.no_tie_rank,
              release_name: elem.release_name,
              feature_des: elem.feature_description,
              assigned_to: elem.assigned_to,
              created_by: elem.created_by,
              creation_date: elem.feature_created_date,
              last_status_change_date: elem.last_status_change_date,
              feature_type:
                elem.dev_estimate_person_weeks <= smallLimit
                  ? "small"
                  : elem.dev_estimate_person_weeks <= midLimit
                  ? "mid"
                  : "large",
            };
            dplArray.push(obj);
          });
          dplMetricResponseData.techDebt.forEach((elem) => {
            const obj = {
              feature_reference: elem.feature_reference,
              feature_name: elem.feature_name,
              jira_id: elem.jira_id,
              feature_status: elem.feature_status,
              feature_tag: "wireless tect debt",
              pin: elem.pin,
              no_tie_rank: elem.no_tie_rank,
              release_name: elem.release_name,
              feature_des: elem.feature_description,
              assigned_to: elem.assigned_to,
              created_by: elem.created_by,
              creation_date: elem.feature_created_date,
              last_status_change_date: elem.last_status_change_date,
              feature_type:
                elem.dev_estimate_person_weeks <= smallLimit
                  ? "small"
                  : elem.dev_estimate_person_weeks <= midLimit
                  ? "mid"
                  : "large",
            };
            dplArray.push(obj);
          });
          dplMetricResponseData.serviceability.forEach((elem) => {
            const obj = {
              feature_reference: elem.feature_reference,
              feature_name: elem.feature_name,
              jira_id: elem.jira_id,
              feature_status: elem.feature_status,
              feature_tag: "wireless serviceability",
              pin: elem.pin,
              no_tie_rank: elem.no_tie_rank,
              release_name: elem.release_name,
              feature_des: elem.feature_description,
              assigned_to: elem.assigned_to,
              created_by: elem.created_by,
              creation_date: elem.feature_created_date,
              last_status_change_date: elem.last_status_change_date,
              feature_type:
                elem.dev_estimate_person_weeks <= smallLimit
                  ? "small"
                  : elem.dev_estimate_person_weeks <= midLimit
                  ? "mid"
                  : "large",
            };
            dplArray.push(obj);
          });
          setDplTable(dplArray);
        } catch (err) {
          console.log(err);
          alert("Can't fetch dpl metric data at the moment");
        }

        const response = () => {
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              //   const dlpResponseData = tableData;
              //   const jiraResponseData = activeReleaseTable;
              const childParentMapResponse = child_parent_map;

              const parentChildData = parent_child_map;
              const userFullNameData = userdId_fullName_map;

              //   setDplTable(dlpResponseData);
              //   setJiraTable(jiraResponseData);
              setChildParentMap(childParentMapResponse);
              setParentChildMap(parentChildData);
              setUserFullNameMap(userFullNameData);
              setIsLoading(false);
              resolve();
            }, 500);
          });
        };
        await response();
      } catch (err) {
        console.log(err);
        alert("Something went wrong.");
      }
    };

    fetchData();
  }, []);

  const context = {
    isLoading,
    setLoading,
    dplTable,
    jiraTable,
    childParentMap,
    parentChildMap,
    userFullNameMap,
  };

  return (
    <DataContext.Provider value={context}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContext;
