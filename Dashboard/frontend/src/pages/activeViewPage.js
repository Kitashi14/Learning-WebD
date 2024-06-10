import { useContext, useEffect, useState } from "react";
import ProfileSearchBar from "../components/profileSearchBar";
import { Card, Typography } from "@material-tailwind/react";
import CloseIcon from "@rsuite/icons/Close";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useNavigate, useParams } from "react-router-dom";
import DataContext from "../context/dataContext";
import ActiveFeatureTable from "../components/activeFeatureTable";
import FeatureStatusRadio from "../components/featureStatusRadio";
import ActiveFeatureTypeRadio from "../components/activeFeatureTypeRadio";
import { SelectPicker } from "rsuite";

// dashboard view page for any user
const ActiveViewPage = (props) => {
  //extracting context global data
  const contextData = useContext(DataContext);

  // useState containing all filter's states
  // level 1 filters
  const featureRelease = contextData.active_states.featureRelease;
  const featureType = contextData.active_states.featureType;
  const featureStatus = contextData.active_states.featureStatus;

  const [userData, setUserData] = useState([]); //it will contain all elements under the user node irrespective of the state of any filters applied, used for finding different release under the user
  const [viewData, setViewData] = useState([]); //it will contain all elements after applying level 1 filter, used for showing lvl 1 charts
  const [viewTableData, setViewTableData] = useState([]); //it will contain all elements after applying level 2 filter, used for filling table

  // getting the feature details that was sorted
  const sortedFeature = {
    feature: contextData.active_states.sortedFeature.feature,
    order: contextData.active_states.sortedFeature.order,
  };

  //for invalid userId
  const [isUserValid, SetIsUserValid] = useState(true);

  const navigate = useNavigate(); //for navigating to different routes
  const userId = useParams().uid; //extracting user id from the route/url
  contextData.setActiveUser(userId);

  //field type full name map
  const fieldTypeFullName = new Map([
    ['test',"Only as Test"],
    ['dev', "Only as Dev"],
    ['combined',"Combined"]
  ])

  // for finding all parents nodes of the current user
  const previous_parents = [userId];
  let currChild = userId;
  while (contextData.childParentMap.has(currChild)) {
    previous_parents.unshift(contextData.childParentMap.get(currChild));
    currChild = contextData.childParentMap.get(currChild);
  }
  if (userId !== "all") previous_parents.unshift("all");

  //function for sorting the view table
  const sortViewTableAscending = (table, feature, order) => {
    const copyViewTableData = table; //for making a copy by data, not reference
    if (order > 0)
      copyViewTableData.sort((a, b) => {
        if (feature === "dev_managers" || feature === "test_managers") {
          return a[feature].size > b[feature].size
            ? 1
            : a[feature].size < b[feature].size
            ? -1
            : 0;
        }
        return a[feature] > b[feature] ? 1 : a[feature] < b[feature] ? -1 : 0;
      });
    else {
      copyViewTableData.sort((a, b) => {
        if (feature === "dev_managers" || feature === "test_managers") {
          return a[feature].size > b[feature].size
            ? -1
            : a[feature].size < b[feature].size
            ? 1
            : 0;
        }
        return a[feature] > b[feature] ? -1 : a[feature] < b[feature] ? 1 : 0;
      });
    }
    setViewTableData(copyViewTableData);
    const currentActiveStatus = contextData.active_states;
    if (
      currentActiveStatus.sortedFeature.feature !== feature ||
      currentActiveStatus.sortedFeature.order !== order
    ) {
      contextData.setActive({
        featureRelease: currentActiveStatus.featureRelease,
        featureType: currentActiveStatus.featureType,
        featureStatus: currentActiveStatus.featureStatus,
        sortedFeature: {
          feature,
          order,
        },
      });
    }
  };

  //function for filtering and loading view table according to level 2 filters
  const loadTableData = (table) => {
    const data = table;
    // sorting the data if a feature are previously selected for sorting
    if (sortedFeature.feature !== null) {
      sortViewTableAscending(data, sortedFeature.feature, sortedFeature.order);
    } else {
      setViewTableData(data);
    }
  };

  // for rending the whole page when a variable from dependency array changes its value
  useEffect(
    () => {
      const loadData = async (table) => {
        let data = [];
        let enteredIndex = new Map();

        //condition check is a valid is selected
        if (userId === "all") {
          data = table;
        } else {
          // storing all direct children nodes
          const childrens = contextData.parentChildMap.has(userId)
            ? contextData.parentChildMap.get(userId)
            : [];

          const colors = [
            "#16a34a",
            "#57534e",
            "#dc2626",
            "#ea580c",
            "#ca8a04",
            "#059669",
            "#52525b",
            "#65a30d",
            "#475569",
            "#4b5563",
          ];
          // filtering features assigned directly to user
          var i = 0; //index of activeReleaseTable
          var j = 0; //index of dataTable
          table.forEach((elem) => {
            if (
              elem.test_managers.has(userId) &&
              elem.dev_managers.has(userId)
            ) {
              data.push({
                ...elem,
                type: "combined",
                assigned_test_managers: new Map([["self", new Set([userId])]]),
                assigned_dev_managers: new Map([["self", new Set([userId])]]),
                color_map: new Map([
                  [userId, colors[0]],
                  ["self", colors[0]],
                ]),
              });
              enteredIndex.set(i, j);
              j++;
            } else if (elem.test_managers.has(userId)) {
              data.push({
                ...elem,
                type: "test",
                assigned_test_managers: new Map([["self", new Set([userId])]]),
                assigned_dev_managers: new Map(),
                color_map: new Map([
                  [userId, colors[0]],
                  ["self", colors[0]],
                ]),
              });
              enteredIndex.set(i, j);
              j++;
            } else if (elem.dev_managers.has(userId)) {
              data.push({
                ...elem,
                type: "dev",
                assigned_test_managers: new Map(),
                assigned_dev_managers: new Map([["self", new Set([userId])]]),
                color_map: new Map([
                  [userId, colors[0]],
                  ["self", colors[0]],
                ]),
              });
              enteredIndex.set(i, j);
              j++;
            }
            i++;
          });

          // dfs search in the tree
          const dfs_search = (curr, ultimate_parent, count) => {
            var k = 0; //index of activeReleaseTable
            table.forEach((elem) => {
              //if child present in both dev and test division
              if (elem.test_managers.has(curr) && elem.dev_managers.has(curr)) {
                // feature already added for the viewpage user
                if (enteredIndex.has(k)) {
                  const idx = enteredIndex.get(k);

                  //handling type
                  data[idx]["type"] = "combined";

                  //handling assinged test managers
                  if (
                    data[idx]["assigned_test_managers"].has(ultimate_parent)
                  ) {
                    data[idx]["assigned_test_managers"]
                      .get(ultimate_parent)
                      .add(curr);
                    data[idx]["color_map"].set(curr, colors[count]);
                  } else {
                    data[idx]["assigned_test_managers"].set(
                      ultimate_parent,
                      new Set([curr])
                    );
                    data[idx]["color_map"].set(curr, colors[count]);
                    data[idx]["color_map"].set(ultimate_parent, colors[count]);
                  }

                  //handling assinged dev managers
                  if (data[idx]["assigned_dev_managers"].has(ultimate_parent)) {
                    data[idx]["assigned_dev_managers"]
                      .get(ultimate_parent)
                      .add(curr);
                    data[idx]["color_map"].set(curr, colors[count]);
                  } else {
                    data[idx]["assigned_dev_managers"].set(
                      ultimate_parent,
                      new Set([curr])
                    );
                    data[idx]["color_map"].set(curr, colors[count]);
                    data[idx]["color_map"].set(ultimate_parent, colors[count]);
                  }
                } else {
                  data.push({
                    ...elem,
                    type: "combined",
                    assigned_test_managers: new Map([
                      [ultimate_parent, new Set([curr])],
                    ]),
                    assigned_dev_managers: new Map([
                      [ultimate_parent, new Set([curr])],
                    ]),
                    color_map: new Map([
                      [curr, colors[count]],
                      [ultimate_parent, colors[count]],
                    ]),
                  });
                  enteredIndex.set(k, j);
                  j++;
                }
              } //if feature child in only test division
              else if (elem.test_managers.has(curr)) {
                // feature already added for the viewpage user
                if (enteredIndex.has(k)) {
                  const idx = enteredIndex.get(k);

                  //handling type
                  if (data[idx]["type"] !== "test")
                    data[idx]["type"] = "combined";

                  //handling assigned test managers
                  if (
                    data[idx]["assigned_test_managers"].has(ultimate_parent)
                  ) {
                    data[idx]["assigned_test_managers"]
                      .get(ultimate_parent)
                      .add(curr);
                    data[idx]["color_map"].set(curr, colors[count]);
                  } else {
                    data[idx]["assigned_test_managers"].set(
                      ultimate_parent,
                      new Set([curr])
                    );
                    data[idx]["color_map"].set(curr, colors[count]);
                    data[idx]["color_map"].set(ultimate_parent, colors[count]);
                  }
                } else {
                  data.push({
                    ...elem,
                    type: "test",
                    assigned_test_managers: new Map([
                      [ultimate_parent, new Set([curr])],
                    ]),
                    assigned_dev_managers: new Map(),
                    color_map: new Map([
                      [curr, colors[count]],
                      [ultimate_parent, colors[count]],
                    ]),
                  });
                  enteredIndex.set(k, j);
                  j++;
                }
              } // feature child only in dev manager
              else if (elem.dev_managers.has(curr)) {
                // feature already added for the viewpage user
                if (enteredIndex.has(k)) {
                  const idx = enteredIndex.get(k);

                  //handling type
                  if (data[idx]["type"] !== "dev")
                    data[idx]["type"] = "combined";

                  //handling assinged dev managers
                  if (data[idx]["assigned_dev_managers"].has(ultimate_parent)) {
                    data[idx]["assigned_dev_managers"]
                      .get(ultimate_parent)
                      .add(curr);
                    data[idx]["color_map"].set(curr, colors[count]);
                  } else {
                    data[idx]["assigned_dev_managers"].set(
                      ultimate_parent,
                      new Set([curr])
                    );
                    data[idx]["color_map"].set(curr, colors[count]);
                    data[idx]["color_map"].set(ultimate_parent, colors[count]);
                  }
                } else {
                  data.push({
                    ...elem,
                    type: "dev",
                    assigned_test_managers: new Map(),
                    assigned_dev_managers: new Map([
                      [ultimate_parent, new Set([curr])],
                    ]),
                    color_map: new Map([
                      [curr, colors[count]],
                      [ultimate_parent, colors[count]],
                    ]),
                  });
                  enteredIndex.set(k, j);
                  j++;
                }
              }
              k++;
            });
            const childNodes = contextData.parentChildMap.has(curr)
              ? contextData.parentChildMap.get(curr)
              : [];
            childNodes.forEach((childNode) => {
              dfs_search(childNode, ultimate_parent, count);
            });
          };
          // itterating to all nodes under a direct children one by one using dfs
          var colorCount = 1;
          try {
            childrens.forEach((child) => {
              var assingeeCount = j;
              dfs_search(child, child, colorCount);
              if (assingeeCount !== j) {
                colorCount++;
              }
            });
          } catch (err) {
            console.log(err);
          }
        }
        const findAssignedManagersCount = (elem) => {
          const assignees = [];
          if (elem.assigned_test_managers) {
            elem.assigned_test_managers.forEach((v, k) => {
              assignees.push(k);
            });
          }
          if (elem.assigned_dev_managers)
            elem.assigned_dev_managers.forEach((v, k) => {
              assignees.push(k);
            });
          return assignees.filter((x, i, a) => a.indexOf(x) === i).length;
        };

        data = data.map((elem) => {
          const reporteesCount = findAssignedManagersCount(elem);
          return { ...elem, reporteesCount };
        });

        setUserData(data);

        //filtering data according to lvl 1 filters
        data = data.filter((elem) => {
          return (
            (elem.release_name === featureRelease ||
              featureRelease === "all") &&
            (elem.type === featureType || featureType === "all") &&
            (elem.feature_status === featureStatus || featureStatus === "all")
          );
        });
        setViewData(data);
        loadTableData(data);
      };
      var tableToUse;
      tableToUse = contextData.jiraTable;
      loadData(tableToUse);
    },
    // eslint-disable-next-line
    [userId, featureRelease, contextData, featureStatus, featureType] // dependency array
  );

  //type chart parameters
  const diffTypes =
    userId !== "all"
      ? viewData
          .map((elem) => elem.type)
          .filter((x, i, a) => a.indexOf(x) === i)
      : [];

  const diffTypeCount =
    userId !== "all"
      ? diffTypes.map((type) => {
          let count = 0;
          viewData.forEach((elem) => {
            if (elem.type === type) count++;
          });
          return { name: type, y: count };
        })
      : [];
  diffTypeCount.sort((a, b) =>
    a.name > b.name ? 1 : a.name < b.name ? -1 : 0
  );
  const typeChartOptions = {
    chart: {
      type: "pie",
      height: 300,
      width: 350,
    },
    title: {
      text: "Field Chart",
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br>{point.percentage:.1f}%",
          distance: 20,
        },
      },
    },
    credits: {
      enabled: false,
    },

    xAxis: {
      categories: diffTypeCount.map((elem) => elem.name),
    },
    series: [
      {
        name: "No. of features",
        data: diffTypeCount,
        events: {
          click: (e) => {
            selectFeatureType(e.point.name);
          },
        },
      },
    ],
  };

  //release chart parameters
  const diffRelease = viewData
    .map((elem) => elem.release_name)
    .filter((x, i, a) => a.indexOf(x) === i);
  diffRelease.sort();

  const diffReleaseCount = diffRelease.map((release) => {
    let count = 0;
    viewData.forEach((elem) => {
      if (elem.release_name === release) count++;
    });
    return { name: release, y: count };
  });
  diffReleaseCount.sort((a, b) =>
    a.name > b.name ? 1 : a.name < b.name ? -1 : 0
  );
  const releaseChartOptions = {
    chart: {
      type: "bar",
      height: userId !== "all" ? 300 : 650,
      width: userId !== "all" ? 550 : 880,
    },
    title: {
      text: "Release Chart",
    },
    // colors: ["#FFC300", "#EC610A", "#A40A3C", "#6B0848"],
    colors: ["#6366f1", "#41AEA9", "#213E3B", "#E8FFFF"],
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br>{point.percentage:.1f}",
          distance: 20,
        },
      },
    },
    credits: {
      enabled: false,
    },

    xAxis: {
      categories: diffReleaseCount.map((elem) => ""),
    },
    series: [
      {
        name: "No. of features",
        data: diffReleaseCount,
        events: {
          click: (e) => {
            console.log(e, e.point.options.selected);
            if (!e.point.options.selected) selectFeatureRelease(e.point.name);
            else selectFeatureRelease("all");
          },
        },
      },
    ],
  };

  // function to find different assignees
  const findDifferentAssignees = (table) => {
    const assignees = [];
    table.forEach((elem) => {
      if (elem.assigned_test_managers)
        elem.assigned_test_managers.forEach((v, k) => {
          assignees.push(k);
        });
      if (elem.assigned_dev_managers)
        elem.assigned_dev_managers.forEach((v, k) => {
          assignees.push(k);
        });
    });
    return assignees.filter((x, i, a) => a.indexOf(x) === i);
  };
  //distribution chart parameters
  var diffAssign = userId !== "all" ? findDifferentAssignees(viewData) : [];

  var diffAssignCount =
    userId !== "all"
      ? diffAssign.map((assign) => {
          let count = 0;
          viewData.forEach((elem) => {
            if (
              elem.assigned_test_managers.has(assign) ||
              elem.assigned_dev_managers.has(assign)
            )
              count++;
          });
          return {
            name: assign,
            y: count,
          };
        })
      : [];
  diffAssignCount.sort((a, b) => a.y - b.y);
  diffAssign = diffAssignCount.map((elem) => elem.name);
  diffAssignCount = diffAssignCount.map((elem) => {
    return {
      name:
        elem.name === "self"
          ? "self"
          : contextData.userFullNameMap.get(elem.name),
      y: elem.y,
    };
  });
  const assignedChartOptions = {
    chart: {
      type: "column",
      height: 280,
      width: 1300,
    },
    title: {
      text: "Distribution Chart",
    },
    colors: ["#15803d"],
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br>{point.percentage:.1f}",
          distance: 20,
        },
      },
    },
    credits: {
      text: "NOTE: Some features may be assigned under more than one person reporting to you",
      style: {
        fontSize: "15px",
        color: "red",
      },
    },

    xAxis: {
      categories: diffAssign,
    },
    series: [
      {
        name: "No. of features",
        data: diffAssignCount,
        innerSize: "50%",
        events: {
          click: (e) => {
            if (e.point.category !== "self")
              navigate(`/active/view/${e.point.category}`);
          },
        },
      },
    ],
  };

  // status chart parameters
  const diffStatus = viewData
    .map((elem) => elem.feature_status)
    .filter((x, i, a) => a.indexOf(x) === i);

  const diffStatusCount = diffStatus.map((status) => {
    let count = 0;
    viewData.forEach((elem) => {
      if (elem.feature_status === status) count++;
    });
    return { name: status, y: count };
  });

  diffStatusCount.sort((a, b) =>
    a.name > b.name ? 1 : a.name < b.name ? -1 : 0
  );
  const statusChartOptions = {
    chart: {
      type: "pie",
      height: userId !== "all" ? 300 : featureRelease === "all" ? 650 : 400,
      width: userId !== "all" ? 350 : featureRelease === "all" ? 400 : 450,
    },
    title: {
      text: "Workflow State Chart",
    },
    colors: ["#D789D7", "#9D65C9", "#5D54A4", "#2A3D66"],
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br>{point.percentage:.1f}%",
          distance: 20,
        },
      },
    },
    credits: {
      enabled: false,
    },

    xAxis: {
      categories: diffStatusCount.map((elem) => elem.name),
    },
    series: [
      {
        name: "No. of features",
        data: diffStatusCount,
        events: {
          click: (e) => {
            selectFeatureStatus(e.point.name);
          },
        },
      },
    ],
  };

  // wrappers function for selecting user from the user search bar
  const selectUserId = (userId) => {
    navigate(`/active/view/${userId}`);
  };

  // filtering data according to release (lvl 1 filter)
  const selectFeatureRelease = (release) => {
    const currentActiveStatus = contextData.active_states;
    contextData.setActive({
      featureRelease: release,
      featureType: currentActiveStatus.featureType,
      featureStatus: currentActiveStatus.featureStatus,
      sortedFeature: currentActiveStatus.sortedFeature,
    });
  };

  // filtering data according to status (lvl 1 filter)
  const selectFeatureStatus = (status) => {
    const currentActiveStatus = contextData.active_states;
    contextData.setActive({
      featureRelease: currentActiveStatus.featureRelease,
      featureType: currentActiveStatus.featureType,
      featureStatus: status,
      sortedFeature: currentActiveStatus.sortedFeature,
    });
  };

  // filtering data according to type (lvl 1 filter)
  const selectFeatureType = (type) => {
    const currentActiveStatus = contextData.active_states;
    contextData.setActive({
      featureRelease: currentActiveStatus.featureRelease,
      featureType: type,
      featureStatus: currentActiveStatus.featureStatus,
      sortedFeature: currentActiveStatus.sortedFeature,
    });
  };

  // finding different unique release for status filter bar
  const releaseSelectorData = userData
    .map((data) => data.release_name)
    .filter((x, i, a) => a.indexOf(x) === i)
    .map((item) => ({ label: item, value: item }));
  releaseSelectorData.unshift({ label: "All", value: "all" });

  if (featureRelease !== "all" && diffRelease.indexOf(featureRelease) === -1) {
    selectFeatureRelease("all");
  }

  const setInvalidUserSelected = (value) => {
    SetIsUserValid(value);
  };

  return (
    <>
      {/* page block */}
      <div className="bg-gray-200 flex h-full overflow-y-auto flex-col py-3 space-y-2">
        <div className="flex flex-row justify-center mb-[-20px]">
          {" "}
          <span className=" bg-blue-600 py-2 px-3 rounded-lg text-white font-bold text-lg">
            Active Releases
          </span>
        </div>
        <ProfileSearchBar
          selectUserId={selectUserId}
          table={contextData.jiraTable}
          userId={userId}
          type={"active"}
          setInvalidUserSelected={setInvalidUserSelected}
        />
        {isUserValid ? (
          <>
            {/* level 1 filter block */}
            <div className="flex flex-col items-center px-3 rounded-lg space-y-3 bg-gray-50 drop-shadow-md border-blue-200 border-none border-[1px] border-solid py-2 w-fit m-auto ">
              <Card className="w-fit flex flex-row items-center px-3 py-3 ml-4">
                View For :
                <span className="text-base text-blue-500 font-bold pl-2">
                  {userId === "all"
                    ? "All"
                    : contextData.userFullNameMap.get(userId)}
                </span>
              </Card>

              <div className="flex flex-row items-center space-x-3">
                {userId !== "all" ? (
                  <>
                    <ActiveFeatureTypeRadio
                      value={featureType}
                      selectFeatureType={selectFeatureType}
                      userData={userData}
                    />
                  </>
                ) : (
                  <></>
                )}
                <SelectPicker
                  label="Release"
                  style={{ width: 250 }}
                  data={releaseSelectorData}
                  onChange={(e) => {
                    selectFeatureRelease(e == null ? "all" : e);
                  }}
                  value={featureRelease}
                />
                <FeatureStatusRadio
                  value={featureStatus}
                  selectFeatureStatus={selectFeatureStatus}
                  userData={userData}
                />
              </div>
              <Typography variant="h5" className="pl-4 text-center">
                {" "}
                Total no. of features : <span>{viewData.length}</span>{" "}
              </Typography>
            </div>

            {/* user path from its ultimate parent */}
            {userId !== "all" ? (
              <>
                <div className=" px-3 flex cursor-default flex-row justify-center">
                  {" "}
                  {previous_parents.map((elem) => (
                    <>
                      /
                      <span
                        className="px-2 cursor-pointer text-blue-500"
                        onClick={() => {
                          navigate(`/active/view/${elem}`);
                        }}
                      >
                        {elem}
                      </span>
                    </>
                  ))}
                </div>
              </>
            ) : (
              <></>
            )}

            {/* data block, contains charts and table */}
            <div className="w-full flex flex-col space-y-4 px-0">
              {/* level 1 charts */}
              <div className="flex flex-col space-y-3 items-center pt-1 pb-2  bg-blue-gray-200">
                <div className="w-full flex flex-row space-x-1 justify-evenly pt-1 ">
                  {userId !== "all" && featureType === "all" ? (
                    <>
                      <Card className=" p-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit ">
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={typeChartOptions}
                        />
                      </Card>
                    </>
                  ) : (
                    <></>
                  )}
                  {featureRelease === "all" ? (
                    <>
                      <Card className="p-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit">
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={releaseChartOptions}
                        />
                      </Card>
                    </>
                  ) : (
                    <></>
                  )}
                  {featureStatus === "all" ? (
                    <>
                      <Card className=" p-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit ">
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={statusChartOptions}
                        />
                      </Card>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                {userId !== "all" ? (
                  <>
                    <Card className="p-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit ">
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={assignedChartOptions}
                      />
                    </Card>
                  </>
                ) : (
                  <></>
                )}
              </div>

              {/* table block */}
              <div className="px-4 bg-gray-50 pb-4 pt-6">
                {/* table label with level 1 filter data */}
                <Typography className="pl-4 pb-4" variant="h3">
                <span className="font-large font-mono text-base text-blue-500 text-lg">
                    View For:{" "}
                    {userId !== "all"
                      ? contextData.userFullNameMap.get(userId)
                      : "All"}
                  </span>
                  <br />
                  {featureRelease !== "all" || featureStatus !== "all" || featureType!=="all" ? (
                    <>
                      {" "}
                      {featureRelease !== "all" ? (
                        <>
                          <span className=" bg-gray-100 py-2 pl-3 rounded-md drop-shadow-md text-blue-500 font-medium font-mono text-base">
                            {featureRelease}{" "}
                            <CloseIcon
                              style={{ marginRight: 10, fontSize: "0.8em" }}
                              className="fill-gray-500 hover:fill-red-500 hover:cursor-pointer"
                              onClick={() => {
                                selectFeatureRelease("all");
                              }}
                            />
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                      {featureStatus !== "all" ? (
                        <>
                          <span className=" bg-gray-100 py-2 pl-3 ml-3 rounded-md drop-shadow-md text-blue-500 font-medium font-mono text-base">
                            {featureStatus}{" "}
                            <CloseIcon
                              style={{ marginRight: 10, fontSize: "0.8em" }}
                              className="fill-gray-500 hover:fill-red-500 hover:cursor-pointer"
                              onClick={() => {
                                selectFeatureStatus("all");
                              }}
                            />
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                      {featureType !== "all" ? (
                        <>
                          <span className=" bg-gray-100 py-2 pl-3 rounded-md drop-shadow-md text-blue-500 font-medium font-mono text-base">
                            {fieldTypeFullName.get(featureType)}{" "}
                            <CloseIcon
                              style={{ marginRight: 10, fontSize: "0.8em" }}
                              className="fill-gray-500 hover:fill-red-500 hover:cursor-pointer"
                              onClick={() => {
                                selectFeatureType("all");
                              }}
                            />
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                      <br />
                    </>
                  ) : (
                    <></>
                  )}
                  <hr />
                  Feature Count :{" "}
                  <span className=" text-blue-500">
                    {viewTableData.length}
                  </span>{" "}
                </Typography>
                <ActiveFeatureTable
                  userId={userId}
                  data={viewTableData}
                  sortViewTableAscending={sortViewTableAscending}
                  sortedFeature={sortedFeature}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col justify-center items-center h-full text-3xl font-bold text-blue-gray-400 ">
              <div>User with this id ({userId}) not found for this page.</div>
              Please select another user.
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ActiveViewPage;
