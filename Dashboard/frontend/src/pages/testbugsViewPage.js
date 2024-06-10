import { useContext, useEffect, useState } from "react";
import ProfileSearchBar from "../components/profileSearchBar";
import {
  Card,
  Tab,
  Tabs,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import CloseIcon from "@rsuite/icons/Close";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useNavigate, useParams } from "react-router-dom";
import DataContext from "../context/dataContext";
import { Loader } from "rsuite";
import TestbugsMetricsSegmentTypeRadio from "../components/testbugsSegmentTypeRadio";
import TestbugsMetricsTypeRadio from "../components/testbugsTypeRadio";
import TestbugsAssigneeTable from "../components/testbugsAssigneeTable";
import TestbugsMetricsTable from "../components/testbugsTable";
import SearchBar from "../components/SearchBar";

// dashboard view page for any user
const TestbugsMetricsViewPage = (props) => {
  //extracting context global data
  const contextData = useContext(DataContext);
  // useState containing all filter's states
  // level 1 filters
  const bugSegment = contextData.testbugs_states.bugSegment;
  const bugType = contextData.testbugs_states.bugType;
  const tableOpen = contextData.testbugs_states.tableOpen;

  // level 2 filters
  const [featureComponent, setFeatureComponent] = useState("all");

  const [viewData, setViewData] = useState([]); //it will contain all elements after applying level 1 filter, used for showing lvl 1 charts
  const [viewTableData, setViewTableData] = useState([]); //it will contain all elements after applying level 2 filter, used for filling table
  const [assigneeTableData, setAssigneeTableData] = useState([]); // storing assignee table data

  const [showAllAssignees, setShowAllAssignees] = useState(false);
  const [showAllComponents, setShowAllComponents] = useState(false);

  //for invalid userId
  const [isUserValid, SetIsUserValid] = useState(true);

  // getting the bugs details that was sorted
  const sortedFeature = {
    feature: contextData.testbugs_states.sortedFeature.feature,
    order: contextData.testbugs_states.sortedFeature.order,
  };

  //pagenation
  const [currentPage, setCurrentPage] = useState(1);

  const segmentFullNameMap = new Map([
    ["week-0", "Current Week"],
    ["week-1", "Week 1"],
    ["week-2", "Week 2"],
    ["week-3", "Week 3"],
    ["week-4", "Week 4"],
    ["quarter", "Quarterly"],
    ["semi", "Semi Annually"],
    ["annual", "Annually"],
  ]);
  const weekBarValidityMap = new Map([
    ["week-0", new Set(["week-0", "quarter", "semi", "annual"])],
    ["week-1", new Set(["week-1", "quarter", "semi", "annual"])],
    ["week-2", new Set(["week-2", "quarter", "semi", "annual"])],
    ["week-3", new Set(["week-3", "quarter", "semi", "annual"])],
    ["week-4", new Set(["week-4", "quarter", "semi", "annual"])],
    ["quarter", new Set(["quarter", "semi", "annual"])],
    ["semi", new Set(["semi", "annual"])],
    ["annual", new Set(["annual"])],
  ]);
  const reverseSegmentMap = new Map();
  segmentFullNameMap.forEach((v, k) => {
    reverseSegmentMap.set(v, k);
  });

  const typeFullNameMap = new Map([
    ["O", "Opened"],
    ["A", "Assigned"],
    ["I", "Info required"],
    ["R", "Resolved"],
    ["M", "More"],
    ["V", "Verified"],
    ["J", "Junked"],
    ["D", "Duplicate"],
    ["U", "Unproducible"],
    ["C", "Closed"],
    ["N", "New"],
  ]);

  const typeColors = ["#D789D7", "#9D65C9", "#5D54A4", "#2A3D66"];
  const stateOrder = ["N", "OAI", "RMV", "JDCU"];

  const [prevUser, setPrevUser] = useState(null);
  const [prevType, setPrevType] = useState(null);
  const [segmentCount, setSegmentCount] = useState(new Map());

  const navigate = useNavigate(); //for navigating to different routes
  const userId = useParams().uid; //extracting user id from the route/url
  contextData.setTestbugsUser(userId);

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
        return a[feature] > b[feature] ? 1 : a[feature] < b[feature] ? -1 : 0;
      });
    else {
      copyViewTableData.sort((a, b) => {
        return a[feature] > b[feature] ? -1 : a[feature] < b[feature] ? 1 : 0;
      });
    }
    setViewTableData(copyViewTableData);
    setCurrentPage(1);
    const currentTestbugsStatus = contextData.testbugs_states;
    if (
      currentTestbugsStatus.sortedFeature.feature !== feature ||
      currentTestbugsStatus.sortedFeature.order !== order
    ) {
      contextData.setTestbugsStates({
        bugSegment: currentTestbugsStatus.bugSegment,
        bugType: currentTestbugsStatus.bugType,
        sortedFeature: {
          feature,
          order,
        },
        tableOpen: currentTestbugsStatus.tableOpen,
      });
    }
  };

  //function for filtering and loading view table according to level 2 filters
  const loadTableData = (table, component) => {
    const data = table.filter((elem) => {
      return component === "all" || component === elem.component;
    });
    // sorting the data if a feature are previously selected for sorting
    if (sortedFeature.feature !== null) {
      sortViewTableAscending(data, sortedFeature.feature, sortedFeature.order);
    } else {
      setViewTableData(data);
      setCurrentPage(1);
    }
  };

  //filtering the data accoring to pin (lvl 2 filter)
  const selectFeatureComponent = (component) => {
    setFeatureComponent(component);
    loadTableData(viewData, component);
  };

  // for rending the whole page when a variable from dependency array changes its value
  useEffect(
    () => {
      const mainFunction = async () => {
        const segmentMap = new Map();
        const loadData = async (table, segment) => {
          let data = [];

          //condition check is a valid is selected
          if (userId === "all") {
            data = table;
          } else {
            // storing all direct children nodes
            const childrens = contextData.parentChildMap.has(userId)
              ? contextData.parentChildMap.get(userId)
              : [];

            // filtering bugs assigned directly to user
            const assigneeCountMap = [];
            const selfCount = {
              N: 0,
              R: 0,
              M: 0,
              V: 0,
              O: 0,
              A: 0,
              I: 0,
              J: 0,
              D: 0,
              U: 0,
              C: 0,
              Total: 0,
            };
            table.forEach((elem) => {
              if (
                (elem.emp_id === userId ||
                  ((elem.emp_id === "" ||
                    !contextData.userFullNameMap.has(elem.emp_id)) &&
                    elem.mgr_id === userId)) &&
                "OAIRMVJDCUN".includes(elem.state)
              ) {
                data.push({ ...elem, assigned_under: "self" });
                selfCount[elem.state]++;
                selfCount.Total++;
              }
            });
            if (selfCount.Total > 0)
              assigneeCountMap.push({
                assignee: "self",
                countDetails: selfCount,
              });

            // dfs search in the tree
            const dfs_search = (curr, ultimate_parent, assigneeObj) => {
              const childNodes = contextData.parentChildMap.has(curr)
                ? contextData.parentChildMap.get(curr)
                : [];
              table.forEach((elem) => {
                if (
                  (elem.emp_id === curr ||
                    ((elem.emp_id === "" ||
                      !contextData.userFullNameMap.has(elem.emp_id)) &&
                      elem.mgr_id === curr)) &&
                  "OAIRMVJDCUN".includes(elem.state)
                ) {
                  data.push({ ...elem, assigned_under: ultimate_parent });
                  assigneeObj[elem.state]++;
                  assigneeObj.Total++;
                }
              });

              childNodes.forEach((childNode) => {
                dfs_search(childNode, ultimate_parent, assigneeObj);
              });
            };

            // itterating to all nodes under a direct children one by one using dfs
            childrens.forEach((child) => {
              const assigneeCount = {
                N: 0,
                R: 0,
                M: 0,
                V: 0,
                O: 0,
                A: 0,
                I: 0,
                J: 0,
                D: 0,
                U: 0,
                C: 0,
                Total: 0,
              };
              dfs_search(child, child, assigneeCount);
              if (assigneeCount.Total > 0)
                assigneeCountMap.push({
                  assignee: child,
                  countDetails: assigneeCount,
                });
            });
            assigneeCountMap.sort(
              (a, b) => b.countDetails.Total - a.countDetails.Total
            );
            if (segment === bugSegment) setAssigneeTableData(assigneeCountMap);
          }

          //filtering data according to lvl 1 filters
          data = data.filter((elem) => {
            return (
              "OAIRMVJDCUN".includes(elem.state) &&
              (bugType.includes(elem.state) || bugType === "all")
            );
          });
          segmentMap.set(segment, data.length);
          if (segment === bugSegment) {
            setFeatureComponent("all");
            setViewData(data);
            loadTableData(data, "all");
          }
        };
        //api call
        const fetchData = async () => {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/test/testbugs`
            );
            const responseData = await response.json();
            contextData.setTestbugsTable(responseData.data);
          } catch (err) {
            console.log(err);
            alert("Can't fetch test metrics bug details at the moment");
          }
        };
        //fetch table
        if (!contextData.isTestbugsTableLoaded) {
          await fetchData();
          contextData.setIsTestbugsTableLoaded(true);
        }
        var tableToUse;
        //segment will be selected
        if (userId === prevUser && prevType === bugType) {
          tableToUse = contextData.testbugsTable[bugSegment]
            ? contextData.testbugsTable[bugSegment].bugs
            : [];
          loadData(tableToUse, bugSegment);
        } else {
          segmentFullNameMap.forEach((v, k) => {
            tableToUse = contextData.testbugsTable[k]
              ? contextData.testbugsTable[k].bugs
              : [];
            loadData(tableToUse, k);
          });
          setSegmentCount(segmentMap);
        }

        // segmentFullNameMap.forEach((v, k) => {
        //   tableToUse = contextData.testbugsTable[k]
        //     ? contextData.testbugsTable[k].bugs
        //     : [];
        //   loadData(tableToUse, k);
        // });
        // setSegmentCount(segmentMap);
      };
      try {
        mainFunction();
      } catch (err) {
        console.log(err);
      }
      if (contextData.isTestbugsTableLoaded) {
        setPrevUser(userId);
        setPrevType(bugType);
        contextData.setIsTestbugsPageLoading(false);
      }
    },
    // eslint-disable-next-line
    [userId, bugSegment, contextData.isTestbugsTableLoaded, bugType] // dependency array
  );

  //segment chart parameters
  const diffSegment = [
    "week-0",
    "week-1",
    "week-2",
    "week-3",
    "week-4",
    "quarter",
    "semi",
    "annual",
  ];
  diffSegment.reverse();
  const diffSegmentCount = diffSegment.map((segment) => {
    const count = segmentCount.get(segment);
    return {
      name: segmentFullNameMap.get(segment),
      y: count,
      selected: segment === bugSegment ? true : false,
      dataLabels:
        segment === bugSegment
          ? {
              enabled: true,
              color: "#16803C",
            }
          : {
              enabled: true,
            },
    };
  });
  const segmentChartOptions = {
    chart: {
      type: "column",
      height: userId === "all" ? 480 : 400,
      width: 1300,
    },
    title: {
      text: "Segment Chart",
    },
    // colors: ["#FFC300", "#EC610A", "#A40A3C", "#6B0848"],
    colors: ["#16803C", "#41AEA9", "#213E3B", "#E8FFFF"],
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br>{point.percentage:.1f}",
          distance: 20,
        },
        states: {
          select: {
            colorIndex: "#D789D7",
            color: "#6CE890",
            borderWidth: 0,
            borderColor: "#6CE890",
          },
        },
      },
    },
    credits: {
      enabled: true,
      href: "#",
      text: `For: State (${bugType})`,
      style: {
        fontSize: "15px",
      },
      position: {
        align: "right",
      },
    },

    xAxis: {
      categories: diffSegment.map(
        (e) =>
          `${
            contextData.testbugsTable[e]
              ? contextData.testbugsTable[e]["lower limit df"]
              : ""
          } <br> - ${
            contextData.testbugsTable[e]
              ? contextData.testbugsTable[e]["upper limit df"]
              : ""
          }`
      ),
    },
    series: [
      {
        name: "No. of bugs",
        data: diffSegmentCount,
        events: {
          click: (e) => {
            selectBugSegment(reverseSegmentMap.get(e.point.name));
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
  diffAssign = diffAssignCount.map((elem) =>
    elem.name === "self" ? userId : elem.name
  );
  diffAssignCount = diffAssignCount.map((elem) => {
    return {
      name:
        elem.name === "self"
          ? "Self"
          : contextData.userFullNameMap.get(elem.name),
      y: elem.y,
    };
  });
  const diffAssignNumbers = diffAssign.length;
  if (diffAssign.length > 10 && !showAllAssignees) {
    diffAssign = diffAssign.slice(0, 10);
    diffAssignCount = diffAssignCount.slice(0, 10);
  }
  const assignedChartOptions = {
    chart: {
      type: "bar",
      height: 300,
    },
    title: {
      text:
        diffAssignNumbers > 10 && !showAllAssignees
          ? "Distribution Chart (Top 10)"
          : "Distribution Chart",
    },
    // colors: ['#D789D7'],
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
      enabled: true,
      href: "#",
      text: `For: ${segmentFullNameMap.get(bugSegment)}, State (${bugType})`,
      style: {
        fontSize: "15px",
      },
    },

    xAxis: {
      categories: diffAssign,
    },
    series: [
      {
        name: "No. of bugs",
        data: diffAssignCount,
        innerSize: "50%",
        events: {
          click: (e) => {
            if (e.point.category !== userId) {
              contextData.setIsTestbugsPageLoading(true);
              navigate(`/testbugs/view/${e.point.category}`);
            }
          },
        },
      },
    ],
  };

  //type chart parameters
  const diffTypes =
    bugType === "all" ? ["N", "OAI", "RMV", "JDCU"] : bugType.split("");

  const diffTypeCount = diffTypes.map((type) => {
    let count = 0;
    viewData.forEach((elem) => {
      if (type.includes(elem.state)) count++;
    });
    return { name: type, y: count, selected: false };
  });

  const typeChartOptions = {
    chart: {
      type: "pie",
      height: 300,
    },
    title: {
      text: "State Chart",
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
      enabled: true,
      href: "#",
      text: `For: ${segmentFullNameMap.get(bugSegment)}, State (${bugType})`,
      style: {
        fontSize: "15px",
      },
    },

    xAxis: {
      categories: diffTypes,
    },
    series: [
      {
        name: "No. of bugs",
        data: diffTypeCount,
        innerSize: "50%",
        events: {
          click: (e) => {
            selectBugType(e.point.name);
          },
        },
      },
    ],
  };

  //component chart parameters
  const diffComponent = viewData
    .map((elem) => elem.component)
    .filter((x, i, a) => a.indexOf(x) === i);

  var diffComponentCount = diffComponent.map((component) => {
    let count = 0;
    viewData.forEach((elem) => {
      if (elem.component === component) count++;
    });
    return { name: component, y: count };
  });
  diffComponentCount.sort((a, b) => b.y - a.y);
  if (diffComponentCount.length > 10 && !showAllComponents)
    diffComponentCount = diffComponentCount.slice(0, 10);
  const componentChartOptions = {
    chart: {
      type: "column",
      height: 350,
      width: 1300,
    },
    title: {
      text:
        diffComponent.length > 10 && !showAllComponents
          ? "Top 10 Components"
          : "Top components",
    },
    colors: ["#EC610A", "#A40A3C", "#6B0848", "#FFC300"],
    // colors: ["#6366f1", "#41AEA9", "#213E3B", "#E8FFFF"],
    plotOptions: {
      series: {
        allowPointSelect: false,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b><br>{point.percentage:.1f}",
          distance: 20,
        },
        colorByPoint: false,
      },
    },
    credits: {
      enabled: true,
      href: "#",
      text: `For: ${segmentFullNameMap.get(bugSegment)}, State (${bugType})`,
      style: {
        fontSize: "15px",
      },
    },

    xAxis: {
      categories: diffComponentCount.map((elem) => ""),
    },
    series: [
      {
        name: "No. of bugs",
        data: diffComponentCount,
      },
    ],
  };

  // wrappers function for selecting user from the user search bar
  const selectUserId = (user) => {
    if (user !== userId) {
      contextData.setIsTestbugsPageLoading(true);
      navigate(`/testbugs/view/${user}`);
    }
  };

  // filtering data according to release (lvl 1 filter)
  const selectBugType = (type) => {
    const currentTestbugsStatus = contextData.testbugs_states;
    contextData.setTestbugsStates({
      bugSegment: currentTestbugsStatus.bugSegment,
      bugType: type,
      sortedFeature: currentTestbugsStatus.sortedFeature,
      tableOpen: currentTestbugsStatus.tableOpen,
    });
  };

  //for change assignee table states
  const setTableOpen = (value) => {
    const currentTestbugsStatus = contextData.testbugs_states;
    contextData.setTestbugsStates({
      bugSegment: currentTestbugsStatus.bugSegment,
      bugType: currentTestbugsStatus.bugType,
      sortedFeature: currentTestbugsStatus.sortedFeature,
      tableOpen: value,
    });
  };

  // filtering data according to status (lvl 1 filter)
  const selectBugSegment = (segment) => {
    const currentTestbugsStatus = contextData.testbugs_states;
    contextData.setTestbugsStates({
      bugSegment: segment,
      bugType: currentTestbugsStatus.bugType,
      sortedFeature: currentTestbugsStatus.sortedFeature,
      tableOpen: currentTestbugsStatus.tableOpen,
    });
  };
  const pageNumbers = [];
  var p = 1000;
  while (p < viewTableData.length) {
    pageNumbers.push(p / 1000);
    p = p + 1000;
  }
  pageNumbers.push(p / 1000);

  const setInvalidUserSelected = (value) => {
    SetIsUserValid(value);
  };

  // finding different unique pin for pin filter bar
  const componentSelectorData = viewData
    .map((data) => data.component)
    .filter((x, i, a) => a.indexOf(x) === i)
    .map((item) => ({ label: item, value: item }));
  componentSelectorData.unshift({ label: "All", value: "all" });
  return (
    <>
      {contextData.isTestbugsPageLoading ||
      !contextData.isTestbugsTableLoaded ? (
        <>
          <div className="h-full w-full flex flex-row justify-center items-center">
            <Loader size="lg" />
          </div>
        </>
      ) : (
        <>
          {/* page block */}
          <div className="bg-gray-200 flex h-full overflow-y-auto flex-col py-3 space-y-2">
            <div className="flex flex-row justify-center mb-[-20px]">
              {" "}
              <span className=" bg-blue-600 py-2 px-3 rounded-lg text-white font-bold text-lg">
                Test Metrics: Bugs
              </span>
            </div>
            <ProfileSearchBar
              selectUserId={selectUserId}
              table={
                contextData.testbugsTable.annual
                  ? contextData.testbugsTable.annual.bugs
                  : []
              }
              userId={userId}
              type={"testbugs"}
              setInvalidUserSelected={setInvalidUserSelected}
            />

            {isUserValid ? (
              <>
                {/* level 1 filter block */}
                <div className=" flex flex-row justify-stretch">
                  <div className="w-1/5"> </div>
                  <div className="flex flex-col items-center px-3 rounded-lg space-y-3 bg-gray-50 drop-shadow-md border-blue-200 border-none border-[1px] border-solid py-2 w-fit m-auto ">
                    <Card className="w-fit flex flex-row items-center px-3 py-3 ml-4">
                      View For :
                      <span className="text-base text-blue-500 font-bold pl-2">
                        {userId === "all"
                          ? "All"
                          : contextData.userFullNameMap.get(userId)}
                      </span>
                    </Card>

                    <div className="flex flex-col items-center space-y-3">
                      <TestbugsMetricsSegmentTypeRadio
                        value={bugSegment}
                        selectSegment={selectBugSegment}
                        data={segmentFullNameMap}
                      />
                      <TestbugsMetricsTypeRadio
                        value={bugType}
                        selectBugType={selectBugType}
                      />
                    </div>
                    <Typography variant="h5" className="pl-4 text-center">
                      {" "}
                      Total no. of Bugs : <span>{viewData.length}</span>{" "}
                    </Typography>
                  </div>
                  <div className="   w-1/5 flex flex-col justify-evenly items-center  pr-8">
                    {bugType !== "all" ? (
                      <>
                        <div className="  bg-gray-100 border-gray-300 border-solid border-[2px] rounded-lg   w-4/5 h-full flex flex-col justify-evenly items-center">
                          {stateOrder[
                            stateOrder.findIndex((v, i, a) => {
                              return v.includes(bugType);
                            })
                          ]
                            .split("")
                            .map((char) => (
                              <>
                                <div
                                  style={{
                                    color:
                                      typeColors[
                                        stateOrder[
                                          stateOrder.findIndex((v, i, a) => {
                                            return v.includes(char);
                                          })
                                        ].indexOf(char)
                                      ],
                                  }}
                                  className={
                                    bugType !== char
                                      ? "underline hover:cursor-pointer"
                                      : "font-bold"
                                  }
                                  onClick={() => {
                                    if (bugType !== char) selectBugType(char);
                                  }}
                                >
                                  {" "}
                                  {char}
                                  {" : "}
                                  {typeFullNameMap.get(char)}
                                </div>
                              </>
                            ))}
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
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
                              if (elem !== userId) {
                                contextData.setIsTestbugsPageLoading(true);
                                navigate(`/testbugs/view/${elem}`);
                              }
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

                <div className="w-full px-8 py-[1px] ">
                  <div className="w-full flex flex-row bg-gray-50 border-solid border-[1px] border-gray-300 rounded-md h-[22px]">
                    <div
                      style={{
                        background: weekBarValidityMap
                          .get("annual")
                          .has(bugSegment)
                          ? "#16803B"
                          : "",
                      }}
                      className="rounded-l-md border-solid border-r-[1px] border-gray-300 w-[50%]"
                    ></div>
                    <div
                      style={{
                        background: weekBarValidityMap
                          .get("semi")
                          .has(bugSegment)
                          ? "#16803B"
                          : "",
                      }}
                      className="border-solid border-r-[1px] border-gray-300 w-[25%]"
                    ></div>
                    <div
                      style={{
                        background: weekBarValidityMap
                          .get("quarter")
                          .has(bugSegment)
                          ? "#16803B"
                          : "",
                      }}
                      className="border-solid border-r-[1px] border-gray-300 w-[7%]"
                    ></div>
                    <div
                      style={{
                        background: weekBarValidityMap
                          .get("week-4")
                          .has(bugSegment)
                          ? "#16803B"
                          : "",
                      }}
                      className="border-solid border-r-[1px] border-gray-300 w-[4%]"
                    ></div>
                    <div
                      style={{
                        background: weekBarValidityMap
                          .get("week-3")
                          .has(bugSegment)
                          ? "#16803B"
                          : "",
                      }}
                      className="border-solid border-r-[1px] border-gray-300 w-[4%]"
                    ></div>
                    <div
                      style={{
                        background: weekBarValidityMap
                          .get("week-2")
                          .has(bugSegment)
                          ? "#16803B"
                          : "",
                      }}
                      className="border-solid border-r-[1px] border-gray-300 w-[4%]"
                    ></div>
                    <div
                      style={{
                        background: weekBarValidityMap
                          .get("week-1")
                          .has(bugSegment)
                          ? "#16803B"
                          : "",
                      }}
                      className="border-solid border-r-[1px] border-gray-300 w-[4%]"
                    ></div>
                    <div
                      style={{
                        background: weekBarValidityMap
                          .get("week-0")
                          .has(bugSegment)
                          ? "#16803B"
                          : "",
                      }}
                      className=" rounded-r-md  w-[2%]"
                    ></div>
                  </div>
                </div>

                {/* data block, contains charts and table */}
                <div className="w-full flex flex-col space-y-4 px-0">
                  {/* level 1 charts */}
                  <div className="flex flex-col space-y-3 pt-3 items-center pt-1 pb-2 px-8 bg-blue-gray-200">
                    <Card className="p-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-full font-bold text-lg text-green-800 ">
                      {" "}
                      {segmentFullNameMap.get(bugSegment)}
                      {" : "}
                      {contextData.testbugsTable[bugSegment]
                        ? contextData.testbugsTable[bugSegment]["lower limit"]
                        : ""}
                      {" - "}
                      {contextData.testbugsTable[bugSegment]
                        ? contextData.testbugsTable[bugSegment]["upper limit"]
                        : ""}{" "}
                    </Card>
                    <Card className="pb-3 pt-1 px-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit ">
                      {userId !== "all" ? (
                        <>
                          <Tabs value={tableOpen ? "table" : "graph"}>
                            <TabsHeader>
                              <Tab
                                className={`${
                                  tableOpen ? "font-normal" : " font-bold"
                                } text-blue-600 z-10`}
                                key={"graph"}
                                value={"graph"}
                                onClick={() => {
                                  setTableOpen(false);
                                }}
                              >
                                {"Graph"}
                              </Tab>
                              <Tab
                                className={`${
                                  tableOpen ? "font-bold" : " font-normal"
                                } text-blue-600 z-10`}
                                key={"table"}
                                value={"table"}
                                onClick={() => {
                                  setTableOpen(true);
                                }}
                              >
                                {"Table"}
                              </Tab>
                            </TabsHeader>
                          </Tabs>
                        </>
                      ) : (
                        <></>
                      )}

                      {tableOpen && userId !== "all" ? (
                        <>
                          <TestbugsAssigneeTable
                            bugType={bugType}
                            tableData={assigneeTableData}
                            userId={userId}
                            bugSegment={segmentFullNameMap.get(bugSegment)}
                          />
                        </>
                      ) : (
                        <>
                          <HighchartsReact
                            highcharts={Highcharts}
                            options={segmentChartOptions}
                          />
                        </>
                      )}
                    </Card>
                    {tableOpen && userId !== "all" ? (
                      <>
                        <div className="flex bg-gray-100 p-4 rounded-lg flex-col items-center space-y-3">
                          <TestbugsMetricsTypeRadio
                            value={bugType}
                            selectBugType={selectBugType}
                          />
                          <Typography
                            variant="medium"
                            className="pl-4 text-center"
                          >
                            {" "}
                            Bug Count : <span>{viewData.length}</span>{" "}
                          </Typography>
                        </div>
                      </>
                    ) : (
                      <></>
                    )}

                    <div className="w-full flex flex-row space-x-3 justify-evenly items-center pt-1 ">
                      {userId !== "all" ? (
                        <>
                          <Card className=" p-4  flex flex-col justify-center items-center hover:drop-shadow-xl w-fit ">
                            {diffAssignNumbers > 10 && !showAllAssignees ? (
                              <>
                                <div className=" w-full flex pr-4 flex-row justify-end mb-[-20px] z-10">
                                  <span
                                    className="underline hover:cursor-pointer"
                                    onClick={() => {
                                      setShowAllAssignees(true);
                                    }}
                                  >
                                    show all
                                  </span>
                                </div>
                              </>
                            ) : diffAssignNumbers > 10 ? (
                              <>
                                <div className=" w-full flex pr-4 flex-row justify-end mb-[-20px] z-10">
                                  <span
                                    className="underline hover:cursor-pointer"
                                    onClick={() => {
                                      setShowAllAssignees(false);
                                    }}
                                  >
                                    show top 10
                                  </span>
                                </div>
                              </>
                            ) : (
                              <></>
                            )}

                            <HighchartsReact
                              highcharts={Highcharts}
                              options={assignedChartOptions}
                            />
                          </Card>
                        </>
                      ) : (
                        <></>
                      )}
                      {bugType.length > 1 ? (
                        <>
                          <Card className="p-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit">
                            <HighchartsReact
                              highcharts={Highcharts}
                              options={typeChartOptions}
                            />
                          </Card>
                        </>
                      ) : (
                        <></>
                      )}
                      {bugType.length === 1 &&
                      bugType !== "N" &&
                      userId !== "all" &&
                      tableOpen ? (
                        <>
                          <div className="  bg-gray-100 border-gray-300 border-solid border-[2px] rounded-lg   w-1/5 h-fit flex flex-col justify-evenly space-y-4 py-16 items-center">
                            {stateOrder[
                              stateOrder.findIndex((v, i, a) => {
                                return v.includes(bugType);
                              })
                            ]
                              .split("")
                              .map((char) => (
                                <>
                                  <div
                                    style={{
                                      color:
                                        typeColors[
                                          stateOrder[
                                            stateOrder.findIndex((v, i, a) => {
                                              return v.includes(char);
                                            })
                                          ].indexOf(char)
                                        ],
                                    }}
                                    className={
                                      bugType !== char
                                        ? "underline hover:cursor-pointer "
                                        : "font-bold"
                                    }
                                    onClick={() => {
                                      if (bugType !== char) selectBugType(char);
                                    }}
                                  >
                                    {" "}
                                    {char}
                                    {" : "}
                                    {typeFullNameMap.get(char)}
                                  </div>
                                </>
                              ))}
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    <Card className="pb-3 pt-1 px-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit ">
                      {diffComponent.length > 10 && !showAllComponents ? (
                        <>
                          <div className=" w-full flex pr-4 flex-row justify-end mb-[-20px] z-10">
                            <span
                              className="underline hover:cursor-pointer"
                              onClick={() => {
                                setShowAllComponents(true);
                              }}
                            >
                              show all
                            </span>
                          </div>
                        </>
                      ) : diffComponent.length > 10 ? (
                        <>
                          <div className=" w-full flex pr-4 flex-row justify-end mb-[-20px] z-10">
                            <span
                              className="underline hover:cursor-pointer"
                              onClick={() => {
                                setShowAllComponents(false);
                              }}
                            >
                              show top 10
                            </span>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={componentChartOptions}
                      />
                    </Card>

                    <Card className="p-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-full font-bold text-lg text-green-800 ">
                      {" "}
                      {segmentFullNameMap.get(bugSegment)}
                      {" : "}
                      {contextData.testbugsTable[bugSegment]
                        ? contextData.testbugsTable[bugSegment]["lower limit"]
                        : ""}
                      {" - "}
                      {contextData.testbugsTable[bugSegment]
                        ? contextData.testbugsTable[bugSegment]["upper limit"]
                        : ""}{" "}
                    </Card>
                  </div>

                  {/* table block */}
                  <div className="px-4 bg-gray-50 pb-4 pt-6">
                    {/* table label with level 1 filter data */}
                    <Typography className="pl-4" variant="h3">
                      <span className="font-large font-mono text-base text-blue-500 text-lg">
                        View For:{" "}
                        {userId !== "all"
                          ? contextData.userFullNameMap.get(userId)
                          : "All"}
                      </span>
                      <br />
                      {bugSegment !== "annual" || bugType !== "all" ? (
                        <>
                          {" "}
                          {bugSegment !== "annual" ? (
                            <>
                              <span className=" bg-gray-100 py-2 pl-3 rounded-md drop-shadow-md text-blue-500 font-medium font-mono text-base">
                                {segmentFullNameMap.get(bugSegment)}{" "}
                                <CloseIcon
                                  style={{ marginRight: 10, fontSize: "0.8em" }}
                                  className="fill-gray-500 hover:fill-red-500 hover:cursor-pointer"
                                  onClick={() => {
                                    selectBugSegment("annual");
                                  }}
                                />
                              </span>
                            </>
                          ) : (
                            <></>
                          )}
                          {bugType !== "all" ? (
                            <>
                              <span className=" bg-gray-100 py-2 pl-3 ml-3 rounded-md drop-shadow-md text-blue-500 font-medium font-mono text-base">
                                {bugType}{" "}
                                <CloseIcon
                                  style={{ marginRight: 10, fontSize: "0.8em" }}
                                  className="fill-gray-500 hover:fill-red-500 hover:cursor-pointer"
                                  onClick={() => {
                                    selectBugType("all");
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
                      Total Bugs Count :{" "}
                      <span className=" text-blue-500">
                        {viewTableData.length}
                      </span>{" "}
                      <br />
                    </Typography>
                    {/* level 2 filter block */}
                    <div className="py-2">
                      <SearchBar
                        label={"Feature Component"}
                        data={componentSelectorData}
                        value={featureComponent}
                        selectOption={selectFeatureComponent}
                      />
                    </div>
                    <div className="pb-4 flex flex-col justify-center items-center">
                      <div className="bg-gray-100 border-bold border-gray-300 border-[1px] rounded-md flex flex-row max-w-lg  overflow-x-auto select-none">
                        {pageNumbers.map((elem) => {
                          if (elem === pageNumbers.length)
                            return (
                              <>
                                <div
                                  style={{
                                    fontWeight:
                                      elem === currentPage ? "bold" : "",
                                    fontSize:
                                      elem === currentPage ? "15px" : "",
                                    color:
                                      elem === currentPage ? "#2096F3" : "",
                                  }}
                                  className=" flex flex-row justify-center items-center py-2 px-3 hover:bg-gray-300 text-center"
                                  onClick={() => {
                                    if (elem !== currentPage)
                                      setCurrentPage(elem);
                                  }}
                                >
                                  {elem}
                                </div>
                              </>
                            );
                          return (
                            <>
                              <div
                                style={{
                                  fontWeight:
                                    elem === currentPage ? "bold" : "",
                                  fontSize: elem === currentPage ? "15px" : "",
                                  color: elem === currentPage ? "#2096F3" : "",
                                }}
                                className=" flex flex-row justify-center items-center py-2 px-3 hover:bg-gray-300 border-r-[1px] border-gray-300 border-bold text-center"
                                onClick={() => {
                                  if (elem !== currentPage)
                                    setCurrentPage(elem);
                                }}
                              >
                                {elem}
                              </div>
                            </>
                          );
                        })}
                      </div>

                      <div className="font-bold text-lg text-blue-600">
                        <span className="text-gray-600 font-sans">Page:</span>{" "}
                        {currentPage}
                        <span className="font-normal italic ">
                          {" ("}
                          {(currentPage - 1) * 1000 + 1}
                          {"-"}
                          {currentPage * 1000 < viewTableData.length
                            ? currentPage * 1000
                            : viewTableData.length}
                          {")"}
                        </span>
                      </div>
                    </div>
                    <TestbugsMetricsTable
                      userId={userId}
                      data={viewTableData}
                      sortViewTableAscending={sortViewTableAscending}
                      sortedFeature={sortedFeature}
                      bugType={bugType}
                      lowerIndex={(currentPage - 1) * 1000}
                      upperIndex={
                        currentPage * 1000 < viewTableData.length
                          ? currentPage * 1000
                          : viewTableData.length
                      }
                    />
                    <div className="py-4 flex flex-col justify-center items-center">
                      <div className="bg-gray-100 border-bold border-gray-300 border-[1px] rounded-md flex flex-row max-w-lg  overflow-x-auto select-none">
                        {pageNumbers.map((elem) => {
                          if (elem === pageNumbers.length)
                            return (
                              <>
                                <div
                                  style={{
                                    fontWeight:
                                      elem === currentPage ? "bold" : "",
                                    fontSize:
                                      elem === currentPage ? "15px" : "",
                                    color:
                                      elem === currentPage ? "#2096F3" : "",
                                  }}
                                  className=" flex flex-row justify-center items-center py-2 px-3 hover:bg-gray-300 text-center"
                                  onClick={() => {
                                    if (elem !== currentPage)
                                      setCurrentPage(elem);
                                  }}
                                >
                                  {elem}
                                </div>
                              </>
                            );
                          return (
                            <>
                              <div
                                style={{
                                  fontWeight:
                                    elem === currentPage ? "bold" : "",
                                  fontSize: elem === currentPage ? "15px" : "",
                                  color: elem === currentPage ? "#2096F3" : "",
                                }}
                                className=" flex flex-row justify-center items-center py-2 px-3 hover:bg-gray-300 border-r-[1px] border-gray-300 border-bold text-center"
                                onClick={() => {
                                  if (elem !== currentPage)
                                    setCurrentPage(elem);
                                }}
                              >
                                {elem}
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col justify-center items-center h-full text-3xl font-bold text-blue-gray-400 ">
                  <div>
                    User with this id ({userId}) not found for this page.
                  </div>
                  Please select another user.
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default TestbugsMetricsViewPage;
