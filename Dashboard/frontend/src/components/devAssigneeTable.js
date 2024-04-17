import { Typography } from "@material-tailwind/react";
import { useContext } from "react";
import DataContext from "../context/dataContext";
import { useNavigate } from "react-router-dom";
const DevAssigneeTable = (props) => {
  const tableData = props.tableData;
  const contextData = useContext(DataContext);
  const navigate = useNavigate();
  var totalCount = 0;
  var rmvCount = 0;
  var oaiCount = 0;
  var jdcuCount = 0;
  // eslint-disable-next-line
  var nCount = 0;
  const bugType = props.bugType;
  return (
    <>
      <table className="w-fit  table-auto items-center text-center ">
        <caption className="caption-top font-bold pb-3">
          Table for : {props.bugSegment}, Category (
          {contextData.dev_states.bugCategory})
        </caption>
        <thead className="bg-blue-gray-50 ">
          <tr>
            <th
              key="assingee"
              rowSpan={2}
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
            <th
              key="N"
              rowSpan={2}
              style={{
                background:
                  bugType === "all" || bugType === "N" ? "#f5d0fe" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>N</span>
              </Typography>
            </th>
            <th
              key="OAI"
              colSpan={3}
              style={{
                background:
                  bugType === "all" || bugType.includes("OAI") ? "#f5d0fe" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>OAI</span>
              </Typography>
            </th>
            <th
              key="RMV"
              colSpan={3}
              style={{
                background:
                  bugType === "all" || bugType.includes("RMV") ? "#f5d0fe" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>RMV</span>
              </Typography>
            </th>
            <th
              key="JDCU"
              colSpan={4}
              style={{
                background:
                  bugType === "all" || bugType.includes("JDCU")
                    ? "#f5d0fe"
                    : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>JDCU</span>
              </Typography>
            </th>
            <th
              key="Total"
              style={{
                background: bugType === "all" ? "#f5d0fe" : "",
              }}
              rowSpan={2}
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
          <tr>
            <th
              key="O"
              style={{
                background:
                  bugType === "all" || bugType.includes("O") ? "#f5d0fe" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>O</span>
              </Typography>
            </th>
            <th
              key="A"
              style={{
                background:
                  bugType === "all" || bugType.includes("A") ? "#f5d0fe" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>A</span>
              </Typography>
            </th>
            <th
              key="I"
              style={{
                background:
                  bugType === "all" || bugType.includes("I") ? "#f5d0fe" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>I</span>
              </Typography>
            </th>
            <th
              key="R"
              style={{
                background:
                  bugType === "all" || bugType.includes("R") ? "#f5d0fe" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>R</span>
              </Typography>
            </th>
            <th
              key="M"
              style={{
                background:
                  bugType === "all" || bugType.includes("M") ? "#f5d0fe" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>M</span>
              </Typography>
            </th>
            <th
              key="V"
              style={{
                background:
                  bugType === "all" || bugType.includes("V") ? "#f5d0fe" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>V</span>
              </Typography>
            </th>
            <th
              key="J"
              style={{
                background:
                  bugType === "all" || bugType.includes("J") ? "#f5d0fe" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>J</span>
              </Typography>
            </th>
            <th
              key="D"
              style={{
                background:
                  bugType === "all" || bugType.includes("D") ? "#f5d0fe" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>D</span>
              </Typography>
            </th>

            <th
              key="C"
              style={{
                background:
                  bugType === "all" || bugType.includes("C") ? "#f5d0fe" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>C</span>
              </Typography>
            </th>
            <th
              key="U"
              style={{
                background:
                  bugType === "all" || bugType.includes("U") ? "#f5d0fe" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>U</span>
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data) => (
            <tr key={data.assignee}>
              <td className="p-4 border-b border-l border-r border-blue-gray-100 w-[300px]">
                <Typography
                  variant="small"
                  className={`font-bold text-blue-gray-500 ${
                    data.assignee === "self" ? "" : "hover:cursor-pointer"
                  } `}
                  onClick={() => {
                    if (data.assignee !== "self") {
                      contextData.setIsDevPageLoading(true);
                      navigate(`/dev/view/${data.assignee}`);
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
              {"NOAIRMVJDCU".split("").map((c) => (
                <>
                  <td
                    style={{
                      background:
                        bugType === "all" || bugType.includes(c)
                          ? "#fae8ff"
                          : "",
                    }}
                    className="py-4 w-[100px] border-b border-r border-blue-gray-100"
                  >
                    <Typography
                      variant="small"
                      className={` ${
                        data.countDetails[c] === 0
                          ? "text-blue-gray-800 font-normal"
                          : "text-blue-500 font-bold"
                      } `}
                    >
                      {data.countDetails[c]}
                    </Typography>
                  </td>
                </>
              ))}
              <td
                style={{
                  background: bugType === "all" ? "#fae8ff" : "",
                }}
                className="py-4 w-[100px] border-b border-r border-blue-gray-100"
              >
                <Typography
                  variant="small"
                  className="font-bold text-black"
                >
                  {data.countDetails.Total}
                </Typography>
              </td>
            </tr>
          ))}
          <tr>
            <td
              rowSpan={2}
              className="py-4 w-[100px] border-b border-l border-r border-blue-gray-100"
            >
              <Typography
                variant="small"
                className="font-bold text-black"
              >
                Total
              </Typography>
            </td>
            {"NOAIRMVJDCU".split("").map((c) => {
              var count = 0;
              tableData.forEach((elem) => {
                count = count + elem.countDetails[c];
              });
              totalCount = totalCount + count;
              if ("RMV".includes(c)) rmvCount = rmvCount + count;
              if ("OAI".includes(c)) oaiCount = oaiCount + count;
              if ("JDCU".includes(c)) jdcuCount = jdcuCount + count;
              if (c === "N") {
                nCount = count;

                return (
                  <>
                    <td
                      rowSpan={2}
                      style={{
                        background:
                          bugType === "all" || bugType.includes(c)
                            ? "#fae8ff"
                            : "",
                      }}
                      className="py-4 w-[100px] border-b border-r border-blue-gray-100"
                    >
                      <Typography
                        variant="small"
                        className="font-bold text-black"
                      >
                        {count}
                      </Typography>
                    </td>
                  </>
                );
              } else {
                return (
                  <>
                    <td
                      style={{
                        background:
                          bugType === "all" || bugType.includes(c)
                            ? "#fae8ff"
                            : "",
                      }}
                      className="py-4 w-[100px] border-b border-r border-blue-gray-100"
                    >
                      <Typography
                        variant="small"
                        className="font-bold text-black"
                      >
                        {count}
                      </Typography>
                    </td>
                  </>
                );
              }
            })}
            <td
              rowSpan={2}
              style={{
                background: bugType === "all" ? "#fae8ff" : "",
              }}
              className="py-4 w-[100px] border-b  border-r border-blue-gray-100"
            >
              <Typography variant="small" className="font-bold text-white  ">
                <span className="bg-blue-500 py-1 px-2 rounded-lg">
                  {totalCount}
                </span>
              </Typography>
            </td>
          </tr>
          <tr>
            <td
              colSpan={3}
              style={{
                background:
                  bugType === "all" || bugType === "OAI" ? "#fae8ff" : "",
              }}
              className="py-4 w-[100px] border-b border-r border-blue-gray-100"
            >
              <Typography
                variant="small"
                className="font-bold text-black"
              >
                {oaiCount}
              </Typography>
            </td>
            <td
              colSpan={3}
              style={{
                background:
                  bugType === "all" || bugType === "RMV" ? "#fae8ff" : "",
              }}
              className="py-4 w-[100px] border-b border-r border-blue-gray-100"
            >
              <Typography
                variant="small"
                className="font-bold text-black"
              >
                {rmvCount}
              </Typography>
            </td>
            <td
              colSpan={4}
              style={{
                background:
                  bugType === "all" || bugType === "JDCU" ? "#fae8ff" : "",
              }}
              className="py-4 w-[100px] border-b border-r border-blue-gray-100"
            >
              <Typography
                variant="small"
                className="font-bold text-black"
              >
                {jdcuCount}
              </Typography>
            </td>
          </tr>
        </tbody>
        <caption className="caption-bottom font-bold pt-3">
          Table for : {props.bugSegment}, Category (
          {contextData.dev_states.bugCategory})
        </caption>
      </table>
    </>
  );
};

export default DevAssigneeTable;
