import { Card, Typography } from "@material-tailwind/react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import DataContext from "../context/dataContext";

// table heads
export default function AutonsTable(props) {
  const TABLE_HEAD = [
    "Bug ID",
    "Headline",
    "State",
    "Engineer",
    "Manager",
    "Component",
  ];

  const navigate = useNavigate();
  const contextData = useContext(DataContext);

  //table rows passed through props (viewTableData)
  const TABLE_ROWS = props.data;
  const typeColors = ["#D789D7", "#9D65C9", "#5D54A4", "#2A3D66", "#000000"];
  const stateOrder = ["AMINO", "RJDCU"];

  //features with sorting option
  const featuresToSort = new Map([
    ["Bug ID", "bug_id"],
    ["Headline", "headline"],
    ["State", "state"],
    ["Employee ID", "emp_id"],
    ["Bug under", "assigned_under"],
    ["Engineer", "emp_id"],
    ["Manager", "mgr_id"],
    ["Component", "component"],
  ]);

  //for navigating to different routes
  if (props.userId !== "all") {
    TABLE_HEAD.splice(3, 0, "Bug under");
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
          {TABLE_ROWS.slice(props.lowerIndex, props.upperIndex).map((data) => (
            <tr
              key={data.bug_id}
              className="even:bg-blue-gray-100 hover:bg-blue-100"
            >
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal hover:cursor-pointer hover:text-blue-600"
                  onClick={() => {
                    window.open(
                      `http://wwwin-metrics.cisco.com/protected-cgi-bin/ddtsdisp.cgi?id=${data.bug_id}`,
                      "blank"
                    );
                  }}
                >
                  <span title="open in jira">{data.bug_id}</span>
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {data.headline}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="white"
                  style={{
                    background:
                      props.bugType === "all"
                        ? typeColors[
                            stateOrder.findIndex((v, i, a) => {
                              return v.includes(data.state);
                            })
                          ]
                        : typeColors[
                            stateOrder[
                              stateOrder.findIndex((v, i, a) => {
                                return v.includes(data.state);
                              })
                            ].indexOf(data.state)
                          ],
                  }}
                  className={`font-normal rounded py-1 px-3`}
                >
                  {data.state}
                </Typography>
              </td>
              {props.userId !== "all" ? (
                <>
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal hover:cursor-pointer"
                      onClick={() => {
                        if (
                          contextData.autons_currentUser !== data.assigned_under
                        ) {
                          contextData.setIsAutonsPageLoading(true);
                          navigate(`/autons/view/${data.assigned_under}`);
                        }
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
                  className="font-normal hover:cursor-pointer"
                  onClick={() => {
                    if (
                      contextData.autons_currentUser !== data.emp_id &&
                      data.emp_id !== ""
                    ) {
                      contextData.setIsAutonsPageLoading(true);
                      navigate(`/autons/view/${data.emp_id}`);
                    }
                  }}
                >
                  {data.emp_id}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal hover:cursor-pointer"
                  onClick={() => {
                    if (
                      contextData.autons_currentUser !== data.mgr_id &&
                      data.mgr_id !== ""
                    ) {
                      contextData.setIsAutonsPageLoading(true);
                      navigate(`/autons/view/${data.mgr_id}`);
                    }
                  }}
                >
                  {data.mgr_id}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {data.component}
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
