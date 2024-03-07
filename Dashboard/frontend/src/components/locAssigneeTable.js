import { Typography } from "@material-tailwind/react";
import { useContext } from "react";
import DataContext from "../context/dataContext";
import { useNavigate } from "react-router-dom";
const LocAssigneeTable = (props) => {
  const tableData = props.tableData;
  const contextData = useContext(DataContext);
  const navigate = useNavigate();
  console.log(tableData);
  const locSegment = props.locSegment;
  return (
    <>
      <table className="w-fit  table-auto items-center text-center ">
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
                <span>Distribution Under</span>
              </Typography>
            </th>
            <th
              key="LOC"
              colSpan={3}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>Total LOC</span>
              </Typography>
            </th>
            <th
              key="PR"
              colSpan={3}
              className="border-b rounded-tr-lg border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>Total PRs Reviewed</span>
              </Typography>
            </th>
          </tr>
          <tr>
            <th
              key="month"
              style={{
                background: locSegment === "month" ? "#B8F4D1" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>Monthly</span>
              </Typography>
            </th>
            <th
              key="quarter"
              style={{
                background: locSegment === "quarter" ? "#B8F4D1" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>Quarterly </span>
              </Typography>
            </th>
            <th
              key="semi"
              style={{
                background: locSegment === "semi" ? "#B8F4D1" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>Semi Annually</span>
              </Typography>
            </th>
            <th
              key="month"
              style={{
                background: locSegment === "month" ? "#B8F4D1" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>Monthly</span>
              </Typography>
            </th>
            <th
              key="quarter"
              style={{
                background: locSegment === "quarter" ? "#B8F4D1" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>Quarterly </span>
              </Typography>
            </th>
            <th
              key="semi"
              style={{
                background: locSegment === "semi" ? "#B8F4D1" : "",
              }}
              className="border-b border-r border-blue-gray-100 p-4"
            >
              <Typography
                variant="small"
                color="blue-gray"
                className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
              >
                <span>Semi Annually</span>
              </Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((data) => {
            return (
              <tr key={data.assignee}>
                <td className="p-4 border-b border-l border-r border-blue-gray-100 w-[300px]">
                  <Typography
                    variant="small"
                    className={`font-bold text-blue-gray-500 ${
                      data.assignee === "self" ? "" : "hover:cursor-pointer"
                    } `}
                    onClick={() => {
                      if (data.assignee !== "self") {
                        contextData.setIsLocPageLoading(true);
                        navigate(`/loc/view/${data.assignee}`);
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
                <td
                  style={{
                    background: locSegment === "month" ? "#E3F7F6" : "",
                  }}
                  className="py-4 w-[160px] border-b border-r border-blue-gray-100"
                >
                  <Typography
                    variant="small"
                    className={` ${
                      data.countDetails["loc_month"] === 0
                        ? "text-blue-gray-800 font-normal"
                        : "text-blue-500 font-bold"
                    } `}
                  >
                    {data.countDetails["loc_month"]}
                  </Typography>
                </td>
                <td
                  style={{
                    background: locSegment === "quarter" ? "#E3F7F6" : "",
                  }}
                  className="py-4 w-[160px] border-b border-r border-blue-gray-100"
                >
                  <Typography
                    variant="small"
                    className={` ${
                      data.countDetails["loc_quarter"] === 0
                        ? "text-blue-gray-800 font-normal"
                        : "text-blue-500 font-bold"
                    } `}
                  >
                    {data.countDetails["loc_quarter"]}
                  </Typography>
                </td>
                <td
                  style={{
                    background: locSegment === "semi" ? "#E3F7F6" : "",
                  }}
                  className="py-4 w-[160px] border-b border-r border-blue-gray-100"
                >
                  <Typography
                    variant="small"
                    className={` ${
                      data.countDetails["loc_semi"] === 0
                        ? "text-blue-gray-800 font-normal"
                        : "text-blue-500 font-bold"
                    } `}
                  >
                    {data.countDetails["loc_semi"]}
                  </Typography>
                </td>
                <td
                  style={{
                    background: locSegment === "month" ? "#E3F7F6" : "",
                  }}
                  className="py-4 w-[160px] border-b border-r border-blue-gray-100"
                >
                  <Typography
                    variant="small"
                    className={` ${
                      data.countDetails["pr_month"] === 0
                        ? "text-blue-gray-800 font-normal"
                        : "text-blue-500 font-bold"
                    } `}
                  >
                    {data.countDetails["pr_month"]}
                  </Typography>
                </td>
                <td
                  style={{
                    background: locSegment === "quarter" ? "#E3F7F6" : "",
                  }}
                  className="py-4 w-[160px] border-b border-r border-blue-gray-100"
                >
                  <Typography
                    variant="small"
                    className={` ${
                      data.countDetails["pr_quarter"] === 0
                        ? "text-blue-gray-800 font-normal"
                        : "text-blue-500 font-bold"
                    } `}
                  >
                    {data.countDetails["pr_quarter"]}
                  </Typography>
                </td>
                <td
                  style={{
                    background: locSegment === "semi" ? "#E3F7F6" : "",
                  }}
                  className="py-4 w-[160px] border-b border-r border-blue-gray-100"
                >
                  <Typography
                    variant="small"
                    className={` ${
                      data.countDetails["pr_semi"] === 0
                        ? "text-blue-gray-800 font-normal"
                        : "text-blue-500 font-bold"
                    } `}
                  >
                    {data.countDetails["pr_semi"]}
                  </Typography>
                </td>
              </tr>
            );
          })}
          <tr>
            <td className="py-4 w-[160px] border-b border-l border-r border-blue-gray-100">
              <Typography
                variant="small"
                className="font-bold text-blue-gray-800"
              >
                Total
              </Typography>
            </td>

            <td
              style={{
                background: locSegment === "month" ? "#E3F7F6" : "",
              }}
              className="py-4 w-[160px] border-b  border-r border-blue-gray-100"
            >
              <Typography
                variant="small"
                className="font-bold text-blue-gray-800"
              >
                {props.monthly_loc}
              </Typography>
            </td>
            <td
              style={{
                background: locSegment === "quarter" ? "#E3F7F6" : "",
              }}
              className="py-4 w-[160px] border-b  border-r border-blue-gray-100"
            >
              <Typography
                variant="small"
                className="font-bold text-blue-gray-800"
              >
                {props.quarter_loc}
              </Typography>
            </td>
            <td
              style={{
                background: locSegment === "semi" ? "#E3F7F6" : "",
              }}
              className="py-4 w-[160px] border-b  border-r border-blue-gray-100"
            >
              <Typography
                variant="small"
                className="font-bold text-blue-gray-800"
              >
                {props.semi_loc}
              </Typography>
            </td>
            <td
              style={{
                background: locSegment === "month" ? "#E3F7F6" : "",
              }}
              className="py-4 w-[160px] border-b  border-r border-blue-gray-100"
            >
              <Typography
                variant="small"
                className="font-bold text-blue-gray-800"
              >
                {props.monthly_pr}
              </Typography>
            </td>
            <td
              style={{
                background: locSegment === "quarter" ? "#E3F7F6" : "",
              }}
              className="py-4 w-[160px] border-b  border-r border-blue-gray-100"
            >
              <Typography
                variant="small"
                className="font-bold text-blue-gray-800"
              >
                {props.quarter_pr}
              </Typography>
            </td>
            <td
              style={{
                background: locSegment === "semi" ? "#E3F7F6" : "",
              }}
              className="py-4 w-[160px] border-b  border-r border-blue-gray-100"
            >
              <Typography
                variant="small"
                className="font-bold text-blue-gray-800"
              >
                {props.semi_pr}
              </Typography>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default LocAssigneeTable;
