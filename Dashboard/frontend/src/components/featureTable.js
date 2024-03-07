import { Card, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
// import { Progress } from "rsuite";

// table heads
export default function FeatureTable(props) {
  const TABLE_HEAD = [
    "Ref",
    "Name",
    "Status",
    "No Tie Rank",
    "Type",
    "Tag",
    "Release Name",
    "PIN",
    "Assigned to",
    "Jira Id",
    "Created By",
  ];

  //table rows passed through props (viewTableData)
  const TABLE_ROWS = props.data;


  //features with sorting option
  const featuresToSort = new Map([
    ["Ref", "feature_reference"],
    ["No Tie Rank", "no_tie_rank"],
    ["Name", "feature_name"],
  ]);

  //for navigating to different routes
  const navigate = useNavigate();
  if (props.userId !== "all") {
    TABLE_HEAD.splice(8, 0, "Feature under");
  }

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
                    navigate(`/dpl/feature/${data.feature_reference}`);
                  }}
                >
                  {data.feature_reference}
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
                  {data.no_tie_rank}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  style={{
                    background:
                      data.feature_type === "S"
                        ? "#bbf7d0"
                        : data.feature_type === "M"
                        ? "#86efac"
                        : data.feature_type === "L"
                        ? "#4ade80"
                        : data.feature_type === "XL"
                        ? "#22c55e"
                        : "#16a34a",
                  }}
                  className={`font-normal rounded py-1 px-3`}
                >
                  {data.feature_type}
                </Typography>
              </td>
              {/* <td className="p-4 w-[200px]">
                <Progress.Line percent={data.complete_perct} showInfo={true} />
              </td> */}
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {data.feature_tag}
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
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {data.pin}
                </Typography>
              </td>
              {props.userId !== "all" ? (
                <>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className={`font-normal ${
                        data.assigned_under !== "self" ? "cursor-pointer" : ""
                      }`}
                      onClick={() => {
                        if (data.assigned_under !== "self")
                          navigate(`/dpl/view/${data.assigned_under}`);
                      }}
                    >
                      {data.assigned_under}
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
                  className="font-normal cursor-pointer"
                  onClick={() => {
                    navigate(`/dpl/view/${data.assigned_to}`);
                  }}
                >
                  {data.assigned_to}
                </Typography>
              </td>

              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {data.jira_id}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  <span className="">{data.created_by}</span>
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
