/** @format */

import { createContext, useEffect, useState } from "react";
import {
  // activeReleaseTable,
//   child_parent_map,
//   parent_child_map,
  // removeSpaces,
  // tableData,
//   userdId_fullName_map,
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
        const fullName_eid_map = new Map();
        const eid_fullName_map = new Map();
        const child_parent_map = new Map();
        const parent_child_map = new Map();
        //make tree
        try {
          const employeeDetailResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/employee/details`
          );

          const employeeDetailResponseData =
            await employeeDetailResponse.json();

          employeeDetailResponseData.data.forEach((elem) => {
            fullName_eid_map.set(elem.name.trim(), elem.cec_id);
            eid_fullName_map.set(elem.cec_id, elem.name.trim());
            child_parent_map.set(elem.cec_id, elem.manager);
            if (parent_child_map.has(elem.manager)) {
              parent_child_map.get(elem.manager).push(elem.cec_id);
            } else {
              parent_child_map.set(elem.manager, [elem.cec_id]);
            }
          });

          console.log(employeeDetailResponseData.data.length);
          console.log(
            fullName_eid_map,
            eid_fullName_map,
            child_parent_map,
            parent_child_map
          );
        } catch (err) {
          console.log(err);
          alert("Can't fetch employee details at the moment");
        }

        //active release api
        try {
          const activeReleaseResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/act`
          );
          const activeReleaseResponseData = await activeReleaseResponse.json();

          const activeReleaseArray = [];
          activeReleaseResponseData.data.forEach((elem) => {
            const obj = {
              feature_name: elem.summary,
              jira_id: elem.feature_key,
              feature_status: elem.feature_workflow_state,
              release_name: elem.release,
              test_managers: elem.poc_test_manager
                ? new Set(
                    elem.poc_test_manager.split(",").map((p) => {
                      return p.trim();
                    })
                  )
                : new Set(),
              dev_managers: elem.poc_dev_manager
                ? new Set(elem.poc_dev_manager.split(",").map((p) => p.trim()))
                : new Set(),
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
            // console.log(
            //   elem.assigned_to,
            //   fullName_eid_map,
            //   fullName_eid_map.has(elem.assigned_to)
            // );
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
              assigned_to:
                elem.assigned_to &&
                fullName_eid_map.has(elem.assigned_to.trim())
                  ? fullName_eid_map.get(elem.assigned_to.trim())
                  : elem.assigned_to.trim(),
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
              assigned_to:
              elem.assigned_to &&
              fullName_eid_map.has(elem.assigned_to.trim())
                ? fullName_eid_map.get(elem.assigned_to.trim())
                : elem.assigned_to.trim(),
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
              no_tie_rank: parseInt(elem.no_tie_rank),
              release_name: elem.release_name,
              feature_des: elem.feature_description,
              assigned_to:
                elem.assigned_to &&
                fullName_eid_map.has(elem.assigned_to.trim())
                  ? fullName_eid_map.get(elem.assigned_to.trim())
                  : elem.assigned_to.trim(),
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
              setChildParentMap(child_parent_map);
              setParentChildMap(parent_child_map);
              setUserFullNameMap(eid_fullName_map);
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
