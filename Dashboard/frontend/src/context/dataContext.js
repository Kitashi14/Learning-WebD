/** @format */

import { createContext, useEffect, useState } from "react";
import // activeReleaseTable,
// child_parent_map,
// parent_child_map,
// removeSpaces,
// tableData,
// userdId_fullName_map,
"../data/mockData";

//creating global variables that can be used anywhere inside the react-app
const DataContext = createContext({
  isLoading: true,
  isLocTableLoaded: false,
  isLocPageLoading: true,
  isAutonsTableLoaded: false,
  isAutonsPageLoading: true,
  isTeacatsTableLoaded: false,
  isTeacatsPageLoading: true,
  isTestbugsTableLoaded: false,
  isTestbugsPageLoading: true,
  isPrecommitsTableLoaded: false,
  isPrecommitsPageLoading: true,
  isDevTableLoaded: false,
  isDevPageLoading: true,
  setIsLocPageLoading: () => {},
  setIsLocTableLoaded: () => {},
  setIsAutonsPageLoading: () => {},
  setIsAutonsTableLoaded: () => {},
  setIsTeacatsPageLoading: () => {},
  setIsTeacatsTableLoaded: () => {},
  setIsTestbugsPageLoading: () => {},
  setIsTestbugsTableLoaded: () => {},
  setIsPrecommitsPageLoading: () => {},
  setIsPrecommitsTableLoaded: () => {},
  setIsDevPageLoading: () => {},
  setIsDevTableLoaded: () => {},
  setLoading: () => {},
  dplTable: [],
  jiraTable: [],
  devMetricsTable: {},
  locTable: [],
  autonsTable: [],
  teacatsTable: [],
  testbugsTable: [],
  precommitsTable: [],
  childParentMap: new Map(),
  parentChildMap: new Map(),
  userFullNameMap: new Map(),
  dpl_currentUser: "psesham",
  active_currentUser: "psesham",
  devMetrics_currentUser: "psesham",
  loc_currentUser: "psesham",
  autons_currentUser: "psesham",
  teacats_currentUser: "psesham",
  testbugs_currentUser: "psesham",
  precommits_currentUser: "psesham",
  dev_states: {},
  dpl_states: {},
  active_states: {},
  loc_states: {},
  autons_states: {},
  teacats_states: {},
  testbugs_states: {},
  precommits_states: {},
  setDplUser: () => {},
  setActiveUser: () => {},
  setDevMetricsUser: () => {},
  setLocUser: () => {},
  setAutonsUser: () => {},
  setTeacatsUser: () => {},
  setTestbugsUser: () => {},
  setPrecommitsUser: () => {},
  setDpl: () => {},
  setActive: () => {},
  setDevMetricsStates: () => {},
  setLoc: () => {},
  setAutonsStates: () => {},
  setTeacatsStates: () => {},
  setTestbugsStates: () => {},
  setPrecommitsStates: () => {},
  setDevTable: () => {},
  setLocTable: () => {},
  setAutonsTable: () => {},
  setTeacatsTable: () => {},
  setTestbugsTable: () => {},
  setPrecommitsTable: () => {},
});

export const DataContextProvider = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isDevTableLoaded, setIsDevTableLoaded] = useState(false);
  const [isDevPageLoading, setIsDevPageLoading] = useState(true);
  const [isLocTableLoaded, setIsLocTableLoaded] = useState(false);
  const [isLocPageLoading, setIsLocPageLoading] = useState(true);
  const [isAutonsTableLoaded, setIsAutonsTableLoaded] = useState(false);
  const [isAutonsPageLoading, setIsAutonsPageLoading] = useState(true);
  const [isTeacatsTableLoaded, setIsTeacatsTableLoaded] = useState(false);
  const [isTeacatsPageLoading, setIsTeacatsPageLoading] = useState(true);
  const [isTestbugsTableLoaded, setIsTestbugsTableLoaded] = useState(false);
  const [isTestbugsPageLoading, setIsTestbugsPageLoading] = useState(true);
  const [isPrecommitsTableLoaded, setIsPrecommitsTableLoaded] = useState(false);
  const [isPrecommitsPageLoading, setIsPrecommitsPageLoading] = useState(true);
  const [dplTable, setDplTable] = useState([]);
  const [jiraTable, setJiraTable] = useState([]);
  const [devMetricsTable, setDevMetricsTable] = useState({});
  const [locTable, setLocTable] = useState([]);
  const [autonsTable, setAutonsTable] = useState([]);
  const [teacatsTable, setTeacatsTable] = useState([]);
  const [testbugsTable, setTestbugsTable] = useState([]);
  const [precommitsTable, setPrecommitsTable] = useState([]);
  const [childParentMap, setChildParentMap] = useState(new Map());
  const [parentChildMap, setParentChildMap] = useState(new Map());
  const [userFullNameMap, setUserFullNameMap] = useState(new Map());
  const [dpl_currentUser, setDplCurrentUser] = useState("psesham");
  const [active_currentUser, setActiveCurrentUser] = useState("psesham");
  const [devMetrics_currentUser, setDevMetricsCurrentUser] =
    useState("psesham");
  const [loc_currentUser, setLocCurrentUser] = useState("psesham");
  const [autons_currentUser, setAutonsCurrentUser] = useState("psesham");
  const [teacats_currentUser, setTeacatsCurrentUser] = useState("psesham");
  const [testbugs_currentUser, setTestbugsCurrentUser] = useState("psesham");
  const [precommits_currentUser, setPrecommitsCurrentUser] = useState("psesham");
  const [dpl_states, setDplStates] = useState({
    featureRelease: "all",
    featureTag: "all",
    featureType: "all",
    sortedFeature: {
      feature: null,
      order: null,
    },
  });
  const [active_states, setActiveStates] = useState({
    featureRelease: "all",
    featureType: "all",
    featureStatus: "all",
    sortedFeature: {
      feature: null,
      order: null,
    },
  });
  const [dev_states, setDevStates] = useState({
    bugSegment: "annual",
    bugType: "all",
    bugCategory: "all",
    sortedFeature: {
      feature: null,
      order: null,
    },
    tableOpen: false,
    customDates: {
      name: null,
      upper_limit: null,
      lower_limit: null,
    },
  });
  const [loc_states, setLocStates] = useState({
    locSegment: "semi",
    tableOpen: false,
    tableSortBy: "loc",
    customDates: {
      name: null,
      upper_limit: null,
      lower_limit: null,
    },
  });
  const [autons_states, setAutonsStates] = useState({
    bugSegment: "semi",
    bugType: "all",
    sortedFeature: {
      feature: null,
      order: null,
    },
    tableOpen: false,
  });
  const [teacats_states, setTeacatsStates] = useState({
    bugSegment: "semi",
    bugType: "all",
    sortedFeature: {
      feature: null,
      order: null,
    },
    tableOpen: false,
  });
  const [testbugs_states, setTestbugsStates] = useState({
    bugSegment: "annual",
    bugType: "all",
    sortedFeature: {
      feature: null,
      order: null,
    },
    tableOpen: false,
  });

  const [precommits_states, setPrecommitsStates] = useState({
    bugSegment: "Combined",
    bugState: "all",
    sortedFeature: {
      feature: null,
      order: null,
    },
    tableOpen: false,
  });

  const setLoading = (value) => {
    setIsLoading(value);
  };

  const setDplUser = (value) => {
    setDplCurrentUser(value);
  };

  const setActiveUser = (value) => {
    setActiveCurrentUser(value);
  };

  const setDpl = (value) => {
    setDplStates(value);
  };
  const setActive = (value) => {
    setActiveStates(value);
  };

  const setDevTable = (value) => {
    setDevMetricsTable(value);
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
          const orgs = new Set();
          employeeDetailResponseData.org.forEach((elem) => {
            eid_fullName_map.set(elem.cec_id, elem.name);
            orgs.add(elem.cec_id);
          });

          employeeDetailResponseData.employee.forEach((elem) => {
            if (orgs.has(elem.cec_id)) return;
            fullName_eid_map.set(elem.name.trim(), elem.cec_id);
            eid_fullName_map.set(elem.cec_id, elem.name.trim());
            child_parent_map.set(elem.cec_id, elem.manager);
            if (parent_child_map.has(elem.manager)) {
              parent_child_map.get(elem.manager).push(elem.cec_id);
            } else {
              parent_child_map.set(elem.manager, [elem.cec_id]);
            }
          });
        } catch (err) {
          console.log(err);
        }

        //active release api
        try {
          const activeReleaseResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/plm/act`
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
        }

        //dpl metric api
        try {
          const dplMetricResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/plm/dpl`
          );

          const dplMetricResponseData = await dplMetricResponse.json();
          const dplArray = [];
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
              assigned_to:
                elem.assigned_to &&
                fullName_eid_map.has(elem.assigned_to.trim())
                  ? fullName_eid_map.get(elem.assigned_to.trim())
                  : elem.assigned_to.trim(),
              created_by: elem.created_by,
              creation_date: elem.feature_created_date,
              last_status_change_date: elem.last_status_change_date,
              feature_type:
                elem.dev_estimate_person_weeks <= 3
                  ? "S"
                  : elem.dev_estimate_person_weeks <= 8
                  ? "M"
                  : elem.dev_estimate_person_weeks <= 20
                  ? "L"
                  : elem.dev_estimate_person_weeks <= 60
                  ? "XL"
                  : "XXL",
            };
            dplArray.push(obj);
          });
          dplMetricResponseData.techDebt.forEach((elem) => {
            const obj = {
              feature_reference: elem.feature_reference,
              feature_name: elem.feature_name,
              jira_id: elem.jira_id,
              feature_status: elem.feature_status,
              feature_tag: "wireless tech debt",
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
                elem.dev_estimate_person_weeks <= 3
                  ? "S"
                  : elem.dev_estimate_person_weeks <= 8
                  ? "M"
                  : elem.dev_estimate_person_weeks <= 20
                  ? "L"
                  : elem.dev_estimate_person_weeks <= 60
                  ? "XL"
                  : "XXL",
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
                elem.dev_estimate_person_weeks <= 3
                  ? "S"
                  : elem.dev_estimate_person_weeks <= 8
                  ? "M"
                  : elem.dev_estimate_person_weeks <= 20
                  ? "L"
                  : elem.dev_estimate_person_weeks <= 60
                  ? "XL"
                  : "XXL",
            };
            dplArray.push(obj);
          });
          setDplTable(dplArray);
        } catch (err) {
          console.log(err);
          throw Error(err);
        }

        setChildParentMap(child_parent_map);
        setParentChildMap(parent_child_map);
        setUserFullNameMap(eid_fullName_map);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        alert("Something went wrong. Can't fetch data");
      }
    };

    fetchData();
  }, []);

  const context = {
    isLoading,
    isLocTableLoaded,
    isLocPageLoading,
    isAutonsTableLoaded,
    isAutonsPageLoading,
    isTeacatsTableLoaded,
    isTeacatsPageLoading,
    isTestbugsTableLoaded,
    isTestbugsPageLoading,
    isPrecommitsTableLoaded,
    isPrecommitsPageLoading,
    isDevTableLoaded,
    isDevPageLoading,
    setIsLocPageLoading,
    setIsLocTableLoaded,
    setIsAutonsPageLoading,
    setIsAutonsTableLoaded,
    setIsTeacatsPageLoading,
    setIsTeacatsTableLoaded,
    setIsTestbugsPageLoading,
    setIsTestbugsTableLoaded,
    setIsPrecommitsPageLoading,
    setIsPrecommitsTableLoaded,
    setIsDevPageLoading,
    setIsDevTableLoaded,
    setLoading,
    dplTable,
    jiraTable,
    devMetricsTable,
    locTable,
    autonsTable,
    teacatsTable,
    testbugsTable,
    precommitsTable,
    childParentMap,
    parentChildMap,
    userFullNameMap,
    dpl_currentUser,
    active_currentUser,
    devMetrics_currentUser,
    loc_currentUser,
    autons_currentUser,
    teacats_currentUser,
    testbugs_currentUser,
    precommits_currentUser,
    dpl_states,
    active_states,
    dev_states,
    loc_states,
    autons_states,
    teacats_states,
    testbugs_states,
    precommits_states,
    setDplUser,
    setActiveUser,
    setDevMetricsUser: setDevMetricsCurrentUser,
    setLocUser: setLocCurrentUser,
    setAutonsUser: setAutonsCurrentUser,
    setTeacatsUser: setTeacatsCurrentUser,
    setTestbugsUser: setTestbugsCurrentUser,
    setPrecommitsUser: setPrecommitsCurrentUser,
    setDpl,
    setActive,
    setDevMetricsStates: setDevStates,
    setLoc: setLocStates,
    setAutonsStates,
    setTeacatsStates,
    setTestbugsStates,
    setPrecommitsStates,
    setDevTable,
    setLocTable,
    setAutonsTable,
    setTeacatsTable,
    setTestbugsTable,
    setPrecommitsTable,
  };

  return (
    <DataContext.Provider value={context}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataContext;
