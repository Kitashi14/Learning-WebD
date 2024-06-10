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
import TeacatsTypeRadio from "../components/teacatsTypeRadio";
import TeacatsSegmentRadio from "../components/teacatsSegmentRadio";
import TeacatsTable from "../components/teacatsTable";
import TeacatsAssigneeTable from "../components/teacatsAssigneeTable";
import SearchBar from "../components/SearchBar";

// dashboard view page for any user
const TeacatsViewPage = (props) => {
  //extracting context global data
  const contextData = useContext(DataContext);
  // useState containing all filter's states
  // level 1 filters
  const bugSegment = contextData.teacats_states.bugSegment;
  const bugType = contextData.teacats_states.bugType;
  const tableOpen = contextData.teacats_states.tableOpen;

  // level 2 filters
  const [featureComponent, setFeatureComponent] = useState("all");

  const [viewData, setViewData] = useState([]); //it will contain all elements after applying level 1 filter, used for showing lvl 1 charts
  const [viewTableData, setViewTableData] = useState([]); //it will contain all elements after applying level 2 filter, used for filling table
  const [assigneeTableData, setAssigneeTableData] = useState([]); // storing assignee table data

  const [showAllAssignees, setShowAllAssignees] = useState(false);
  const [showAllComponents, setShowAllComponents] = useState(false);

  //for invalid userId
  const [isUserValid, SetIsUserValid] = useState(true);

  const [prevUser, setPrevUser] = useState(null);
  const [prevType, setPrevType] = useState(null);
  const [segmentCountData, setSegmentCountData] = useState([]);

  // getting the bugs details that was sorted
  const sortedFeature = {
    feature: contextData.teacats_states.sortedFeature.feature,
    order: contextData.teacats_states.sortedFeature.order,
  };

  const segmentFullNameMap = new Map([
    ["week", "Last 7 days (Weekly)"],
    ["month", "Monthly"],
    ["quarter", "Quarterly"],
    ["semi", "Semi Annually"],
    ["lte7", "Less than or equal to 7 days"],
    ["gt7", "Older than 7 days"],
  ]);
  const weekBarValidityMap = new Map([
    ["week", new Set(["week", "month", "quarter", "semi"])],
    ["month", new Set(["month", "quarter", "semi"])],
    ["quarter", new Set(["quarter", "semi"])],
    ["semi", new Set(["semi"])],
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
  const stateOrder = ["AMINO", "RJDCU"];

  const navigate = useNavigate(); //for navigating to different routes
  const userId = useParams().uid; //extracting user id from the route/url
  contextData.setTeacatsUser(userId);

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
    const currentTeacatsStatus = contextData.teacats_states;
    if (
      currentTeacatsStatus.sortedFeature.feature !== feature ||
      currentTeacatsStatus.sortedFeature.order !== order
    ) {
      contextData.setTeacatsStates({
        bugSegment: currentTeacatsStatus.bugSegment,
        bugType: currentTeacatsStatus.bugType,
        sortedFeature: {
          feature,
          order,
        },
        tableOpen: currentTeacatsStatus.tableOpen,
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
        const loadData = async (table) => {
          let data = [];
          if (bugType !== "all") {
            if ("AMINO".includes(bugType))
              table = table.filter((e) => {
                return (
                  e.bug_segment === bugSegment ||
                  (bugSegment === "all" &&
                    (e.bug_segment === "gt7" || e.bug_segment === "lte7"))
                );
              });
            else {
              table = table.filter((e) => {
                return (
                  ["week", "month", "quarter", "semi"].includes(
                    e.bug_segment
                  ) && weekBarValidityMap.get(e.bug_segment).has(bugSegment)
                );
              });
            }
          }
          //condition check is a valid is selected
          if (userId === "all") {
            data = table.map((e) => {
              return {
                ...e.bug_info,
                bugSegment: e.bug_segment,
                bugType: e.bug_type,
              };
            });
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
              week: 0,
              month: 0,
              quarter: 0,
              semi: 0,
              lte7: 0,
              gt7: 0,
              Total_R: 0,
              Total_O: 0,
            };
            table.forEach((elem) => {
              const bugType = elem.bug_type;
              const bugSegment = elem.bug_segment;
              elem = elem.bug_info;
              if (
                elem.emp_id === userId ||
                ((elem.emp_id === "" ||
                  !contextData.userFullNameMap.has(elem.emp_id)) &&
                  elem.mgr_id === userId)
              ) {
                data.push({
                  ...elem,
                  assigned_under: "self",
                  bugType,
                  bugSegment,
                });
                selfCount[elem.state]++;
                selfCount[bugSegment]++;
                if ("AMINO".includes(elem.state)) selfCount.Total_O++;
                else selfCount.Total_R++;
              }
            });
            if (selfCount.Total_R > 0 || selfCount.Total_O > 0)
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
                const bugType = elem.bug_type;
                const bugSegment = elem.bug_segment;
                elem = elem.bug_info;
                if (
                  elem.emp_id === curr ||
                  ((elem.emp_id === "" ||
                    !contextData.userFullNameMap.has(elem.emp_id)) &&
                    elem.mgr_id === curr)
                ) {
                  data.push({
                    ...elem,
                    assigned_under: ultimate_parent,
                    bugSegment,
                    bugType,
                  });
                  assigneeObj[elem.state]++;
                  assigneeObj[bugSegment]++;
                  if ("AMINO".includes(elem.state)) assigneeObj.Total_O++;
                  else assigneeObj.Total_R++;
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
                week: 0,
                month: 0,
                quarter: 0,
                semi: 0,
                lte7: 0,
                gt7: 0,
                Total_R: 0,
                Total_O: 0,
              };
              dfs_search(child, child, assigneeCount);
              if (assigneeCount.Total_R > 0 || assigneeCount.Total_O > 0)
                assigneeCountMap.push({
                  assignee: child,
                  countDetails: assigneeCount,
                });
            });
            if (bugType === "all") {
              assigneeCountMap.sort(
                (a, b) =>
                  b.countDetails.Total_O +
                  b.countDetails.Total_R -
                  (a.countDetails.Total_O + a.countDetails.Total_R)
              );
            } else if ("AMINO".includes(bugType)) {
              assigneeCountMap.sort(
                (a, b) => b.countDetails.Total_O - a.countDetails.Total_O
              );
            } else {
              assigneeCountMap.sort(
                (a, b) => b.countDetails.Total_R - a.countDetails.Total_R
              );
            }

            setAssigneeTableData(assigneeCountMap);
          }
          //filtering data according to lvl 1 filters
          data = data.filter((elem) => {
            return bugType.includes(elem.state) || bugType === "all";
          });
          setFeatureComponent("all");
          setViewData(data);
          loadTableData(data, "all");
        };

        const segmentData = async (table) => {
          let data = [];
          //condition check is a valid is selected
          if (userId === "all") {
            data = table.map((e) => {
              return {
                ...e.bug_info,
                bugSegment: e.bug_segment,
                bugType: e.bug_type,
              };
            });
          } else {
            // storing all direct children nodes
            const childrens = contextData.parentChildMap.has(userId)
              ? contextData.parentChildMap.get(userId)
              : [];

            table.forEach((elem) => {
              const bugType = elem.bug_type;
              const bugSegment = elem.bug_segment;
              elem = elem.bug_info;
              if (
                elem.emp_id === userId ||
                ((elem.emp_id === "" ||
                  !contextData.userFullNameMap.has(elem.emp_id)) &&
                  elem.mgr_id === userId)
              ) {
                data.push({
                  ...elem,
                  assigned_under: "self",
                  bugType,
                  bugSegment,
                });
              }
            });

            // dfs search in the tree
            const dfs_search = (curr, ultimate_parent) => {
              const childNodes = contextData.parentChildMap.has(curr)
                ? contextData.parentChildMap.get(curr)
                : [];
              table.forEach((elem) => {
                const bugType = elem.bug_type;
                const bugSegment = elem.bug_segment;
                elem = elem.bug_info;
                if (
                  elem.emp_id === curr ||
                  ((elem.emp_id === "" ||
                    !contextData.userFullNameMap.has(elem.emp_id)) &&
                    elem.mgr_id === curr)
                ) {
                  data.push({
                    ...elem,
                    assigned_under: ultimate_parent,
                    bugSegment,
                    bugType,
                  });
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
          //filtering data according to lvl 1 filters
          data = data.filter((elem) => {
            return bugType.includes(elem.state) || bugType === "all";
          });

          setSegmentCountData(data);
        };
        //api call
        const fetchData = async () => {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/test/teacats`
            );
            const responseData = await response.json();
            contextData.setTeacatsTable(responseData);
          } catch (err) {
            console.log(err);
            alert("Can't fetch teacats bug details at the moment");
          }
        };
        //fetch table
        if (!contextData.isTeacatsTableLoaded) {
          await fetchData();
          contextData.setIsTeacatsTableLoaded(true);
        }
        const table = contextData.isTeacatsTableLoaded
          ? contextData.teacatsTable.data
          : [];
        loadData(table);

        if (userId !== prevUser || bugType !== prevType) {
          segmentData(table);
        }
      };
      try {
        mainFunction();
      } catch (err) {
        console.log(err);
      }
      if (contextData.isTeacatsTableLoaded) {
        setPrevUser(userId);
        setPrevType(bugType);
        contextData.setIsTeacatsPageLoading(false);
      }
    },
    // eslint-disable-next-line
    [userId, bugSegment, contextData.isTeacatsTableLoaded, bugType] // dependency array
  );
  var outstandingAll = 0;
  var outstandinglte7 = 0;
  var outstandinggt7 = 0;
  var resolvedWeek = 0;
  var resolvedQuarter = 0;
  var resolvedMonth = 0;
  var resolvedSemi = 0;

  if (userId === "all") {
    contextData.teacatsTable.data.forEach((elem) => {
      const bugSegment = elem.bug_segment;
      elem = elem.bug_info;

      if (bugSegment === "lte7") outstandinglte7++;
      else if (bugSegment === "gt7") outstandinggt7++;
      else if (bugSegment === "week") resolvedWeek++;
      else if (bugSegment === "quarter") resolvedQuarter++;
      else if (bugSegment === "month") resolvedMonth++;
      else resolvedSemi++;
    });

    outstandingAll = outstandinggt7 + outstandinglte7;
    resolvedMonth = resolvedMonth + resolvedWeek;
    resolvedQuarter = resolvedQuarter + resolvedMonth;
    resolvedSemi = resolvedSemi + resolvedQuarter;
  } else {
    segmentCountData.forEach((elem) => {
      const bugSegment = elem.bugSegment;
      if (bugSegment === "lte7") outstandinglte7++;
      else if (bugSegment === "gt7") outstandinggt7++;
      else if (bugSegment === "week") resolvedWeek++;
      else if (bugSegment === "quarter") resolvedQuarter++;
      else if (bugSegment === "month") resolvedMonth++;
      else resolvedSemi++;
    });

    outstandingAll = outstandinggt7 + outstandinglte7;
    resolvedMonth = resolvedMonth + resolvedWeek;
    resolvedQuarter = resolvedQuarter + resolvedMonth;
    resolvedSemi = resolvedSemi + resolvedQuarter;
  }
  //outstanding segment chart parameters
  const diffOutstandingSegment = ["lte7", "gt7"];
  const diffOutstandingSegmentCount = diffOutstandingSegment.map((segment) => {
    var count = 0;
    viewData.forEach((elem) => {
      if (elem.bugSegment === segment) count++;
    });
    return {
      name: segmentFullNameMap.get(segment),
      y: count,
    };
  });
  const outstandingSegmentChartOptions = {
    chart: {
      type: "pie",
      height: 400,
      width: 400,
    },
    title: {
      text: "Outstanding Segment Chart",
    },
    subtitle: {
      text: `Bugs count: ${
        diffOutstandingSegmentCount[0].y + diffOutstandingSegmentCount[1].y
      }`,
    },
    colors: ["#FFC300", "#ef4444", "#A40A3C", "#6B0848"],
    // colors: ["#16803C", "#41AEA9", "#213E3B", "#E8FFFF"],
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
      text: `For: State (AMINO)`,
      style: {
        fontSize: "15px",
      },
      position: {
        align: "right",
      },
    },

    xAxis: {
      categories: diffOutstandingSegment.map((e) => segmentFullNameMap.get(e)),
    },
    series: [
      {
        name: "No. of bugs",
        data: diffOutstandingSegmentCount,
        events: {
          click: (e) => {
            const currentTeacatsStatus = contextData.teacats_states;
            contextData.setTeacatsStates({
              bugSegment: reverseSegmentMap.get(e.point.name),
              bugType: "AMINO",
              sortedFeature: currentTeacatsStatus.sortedFeature,
              tableOpen: currentTeacatsStatus.tableOpen,
            });
          },
        },
      },
    ],
  };
  //resolved segment chart parameters
  const diffResolvedSegment = ["week", "month", "quarter", "semi"];
  const diffResolvedSegmentCount = diffResolvedSegment.map((segment) => {
    var count = 0;
    viewData.forEach((elem) => {
      if (weekBarValidityMap.has(elem.bugSegment)) {
        if (weekBarValidityMap.get(elem.bugSegment).has(segment)) count++;
      }
    });
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
  const resolvedSegmentChartOptions = {
    chart: {
      type: "column",
      height: 400,
      width: 400,
    },
    title: {
      text: "Resolved Segment Chart",
    },
    subtitle: {
      text: `Bugs count: ${diffResolvedSegmentCount[3].y}`,
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
      text: `For: State (RJDCU)`,
      style: {
        fontSize: "15px",
      },
      position: {
        align: "right",
      },
    },

    xAxis: {
      categories: diffResolvedSegment.map(
        (e) =>
          `${
            contextData.teacatsTable.dates
              ? contextData.teacatsTable.dates[e]["lower limit df"]
              : ""
          } <br> - ${
            contextData.teacatsTable.dates
              ? contextData.teacatsTable.dates[e]["upper limit df"]
              : ""
          }`
      ),
    },
    series: [
      {
        name: "No. of bugs",
        data: diffResolvedSegmentCount,
        events: {
          click: (e) => {
            const currentTeacatsStatus = contextData.teacats_states;
            contextData.setTeacatsStates({
              bugSegment: reverseSegmentMap.get(e.point.name),
              bugType: "RJDCU",
              sortedFeature: currentTeacatsStatus.sortedFeature,
              tableOpen: currentTeacatsStatus.tableOpen,
            });
          },
        },
      },
    ],
  };

  //distribution chart parameters
  var diffAssign =
    userId !== "all" || bugType === "all"
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
      height: 400,
      width: bugType === "all" ? 400 : 600,
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
      text: `For: ${
        bugSegment !== "all" ? segmentFullNameMap.get(bugSegment) : "All"
      }, State (${bugType})`,
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
              contextData.setIsTeacatsPageLoading(true);
              navigate(`/teacats/view/${e.point.category}`);
            }
          },
        },
      },
    ],
  };
  //type chart parameters
  const diffTypes = bugType === "all" ? ["AMINO", "RJDCU"] : bugType.split("");

  const diffTypeCount = diffTypes.map((type) => {
    let count = 0;
    viewData.forEach((elem) => {
      if (type.includes(elem.state)) count++;
    });
    return {
      name:
        type === "AMINO" ? "Outstanding" : type === "RJDCU" ? "Resolved" : type,
      y: count,
      selected: false,
    };
  });
  const typeChartOptions = {
    chart: {
      type: "pie",
      height: 400,
      width: bugType === "all" ? 400 : 600,
    },
    title: {
      text: "State Chart",
    },
    subtitle: {
      text: `Bug Count: ${viewData.length}`,
    },
    colors: ["#D789D7", "#9D65C9", "#5D54A4", "#2A3D66", "#000000"],
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
      text: `For: ${
        bugType === "all"
          ? ""
          : bugSegment !== "all"
          ? segmentFullNameMap.get(bugSegment) + ","
          : "All,"
      } State (${bugType})`,
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
            selectBugType(
              e.point.name === "Outstanding"
                ? "AMINO"
                : e.point.name === "Resolved"
                ? "RJDCU"
                : e.point.name
            );
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
      text: `For: ${
        bugSegment !== "all" ? segmentFullNameMap.get(bugSegment) : "All"
      }, State (${bugType})`,
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
      contextData.setIsTeacatsPageLoading(true);
      navigate(`/teacats/view/${user}`);
    }
  };

  // filtering data according to type (lvl 1 filter)
  const selectBugType = (type) => {
    const currentTeacatsStatus = contextData.teacats_states;
    if ("AMINO".includes(type)) {
      if (
        ["week", "month", "quarter", "semi", "none"].includes(
          contextData.teacats_states.bugSegment
        )
      ) {
        contextData.setTeacatsStates({
          bugSegment: "all",
          bugType: type,
          sortedFeature: currentTeacatsStatus.sortedFeature,
          tableOpen: currentTeacatsStatus.tableOpen,
        });
      } else {
        contextData.setTeacatsStates({
          bugSegment: currentTeacatsStatus.bugSegment,
          bugType: type,
          sortedFeature: currentTeacatsStatus.sortedFeature,
          tableOpen: currentTeacatsStatus.tableOpen,
        });
      }
    } else if ("RJDCU".includes(type)) {
      if (
        ["all", "lte7", "gt7", "none"].includes(
          contextData.teacats_states.bugSegment
        )
      ) {
        contextData.setTeacatsStates({
          bugSegment: "semi",
          bugType: type,
          sortedFeature: currentTeacatsStatus.sortedFeature,
          tableOpen: currentTeacatsStatus.tableOpen,
        });
      } else {
        contextData.setTeacatsStates({
          bugSegment: currentTeacatsStatus.bugSegment,
          bugType: type,
          sortedFeature: currentTeacatsStatus.sortedFeature,
          tableOpen: currentTeacatsStatus.tableOpen,
        });
      }
    } else {
      contextData.setTeacatsStates({
        bugSegment: "semi",
        bugType: "all",
        sortedFeature: currentTeacatsStatus.sortedFeature,
        tableOpen: currentTeacatsStatus.tableOpen,
      });
    }
  };

  //for change assignee table states
  const setTableOpen = (value) => {
    const currentTeacatsStatus = contextData.teacats_states;
    contextData.setTeacatsStates({
      bugSegment: currentTeacatsStatus.bugSegment,
      bugType: currentTeacatsStatus.bugType,
      sortedFeature: currentTeacatsStatus.sortedFeature,
      tableOpen: value,
    });
  };

  // filtering data according to status (lvl 1 filter)
  const selectBugSegment = (segment) => {
    const currentTeacatsStatus = contextData.teacats_states;
    contextData.setTeacatsStates({
      bugSegment: segment,
      bugType: currentTeacatsStatus.bugType,
      sortedFeature: currentTeacatsStatus.sortedFeature,
      tableOpen: currentTeacatsStatus.tableOpen,
    });
  };

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
      {contextData.isTeacatsPageLoading ||
      !contextData.isTeacatsTableLoaded ||
      (bugType !== "all" && bugSegment === "none") ? (
        <>
          <div className="h-full w-full flex flex-row justify-center items-center">
            <Loader size="lg" />
          </div>
        </>
      ) : (
        <>
          {/* page block */}
          <div className="bg-gray-200 flex h-full overflow-y-auto flex-col py-3 space-y-2">
            <div className="flex flex-row justify-center mb-[-35px]">
              {" "}
              <span className=" bg-blue-600 py-2 px-3 rounded-lg text-white font-bold text-lg">
                Test Metrics : Teacats
              </span>
            </div>
            <ProfileSearchBar
              selectUserId={selectUserId}
              table={
                contextData.teacatsTable.data
                  ? contextData.teacatsTable.data
                  : []
              }
              userId={userId}
              type={"teacats"}
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

                    <div className="flex flex-col items-center space-y-2">
                      <TeacatsTypeRadio
                        value={bugType}
                        selectBugType={selectBugType}
                      />
                      {bugType !== "all" ? (
                        <>
                          <TeacatsSegmentRadio
                            value={bugSegment}
                            selectSegment={selectBugSegment}
                          />
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    <Typography variant="h5" className="pl-4 text-center">
                      {" "}
                      Total no. of Bugs : <span>{viewData.length}</span>{" "}
                    </Typography>
                  </div>
                  <div className="  w-1/5 flex flex-col justify-evenly items-center">
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
                                contextData.setIsTeacatsPageLoading(true);
                                navigate(`/teacats/view/${elem}`);
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
                {bugType !== "all" ? (
                  "AMINO".includes(bugType) ? (
                    <>
                      <hr className="border-[1px] border-blue-gray-200" />
                      <div className="w-full  h-16 flex flex-row justify-evenly items-center pt-1 ">
                        <div className="w-1/5 h-full  flex flex-col">
                          <div className={`h-3/10 w-full text-center `}>
                            {" "}
                            <span
                              className={
                                bugSegment === "all"
                                  ? "font-bold text-white bg-green-700 px-2 py-[3px] rounded-md"
                                  : "font-semibold text-blue-gray-500"
                              }
                            >
                              All Time
                            </span>
                          </div>
                          <div className="h-7/10 w-full flex flex-col justify-center">
                            <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                              <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                                <div className="w-[10px] h-[10px] bg-blue-600 rounded-full"></div>
                              </div>
                              <div className="h-fit w-1/2 flex flex-row justify-start ">
                                <span
                                  className={
                                    bugSegment === "all" ? "font-bold" : ""
                                  }
                                >
                                  {outstandingAll}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-1/5 h-full  flex flex-col">
                          <div className={`h-3/10 w-full text-center `}>
                            {" "}
                            <span
                              className={
                                bugSegment === "lte7"
                                  ? "font-bold text-white bg-green-700 px-2 py-[3px] rounded-md"
                                  : "font-semibold text-blue-gray-500"
                              }
                            >
                              {segmentFullNameMap.get("lte7")}
                            </span>
                          </div>
                          <div className="h-7/10 w-full flex flex-col justify-center">
                            <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                              <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                                <div className="w-[10px] h-[10px] bg-blue-600 rounded-full"></div>
                              </div>
                              <div className="h-fit w-1/2 flex flex-row justify-start ">
                                <span
                                  className={
                                    bugSegment === "lte7" ? "font-bold" : ""
                                  }
                                >
                                  {outstandinglte7}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-1/5 h-full  flex flex-col">
                          <div className={`h-3/10 w-full text-center `}>
                            {" "}
                            <span
                              className={
                                bugSegment === "gt7"
                                  ? "font-bold text-white bg-green-700 px-2 py-[3px] rounded-md"
                                  : "font-semibold text-blue-gray-500"
                              }
                            >
                              {segmentFullNameMap.get("gt7")}
                            </span>
                          </div>
                          <div className="h-7/10 w-full flex flex-col justify-center">
                            <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                              <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                                <div className="w-[10px] h-[10px] bg-blue-600 rounded-full"></div>
                              </div>
                              <div className="h-fit w-1/2 flex flex-row justify-start ">
                                <span
                                  className={
                                    bugSegment === "gt7" ? "font-bold" : ""
                                  }
                                >
                                  {outstandinggt7}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <hr className="border-[1px] border-blue-gray-200" />
                      <div className="w-full  h-16 flex flex-row justify-evenly items-center pt-1">
                        <div className="w-1/5 h-full  flex flex-col">
                          <div className={`h-3/10 w-full text-center `}>
                            {" "}
                            <span
                              className={
                                bugSegment === "week"
                                  ? "font-bold text-white bg-green-700 px-2 py-[3px] rounded-md"
                                  : "font-semibold text-blue-gray-500"
                              }
                            >
                              {segmentFullNameMap.get("week")}
                            </span>
                          </div>
                          <div className="h-7/10 w-full flex flex-col justify-center">
                            <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                              <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                                <div className="w-[10px] h-[10px] bg-blue-600 rounded-full"></div>
                              </div>
                              <div className="h-fit w-1/2 flex flex-row justify-start ">
                                <span
                                  className={
                                    bugSegment === "week" ? "font-bold" : ""
                                  }
                                >
                                  {resolvedWeek}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-1/5 h-full  flex flex-col">
                          <div className={`h-3/10 w-full text-center `}>
                            {" "}
                            <span
                              className={
                                bugSegment === "month"
                                  ? "font-bold text-white bg-green-700 px-2 py-[3px] rounded-md"
                                  : "font-semibold text-blue-gray-500"
                              }
                            >
                              {segmentFullNameMap.get("month")}
                            </span>
                          </div>
                          <div className="h-7/10 w-full flex flex-col justify-center">
                            <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                              <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                                <div className="w-[10px] h-[10px] bg-blue-600 rounded-full"></div>
                              </div>
                              <div className="h-fit w-1/2 flex flex-row justify-start ">
                                <span
                                  className={
                                    bugSegment === "month" ? "font-bold" : ""
                                  }
                                >
                                  {resolvedMonth}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-1/5 h-full  flex flex-col">
                          <div className={`h-3/10 w-full text-center `}>
                            {" "}
                            <span
                              className={
                                bugSegment === "quarter"
                                  ? "font-bold text-white bg-green-700 px-2 py-[3px] rounded-md"
                                  : "font-semibold text-blue-gray-500"
                              }
                            >
                              {segmentFullNameMap.get("quarter")}
                            </span>
                          </div>
                          <div className="h-7/10 w-full flex flex-col justify-center">
                            <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                              <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                                <div className="w-[10px] h-[10px] bg-blue-600 rounded-full"></div>
                              </div>
                              <div className="h-fit w-1/2 flex flex-row justify-start ">
                                <span
                                  className={
                                    bugSegment === "quarter" ? "font-bold" : ""
                                  }
                                >
                                  {resolvedQuarter}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-1/5 h-full  flex flex-col">
                          <div className={`h-3/10 w-full text-center `}>
                            {" "}
                            <span
                              className={
                                bugSegment === "semi"
                                  ? "font-bold text-white bg-green-700 px-2 py-[3px] rounded-md"
                                  : "font-semibold text-blue-gray-500"
                              }
                            >
                              {segmentFullNameMap.get("semi")}
                            </span>
                          </div>
                          <div className="h-7/10 w-full flex flex-col justify-center">
                            <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                              <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                                <div className="w-[10px] h-[10px] bg-blue-600 rounded-full"></div>
                              </div>
                              <div className="h-fit w-1/2 flex flex-row justify-start ">
                                <span
                                  className={
                                    bugSegment === "semi" ? "font-bold" : ""
                                  }
                                >
                                  {resolvedSemi}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                ) : (
                  <></>
                )}

                {/* data block, contains charts and table */}
                <div className="w-full flex flex-col space-y-4 px-0">
                  {/* level 1 charts */}
                  <div className="flex flex-col space-y-3 pt-3 items-center pt-1 pb-2 px-8 bg-blue-gray-200">
                    {"AMINO".includes(bugType) ? (
                      bugSegment === "all" ? (
                        <>
                          <Card className="p-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-full font-bold text-lg text-green-800 ">
                            {" "}
                            All Time{" "}
                          </Card>
                        </>
                      ) : (
                        <>
                          <Card className="p-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-full font-bold text-lg text-green-800 ">
                            {" "}
                            {segmentFullNameMap.get(bugSegment)}{" "}
                          </Card>
                        </>
                      )
                    ) : bugType !== "all" ? (
                      <>
                        <Card className="p-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-full font-bold text-lg text-green-800 ">
                          {" "}
                          {segmentFullNameMap.get(bugSegment)}
                          {" : "}
                          {contextData.teacatsTable.dates
                            ? contextData.teacatsTable.dates[bugSegment][
                                "lower limit"
                              ]
                            : ""}
                          {" - "}
                          {contextData.teacatsTable.dates
                            ? contextData.teacatsTable.dates[bugSegment][
                                "upper limit"
                              ]
                            : ""}{" "}
                        </Card>
                      </>
                    ) : (
                      <></>
                    )}

                    <Card
                      className={`pb-3 pt-1 px-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit ${
                        tableOpen ? "bg-white" : "bg-gray-300"
                      } `}
                    >
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
                          <TeacatsAssigneeTable
                            bugType={bugType}
                            tableData={assigneeTableData}
                            userId={userId}
                            bugSegment={segmentFullNameMap.get(bugSegment)}
                          />
                        </>
                      ) : (
                        <>
                          <div className="w-full flex flex-row space-x-3 justify-evenly items-center pt-1 ">
                            {bugType === "all" ? (
                              <>
                                <Card className="p-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit">
                                  <HighchartsReact
                                    highcharts={Highcharts}
                                    options={outstandingSegmentChartOptions}
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
                            {userId !== "all" && bugType !== "all" ? (
                              <>
                                <Card className=" p-4  flex flex-col justify-center items-center hover:drop-shadow-xl w-fit ">
                                  {diffAssignNumbers > 10 &&
                                  !showAllAssignees ? (
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

                            {bugType === "all" ? (
                              <>
                                <Card className="p-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit">
                                  <HighchartsReact
                                    highcharts={Highcharts}
                                    options={resolvedSegmentChartOptions}
                                  />
                                </Card>
                              </>
                            ) : (
                              <></>
                            )}
                          </div>
                        </>
                      )}
                    </Card>

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

                    {"AMINO".includes(bugType) ? (
                      <></>
                    ) : bugType !== "all" ? (
                      <>
                        <Card className="p-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-full font-bold text-lg text-green-800 ">
                          {" "}
                          {segmentFullNameMap.get(bugSegment)}
                          {" : "}
                          {contextData.teacatsTable.dates
                            ? contextData.teacatsTable.dates[bugSegment][
                                "lower limit"
                              ]
                            : ""}
                          {" - "}
                          {contextData.teacatsTable.dates
                            ? contextData.teacatsTable.dates[bugSegment][
                                "upper limit"
                              ]
                            : ""}{" "}
                        </Card>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>

                  {/* table block */}
                  <div className="px-4 bg-gray-50 pb-4 pt-6 space-y-2">
                    {/* table label with level 1 filter data */}
                    <Typography className="pl-4" variant="h3">
                      <span className="font-large font-mono text-base text-blue-500 text-lg">
                        View For:{" "}
                        {userId !== "all"
                          ? contextData.userFullNameMap.get(userId)
                          : "All"}
                      </span>
                      <br />
                      {bugType !== "all" ? (
                        <>
                          {" "}
                          {bugSegment !== "semi" && bugSegment !== "all" ? (
                            <>
                              <span className=" bg-gray-100 py-2 pl-3 rounded-md drop-shadow-md text-blue-500 font-medium font-mono text-base">
                                {segmentFullNameMap.get(bugSegment)}{" "}
                                <CloseIcon
                                  style={{ marginRight: 10, fontSize: "0.8em" }}
                                  className="fill-gray-500 hover:fill-red-500 hover:cursor-pointer"
                                  onClick={() => {
                                    if (bugType === "AMINO")
                                      selectBugSegment("all");
                                    else selectBugSegment("semi");
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
                                {bugType.length === 1
                                  ? typeFullNameMap.get(bugType)
                                  : bugType}{" "}
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
                    <TeacatsTable
                      userId={userId}
                      data={viewTableData}
                      sortViewTableAscending={sortViewTableAscending}
                      sortedFeature={sortedFeature}
                      bugType={bugType}
                    />
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

export default TeacatsViewPage;
