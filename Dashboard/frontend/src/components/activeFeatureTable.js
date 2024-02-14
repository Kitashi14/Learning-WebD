import { Card, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

// table heads
export default function ActiveFeatureTable(props) {
  const TABLE_HEAD = [
    "Feature Key",
    "Summary",
    "Status",
    "Release Name",
    "Dev Managers",
    "Test Managers",
  ];

  //table rows passed through props (viewTableData)
  const TABLE_ROWS = props.data;

  //features with sorting option
  const featuresToSort = new Map([
    ["Feature Key", "jira_id"],
    ["Summary", "feature_name"],
  ]);

  //for navigating to different routes
  const navigate = useNavigate();
  if (props.userId !== "all") {
    TABLE_HEAD.splice(4, 0, "Assigned under ");
  }

  const findAssignedManagers = (elem) => {
    const assignees = [];
    if (elem.assigned_test_managers && elem.assigned_test_managers.size) {
      elem.assigned_test_managers.forEach((v, k) => {
        assignees.push(k);
      });
    }
    if (elem.assigned_dev_managers && elem.assigned_dev_managers.size)
      elem.assigned_dev_managers.forEach((v, k) => {
        assignees.push(k);
      });
    return assignees.filter((x, i, a) => a.indexOf(x) === i);
  };

  return (
    <Card className=" w-full overflow-scroll">
      <table className="w-full min-w-max table-auto items-center text-center">
        <thead>
          <tr>
            {/* table head elements */}
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
                >
                  <span>{head}</span>
                  {/* adding sorting options to the elements present in featuresToSort map */}
                  {featuresToSort.has(head) ? (
                    props.sortedFeature.feature === featuresToSort.get(head) ? (
                      props.sortedFeature.order > 0 ? (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4 hover:cursor-pointer hover:text-blue-800"
                            onClick={() => {
                              const tableHeadName = head;
                              const feature = featuresToSort.get(tableHeadName);
                              props.sortViewTableAscending(
                                TABLE_ROWS,
                                feature,
                                -1
                              );
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-4 h-4 hover:cursor-pointer hover:text-blue-800"
                            onClick={() => {
                              const tableHeadName = head;
                              const feature = featuresToSort.get(tableHeadName);
                              props.sortViewTableAscending(
                                TABLE_ROWS,
                                feature,
                                1
                              );
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m4.5 15.75 7.5-7.5 7.5 7.5"
                            />
                          </svg>
                        </>
                      )
                    ) : (
                      <>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 hover:cursor-pointer hover:text-blue-800"
                          onClick={() => {
                            const tableHeadName = head;
                            const feature = featuresToSort.get(tableHeadName);
                            props.sortViewTableAscending(
                              TABLE_ROWS,
                              feature,
                              1
                            );
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                          />
                        </svg>
                      </>
                    )
                  ) : (
                    <></>
                  )}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* table data rows */}
          {TABLE_ROWS.map((data) => (
            <tr
              key={data.feature_reference}
              className="even:bg-blue-gray-100 hover:bg-blue-100"
            >
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal hover:cursor-pointer hover:text-blue-600"
                  onClick={() => {
                    console.log(data.jira_id);
                    window.open(
                      `https://miggbo.atlassian.net/browse/${data.jira_id}`,
                      "blank"
                    );
                  }}
                >
                  <span title="open in jira">{data.jira_id}</span>
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {data.feature_name}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {data.feature_status}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {data.release_name}
                </Typography>
              </td>
              {/* <td className="p-4">
                <Typography
                  variant="small"
                  color="white"
                  className={`font-normal bg-${
                    data.feature_type === "small"
                      ? "green-500"
                      : data.feature_type === "mid"
                      ? "orange-500"
                      : "red-500"
                  } rounded py-1 px-3`}
                >
                  {data.feature_type}
                </Typography>
              </td> */}
              {props.userId !== "all" ? (
                <>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="white"
                      className="space-x-1"
                    >
                      {findAssignedManagers(data).map((manager) => {
                        return (
                          <>
                            <span
                              style={{
                                background: data.color_map.get(manager),
                              }}
                              className={`font-normal rounded py-1 px-2 ${
                                manager !== "self" ? "cursor-pointer " : ""
                              } `}
                              onClick={() => {
                                if (data.assigned_under !== "self")
                                  navigate(`/active/view/${manager}`);
                              }}
                            >
                              {manager}
                            </span>
                          </>
                        );
                      })}
                    </Typography>
                  </td>
                </>
              ) : (
                <></>
              )}
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {Array.from(data.dev_managers).map((manager) => {
                    return (
                      <>
                        <span
                          style={{
                            color: data.color_map
                              ? data.color_map.get(manager)
                              : "",
                          }}
                          className={`${
                            data.color_map
                              ? data.color_map.has(manager)
                                ? "font-bold"
                                : ""
                              : ""
                          } px-1 ${
                            manager !== "self" ? "cursor-pointer " : ""
                          } `}
                          onClick={() => {
                            if (data.assigned_under !== "self")
                              navigate(`/active/view/${manager}`);
                          }}
                        >
                          {manager}
                        </span>
                      </>
                    );
                  })}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {Array.from(data.test_managers).map((manager) => {
                    return (
                      <>
                        <span
                          style={{
                            color: data.color_map
                              ? data.color_map.get(manager)
                              : "",
                          }}
                          className={`${
                            data.color_map
                              ? data.color_map.has(manager)
                                ? "font-bold"
                                : ""
                              : ""
                          } px-1 ${
                            manager !== "self" ? "cursor-pointer " : ""
                          } `}
                          onClick={() => {
                            if (data.assigned_under !== "self")
                              navigate(`/active/view/${manager}`);
                          }}
                        >
                          {manager}
                        </span>
                      </>
                    );
                  })}
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {TABLE_ROWS.length === 0 ? (
        <>
          <Typography className="text-center py-4">
            No features found
          </Typography>
        </>
      ) : (
        <></>
      )}
    </Card>
  );
}
