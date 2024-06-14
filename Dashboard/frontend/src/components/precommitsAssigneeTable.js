import { Typography } from "@material-tailwind/react";
import { useContext } from "react";
import DataContext from "../context/dataContext";
import { useNavigate } from "react-router-dom";
const PrecommitsAssigneeTable = (props) => {
  const tableData = props.tableData;
  const contextData = useContext(DataContext);
  const navigate = useNavigate();
  var totalCount = 0;
  const bugState = props.bugState;
  const availableBugStates = props.states;
  return (
    <>
      <table className="w-fit  table-auto items-center text-center ">
        <caption className="caption-top font-bold pb-3">
          Table for : {props.bugSegment}, Run Analysis ({props.bugRunAnalysis})
        </caption>
        <thead className="bg-blue-gray-50 ">
          <tr>
            <th
              key="assignee"
              className="border-b border-r border-blue-gray-100 p-4 rounded-tl-lg"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>Bugs Under</span>
              </Typography>
            </th>
            {availableBugStates.map((e) => {
              return (
                <>
                  <th
                    key={e}
                    style={{
                      background:
                        bugState === "all" || bugState === e ? "#f5d0fe" : "",
                    }}
                    className="border-b border-r border-blue-gray-100 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
                    >
                      <span>{e}</span>
                    </Typography>
                  </th>
                </>
              );
            })}
            <th
              key="Total"
              style={{
                background: bugState === "all" ? "#f5d0fe" : "",
              }}
              className="border-b rounded-tr-lg border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>Total</span>
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data) => (
            <tr key={data.assignee}>
              <td className="p-4 border-b border-l border-r border-blue-gray-100 w-[350px]">
                <Typography
                  variant="small"
                  className={`font-bold text-blue-gray-500 ${
                    data.assignee === "self" ? "" : "hover:cursor-pointer"
                  } `}
                  onClick={() => {
                    if (data.assignee !== "self") {
                      contextData.setIsPrecommitsPageLoading(true);
                      navigate(`/precommits/view/${data.assignee}`);
                    }
                  }}
                >
                  {data.assignee === "self"
                    ? "Self"
                    : contextData.userFullNameMap.get(data.assignee)}
                  {" ("}
                  {data.assignee === "self" ? props.userId : data.assignee}
                  {") "}
                </Typography>
              </td>
              {availableBugStates.map((c) => (
                <>
                  <td
                    style={{
                      background:
                        bugState === "all" || bugState === c ? "#fae8ff" : "",
                    }}
                    className="py-4 w-[200px] border-b border-r border-blue-gray-100"
                  >
                    <Typography
                      variant="small"
                      className={` ${
                        (data.countDetails[c] ? data.countDetails[c] : 0) === 0
                          ? "text-blue-gray-800 font-normal"
                          : "text-blue-500 font-bold"
                      } `}
                    >
                      {data.countDetails[c] ? data.countDetails[c] : 0}
                    </Typography>
                  </td>
                </>
              ))}
              <td
                style={{
                  background: bugState === "all" ? "#fae8ff" : "",
                }}
                className="py-4 w-[200px] border-b border-r border-blue-gray-100"
              >
                <Typography
                  variant="small"
                  className="font-bold text-blue-gray-800"
                >
                  {data.countDetails.Total}
                </Typography>
              </td>
            </tr>
          ))}
          <tr>
            <td className="py-4 w-[350px] border-b border-l border-r border-blue-gray-100">
              <Typography
                variant="small"
                className="font-bold text-blue-gray-800"
              >
                Total
              </Typography>
            </td>
            {availableBugStates.map((c) => {
              var count = 0;
              tableData.forEach((elem) => {
                count =
                  count + (elem.countDetails[c] ? elem.countDetails[c] : 0);
              });
              totalCount = totalCount + count;
              return (
                <>
                  <td
                    style={{
                      background:
                        bugState === "all" || bugState === c ? "#fae8ff" : "",
                    }}
                    className="py-4 w-[200px] border-b border-r border-blue-gray-100"
                  >
                    <Typography
                      variant="small"
                      className="font-bold text-blue-gray-800"
                    >
                      {count}
                    </Typography>
                  </td>
                </>
              );
            })}
            <td
              style={{
                background: bugState === "all" ? "#fae8ff" : "",
              }}
              className="py-4 w-[200px] border-b  border-r border-blue-gray-100"
            >
              <Typography variant="small" className="font-bold text-white  ">
                <span className="bg-blue-500 py-1 px-2 rounded-lg">
                  {totalCount}
                </span>
              </Typography>
            </td>
          </tr>
        </tbody>
        <caption className="caption-bottom font-bold pt-3">
          Table for : {props.bugSegment}, Run Analysis ({props.bugRunAnalysis})
        </caption>
      </table>
    </>
  );
};

export default PrecommitsAssigneeTable;
