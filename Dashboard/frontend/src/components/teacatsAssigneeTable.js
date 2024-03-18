import { Typography } from "@material-tailwind/react";
import { useContext } from "react";
import DataContext from "../context/dataContext";
import { useNavigate } from "react-router-dom";
const TeacatsAssigneeTable = (props) => {
  const tableData = props.tableData;
  const contextData = useContext(DataContext);
  const navigate = useNavigate();
  console.log(tableData);
  var totalCount = 0;
  const counts = {
    N: 0,
    R: 0,
    M: 0,
    V: 0,
    O: 0,
    A: 0,
    I: 0,
    J: 0,
    D: 0,
    U: 0,
    C: 0,
    week: 0,
    month: 0,
    quarter: 0,
    semi: 0,
    lte7: 0,
    gt7: 0,
    Total_R: 0,
    Total_O: 0,
  };
  const bugType = props.bugType;
  const userId = props.userId;
  return (
    <>
      {bugType === "all" ? (
        <>
          <table className="w-fit   table-auto items-center text-center ">
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
                  key="AMINO"
                  colSpan={2}
                  className="border-b border-r border-blue-gray-100 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
                  >
                    <span>Outstanding Teacats (AMINO)</span>
                  </Typography>
                </th>
                <th
                  key="RJDCU"
                  colSpan={4}
                  className="border-b rounded-tr-lg border-blue-gray-100 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
                  >
                    <span>Resolved Teacats (RJDCU)</span>
                  </Typography>
                </th>
              </tr>
              <tr>
                <th
                  key="lte7"
                  style={{
                    background: "#ECEFF1",
                  }}
                  className="border-b border-r border-blue-gray-100 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
                  >
                    <span>Less than or equal to 7 days</span>
                  </Typography>
                </th>
                <th
                  key="gt7"
                  style={{
                    background: "#ECEFF1",
                  }}
                  className="border-b border-r border-blue-gray-100 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
                  >
                    <span>Greater than 7 days </span>
                  </Typography>
                </th>
                <th
                  key="week"
                  style={{
                    background: "#ECEFF1",
                  }}
                  className="border-b border-r border-blue-gray-100 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
                  >
                    <span>Last 7 days (Weekly)</span>
                  </Typography>
                </th>
                <th
                  key="month"
                  style={{
                    background: "#ECEFF1",
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
                    background: "#ECEFF1",
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
                    background: "#ECEFF1",
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
                Object.keys(data.countDetails).forEach((key) => {
                  const value = data.countDetails[key];
                  counts[key] = counts[key] + value;
                });

                return (
                  <tr key={data.assignee}>
                    <td className="p-4 border-b border-l border-r border-blue-gray-100 w-[300px] bg-white">
                      <Typography
                        variant="small"
                        className={`font-bold text-blue-gray-500 ${
                          data.assignee === "self" ? "" : "hover:cursor-pointer"
                        } `}
                        onClick={() => {
                          if (data.assignee !== "self") {
                            contextData.setIsTeacatsPageLoading(true);
                            navigate(`/teacats/view/${data.assignee}`);
                          }
                        }}
                      >
                        {data.assignee === "self"
                          ? "Self"
                          : contextData.userFullNameMap.get(data.assignee)}
                        {" ("}
                        {data.assignee === "self" ? userId : data.assignee}
                        {") "}
                      </Typography>
                    </td>
                    <td
                      style={{
                        background: "#FFFFFF",
                      }}
                      className="py-4 w-[240px] border-b border-r border-blue-gray-100"
                    >
                      <Typography
                        variant="small"
                        className={` ${
                          data.countDetails["lte7"] === 0
                            ? "text-blue-gray-800 font-normal"
                            : "text-[#D789D7] font-bold"
                        } `}
                      >
                        {data.countDetails["lte7"]}
                      </Typography>
                    </td>
                    <td
                      style={{
                        background: "#FFFFFF",
                      }}
                      className="py-4 w-[240px] border-b border-r border-blue-gray-100"
                    >
                      <Typography
                        variant="small"
                        className={` ${
                          data.countDetails["gt7"] === 0
                            ? "text-blue-gray-800 font-normal"
                            : "text-[#D789D7] font-bold"
                        } `}
                      >
                        {data.countDetails["gt7"]}
                      </Typography>
                    </td>
                    <td
                      style={{
                        background: "#FFFFFF",
                      }}
                      className="py-4 w-[120px] border-b border-r border-blue-gray-100"
                    >
                      <Typography
                        variant="small"
                        className={` ${
                          data.countDetails["week"] === 0
                            ? "text-blue-gray-800 font-normal"
                            : "text-[#9D64C9] font-bold"
                        } `}
                      >
                        {data.countDetails["week"]}
                      </Typography>
                    </td>
                    <td
                      style={{
                        background: "#FFFFFF",
                      }}
                      className="py-4 w-[120px] border-b border-r border-blue-gray-100"
                    >
                      <Typography
                        variant="small"
                        className={` ${
                          (data.countDetails["month"]+data.countDetails["week"]) === 0
                            ? "text-blue-gray-800 font-normal"
                            : "text-[#9D64C9] font-bold"
                        } `}
                      >
                        {data.countDetails["month"]+data.countDetails["week"]}
                      </Typography>
                    </td>
                    <td
                      style={{
                        background: "#FFFFFF",
                      }}
                      className="py-4 w-[120px] border-b border-r border-blue-gray-100"
                    >
                      <Typography
                        variant="small"
                        className={` ${
                          (data.countDetails["quarter"]+data.countDetails["month"]+data.countDetails["week"]) === 0
                            ? "text-blue-gray-800 font-normal"
                            : "text-[#9D64C9] font-bold"
                        } `}
                      >
                        {data.countDetails["quarter"]+data.countDetails["month"]+data.countDetails["week"]}
                      </Typography>
                    </td>
                    <td
                      style={{
                        background: "#FFFFFF",
                      }}
                      className="py-4 w-[120px] border-b border-r border-blue-gray-100"
                    >
                      <Typography
                        variant="small"
                        className={` ${
                          (data.countDetails["semi"]+data.countDetails["quarter"]+data.countDetails["month"]+data.countDetails["week"]) === 0
                            ? "text-blue-gray-800 font-normal"
                            : "text-[#9D64C9] font-bold"
                        } `}
                      >
                        {data.countDetails["semi"]+data.countDetails["quarter"]+data.countDetails["month"]+data.countDetails["week"]}
                      </Typography>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td className="py-4 w-[300px] border-b border-l border-r border-blue-gray-100 bg-white">
                  <Typography
                    variant="small"
                    className="font-bold text-blue-gray-800"
                  >
                    Total
                  </Typography>
                </td>

                <td
                  style={{
                    background: "#FFFFFF",
                  }}
                  className="py-4 w-[240px] border-b  border-r border-blue-gray-100"
                >
                  <Typography variant="small" className="font-bold text-white">
                    <span className="bg-[#D789D7] py-1 px-2 rounded-lg">
                      {counts.lte7}
                    </span>
                  </Typography>
                </td>
                <td
                  style={{
                    background: "#FFFFFF",
                  }}
                  className="py-4 w-[240px] border-b  border-r border-blue-gray-100"
                >
                  <Typography variant="small" className="font-bold text-white">
                    <span className="bg-[#D789D7] py-1 px-2 rounded-lg">
                      {counts.gt7}
                    </span>
                  </Typography>
                </td>
                <td
                  style={{
                    background: "#FFFFFF",
                  }}
                  className="py-4 w-[120px] border-b  border-r border-blue-gray-100"
                >
                  <Typography variant="small" className="font-bold text-white">
                    <span className="bg-[#9D64C9] py-1 px-2 rounded-lg">
                      {counts.week}
                    </span>
                  </Typography>
                </td>
                <td
                  style={{
                    background: "#FFFFFF",
                  }}
                  className="py-4 w-[120px] border-b  border-r border-blue-gray-100"
                >
                  <Typography variant="small" className="font-bold text-white">
                    <span className="bg-[#9D64C9] py-1 px-2 rounded-lg">
                      {counts.month+counts.week}
                    </span>
                  </Typography>
                </td>
                <td
                  style={{
                    background: "#FFFFFF",
                  }}
                  className="py-4 w-[120px] border-b  border-r border-blue-gray-100"
                >
                  <Typography variant="small" className="font-bold text-white">
                    <span className="bg-[#9D64C9] py-1 px-2 rounded-lg">
                      {counts.quarter+counts.month+counts.week}
                    </span>
                  </Typography>
                </td>
                <td
                  style={{
                    background: "#FFFFFF",
                  }}
                  className="py-4 w-[120px] border-b  border-r border-blue-gray-100"
                >
                  <Typography variant="small" className="font-bold text-white">
                    <span className="bg-[#9D64C9] py-1 px-2 rounded-lg">
                      {counts.semi+counts.quarter+counts.month+counts.week}
                    </span>
                  </Typography>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      ) : "AMINO".includes(bugType) ? (
        <>
          <table className="w-fit  table-auto items-center text-center ">
            <caption className="caption-top font-bold pb-3">
              Table for : {props.bugSegment?props.bugSegment:"All Time"}
            </caption>
            <thead className="bg-blue-gray-50 ">
              <tr>
                <th
                  key="assingee"
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
                {"AMINO".split("").map((type) => {
                  return (
                    <>
                      <th
                        key="O"
                        style={{
                          background:
                            bugType === "AMINO" || bugType.includes(type)
                              ? "#B7F4D0"
                              : "#ECEFF1",
                        }}
                        className="border-b border-r border-blue-gray-100 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
                        >
                          <span>{type}</span>
                        </Typography>
                      </th>
                    </>
                  );
                })}
                <th
                  key="Total"
                  style={{
                    background: bugType === "AMINO" ? "#B7F4D0" : "#ECEFF1",
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
              {tableData.map((data) => {
                totalCount = totalCount + data.countDetails.Total_O;
                Object.keys(data.countDetails).forEach((key) => {
                    const value = data.countDetails[key];
                    counts[key] = counts[key] + value;
                  });
                return (
                  <tr key={data.assignee}>
                    <td className="p-4 border-b border-l border-r border-blue-gray-100 w-[400px] bg-white">
                      <Typography
                        variant="small"
                        className={`font-bold text-blue-gray-500 ${
                          data.assignee === "self" ? "" : "hover:cursor-pointer"
                        } `}
                        onClick={() => {
                          if (data.assignee !== "self") {
                            contextData.setIsTeacatsPageLoading(true);
                            navigate(`/teacats/view/${data.assignee}`);
                          }
                        }}
                      >
                        {data.assignee === "self"
                          ? "Self"
                          : contextData.userFullNameMap.get(data.assignee)}
                        {" ("}
                        {data.assignee === "self"
                          ? props.userId
                          : data.assignee}
                        {") "}
                      </Typography>
                    </td>
                    {"AMINO".split("").map((c) => (
                      <>
                        <td
                          style={{
                            background:
                              bugType === "AMINO" || bugType.includes(c)
                                ? "#E3F6F6"
                                : "#ffffff",
                          }}
                          className="py-4 w-[200px] border-b border-r border-blue-gray-100"
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
                        background: bugType === "AMINO" ? "#E3F6F6" : "#FFFFFF",
                      }}
                      className="py-4 w-[200px] border-b border-r border-blue-gray-100"
                    >
                      <Typography
                        variant="small"
                        className="font-bold text-blue-gray"
                      >
                        {data.countDetails.Total_O}
                      </Typography>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td
                  rowSpan={2}
                  className="py-4 w-[200px] border-b border-l border-r border-blue-gray-100 bg-white"
                >
                  <Typography
                    variant="small"
                    className="font-bold text-blue-gray-800"
                  >
                    Total
                  </Typography>
                </td>
                {"AMINO".split("").map((type) => {
                  return (
                    <>
                      <td
                        rowSpan={2}
                        style={{
                          background:
                            bugType === "AMINO" || bugType.includes(type)
                              ? "#E3F6F6"
                              : "#ffffff",
                        }}
                        className="py-4 w-[200px] border-b border-r border-blue-gray-100"
                      >
                        <Typography
                          variant="small"
                          className="font-bold text-blue-gray-800"
                        >
                          {counts[type]}
                        </Typography>
                      </td>
                    </>
                  );
                })}
                <td
                  rowSpan={2}
                  style={{
                    background: bugType === "AMINO" ? "#E3F6F6" : "#FFFFFF",
                  }}
                  className="py-4 w-[200px] border-b  border-r border-blue-gray-100"
                >
                  <Typography
                    variant="small"
                    className="font-bold text-white  "
                  >
                    <span className="bg-blue-500 py-1 px-2 rounded-lg">
                      {totalCount}
                    </span>
                  </Typography>
                </td>
              </tr>
            </tbody>
            <caption className="caption-bottom font-bold pt-3">
              Table for : {props.bugSegment?props.bugSegment:"All Time"}
            </caption>
          </table>
        </>
      ) : (
        <>
          <table className="w-fit  table-auto items-center text-center ">
            <caption className="caption-top font-bold pb-3">
              Table for : {props.bugSegment?props.bugSegment:"All Time"}
            </caption>
            <thead className="bg-blue-gray-50 ">
              <tr>
                <th
                  key="assingee"
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
                {"RJDCU".split("").map((type) => {
                  return (
                    <>
                      <th
                        key="O"
                        style={{
                          background:
                            bugType === "RJDCU" || bugType.includes(type)
                              ? "#B7F4D0"
                              : "#ECEFF1",
                        }}
                        className="border-b border-r border-blue-gray-100 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal flex flex-row justify-center items-center space-x-2 leading-none opacity-70"
                        >
                          <span>{type}</span>
                        </Typography>
                      </th>
                    </>
                  );
                })}
                <th
                  key="Total"
                  style={{
                    background: bugType === "RJDCU" ? "#B7F4D0" : "#ECEFF1",
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
              {tableData.map((data) => {
                totalCount = totalCount + data.countDetails.Total_R;
                Object.keys(data.countDetails).forEach((key) => {
                    const value = data.countDetails[key];
                    counts[key] = counts[key] + value;
                  });
                return (
                  <tr key={data.assignee}>
                    <td className="p-4 border-b border-l border-r border-blue-gray-100 w-[400px] bg-white">
                      <Typography
                        variant="small"
                        className={`font-bold text-blue-gray-500 ${
                          data.assignee === "self" ? "" : "hover:cursor-pointer"
                        } `}
                        onClick={() => {
                          if (data.assignee !== "self") {
                            contextData.setIsTeacatsPageLoading(true);
                            navigate(`/teacats/view/${data.assignee}`);
                          }
                        }}
                      >
                        {data.assignee === "self"
                          ? "Self"
                          : contextData.userFullNameMap.get(data.assignee)}
                        {" ("}
                        {data.assignee === "self"
                          ? props.userId
                          : data.assignee}
                        {") "}
                      </Typography>
                    </td>
                    {"RJDCU".split("").map((c) => (
                      <>
                        <td
                          style={{
                            background:
                              bugType === "RJDCU" || bugType.includes(c)
                                ? "#E3F6F6"
                                : "#ffffff",
                          }}
                          className="py-4 w-[200px] border-b border-r border-blue-gray-100"
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
                        background: bugType === "RJDCU" ? "#E3F6F6" : "#FFFFFF",
                      }}
                      className="py-4 w-[200px] border-b border-r border-blue-gray-100"
                    >
                      <Typography
                        variant="small"
                        className="font-bold text-blue-gray"
                      >
                        {data.countDetails.Total_R}
                      </Typography>
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td
                  rowSpan={2}
                  className="py-4 w-[200px] border-b border-l border-r border-blue-gray-100 bg-white"
                >
                  <Typography
                    variant="small"
                    className="font-bold text-blue-gray-800"
                  >
                    Total
                  </Typography>
                </td>
                {"RJDCU".split("").map((type) => {
                  return (
                    <>
                      <td
                        rowSpan={2}
                        style={{
                          background:
                            bugType === "RJDCU" || bugType.includes(type)
                              ? "#E3F6F6"
                              : "#ffffff",
                        }}
                        className="py-4 w-[200px] border-b border-r border-blue-gray-100"
                      >
                        <Typography
                          variant="small"
                          className="font-bold text-blue-gray-800"
                        >
                          {counts[type]}
                        </Typography>
                      </td>
                    </>
                  );
                })}
                <td
                  rowSpan={2}
                  style={{
                    background: bugType === "RJDCU" ? "#E3F6F6" : "#FFFFFF",
                  }}
                  className="py-4 w-[200px] border-b  border-r border-blue-gray-100"
                >
                  <Typography
                    variant="small"
                    className="font-bold text-white  "
                  >
                    <span className="bg-blue-500 py-1 px-2 rounded-lg">
                      {totalCount}
                    </span>
                  </Typography>
                </td>
              </tr>
            </tbody>
            <caption className="caption-bottom font-bold pt-3">
              Table for : {props.bugSegment?props.bugSegment:"All Time"}
            </caption>
          </table>
        </>
      )}
    </>
  );
};

export default TeacatsAssigneeTable;
