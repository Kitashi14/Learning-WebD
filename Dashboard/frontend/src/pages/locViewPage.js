import { useContext, useEffect, useState } from "react";
import ProfileSearchBar from "../components/profileSearchBar";
import {
  Card,
  Tab,
  Tabs,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useNavigate, useParams } from "react-router-dom";
import DataContext from "../context/dataContext";
import DevMetricsSegmentTypeRadio from "../components/devMetricsSegmentTypeRadio";
import { Loader } from "rsuite";
import LocAssigneeTable from "../components/locAssigneeTable";

// dashboard view page for any user
const LocViewPage = (props) => {
  //extracting context global data
  const contextData = useContext(DataContext);
  // useState containing all filter's states
  // level 1 filters
  const locSegment = contextData.loc_states.locSegment;
  const tableOpen = contextData.loc_states.tableOpen;

  const [viewData, setViewData] = useState([]); //it will contain all elements after applying level 1 filter, used for showing lvl 1 charts

  const [showAllAssignees, setShowAllAssignees] = useState(false);

  const segmentFullNameMap = new Map([
    ["month", "Monthly"],
    ["quarter", "Quarterly"],
    ["semi", "Semi Annually"],
  ]);
  const weekBarValidityMap = new Map([
    ["month", new Set(["month", "quarter", "semi"])],
    ["quarter", new Set(["quarter", "semi"])],
    ["semi", new Set(["semi"])],
  ]);

  const reverseSegmentMap = new Map();
  segmentFullNameMap.forEach((v, k) => {
    reverseSegmentMap.set(v, k);
  });

  const navigate = useNavigate(); //for navigating to different routes
  const userId = useParams().uid; //extracting user id from the route/url
  contextData.setLocUser(userId);

  // for finding all parents nodes of the current user
  const previous_parents = [userId];
  let currChild = userId;
  while (contextData.childParentMap.has(currChild)) {
    previous_parents.unshift(contextData.childParentMap.get(currChild));
    currChild = contextData.childParentMap.get(currChild);
  }
  if (userId !== "all") previous_parents.unshift("all");

  // for rending the whole page when a variable from dependency array changes its value
  useEffect(
    () => {
      const mainFunction = async () => {
        const loadData = async (tableMap) => {
          let data = [];

          //condition check is a valid is selected
          if (userId === "all") {
            const dataCount = {
              loc_month: 0,
              loc_quarter: 0,
              loc_semi: 0,
              pr_month: 0,
              pr_quarter: 0,
              pr_semi: 0,
            };
            tableMap.forEach((v, k) => {
              dataCount.loc_month =
                dataCount.loc_month +
                parseInt(
                  v.total_loc_monthly === null ? 0 : v.total_loc_monthly
                );
              dataCount.loc_quarter =
                dataCount.loc_quarter +
                parseInt(
                  v.total_loc_quarterly === null ? 0 : v.total_loc_quarterly
                );
              dataCount.loc_semi =
                dataCount.loc_semi +
                parseInt(
                  v.total_loc_semiannually === null
                    ? 0
                    : v.total_loc_semiannually
                );
              dataCount.pr_month =
                dataCount.pr_month +
                parseInt(
                  v.pr_reviewed_monthly === null ? 0 : v.pr_reviewed_monthly
                );
              dataCount.pr_quarter =
                dataCount.pr_quarter +
                parseInt(
                  v.pr_reviewed_quarterly === null ? 0 : v.pr_reviewed_quarterly
                );
              dataCount.pr_semi =
                dataCount.pr_semi +
                parseInt(
                  v.pr_reviewed_semiannually === null
                    ? 0
                    : v.pr_reviewed_semiannually
                );
            });
            data.push({
              assignee: "all",
              countDetails: dataCount,
            });
          } else {
            // storing all direct children nodes
            const childrens = contextData.parentChildMap.has(userId)
              ? contextData.parentChildMap.get(userId)
              : [];

            // filtering bugs assigned directly to user
            const assigneeCountMap = [];
            const selfCount = {
              loc_month: tableMap.has(userId)
                ? parseInt(
                    tableMap.get(userId).total_loc_monthly === null
                      ? 0
                      : tableMap.get(userId).total_loc_monthly
                  )
                : 0,
              loc_quarter: tableMap.has(userId)
                ? parseInt(
                    tableMap.get(userId).total_loc_quarterly === null
                      ? 0
                      : tableMap.get(userId).total_loc_quarterly
                  )
                : 0,
              loc_semi: tableMap.has(userId)
                ? parseInt(
                    tableMap.get(userId).total_loc_semiannually === null
                      ? 0
                      : tableMap.get(userId).total_loc_semiannually
                  )
                : 0,
              pr_month: tableMap.has(userId)
                ? parseInt(
                    tableMap.get(userId).pr_reviewed_monthly === null
                      ? 0
                      : tableMap.get(userId).pr_reviewed_monthly
                  )
                : 0,
              pr_quarter: tableMap.has(userId)
                ? parseInt(
                    tableMap.get(userId).pr_reviewed_quarterly === null
                      ? 0
                      : tableMap.get(userId).pr_reviewed_quarterly
                  )
                : 0,
              pr_semi: tableMap.has(userId)
                ? parseInt(
                    tableMap.get(userId).pr_reviewed_semiannually === null
                      ? 0
                      : tableMap.get(userId).pr_reviewed_semiannually
                  )
                : 0,
            };
            // if ((selfCount.loc_month+selfCount.loc_quarter+selfCount.loc_semi+selfCount.pr_month+selfCount.pr_quarter+selfCount.pr_semi) > 0)
            assigneeCountMap.push({
              assignee: "self",
              countDetails: selfCount,
            });

            // dfs search in the tree
            const dfs_search = (curr, ultimate_parent, assigneeObj) => {
              const childNodes = contextData.parentChildMap.has(curr)
                ? contextData.parentChildMap.get(curr)
                : [];
              assigneeObj.loc_month =
                assigneeObj.loc_month +
                (tableMap.has(curr)
                  ? parseInt(
                      tableMap.get(curr).total_loc_monthly === null
                        ? 0
                        : tableMap.get(curr).total_loc_monthly
                    )
                  : 0);

              assigneeObj.loc_quarter =
                assigneeObj.loc_quarter +
                (tableMap.has(curr)
                  ? parseInt(
                      tableMap.get(curr).total_loc_quarterly === null
                        ? 0
                        : tableMap.get(curr).total_loc_quarterly
                    )
                  : 0);

              assigneeObj.loc_semi =
                assigneeObj.loc_semi +
                (tableMap.has(curr)
                  ? parseInt(
                      tableMap.get(curr).total_loc_semiannually === null
                        ? 0
                        : tableMap.get(curr).total_loc_semiannually
                    )
                  : 0);

              assigneeObj.pr_month =
                assigneeObj.pr_month +
                (tableMap.has(curr)
                  ? parseInt(
                      tableMap.get(curr).pr_reviewed_monthly === null
                        ? 0
                        : tableMap.get(curr).pr_reviewed_monthly
                    )
                  : 0);

              assigneeObj.pr_quarter =
                assigneeObj.pr_quarter +
                (tableMap.has(curr)
                  ? parseInt(
                      tableMap.get(curr).pr_reviewed_quarterly === null
                        ? 0
                        : tableMap.get(curr).pr_reviewed_quarterly
                    )
                  : 0);
              assigneeObj.pr_semi =
                assigneeObj.pr_semi +
                (tableMap.has(curr)
                  ? parseInt(
                      tableMap.get(curr).pr_reviewed_semiannually === null
                        ? 0
                        : tableMap.get(curr).pr_reviewed_semiannually
                    )
                  : 0);
              childNodes.forEach((childNode) => {
                dfs_search(childNode, ultimate_parent, assigneeObj);
              });
            };

            // itterating to all nodes under a direct children one by one using dfs
            childrens.forEach((child) => {
              const assigneeCount = {
                loc_month: 0,
                loc_quarter: 0,
                loc_semi: 0,
                pr_month: 0,
                pr_quarter: 0,
                pr_semi: 0,
              };
              dfs_search(child, child, assigneeCount);
              console.log(child, assigneeCount);
              //   if ((assigneeCount.loc_month+assigneeCount.loc_quarter+assigneeCount.loc_semi+assigneeCount.pr_month+assigneeCount.pr_quarter+assigneeCount.pr_semi>0))
              assigneeCountMap.push({
                assignee: child,
                countDetails: assigneeCount,
              });
            });

            data = assigneeCountMap;
          }

          setViewData(data);
        };
        //api call
        const fetchData = async () => {
          try {
            const response = await fetch(
              `${process.env.REACT_APP_BACKEND_URL}/loc/details`
            );
            const responseData = await response.json();
            contextData.setLocTable(responseData.data);
            console.log(responseData);
          } catch (err) {
            console.log(err);
            alert("Can't fetch loc metrics details at the moment");
          }
        };

        //fetch table
        if (!contextData.isLocTableLoaded) {
          await fetchData();
          contextData.setIsLocTableLoaded(true);
        } else {
          const tableMapToUse = new Map();
          contextData.locTable.loc_data.forEach((e) => {
            tableMapToUse.set(e.emp_id, e);
          });
          loadData(tableMapToUse);
        }
      };
      try {
        mainFunction();
      } catch (err) {
        console.log(err);
      }
      console.log(contextData);
      if (contextData.isLocTableLoaded) {
        contextData.setIsLocPageLoading(false);
      }
    },
    // eslint-disable-next-line
    [userId, contextData.isLocTableLoaded] // dependency array
  );

  var total_loc_count = 0;
  var total_pr_count = 0;
  var monthly_loc = 0;
  var monthly_pr = 0;
  var quarter_loc = 0;
  var quarter_pr = 0;
  var semi_loc = 0;
  var semi_pr = 0;

  viewData.forEach((elem) => {
    monthly_loc = monthly_loc + elem.countDetails.loc_month;
    monthly_pr = monthly_pr + elem.countDetails.pr_month;
    quarter_loc = quarter_loc + elem.countDetails.loc_quarter;
    quarter_pr = quarter_pr + elem.countDetails.pr_quarter;
    semi_loc = semi_loc + elem.countDetails.loc_semi;
    semi_pr = semi_pr + elem.countDetails.pr_semi;
    if (locSegment === "month") {
      total_loc_count = total_loc_count + elem.countDetails.loc_month;
      total_pr_count = total_pr_count + elem.countDetails.pr_month;
    } else if (locSegment === "quarter") {
      total_loc_count = total_loc_count + elem.countDetails.loc_quarter;
      total_pr_count = total_pr_count + elem.countDetails.pr_quarter;
    } else {
      total_loc_count = total_loc_count + elem.countDetails.loc_semi;
      total_pr_count = total_pr_count + elem.countDetails.pr_semi;
    }
  });
  console.log(viewData);

  //   segment chart parameters
  const diffSegment = ["month", "quarter", "semi"];

  const segmentChartOptions = {
    chart: {
      type: "line",
      height: 605,
      width: 1300,
    },
    title: {
      text: "Segment Chart",
    },
    // colors: ["#FFC300", "#EC610A", "#A40A3C", "#6B0848"],
    //   colors: ["#16803C", "#41AEA9", "#213E3B", "#E8FFFF"],
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

    xAxis: {
      categories: diffSegment.map((elem) => segmentFullNameMap.get(elem)),
    },
    series: [
      {
        name: "No. of LOC",
        data: [monthly_loc, quarter_loc, semi_loc],
        events: {
          click: (e) => {
            //   selectBugSegment(reverseSegmentMap.get(e.point.name));
          },
        },
      },
      {
        name: "No. of PR",
        data: [monthly_pr, quarter_pr, semi_pr],
        events: {
          click: (e) => {
            //   selectBugSegment(reverseSegmentMap.get(e.point.name));
          },
        },
      },
    ],
  };

  const getAssigneeCount = () => {
    const loc = [];
    const pr = [];

    if (locSegment === "month") {
      viewData.sort(
        (a, b) => b.countDetails.loc_month - a.countDetails.loc_month
      );
      viewData.forEach((elem) => {
        loc.push({
          name:
            elem.assignee === "self"
              ? "Self"
              : contextData.userFullNameMap.get(elem.assignee),
          y: elem.countDetails.loc_month,
        });
        pr.push(elem.countDetails.pr_month);
      });
    } else if (locSegment === "quarter") {
      viewData.sort(
        (a, b) => b.countDetails.loc_quarter - a.countDetails.loc_quarter
      );
      viewData.forEach((elem) => {
        loc.push({
          name:
            elem.assignee === "self"
              ? "Self"
              : contextData.userFullNameMap.get(elem.assignee),
          y: elem.countDetails.loc_quarter,
        });
        pr.push(elem.countDetails.pr_quarter);
      });
    } else {
      viewData.sort(
        (a, b) => b.countDetails.loc_semi - a.countDetails.loc_semi
      );
      viewData.forEach((elem) => {
        loc.push({
          name:
            elem.assignee === "self"
              ? "Self"
              : contextData.userFullNameMap.get(elem.assignee),
          y: elem.countDetails.loc_semi,
        });
        pr.push(elem.countDetails.pr_semi);
      });
    }

    return {
      loc,
      pr,
    };
  };

  //distribution chart parameters

  var diffAssignCount =
    userId !== "all"
      ? getAssigneeCount()
      : {
          loc: [],
          pr: [],
        };
  var diffAssign = viewData.map((elem) => elem.assignee);
  const diffAssignNumbers = diffAssign.length;
  if (diffAssign.length > 10 && !showAllAssignees) {
    diffAssign = diffAssign.slice(0, 10);
    diffAssignCount = {
      loc: diffAssignCount.loc.slice(0, 10),
      pr: diffAssignCount.pr.slice(0, 10),
    };
  }
  const assignedChartOptions = {
    chart: {
      type: "column",
      height: 450,
      width: 1300,
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
      enabled: false,
      href: "#",
      text: `For: ${segmentFullNameMap.get(locSegment)}`,
      style: {
        fontSize: "15px",
      },
    },

    xAxis: {
      categories: diffAssign,
    },
    series: [
      {
        name: "No. of LOC",
        data: diffAssignCount.loc,
        innerSize: "50%",
        events: {
          click: (e) => {
            if (e.point.category !== "self") {
              contextData.setIsLocPageLoading(true);
              navigate(`/loc/view/${e.point.category}`);
            }
          },
        },
      },
      {
        name: "No. of PRs",
        data: diffAssignCount.pr,
        innerSize: "50%",
        events: {
          click: (e) => {
            if (e.point.category !== userId) {
              contextData.setIsLocPageLoading(true);
              navigate(`/loc/view/${e.point.category}`);
            }
          },
        },
      },
    ],
  };

  // wrappers function for selecting user from the user search bar
  const selectUserId = (user) => {
    if (user !== userId) {
      contextData.setIsLocPageLoading(true);
      navigate(`/loc/view/${user}`);
    }
  };

  //for change assignee table states
  const setTableOpen = (value) => {
    const currentLocStatus = contextData.loc_states;
    contextData.setLoc({
      locSegment: currentLocStatus.locSegment,
      tableOpen: value,
    });
  };

  // filtering data according to status (lvl 1 filter)
  const selectLocSegment = (segment) => {
    const currentLocStatus = contextData.loc_states;
    contextData.setLoc({
      locSegment: segment,
      tableOpen: currentLocStatus.tableOpen,
    });
  };
  return (
    <>
      {contextData.isLocPageLoading || !contextData.isLocTableLoaded ? (
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
                Loc Metrics
              </span>
            </div>
            <ProfileSearchBar
              selectUserId={selectUserId}
              table={contextData.locTable ? contextData.locTable.loc_data : []}
              userId={userId}
              type={"loc"}
            />

            {/* level 1 filter block */}
            <div className=" flex flex-row justify-stretch">
              <div className="flex flex-col items-center px-3 rounded-lg space-y-3 bg-gray-50 drop-shadow-md border-blue-200 border-none border-[1px] border-solid py-2 w-fit m-auto ">
                <Card className="w-fit flex flex-row items-center px-3 py-3 ">
                  View For :
                  <span className="text-base text-blue-500 font-bold pl-2">
                    {userId === "all"
                      ? "All"
                      : contextData.userFullNameMap.get(userId)}
                  </span>
                </Card>

                {userId !== "all" ? (
                  <>
                    <div className="flex flex-col items-center space-y-3">
                      <DevMetricsSegmentTypeRadio
                        value={locSegment}
                        selectSegment={selectLocSegment}
                        data={segmentFullNameMap}
                        type={"loc"}
                      />
                    </div>
                    <div className="flex flex-row space-x-8">
                      <Typography variant="h5" className="pl-4 text-center">
                        {" "}
                        Total no. of LOC : <span>{total_loc_count}</span>{" "}
                      </Typography>
                      <Typography variant="h5" className="pl-4 text-center">
                        {" "}
                        Total no. of PRs Reviewed : <span>{total_pr_count}</span>{" "}
                      </Typography>
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
                            contextData.setIsLocPageLoading(true);
                            navigate(`/loc/view/${elem}`);
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
            {userId !== "all" ? (
              <>
                <div className="w-full  h-16 flex flex-row justify-evenly items-center pt-1">
                  <div className="w-1/5 h-full  flex flex-col">
                    <div
                      className={`h-3/10 w-full text-center  ${
                        locSegment === "month"
                          ? "font-bold text-blue-500"
                          : "font-semibold text-blue-gray-500"
                      } `}
                    >
                      {" "}
                      Monthly
                    </div>
                    <div className="h-7/10 w-full flex flex-col justify-center">
                      <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                        <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                          <div className="w-[10px] h-[10px] bg-blue-600 rounded-full"></div>
                        </div>
                        <div className="h-fit w-1/2 flex flex-row justify-start ">
                          <span>{monthly_loc}</span>
                        </div>
                      </div>
                      <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                        <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                          <div className="w-[10px] h-[10px] bg-purple-600 rounded-full"></div>
                        </div>
                        <div className="h-fit w-1/2 flex flex-row justify-start ">
                          <span>{monthly_pr}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-1/5 h-full  flex flex-col">
                    <div
                      className={`h-3/10 w-full text-center  ${
                        locSegment === "quarter"
                          ? "font-bold text-blue-500"
                          : "font-semibold text-blue-gray-500"
                      } `}
                    >
                      {" "}
                      Quarterly
                    </div>
                    <div className="h-7/10 w-full flex flex-col justify-center">
                      <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                        <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                          <div className="w-[10px] h-[10px] bg-blue-600 rounded-full"></div>
                        </div>
                        <div className="h-fit w-1/2 flex flex-row justify-start ">
                          <span>{quarter_loc}</span>
                        </div>
                      </div>
                      <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                        <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                          <div className="w-[10px] h-[10px] bg-purple-600 rounded-full"></div>
                        </div>
                        <div className="h-fit w-1/2 flex flex-row justify-start ">
                          <span>{quarter_pr}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-1/5 h-full  flex flex-col">
                    <div
                      className={`h-3/10 w-full text-center  ${
                        locSegment === "semi"
                          ? "font-bold text-blue-500"
                          : "font-semibold text-blue-gray-500"
                      } `}
                    >
                      {" "}
                      Semi Annually
                    </div>
                    <div className="h-7/10 w-full flex flex-col justify-center">
                      <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                        <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                          <div className="w-[10px] h-[10px] bg-blue-600 rounded-full"></div>
                        </div>
                        <div className="h-fit w-1/2 flex flex-row justify-start ">
                          <span>{semi_loc}</span>
                        </div>
                      </div>
                      <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                        <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                          <div className="w-[10px] h-[10px] bg-purple-600 rounded-full"></div>
                        </div>
                        <div className="h-fit w-1/2 flex flex-row justify-start ">
                          <span>{semi_pr}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            {/* <div className="w-full px-8 py-[1px] ">
              <div className="w-full flex flex-row bg-gray-50 border-solid border-[1px] border-gray-300 rounded-md h-[22px]">
                <div
                  style={{
                    background: weekBarValidityMap.get("annual").has(bugSegment)
                      ? "#16803B"
                      : "",
                  }}
                  className="rounded-l-md  w-[50%]"
                ></div>
                <div
                  style={{
                    background: weekBarValidityMap.get("semi").has(bugSegment)
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
                    background: weekBarValidityMap.get("week-4").has(bugSegment)
                      ? "#16803B"
                      : "",
                  }}
                  className="border-solid border-r-[1px] border-gray-300 w-[4%]"
                ></div>
                <div
                  style={{
                    background: weekBarValidityMap.get("week-3").has(bugSegment)
                      ? "#16803B"
                      : "",
                  }}
                  className="border-solid border-r-[1px] border-gray-300 w-[4%]"
                ></div>
                <div
                  style={{
                    background: weekBarValidityMap.get("week-2").has(bugSegment)
                      ? "#16803B"
                      : "",
                  }}
                  className="border-solid border-r-[1px] border-gray-300 w-[4%]"
                ></div>
                <div
                  style={{
                    background: weekBarValidityMap.get("week-1").has(bugSegment)
                      ? "#16803B"
                      : "",
                  }}
                  className="border-solid border-r-[1px] border-gray-300 w-[4%]"
                ></div>
                <div
                  style={{
                    background: weekBarValidityMap.get("week-0").has(bugSegment)
                      ? "#16803B"
                      : "",
                  }}
                  className=" rounded-r-md border-solid border-r-[1px] border-gray-300 w-[2%]"
                ></div>
              </div>
            </div> */}

            {/* data block, contains charts and table */}
            <div className="w-full flex flex-col space-y-4 px-0">
              {/* level 1 charts */}
              <div className="flex flex-col space-y-3 pt-3 items-center pt-1 pb-2 px-8 bg-blue-gray-200">
                {userId !== "all" ? (
                  <>
                    <Card className="p-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-full font-bold text-lg text-green-800 ">
                      {" "}
                      {segmentFullNameMap.get(locSegment)}
                      {" : "}
                      {contextData.locTable.dates[locSegment]
                        ? contextData.locTable.dates[locSegment]["lower limit"]
                        : ""}
                      {" - "}
                      {contextData.locTable.dates[locSegment]
                        ? contextData.locTable.dates[locSegment]["upper limit"]
                        : ""}{" "}
                    </Card>
                    <Card className="pb-3 pt-1 px-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit ">
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
                      {tableOpen && userId !== "all" ? (
                        <>
                          <LocAssigneeTable
                        locSegment={locSegment}
                        tableData={viewData}
                        userId={userId}
                        monthly_loc={monthly_loc}
                        monthly_pr={monthly_pr}
                        quarter_loc={quarter_loc}
                        quarter_pr={quarter_loc}
                        semi_loc={semi_loc}
                        semi_pr={semi_pr}
                      />
                        </>
                      ) : (
                        <>
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
                        </>
                      )}
                    </Card>
                  </>
                ) : (
                  <>
                    <Card className="pb-3 pt-1 px-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit ">
                      <HighchartsReact
                        highcharts={Highcharts}
                        options={segmentChartOptions}
                      />
                    </Card>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default LocViewPage;
