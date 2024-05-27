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
import { Loader, SelectPicker } from "rsuite";
import LocAssigneeTable from "../components/locAssigneeTable";

// dashboard view page for any user
const LocViewPage = (props) => {
  //extracting context global data
  const contextData = useContext(DataContext);
  // useState containing all filter's states
  // level 1 filters
  const locSegment = contextData.loc_states.locSegment;
  const tableOpen = contextData.loc_states.tableOpen;
  const customDates = contextData.loc_states.customDates;

  const [viewData, setViewData] = useState([]); //it will contain all elements after applying level 1 filter, used for showing lvl 1 charts

  //for invalid userId
  const [isUserValid, SetIsUserValid] = useState(true);

  //custom date state
  const [selectedCustomDate, setSelectedCustomDate] = useState(null);

  const [showAllLocAssignees, setShowAllLocAssignees] = useState(false);
  const [showAllPrAssignees, setShowAllPrAssignees] = useState(false);
  const tableSortBy = contextData.loc_states.tableSortBy;

  const segmentFullNameMap = new Map([
    ["month", "Monthly"],
    ["quarter", "Quarterly"],
    ["semi", "Semi Annually"],
    ["custom", "Custom Segment"],
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
        const loadData = async (table) => {
          let data = [];
          if (userId === "all") {
            const dataCount = {
              loc_month: 0,
              loc_quarter: 0,
              loc_semi: 0,
              loc_custom: 0,
              pr_month: 0,
              pr_quarter: 0,
              pr_semi: 0,
              pr_custom: 0,
            };
            table["month"]["bugs"].forEach((e) => {
              dataCount.loc_month = dataCount.loc_month + e.loc;
              if (e.reviewer !== "") dataCount.pr_month++;
            });

            table["quarter"]["bugs"].forEach((e) => {
              dataCount.loc_quarter = dataCount.loc_quarter + e.loc;
              if (e.reviewer !== "") dataCount.pr_quarter++;
            });

            table["semi"]["bugs"].forEach((e) => {
              dataCount.loc_semi = dataCount.loc_semi + e.loc;
              if (e.reviewer !== "") dataCount.pr_semi++;
            });

            table["custom"]["bugs"].forEach((e) => {
              dataCount.loc_custom = dataCount.loc_custom + e.loc;
              if (e.reviewer !== "") dataCount.pr_custom++;
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
              loc_month: 0,
              loc_quarter: 0,
              loc_semi: 0,
              loc_custom: 0,
              pr_month: 0,
              pr_quarter: 0,
              pr_semi: 0,
              pr_custom: 0,
            };

            table["month"]["bugs"].forEach((e) => {
              if (e.emp_id === userId) {
                selfCount.loc_month = selfCount.loc_month + e.loc;
              }
              const reviewers = e.reviewer
                ? new Set(
                    e.reviewer.split(",").map((p) => {
                      return p.trim();
                    })
                  )
                : new Set();

              if (reviewers.has(userId)) selfCount.pr_month++;
            });

            table["quarter"]["bugs"].forEach((e) => {
              if (e.emp_id === userId) {
                selfCount.loc_quarter = selfCount.loc_quarter + e.loc;
              }
              const reviewers = e.reviewer
                ? new Set(
                    e.reviewer.split(",").map((p) => {
                      return p.trim();
                    })
                  )
                : new Set();

              if (reviewers.has(userId)) selfCount.pr_quarter++;
            });

            table["semi"]["bugs"].forEach((e) => {
              if (e.emp_id === userId) {
                selfCount.loc_semi = selfCount.loc_semi + e.loc;
              }
              const reviewers = e.reviewer
                ? new Set(
                    e.reviewer.split(",").map((p) => {
                      return p.trim();
                    })
                  )
                : new Set();

              if (reviewers.has(userId)) selfCount.pr_semi++;
            });

            table["custom"]["bugs"].forEach((e) => {
              if (e.emp_id === userId) {
                selfCount.loc_custom = selfCount.loc_custom + e.loc;
              }
              const reviewers = e.reviewer
                ? new Set(
                    e.reviewer.split(",").map((p) => {
                      return p.trim();
                    })
                  )
                : new Set();

              if (reviewers.has(userId)) selfCount.pr_custom++;
            });

            if (
              selfCount.loc_month +
                selfCount.loc_quarter +
                selfCount.loc_semi +
                selfCount.loc_custom +
                selfCount.pr_month +
                selfCount.pr_quarter +
                selfCount.pr_custom +
                selfCount.pr_semi >
              0
            )
              assigneeCountMap.push({
                assignee: "self",
                countDetails: selfCount,
              });

            // dfs search in the tree
            const dfs_search = (curr, assigneeObj) => {
              const childNodes = contextData.parentChildMap.has(curr)
                ? contextData.parentChildMap.get(curr)
                : [];

              table["month"]["bugs"].forEach((e) => {
                if (e.emp_id === curr) {
                  assigneeObj.loc_month = assigneeObj.loc_month + e.loc;
                }
                const reviewers = e.reviewer
                  ? new Set(
                      e.reviewer.split(",").map((p) => {
                        return p.trim();
                      })
                    )
                  : new Set();

                if (reviewers.has(curr)) assigneeObj.pr_month.add(e.cdet_id);
              });

              table["quarter"]["bugs"].forEach((e) => {
                if (e.emp_id === curr) {
                  assigneeObj.loc_quarter = assigneeObj.loc_quarter + e.loc;
                }
                const reviewers = e.reviewer
                  ? new Set(
                      e.reviewer.split(",").map((p) => {
                        return p.trim();
                      })
                    )
                  : new Set();

                if (reviewers.has(curr)) assigneeObj.pr_quarter.add(e.cdet_id);
              });

              table["semi"]["bugs"].forEach((e) => {
                if (e.emp_id === curr) {
                  assigneeObj.loc_semi = assigneeObj.loc_semi + e.loc;
                }
                const reviewers = e.reviewer
                  ? new Set(
                      e.reviewer.split(",").map((p) => {
                        return p.trim();
                      })
                    )
                  : new Set();

                if (reviewers.has(curr)) assigneeObj.pr_semi.add(e.cdet_id);
              });

              table["custom"]["bugs"].forEach((e) => {
                if (e.emp_id === curr) {
                  assigneeObj.loc_custom = assigneeObj.loc_custom + e.loc;
                }
                const reviewers = e.reviewer
                  ? new Set(
                      e.reviewer.split(",").map((p) => {
                        return p.trim();
                      })
                    )
                  : new Set();

                if (reviewers.has(curr)) assigneeObj.pr_custom.add(e.cdet_id);
              });

              childNodes.forEach((childNode) => {
                dfs_search(childNode, assigneeObj);
              });
            };

            // itterating to all nodes under a direct children one by one using dfs
            childrens.forEach((child) => {
              const assigneeCountInitial = {
                loc_month: 0,
                loc_quarter: 0,
                loc_semi: 0,
                loc_custom: 0,
                pr_month: new Set(),
                pr_quarter: new Set(),
                pr_semi: new Set(),
                pr_custom: new Set(),
              };
              dfs_search(child, assigneeCountInitial);
              const assigneeCount = {
                loc_month: assigneeCountInitial.loc_month,
                loc_quarter: assigneeCountInitial.loc_quarter,
                loc_semi: assigneeCountInitial.loc_semi,
                loc_custom: assigneeCountInitial.loc_custom,
                pr_month: assigneeCountInitial.pr_month.size,
                pr_quarter: assigneeCountInitial.pr_quarter.size,
                pr_semi: assigneeCountInitial.pr_semi.size,
                pr_custom: assigneeCountInitial.pr_custom.size,
              };
              if (
                assigneeCount.loc_month +
                  assigneeCount.loc_quarter +
                  assigneeCount.loc_semi +
                  assigneeCount.loc_custom +
                  assigneeCount.pr_month +
                  assigneeCount.pr_quarter +
                  assigneeCount.pr_custom +
                  assigneeCount.pr_semi >
                0
              )
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
              `${process.env.REACT_APP_BACKEND_URL}/loc/details_new`
            );
            const responseData = await response.json();
            contextData.setLocTable(responseData);
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
          loadData(contextData.locTable.loc_data);
        }
      };
      try {
        mainFunction();
      } catch (err) {
        console.log(err);
      }
      if (contextData.isLocTableLoaded) {
        contextData.setIsLocPageLoading(false);
      }
    },
    // eslint-disable-next-line
    [userId, contextData.isLocTableLoaded, locSegment, customDates] // dependency array
  );
  var total_loc_count = 0;
  var total_pr_count = 0;
  var monthly_loc = 0;
  var monthly_pr = 0;
  var quarter_loc = 0;
  var quarter_pr = 0;
  var semi_loc = 0;
  var semi_pr = 0;
  var custom_loc = 0;
  var custom_pr = 0;

  viewData.forEach((elem) => {
    monthly_loc = monthly_loc + elem.countDetails.loc_month;
    monthly_pr = monthly_pr + elem.countDetails.pr_month;
    quarter_loc = quarter_loc + elem.countDetails.loc_quarter;
    quarter_pr = quarter_pr + elem.countDetails.pr_quarter;
    semi_loc = semi_loc + elem.countDetails.loc_semi;
    semi_pr = semi_pr + elem.countDetails.pr_semi;
    custom_loc = custom_loc + elem.countDetails.loc_custom;
    custom_pr = custom_pr + elem.countDetails.pr_custom;
    if (locSegment === "month") {
      total_loc_count = total_loc_count + elem.countDetails.loc_month;
      total_pr_count = total_pr_count + elem.countDetails.pr_month;
    } else if (locSegment === "quarter") {
      total_loc_count = total_loc_count + elem.countDetails.loc_quarter;
      total_pr_count = total_pr_count + elem.countDetails.pr_quarter;
    } else if (locSegment === "custom") {
      total_loc_count = total_loc_count + elem.countDetails.loc_custom;
      total_pr_count = total_pr_count + elem.countDetails.pr_custom;
    } else {
      total_loc_count = total_loc_count + elem.countDetails.loc_semi;
      total_pr_count = total_pr_count + elem.countDetails.pr_semi;
    }
  });

  //   segment chart parameters
  const diffSegment = ["month", "quarter", "semi"];

  const locSegmentChartOptions = {
    chart: {
      type: "line",
      height: 350,
      width: 1300,
    },
    title: {
      text: "Loc Segment Chart",
    },
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
    ],
  };

  const prSegmentChartOptions = {
    chart: {
      type: "line",
      height: 350,
      width: 1300,
    },
    title: {
      text: "PRs Segment Chart",
    },
    colors: ["#8E24AA", "#41AEA9", "#213E3B", "#E8FFFF"],
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
        name: "No. of PRs",
        data: [monthly_pr, quarter_pr, semi_pr],
        events: {
          click: (e) => {
            //   selectBugSegment(reverseSegmentMap.get(e.point.name));
          },
        },
      },
    ],
  };
  const logBase = (b, n) => Math.log(n) / Math.log(b);
  const getAssigneeCount = (sortBy) => {
    const loc = [];
    const pr = [];

    if (locSegment === "month") {
      if (sortBy === "loc")
        viewData.sort(
          (a, b) => b.countDetails.loc_month - a.countDetails.loc_month
        );
      else
        viewData.sort(
          (a, b) => b.countDetails.pr_month - a.countDetails.pr_month
        );
      viewData.forEach((elem) => {
        loc.push({
          name: parseFloat(
            elem.countDetails.loc_month === 0
              ? 0
              : logBase(100, elem.countDetails.loc_month).toFixed(3)
          ),
          y: parseFloat(
            elem.countDetails.loc_month === 0
              ? 0
              : logBase(100, elem.countDetails.loc_month).toFixed(3)
          ),
          yy: elem.countDetails.loc_month,
        });
        pr.push({
          name: elem.countDetails.pr_month,
          y: elem.countDetails.pr_month,
        });
      });
    } else if (locSegment === "quarter") {
      if (sortBy === "loc")
        viewData.sort(
          (a, b) => b.countDetails.loc_quarter - a.countDetails.loc_quarter
        );
      else
        viewData.sort(
          (a, b) => b.countDetails.pr_quarter - a.countDetails.pr_quarter
        );
      viewData.forEach((elem) => {
        loc.push({
          name: parseFloat(
            elem.countDetails.loc_quarter === 0
              ? 0
              : logBase(100, elem.countDetails.loc_quarter).toFixed(3)
          ),
          y: parseFloat(
            elem.countDetails.loc_quarter === 0
              ? 0
              : logBase(100, elem.countDetails.loc_quarter).toFixed(3)
          ),
          yy: elem.countDetails.loc_quarter,
        });
        pr.push({
          name: elem.countDetails.pr_quarter,
          y: elem.countDetails.pr_quarter,
        });
      });
    } else if (locSegment === "custom") {
      if (sortBy === "loc")
        viewData.sort(
          (a, b) => b.countDetails.loc_custom - a.countDetails.loc_custom
        );
      else
        viewData.sort(
          (a, b) => b.countDetails.pr_custom - a.countDetails.pr_custom
        );
      viewData.forEach((elem) => {
        loc.push({
          name: parseFloat(
            elem.countDetails.loc_custom === 0
              ? 0
              : logBase(100, elem.countDetails.loc_custom).toFixed(3)
          ),
          y: parseFloat(
            elem.countDetails.loc_custom === 0
              ? 0
              : logBase(100, elem.countDetails.loc_custom).toFixed(3)
          ),
          yy: elem.countDetails.loc_custom,
        });
        pr.push({
          name: elem.countDetails.pr_custom,
          y: elem.countDetails.pr_custom,
        });
      });
    } else {
      if (sortBy === "loc")
        viewData.sort(
          (a, b) => b.countDetails.loc_semi - a.countDetails.loc_semi
        );
      else
        viewData.sort(
          (a, b) => b.countDetails.pr_semi - a.countDetails.pr_semi
        );
      viewData.forEach((elem) => {
        loc.push({
          name: parseFloat(
            elem.countDetails.loc_semi === 0
              ? 0
              : logBase(100, elem.countDetails.loc_semi).toFixed(3)
          ),
          y: parseFloat(
            elem.countDetails.loc_semi === 0
              ? 0
              : logBase(100, elem.countDetails.loc_semi).toFixed(3)
          ),
          yy: elem.countDetails.loc_semi,
        });
        pr.push({
          name: elem.countDetails.pr_semi,
          y: elem.countDetails.pr_semi,
        });
      });
    }

    return {
      loc,
      pr,
    };
  };

  //loc distribution chart parameters
  var diffLocAssignCount =
    userId !== "all"
      ? getAssigneeCount("loc")
      : {
          loc: [],
          pr: [],
        };
  diffLocAssignCount = diffLocAssignCount.loc;
  var diffLocAssign = viewData.map((elem) => elem.assignee);
  const diffLocAssignNumbers = diffLocAssign.length;
  if (diffLocAssign.length > 10 && !showAllLocAssignees) {
    diffLocAssign = diffLocAssign.slice(0, 10);
    diffLocAssignCount = diffLocAssignCount.slice(0, 10);
  }
  const locAssignedChartOptions = {
    chart: {
      type: "bar",
      height: 385,
      width: 630,
    },
    title: {
      text:
        diffLocAssignNumbers > 10 && !showAllLocAssignees
          ? "LOC Distribution LOG Chart (Top 10)"
          : "LOC Distribution <i>(log chart)</i>",
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
      text: `For: ${segmentFullNameMap.get(locSegment)}`,
      style: {
        fontSize: "15px",
      },
    },

    xAxis: {
      categories: diffLocAssign,
    },
    series: [
      {
        name: "logBase100(No. of LOC)",
        data: diffLocAssignCount,
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
    ],
    tooltip: {
      shared: true,
      formatter() {
        let s = `<strong>${
          this.x === "self" ? "Self" : contextData.userFullNameMap.get(this.x)
        }</strong>`;
        s += `<br>No. of LOC: ${this.point.yy}`;
        return s;
      },
    },
  };

  //pr distribution chart parameters
  var diffPrAssignCount =
    userId !== "all"
      ? getAssigneeCount("pr")
      : {
          loc: [],
          pr: [],
        };
  diffPrAssignCount = diffPrAssignCount.pr;
  var diffPrAssign = viewData.map((elem) => elem.assignee);
  const diffPrAssignNumbers = diffPrAssign.length;
  if (diffPrAssign.length > 10 && !showAllPrAssignees) {
    diffPrAssign = diffPrAssign.slice(0, 10);
    diffPrAssignCount = diffPrAssignCount.slice(0, 10);
  }
  const prAssignedChartOptions = {
    chart: {
      type: "bar",
      height: 385,
      width: 630,
    },
    title: {
      text:
        diffPrAssignNumbers > 10 && !showAllPrAssignees
          ? "PRs Distribution (Top 10)"
          : "PRs Distribution ",
    },
    colors: ["#8E24AA"],
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
      text: `For: ${segmentFullNameMap.get(locSegment)}`,
      style: {
        fontSize: "15px",
      },
    },

    xAxis: {
      categories: diffPrAssign,
    },
    series: [
      {
        name: "No. of PRs",
        data: diffPrAssignCount,
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
    ],
    tooltip: {
      shared: true,
      formatter() {
        let s = `<strong>${
          this.x === "self" ? "Self" : contextData.userFullNameMap.get(this.x)
        }</strong>`;
        s += `<br>No. of PRs: ${this.points[0].y}`;
        return s;
      },
    },
  };

  // wrappers function for selecting user from the user search bar
  const selectUserId = (user) => {
    if (user !== userId) {
      contextData.setIsLocPageLoading(true);
      if (user === "all") selectLocSegment("semi");
      navigate(`/loc/view/${user}`);
    }
  };

  //for change assignee table states
  const setTableOpen = (value) => {
    const currentLocStatus = contextData.loc_states;
    contextData.setLoc({
      locSegment: currentLocStatus.locSegment,
      tableOpen: value,
      tableSortBy: currentLocStatus.tableSortBy,
      customDates: {
        name: currentLocStatus.customDates.name,
        upper_limit: currentLocStatus.customDates.upper_limit,
        lower_limit: currentLocStatus.customDates.lower_limit,
      },
    });
  };

  // filtering data according to status (lvl 1 filter)
  const selectLocSegment = (segment) => {
    const currentLocStatus = contextData.loc_states;
    contextData.setLoc({
      locSegment: segment,
      tableOpen: currentLocStatus.tableOpen,
      tableSortBy: currentLocStatus.tableSortBy,
      customDates: {
        name: currentLocStatus.customDates.name,
        upper_limit: currentLocStatus.customDates.upper_limit,
        lower_limit: currentLocStatus.customDates.lower_limit,
      },
    });
  };

  const selectTableSortBy = (sortBy) => {
    const currentLocStatus = contextData.loc_states;
    contextData.setLoc({
      locSegment: currentLocStatus.locSegment,
      tableOpen: currentLocStatus.tableOpen,
      tableSortBy: sortBy,
      customDates: {
        name: currentLocStatus.customDates.name,
        upper_limit: currentLocStatus.customDates.upper_limit,
        lower_limit: currentLocStatus.customDates.lower_limit,
      },
    });
  };

  //resorting the assignee table
  if (tableSortBy === "loc") {
    getAssigneeCount("loc");
  } else {
    getAssigneeCount("pr");
  }

  const setInvalidUserSelected = (value) => {
    SetIsUserValid(value);
  };

  const setCustomDates = async () => {
    const name = selectedCustomDate.name;
    const upper_limit = selectedCustomDate.upper_limit;
    const lower_limit = selectedCustomDate.lower_limit;

    const data = {
      upper_limit,
      lower_limit,
    };
    try {
      contextData.setIsDevPageLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/loc/details_new_customDates`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();

      const currLocTable = JSON.parse(JSON.stringify(contextData.locTable));
      currLocTable.dates["custom"] = responseData.dates["custom"];
      currLocTable.loc_data["custom"] = responseData.data["custom"];
      contextData.setLocTable(currLocTable);
      const currentLocStatus = contextData.loc_states;
      contextData.setLoc({
        locSegment: "custom",
        tableOpen: currentLocStatus.tableOpen,
        tableSortBy: currLocTable.tableSortBy,
        customDates: {
          name,
          upper_limit,
          lower_limit,
        },
      });
    } catch (err) {
      console.log(err);
      alert("Something went wrong, can't find data for custom selected dates");
    }
  };

  const customSegmentDates = [];

  const setCustomSegmentDates = () => {
    const Months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currDate = new Date();
    var y = currDate.getFullYear();
    var m = currDate.getMonth() + 1;
    var d = currDate.getDate();

    customSegmentDates.push({
      label: Months[m - 1] + " (" + y + ")",
      value: {
        name: Months[m - 1] + " (" + y + ")",
        upper_limit:
          y.toString() +
          "-" +
          (m > 9 ? m.toString() : "0" + m.toString()) +
          "-" +
          d.toString(),
        lower_limit:
          y.toString() +
          "-" +
          (m > 9 ? m.toString() : "0" + m.toString()) +
          "-" +
          "01",
      },
    });
    m--;
    for (var i = 0; i < 11; i++) {
      var date = new Date(y, m, 0);
      y = date.getFullYear();
      m = date.getMonth() + 1;
      d = date.getDate();
      customSegmentDates.push({
        label: Months[m - 1] + " (" + y + ")",
        value: {
          name: Months[m - 1] + " (" + y + ")",
          upper_limit:
            y.toString() +
            "-" +
            (m > 9 ? m.toString() : "0" + m.toString()) +
            "-" +
            d.toString(),
          lower_limit:
            y.toString() +
            "-" +
            (m > 9 ? m.toString() : "0" + m.toString()) +
            "-" +
            "01",
        },
      });
      m--;
    }
  };

  setCustomSegmentDates();

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
                LOC Metrics
              </span>
            </div>
            <ProfileSearchBar
              selectUserId={selectUserId}
              table={
                contextData.locTable
                  ? contextData.locTable.loc_data["semi"]["bugs"]
                  : []
              }
              userId={userId}
              type={"loc"}
              setInvalidUserSelected={setInvalidUserSelected}
            />
            {isUserValid ? (
              <>
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
                        <div className="flex flex-row space-x-4 items-center">
                          <Typography
                            className={`text-sm font-semi ${
                              locSegment === "custom"
                                ? "text-blue-500 font-bold"
                                : ""
                            }`}
                          >
                            {" "}
                            Custom Segment:{" "}
                          </Typography>
                          <SelectPicker
                            data={customSegmentDates}
                            searchable={false}
                            style={{ width: 124 }}
                            placement="rightStart"
                            onChange={(e) => {
                              setSelectedCustomDate(e);
                            }}
                            placeholder={
                              locSegment === "custom"
                                ? customDates.name
                                : "Select"
                            }
                          />
                          <div
                            className="rounded-md p-2 bg-blue-400 hover:bg-blue-500"
                            onClick={setCustomDates}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                              className="w-4 h-4 hover:cursor-pointer hover:text-blue-800 fill-white"
                            >
                              <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                            </svg>
                          </div>
                        </div>
                        <div className="flex flex-row space-x-8">
                          <Typography variant="h5" className="pl-4 text-center">
                            {" "}
                            Total no. of LOC : <span>
                              {total_loc_count}
                            </span>{" "}
                          </Typography>
                          <Typography variant="h5" className="pl-4 text-center">
                            {" "}
                            Total no. of PRs Reviewed :{" "}
                            <span>{total_pr_count}</span>{" "}
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
                    <hr className="border-[1px] border-blue-gray-200" />
                    <div className="w-full  h-16 flex flex-row justify-evenly items-center pt-1">
                      <div className="w-1/5 h-full  flex flex-col">
                        <div className={`h-3/10 w-full text-center `}>
                          {" "}
                          <span
                            className={
                              locSegment === "month"
                                ? "font-bold text-white bg-green-700 px-2 py-[3px] rounded-md"
                                : "font-semibold text-blue-gray-500"
                            }
                          >
                            Monthly
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
                                  locSegment === "month" ? "font-bold" : ""
                                }
                              >
                                {monthly_loc}
                              </span>
                            </div>
                          </div>
                          <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                            <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                              <div className="w-[10px] h-[10px] bg-purple-600 rounded-full"></div>
                            </div>
                            <div className="h-fit w-1/2 flex flex-row justify-start ">
                              <span
                                className={
                                  locSegment === "month" ? "font-bold" : ""
                                }
                              >
                                {monthly_pr}
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
                              locSegment === "quarter"
                                ? "font-bold text-white bg-green-700 px-2 py-[3px] rounded-md"
                                : "font-semibold text-blue-gray-500"
                            }
                          >
                            Quarterly
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
                                  locSegment === "quarter" ? "font-bold" : ""
                                }
                              >
                                {quarter_loc}
                              </span>
                            </div>
                          </div>
                          <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                            <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                              <div className="w-[10px] h-[10px] bg-purple-600 rounded-full"></div>
                            </div>
                            <div className="h-fit w-1/2 flex flex-row justify-start ">
                              <span
                                className={
                                  locSegment === "quarter" ? "font-bold" : ""
                                }
                              >
                                {quarter_pr}
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
                              locSegment === "semi"
                                ? "font-bold text-white bg-green-700 px-2 py-[3px] rounded-md"
                                : "font-semibold text-blue-gray-500"
                            }
                          >
                            Semi Annually
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
                                  locSegment === "semi" ? "font-bold" : ""
                                }
                              >
                                {semi_loc}
                              </span>
                            </div>
                          </div>
                          <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                            <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                              <div className="w-[10px] h-[10px] bg-purple-600 rounded-full"></div>
                            </div>
                            <div className="h-fit w-1/2 flex flex-row justify-start ">
                              <span
                                className={
                                  locSegment === "semi" ? "font-bold" : ""
                                }
                              >
                                {semi_pr}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {locSegment === "custom" ? (
                        <>
                          <div className="w-1/5 h-full  flex flex-col">
                            <div className={`h-3/10 w-full text-center `}>
                              {" "}
                              <span
                                className={
                                  locSegment === "custom"
                                    ? "font-bold text-white bg-green-700 px-2 py-[3px] rounded-md"
                                    : "font-semibold text-blue-gray-500"
                                }
                              >
                                Custom Segment
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
                                      locSegment === "custom" ? "font-bold" : ""
                                    }
                                  >
                                    {custom_loc}
                                  </span>
                                </div>
                              </div>
                              <div className="flex w-full flex-row  justify-center space-x-6 items-center ">
                                <div className="h-fit w-1/2 flex flex-row justify-end pr-2">
                                  <div className="w-[10px] h-[10px] bg-purple-600 rounded-full"></div>
                                </div>
                                <div className="h-fit w-1/2 flex flex-row justify-start ">
                                  <span
                                    className={
                                      locSegment === "custom" ? "font-bold" : ""
                                    }
                                  >
                                    {custom_pr}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </>
                ) : (
                  <></>
                )}

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
                            ? contextData.locTable.dates[locSegment][
                                "lower limit"
                              ]
                            : ""}
                          {" - "}
                          {contextData.locTable.dates[locSegment]
                            ? contextData.locTable.dates[locSegment][
                                "upper limit"
                              ]
                            : ""}{" "}
                        </Card>
                        <Card
                          className={`pb-3 pt-1 px-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit ${
                            tableOpen ? "bg-white" : "bg-gray-300"
                          } `}
                        >
                          <div className=" w-full flex flex-row">
                            <div className="w-1/3"></div>
                            <div className="w-1/3 flex flex-row justify-center">
                              <div className="w-fit ">
                                <Tabs value={tableOpen ? "table" : "graph"}>
                                  <TabsHeader
                                    className={
                                      tableOpen ? "bg-gray-200" : "bg-gray-400"
                                    }
                                  >
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
                              </div>
                            </div>
                            <div className="w-1/3  flex flex-row items-center justify-end pr-8">
                              {tableOpen ? (
                                <>
                                  {tableSortBy === "loc" ? (
                                    <>
                                      <span
                                        className="underline hover:cursor-pointer"
                                        onClick={() => {
                                          selectTableSortBy("pr");
                                        }}
                                      >
                                        sort by PRs
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <span
                                        className="underline hover:cursor-pointer"
                                        onClick={() => {
                                          selectTableSortBy("loc");
                                        }}
                                      >
                                        sort by LOC
                                      </span>
                                    </>
                                  )}
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          </div>

                          {tableOpen && userId !== "all" ? (
                            <>
                              <LocAssigneeTable
                                locSegment={locSegment}
                                tableData={viewData}
                                userId={userId}
                                monthly_loc={monthly_loc}
                                monthly_pr={monthly_pr}
                                quarter_loc={quarter_loc}
                                quarter_pr={quarter_pr}
                                semi_loc={semi_loc}
                                semi_pr={semi_pr}
                                custom_loc={custom_loc}
                                custom_pr={custom_pr}
                              />
                            </>
                          ) : (
                            <>
                              <div className="flex flex-row space-x-4">
                                <Card className="pb-3 pt-1 px-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit ">
                                  {diffLocAssignNumbers > 10 &&
                                  !showAllLocAssignees ? (
                                    <>
                                      <div className=" w-full flex pr-4 flex-row justify-end mb-[-20px] z-10">
                                        <span
                                          className="underline hover:cursor-pointer"
                                          onClick={() => {
                                            setShowAllLocAssignees(true);
                                          }}
                                        >
                                          show all
                                        </span>
                                      </div>
                                    </>
                                  ) : diffLocAssignNumbers > 10 ? (
                                    <>
                                      <div className=" w-full flex pr-4 flex-row justify-end mb-[-20px] z-10">
                                        <span
                                          className="underline hover:cursor-pointer"
                                          onClick={() => {
                                            setShowAllLocAssignees(false);
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
                                    options={locAssignedChartOptions}
                                  />
                                </Card>
                                <Card className="pb-3 pt-1 px-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit ">
                                  {diffPrAssignNumbers > 10 &&
                                  !showAllPrAssignees ? (
                                    <>
                                      <div className=" w-full flex pr-4 flex-row justify-end mb-[-20px] z-10">
                                        <span
                                          className="underline hover:cursor-pointer"
                                          onClick={() => {
                                            setShowAllPrAssignees(true);
                                          }}
                                        >
                                          show all
                                        </span>
                                      </div>
                                    </>
                                  ) : diffPrAssignNumbers > 10 ? (
                                    <>
                                      <div className=" w-full flex pr-4 flex-row justify-end mb-[-20px] z-10">
                                        <span
                                          className="underline hover:cursor-pointer"
                                          onClick={() => {
                                            setShowAllPrAssignees(false);
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
                                    options={prAssignedChartOptions}
                                  />
                                </Card>
                              </div>
                            </>
                          )}
                        </Card>
                      </>
                    ) : (
                      <>
                        <Card className="pb-3 pt-1 px-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit ">
                          <HighchartsReact
                            highcharts={Highcharts}
                            options={locSegmentChartOptions}
                          />
                        </Card>
                        <Card className="pb-3 pt-1 px-4 flex flex-col justify-center items-center hover:drop-shadow-xl w-fit ">
                          <HighchartsReact
                            highcharts={Highcharts}
                            options={prSegmentChartOptions}
                          />
                        </Card>
                      </>
                    )}
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

export default LocViewPage;
