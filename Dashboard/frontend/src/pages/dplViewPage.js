import { useContext, useEffect, useState } from "react";
import FeatureTable from "../components/featureTable";
import FeatureTagRadio from "../components/featureTagRadio";
import FeatureTypeRadio from "../components/featureTypeRadio";
import ProfileSearchBar from "../components/profileSearchBar";
import { Card, Typography } from "@material-tailwind/react";
import CloseIcon from "@rsuite/icons/Close";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import SearchBar from "../components/SearchBar";
import { useNavigate, useParams } from "react-router-dom";
import DataContext from "../context/dataContext";
import { SelectPicker } from "rsuite";

// dashboard view page for any user
const DplViewPage = (props) => {
  //extracting context global data
  const contextData = useContext(DataContext);

  // useState containing all filter's states
  // level 1 filters
  const featureRelease = contextData.dpl_states.featureRelease;
  const featureType = contextData.dpl_states.featureType;
  const featureTag = contextData.dpl_states.featureTag;

  // level 2 filters
  const [featureStatus, setFeatureStatus] = useState("all");
  const [featurePin, setFeaturePin] = useState("all");

  const [userData, setUserData] = useState([]); //it will contain all elements under the user node irrespective of the state of any filters applied, used for finding different release under the user
  const [viewData, setViewData] = useState([]); //it will contain all elements after applying level 1 filter, used for showing lvl 1 charts
  const [viewTableData, setViewTableData] = useState([]); //it will contain all elements after applying level 2 filter, used for filling table

  //for invalid userId
  const [isUserValid, SetIsUserValid] = useState(true);

  // getting the feature details that was sorted
  const sortedFeature = {
    feature: contextData.dpl_states.sortedFeature.feature,
    order: contextData.dpl_states.sortedFeature.order,
  };

  const navigate = useNavigate(); //for navigating to different routes
  const userId = useParams().uid; //extracting user id from the route/url
  contextData.setDplUser(userId);

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
    const copyViewTableData = JSON.parse(JSON.stringify(table)); //for making a copy by data, not reference
    if (order > 0)
      copyViewTableData.sort((a, b) => {
        return a[feature] > b[feature] ? 1 : a[feature] < b[feature] ? -1 : 0;
      });
    else {
      copyViewTableData.sort((a, b) => {
        return a[feature] > b[feature] ? -1 : a[feature] < b[feature] ? 1 : 0;
      });
    }
    setViewTableData(copyViewTableData);
    const currentDplStates = contextData.dpl_states;
    if (
      currentDplStates.sortedFeature.feature !== feature ||
      currentDplStates.sortedFeature.order !== order
    ) {
      contextData.setDpl({
        featureRelease: currentDplStates.featureRelease,
        featureTag: currentDplStates.featureTag,
        featureType: currentDplStates.featureType,
        sortedFeature: {
          feature,
          order,
        },
      });
    }
  };

  //function for filtering and loading view table according to level 2 filters
  const loadTableData = (table, status, pin) => {
    const data = table.filter((elem) => {
      return (
        (status === "all" || status === elem.feature_status) &&
        (pin === "all" || pin === elem.pin)
      );
    });
    // sorting the data if a feature are previously selected for sorting
    if (sortedFeature.feature !== null) {
      sortViewTableAscending(data, sortedFeature.feature, sortedFeature.order);
    } else {
      setViewTableData(data);
    }
  };

  //filtering the data accoring to status (lvl 2 filter)
  const selectFeatureStatus = (status) => {
    setFeatureStatus(status);
    loadTableData(viewData, status, featurePin);
  };

  //filtering the data accoring to pin (lvl 2 filter)
  const selectFeaturePin = (pin) => {
    setFeaturePin(pin);
    loadTableData(viewData, featureStatus, pin);
  };

  // for rending the whole page when a variable from dependency array changes its value
  useEffect(
    () => {
      const loadData = async (table) => {
        let data = [];

        //condition check is a valid is selected
        if (userId === "all") {
          data = table;
        } else {
          // storing all direct children nodes
          const childrens = contextData.parentChildMap.has(userId)
            ? contextData.parentChildMap.get(userId)
            : [];

          // filtering features assigned directly to user
          table.forEach((elem) => {
            if (elem.assigned_to === userId) {
              data.push({ ...elem, assigned_under: "self" });
            }
          });

          // dfs search in the tree
          const dfs_search = (curr, ultimate_parent) => {
            const childNodes = contextData.parentChildMap.has(curr)
              ? contextData.parentChildMap.get(curr)
              : [];
            table.forEach((elem) => {
              if (elem.assigned_to === curr) {
                data.push({ ...elem, assigned_under: ultimate_parent });
              }
            });

            childNodes.forEach((childNode) => {
              dfs_search(childNode, ultimate_parent);
            });
          };

          // itterating to all nodes under a direct children one by one using dfs
          childrens.forEach((child) => {
            dfs_search(child, child);
          });
        }
        setUserData(data);

        //filtering data according to lvl 1 filters
        data = data.filter((elem) => {
          return (
            (elem.feature_tag === featureTag || featureTag === "all") &&
            (elem.feature_type === featureType || featureType === "all") &&
            (elem.release_name === featureRelease || featureRelease === "all")
          );
        });

        setViewData(data);
        setFeatureStatus("all");
        setFeaturePin("all");
        loadTableData(data, "all", "all");
      };
      var tableToUse;
      tableToUse = contextData.dplTable;
      loadData(tableToUse);
    },
    // eslint-disable-next-line
    [userId, featureTag, featureType, featureRelease, contextData] // dependency array
  );
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

  const releaseChartOptions = {
    chart: {
      type: "column",
      height: userId !== "all" ? 200 : 230,
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
      categories: diffRelease.map((elem) => ""),
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

  //tag chart parameters
  const diffTags = [
    "wireless plm",
    "wireless tech debt",
    "wireless serviceability",
  ];

  const diffTagsCount = diffTags.map((tag) => {
    let count = 0;
    viewData.forEach((elem) => {
      if (elem.feature_tag === tag) {
        count++;
      }
    });
    return { name: tag, y: count };
  });

  const tagChartOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    title: {
      text: "Feature Tag Chart",
    },
    // colors: ['#A7D7C5','#74B49B','#5C8D89'],
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
      categories: diffTags,
    },
    series: [
      {
        name: "No. of features",
        data: diffTagsCount,
        innerSize: "50%",
        events: {
          click: (e) => {
            selectFeatureTag(e.point.name);
          },
        },
      },
    ],
  };

  //distribution chart parameters
  var diffAssign =
    userId !== "all"
      ? viewData
          .map((elem) => elem.assigned_under)
          .filter((x, i, a) => a.indexOf(x) === i)
      : [];

  var diffAssignCount =
    userId !== "all"
      ? diffAssign.map((assign) => {
          let count = 0;
          viewData.forEach((elem) => {
            if (elem.assigned_under === assign) count++;
          });
          return {
            name: assign,
            y: count,
          };
        })
      : [];
  diffAssignCount.sort((a, b) => b.y - a.y);
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
      type: "bar",
      height: 300,
      width: 400,
    },
    title: {
      text: "Distribution Chart",
    },
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
              navigate(`/dpl/view/${e.point.category}`);
          },
        },
      },
    ],
  };

  // type chart parameters
  const diffTypes = ["S", "M", "L", "XL", "XXL"];

  const diffTypesCount = diffTypes.map((type) => {
    let count = 0;
    viewData.forEach((elem) => {
      if (elem.feature_type === type) count++;
    });
    return { name: type, y: count };
  });

  const typeChartOptions = {
    chart: {
      type: "pie",
      height: 300,
    },

    colors: ["#bbf7d0", "#86efac", "#4ade80", "#22c55e", "#16a34a"],
    title: {
      text: "Feature Type Chart",
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
      categories: diffTypes,
    },
    series: [
      {
        name: "No. of features",
        data: diffTypesCount,
        innerSize: "50%",
        events: {
          click: (e) => {
            selectFeatureType(e.point.name);
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

  const statusChartOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    title: {
      text: "Feature Status Chart",
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
      categories: diffStatus,
    },
    series: [
      {
        name: "No. of features",
        data: diffStatusCount,
        events: {
          click: (e) => {
            if (!e.point.options.selected) selectFeatureStatus(e.point.name);
            else selectFeatureStatus("all");
          },
        },
      },
    ],
  };

  // pin chart parameters
  const diffPin = viewData
    .map((elem) => elem.pin)
    .filter((x, i, a) => a.indexOf(x) === i);

  const diffPinCount = diffPin.map((pin) => {
    let count = 0;
    viewData.forEach((elem) => {
      if (elem.pin === pin) count++;
    });
    return { name: pin, y: count };
  });

  const pinChartOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    title: {
      text: "Feature PIN Chart",
    },
    colors: ["#A6F6F1", "#41AEA9", "#213E3B", "#E8FFFF"],
    // colors: ["#FFC300", "#EC610A", "#A40A3C", "#6B0848"],
    // colors: ["#D789D7", "#9D65C9", "#5D54A4", "#2A3D66"],
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
      categories: diffPin,
    },
    series: [
      {
        name: "No. of features",
        data: diffPinCount,
        events: {
          click: (e) => {
            if (!e.point.options.selected) selectFeaturePin(e.point.name);
            else selectFeaturePin("all");
          },
        },
      },
    ],
  };

  // wrappers function for selecting user from the user search bar
  const selectUserId = (userId) => {
    navigate(`/dpl/view/${userId}`);
  };

  // filtering data according to tag (lvl 1 filter)
  const selectFeatureTag = (tag) => {
    const currentDplStates = contextData.dpl_states;
    contextData.setDpl({
      featureRelease: currentDplStates.featureRelease,
      featureTag: tag,
      featureType: currentDplStates.featureType,
      sortedFeature: currentDplStates.sortedFeature,
    });
  };

  // filtering data according to type (lvl 1 filter)
  const selectFeatureType = (type) => {
    const currentDplStates = contextData.dpl_states;
    contextData.setDpl({
      featureRelease: currentDplStates.featureRelease,
      featureTag: currentDplStates.featureTag,
      featureType: type,
      sortedFeature: currentDplStates.sortedFeature,
    });
  };

  // filtering data according to release (lvl 1 filter)
  const selectFeatureRelease = (release) => {
    const currentDplStates = contextData.dpl_states;
    contextData.setDpl({
      featureRelease: release,
      featureTag: currentDplStates.featureTag,
      featureType: currentDplStates.featureType,
      sortedFeature: currentDplStates.sortedFeature,
    });
  };

  // finding different unique status for status filter bar
  const statusSelectorData = viewData
    .map((data) => data.feature_status)
    .filter((x, i, a) => a.indexOf(x) === i)
    .map((item) => ({ label: item, value: item }));
  statusSelectorData.unshift({ label: "All", value: "all" });

  // finding different unique pin for pin filter bar
  const pinSelectorData = viewData
    .map((data) => data.pin)
    .filter((x, i, a) => a.indexOf(x) === i)
    .map((item) => ({ label: item, value: item }));
  pinSelectorData.unshift({ label: "All", value: "all" });

  // finding different unique release for status filter bar
  const releaseSelectorData = userData
    .map((data) => data.release_name)
    .filter((x, i, a) => a.indexOf(x) === i)
    .map((item) => ({ label: item, value: item }));
  releaseSelectorData.unshift({ label: "All", value: "all" });

  const setInvalidUserSelected = (value) => {
    SetIsUserValid(value);
  };

  return (
    <>
      {/* page block */}
      <div className="bg-gray-200 flex h-full overflow-y-auto flex-col py-3 space-y-2">
        <div className="flex flex-row justify-center mb-[-40px]">
          {" "}
          <span className=" bg-blue-600 py-2 px-3 rounded-lg text-white font-bold text-lg">
            DPL Metrics
          </span>
        </div>
        <ProfileSearchBar
          selectUserId={selectUserId}
          table={contextData.dplTable}
          userId={userId}
          type={"dpl"}
          setInvalidUserSelected={setInvalidUserSelected}
        />

        {isUserValid ? (
          <>
            {/* level 1 filter block */}
            <div className="flex flex-col items-center px-3 rounded-lg space-y-3 bg-gray-50 drop-shadow-md border-blue-200 border-none border-[1px] border-solid py-2 w-fit m-auto">
              <Card className="w-fit flex flex-row items-center px-3 py-3 ml-4">
                View For :
                <span className="text-base text-blue-500 font-bold pl-2">
                  {userId === "all"
                    ? "All"
                    : contextData.userFullNameMap.get(userId)}
                </span>
              </Card>

              <div className="flex flex-col items-center space-y-3">
                <SelectPicker
                  label="Release"
                  // style={{ width: 200 }}
                  data={releaseSelectorData}
                  onChange={(e) => {
                    selectFeatureRelease(e == null ? "all" : e);
                  }}
                  value={featureRelease}
                />
                <FeatureTagRadio
                  selectFeatureTag={selectFeatureTag}
                  value={featureTag}
                />
                <FeatureTypeRadio
                  selectFeatureType={selectFeatureType}
                  value={featureType}
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
                          navigate(`/dpl/view/${elem}`);
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
            <div className="w-full flex flex-col space-y-4">
              {/* level 1 charts */}
              <div className="flex flex-col space-y-1 items-center pt-3 pb-3 px-8 bg-blue-gray-200">
                {featureRelease === "all" ? (
                  <>
                    <Card className="p-4 hover:drop-shadow-xl w-full ">
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={releaseChartOptions}
                      />
                    </Card>
                  </>
                ) : (
                  <></>
                )}
                <div className="w-full flex flex-row space-x-8 justify-evenly pt-1 px-8">
                  {featureTag === "all" ? (
                    <>
                      <Card className="p-4 hover:drop-shadow-xl w-1/3">
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={tagChartOptions}
                        />
                      </Card>
                    </>
                  ) : (
                    <></>
                  )}
                  {userId !== "all" ? (
                    <>
                      <Card className="p-4 hover:drop-shadow-xl w-1/3 ">
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={assignedChartOptions}
                        />
                      </Card>
                    </>
                  ) : (
                    <></>
                  )}
                  {featureType === "all" ? (
                    <>
                      <Card className="p-4 hover:drop-shadow-xl w-1/3 ">
                        <HighchartsReact
                          highcharts={Highcharts}
                          options={typeChartOptions}
                        />
                      </Card>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>

              {/* level 2 charts */}
              <div className="flex flex-row  space-x-4 justify-evenly px-8 ">
                <Card className=" p-4 hover:drop-shadow-md w-1/3 ">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={statusChartOptions}
                  />
                </Card>

                <Card className=" p-4 hover:drop-shadow-md w-1/3">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={pinChartOptions}
                  />
                </Card>
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
                  {featureTag !== "all" ||
                  featureType !== "all" ||
                  featureRelease !== "all" ? (
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
                      {featureTag !== "all" ? (
                        <>
                          <span className=" bg-gray-100 py-2 pl-3 ml-3 rounded-md drop-shadow-md text-blue-500 font-medium font-mono text-base">
                            {featureTag}{" "}
                            <CloseIcon
                              style={{ marginRight: 10, fontSize: "0.8em" }}
                              className="fill-gray-500 hover:fill-red-500 hover:cursor-pointer"
                              onClick={() => {
                                selectFeatureTag("all");
                              }}
                            />
                          </span>
                        </>
                      ) : (
                        <></>
                      )}
                      {featureType !== "all" ? (
                        <>
                          <span className=" bg-gray-100 py-2 pl-3 rounded-md drop-shadow-md text-blue-500 ml-4 font-medium font-mono text-base">
                            {featureType}
                            {" feature "}
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
                {/* level 2 filter block */}
                <div className="py-2">
                  <SearchBar
                    label={"Feature Status"}
                    data={statusSelectorData}
                    value={featureStatus}
                    selectOption={selectFeatureStatus}
                  />
                  <SearchBar
                    label={"Feature PIN"}
                    data={pinSelectorData}
                    value={featurePin}
                    selectOption={selectFeaturePin}
                  />
                </div>
                <FeatureTable
                  userId={userId}
                  data={viewTableData}
                  sortViewTableAscending={sortViewTableAscending}
                  sortedFeature={sortedFeature}
                  type={"dpl"}
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

export default DplViewPage;
