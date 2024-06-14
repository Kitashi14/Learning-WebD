import { Card, Typography } from "@material-tailwind/react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataContext from "../context/dataContext";

// table heads
export default function PrecommitsMetricsTable(props) {
  const TABLE_HEAD = [
    "Bug ID",
    "Script Name",
    "State",
    "Run On",
    "Request Link",
    "Manager",
    "Engineer",
    "PR Link",
    "Analysis",
    "Run Analysis",
    "Component",
  ];

  const navigate = useNavigate();
  const contextData = useContext(DataContext);

  const [editId, setEditId] = useState(null);

  //table rows passed through props (viewTableData)
  const TABLE_ROWS = props.data;
  const typeColors = [
    "#bbf7d0",
    "#86efac",
    "#4ade80",
    "#22c55e",
    "#16a34a",
    "#84cc16",
    "#065f46",
    "#14b8a6",
    "#052e16",
    "#bbf7d0",
    "#86efac",
    "#4ade80",
    "#22c55e",
    "#16a34a",
    "#84cc16",
    "#065f46",
    "#14b8a6",
    "#052e16",
  ];
  typeColors.reverse();
  const stateColorMap = new Map([
    ["FAILED", "#dc2626"],
    ["PASSED", "#16a34a"],
    ["ABORTED", "#E8FFFF"],
    ["RUNNING", "#41AEA9"],
    ["ERRORED", "#CF3A64"],
    ["STOPPED", "#dc2626"],
    ["NA", "#41AEA9"],
    ["QUEUING", "#213E3B"],
    ["QUEUED", "#d946ef"],
    ["PREPARING", "#e879f9"],
    ["AWAITING RESOURCES", "#f0abfc"],
  ]);

  //features with sorting option
  const featuresToSort = new Map([
    ["Bug ID", "bug_id"],
    ["State", "state"],
    ["Bug under", "assigned_under"],
    ["Run On", "run_on"],
    ["Engineer", "emp_id"],
    ["Manager", "mgr_id"],
    ["Component", "component"],
    ["Run Analysis", "run_analysis"],
    ["Script Name", "script_name"],
  ]);

  const run_analysisTypes = props.run_analysisTypes;

  //for adding assignee column
  if (props.userId !== "all") {
    TABLE_HEAD.splice(5, 0, "Bug under");
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

  const setAnalysisText = async (id, value, type, date) => {
    const dt = new Date(date);
    const month = Months[dt.getMonth()];
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/test/precommits`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            id,
            value,
            type,
          }),
        }
      );
      if (response.status === 200) {
        const currentPrecommitTable = JSON.parse(
          JSON.stringify(contextData.precommitsTable)
        );
        currentPrecommitTable.Combined.bugs.forEach((e) => {
          if (e.request_id === id) e[type] = value;
        });
        Object.keys(currentPrecommitTable).forEach((k) => {
          if (k.includes(month)) {
            currentPrecommitTable[k].bugs.forEach((e) => {
              if (e.request_id === id) e[type] = value;
            });
          }
        });
        contextData.setPrecommitsTable(currentPrecommitTable);
      } else throw Error("something went wrong");
    } catch (err) {
      console.log(err);
      alert("Analysis update failed. Please try again later.");
      contextData.setIsPrecommitsTableLoaded(false);
    }
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
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-3"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
                >
                  <span className="flex flex-col">
                    {head}
                    {head === "Run Analysis" ? (
                      <>
                        <span className="mt-2">(click to edit)</span>
                      </>
                    ) : (
                      <></>
                    )}
                  </span>
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
          {/* {props.data.map(e=>{
            return <>herer</>
          })} */}
          {TABLE_ROWS.slice(props.lowerIndex, props.upperIndex).map((data) => (
            <tr
              key={data.request_id}
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
                  color="blue-gray"
                  className="font-normal"
                >
                  {data.script_name}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="white"
                  style={{
                    background: stateColorMap.get(data.state),
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
                  className="font-normal hover:cursor-pointer underline text-blue-600"
                  onClick={() => {
                    window.open(data.pr_url, "blank");
                  }}
                >
                  <span title="open in jira">{data.pr_id}</span>
                </Typography>
              </td>
              <td className="py-4 px-6 w-[450px]  justify-center">
                {data.analysis &&
                data.analysis.trim() !== "" &&
                !(
                  editId !== null &&
                  editId.id === data.request_id &&
                  editId.type === "analysis"
                ) ? (
                  <>
                    <div className="flex flex-row space-x-2 items-center justify-center">
                      {" "}
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal w-[350px] break-words text-center"
                      >
                        {data.analysis}
                      </Typography>
                      <div
                        className="bg-gradient-to-b from-blue-300 to-blue-400 rounded py-1 w-fit px-3 text-white hover:cursor-pointer shadow-md active:shadow-none select-none w-[50px]"
                        onClick={(e) => {
                          if(editId && editId.type==="analysis"){
                            const id = "input_"+ editId.id;
                            const input = document.getElementById(id);

                            TABLE_ROWS.forEach(e=>{
                              if(e.request_id==editId.id){
                                input.value = e.analysis && e.analysis.trim() !== ""
                            ? e.analysis
                            : "";
                              }
                            })
                            
                          }
                          setEditId({ id: data.request_id, type: "analysis" });
                        }}
                      >
                        Edit
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <form
                      className="flex flex-row space-x-2 items-center justify-center"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const id = data.request_id;
                        const value = e.target[0].value.trim();
                        setEditId(null);

                        if (data.analysis && data.analysis.trim() !== "") {
                          if (data.analysis.trim() === value) return;
                        } else {
                          if (value === "") return;
                        }
                        setAnalysisText(id, value, "analysis", data.run_on);
                      }}
                    >
                      {" "}
                      <input
                        className="p-1 rounded border-blue-gray-300 text-center drop-shadow-md hover:drop-shadow-xl w-[350px]"
                        type="text"
                        id={"input_"+data.request_id}
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
                        onClick={() => {
                          if(editId && editId.type==="analysis" && editId.id!==data.request_id){
                            const id = "input_"+ editId.id;
                            const input = document.getElementById(id);
                            TABLE_ROWS.forEach(e=>{
                              if(e.request_id==editId.id){
                                input.value = e.analysis && e.analysis.trim() !== ""
                            ? e.analysis
                            : "";
                              }
                            })
                          }
                          setEditId({
                            id: data.request_id,
                            type: "analysis",
                          });
                        }}
                      />
                      <input
                        type="submit"
                        className="bg-gradient-to-b from-blue-600 to-blue-800 rounded py-1 px-2 text-white hover:cursor-pointer shadow-md active:shadow-none select-none w-[50px]"
                        value="Save"
                      />
                    </form>
                  </>
                )}
              </td>
              <td className="p-4 justify-center">
                {!(
                  editId !== null &&
                  editId.id === data.request_id &&
                  editId.type === "run_analysis"
                ) ? (
                  <>
                    <div className="flex flex-row space-x-2 items-center justify-center">
                      {" "}
                      <Typography
                        variant="small"
                        color="white"
                        style={{
                          background:
                            typeColors[
                              run_analysisTypes.indexOf(data.run_analysis)
                            ],
                        }}
                        onClick={(e) => {
                          if(editId && editId.type==="analysis"){
                            const id = "input_"+ editId.id;
                            const input = document.getElementById(id);
                            TABLE_ROWS.forEach(e=>{
                              if(e.request_id==editId.id){
                                input.value = e.analysis && e.analysis.trim() !== ""
                            ? e.analysis
                            : "";
                              }
                            })
                          }
                          setEditId({
                            id: data.request_id,
                            type: "run_analysis",
                          });
                        }}
                        className={`font-normal w-[120px] hover:cursor-pointer rounded py-1 px-3`}
                      >
                        {data.run_analysis}
                      </Typography>
                    </div>
                  </>
                ) : (
                  <>
                    <form
                      className="flex flex-row space-x-2 items-center justify-center"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const id = data.request_id;
                        const value = e.target[0].value;
                        setEditId(null);

                        if (data.run_analysis === value) return;
                        setAnalysisText(id, value, "run_analysis", data.run_on);
                      }}
                    >
                      {" "}
                      <select
                        defaultValue={data.run_analysis}
                        className="w-[120px] text-center py-1 rounded border-[1px] border-blue-gray-600"
                        
                      >
                        {run_analysisTypes.map((e) => {
                          return (
                            <>
                              <option value={e}>{e}</option>
                            </>
                          );
                        })}
                      </select>
                      <input
                        type="submit"
                        className="bg-gradient-to-b from-blue-600 to-blue-800 rounded py-1 px-2 text-white hover:cursor-pointer shadow-md active:shadow-none select-none w-[50px]"
                        value="Save"
                      />
                    </form>
                  </>
                )}
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
          <Typography className="text-center py-4">No bugs found</Typography>
        </>
      ) : (
        <></>
      )}
    </Card>
  );
}
