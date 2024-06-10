import { Card, Typography } from "@material-tailwind/react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataContext from "../context/dataContext";

// table heads
export default function PrecommitsMetricsTable(props) {
  const TABLE_HEAD = [
    "Bug ID",
    "State",
    "Run On",
    "Request Link",
    "Manager",
    "Engineer",
    "Component",
    "PR Link",
    "Analysis",
  ];

  const navigate = useNavigate();
  const contextData = useContext(DataContext);

  const [editId, setEditId] = useState(null);

  //table rows passed through props (viewTableData)
  const TABLE_ROWS = props.data;
  const typeColors = [
    "#D789D7",
    "#9D65C9",
    "#5D54A4",
    "#2A3D66",
    "#A21CAF",
    "#d946ef",
    "#e879f9",
    "#f0abfc",
    "#d8b4fe",
    "#6366f1",
  ];
  const stateOrder = props.states;

  const setAnalysisText = async (id, value) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/test/precommits`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          id,
          value,
        }),
      });
      if (response.status === 200)
        contextData.setIsPrecommitsTableLoaded(false);
      else throw Error("something went wrong");
    } catch (err) {
      console.log(err);
      alert("Analysis update failed. Please try again later.");
    }
  };

  //features with sorting option
  const featuresToSort = new Map([
    ["Bug ID", "bug_id"],
    ["State", "state"],
    ["Bug under", "assigned_under"],
    ["Run On", "run_on"],
    ["Engineer", "emp_id"],
    ["Manager", "mgr_id"],
    ["Component", "component"],
  ]);

  //for navigating to different routes
  if (props.userId !== "all") {
    TABLE_HEAD.splice(4, 0, "Bug under");
  }

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

  const getDate = (date) => {
    const dt = new Date(date);
    const y = dt.getFullYear();
    const m = dt.getMonth();
    const d = dt.getDate();
    return Months[m] + " " + d + ", " + y;
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
          {TABLE_ROWS.slice(props.lowerIndex, props.upperIndex).map((data) => (
            <tr
              key={data.bug_id}
              className="even:bg-blue-gray-100 hover:bg-blue-100"
            >
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal hover:cursor-pointer underline text-blue-600"
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
                  color="white"
                  style={{
                    background: typeColors[stateOrder.indexOf(data.state)],
                  }}
                  className={`font-normal rounded py-1 px-3`}
                >
                  {data.state}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {getDate(data.run_on)}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal hover:cursor-pointer underline text-blue-600"
                  onClick={() => {
                    window.open(data.request_url, "blank");
                  }}
                >
                  <span title="open in jira">{data.request_id}</span>
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
                          contextData.precommits_currentUser !==
                          data.assigned_under
                        ) {
                          contextData.setIsPrecommitsPageLoading(true);
                          navigate(`/precommits/view/${data.assigned_under}`);
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
                      contextData.precommits_currentUser !== data.mgr_id &&
                      data.mgr_id !== ""
                    ) {
                      contextData.setIsPrecommitsPageLoading(true);
                      navigate(`/precommits/view/${data.mgr_id}`);
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
                  className="font-normal hover:cursor-pointer"
                  onClick={() => {
                    if (
                      contextData.precommits_currentUser !== data.emp_id &&
                      data.emp_id !== ""
                    ) {
                      contextData.setIsPrecommitsPageLoading(true);
                      navigate(`/precommits/view/${data.emp_id}`);
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
                  className="font-normal"
                >
                  {data.component}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal hover:cursor-pointer underline text-blue-600"
                  onClick={() => {
                    window.open(data.pr_url, "blank");
                  }}
                >
                  <span title="open in jira">{data.pr_id}</span>
                </Typography>
              </td>
              <td
                className="p-4 w-[250px] flex justify-center"
                key={data.bug_id}
              >
                {data.analysis &&
                data.analysis.trim() !== "" &&
                editId !== data.bug_id ? (
                  <>
                    <div className="flex flex-row space-x-2 items-center justify-center">
                      {" "}
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal w-[150px]"
                      >
                        {data.analysis}
                      </Typography>
                      <div
                        className="bg-gradient-to-b from-orange-300 to-orange-700 rounded py-1 w-fit px-3 text-white hover:cursor-pointer shadow-md active:shadow-none select-none "
                        onClick={(e) => {
                          setEditId(data.bug_id);
                        }}
                      >
                        Edit
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <form
                      className="flex flex-row space-x-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const id = data.bug_id;
                        const value = e.target[0].value.trim();
                        setEditId(null);
                        if (value === "") return;
                        if (data.analysis && data.analysis.trim() !== "") {
                          if (data.analysis.trim() === value) return;
                        }
                        setAnalysisText(id, value);
                      }}
                    >
                      {" "}
                      <input
                        className="p-1 rounded border-blue-gray-300 text-center drop-shadow-md hover:drop-shadow-xl w-[150px]"
                        type="text"
                        defaultValue={
                          data.analysis && data.analysis.trim() !== ""
                            ? data.analysis
                            : ""
                        }
                        placeholder={
                          data.analysis && data.analysis.trim() !== ""
                            ? data.analysis
                            : "Enter text"
                        }
                      />
                      <input
                        type="submit"
                        className="bg-gradient-to-b from-green-300 to-green-600 rounded py-1 px-2 text-white hover:cursor-pointer shadow-md active:shadow-none select-none "
                        value="Save"
                      />
                    </form>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {TABLE_ROWS.length === 0 ? (
        <>
          <Typography className="text-center py-4">No bugs found</Typography>
        </>
      ) : (
        <></>
      )}
    </Card>
  );
}
