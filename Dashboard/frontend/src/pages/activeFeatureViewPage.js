import { useNavigate, useParams } from "react-router-dom";
import { Card, Typography } from "@material-tailwind/react";
import { useContext } from "react";
import DataContext from "../context/dataContext";

//page for a particular feature
const ActiveFeatureViewPage = (props) => {
  const contextData = useContext(DataContext);

  const featureId = useParams().fid; //extracting feature reference and storing it as feature-id
  var tableToUse;
  tableToUse = contextData.jiraTable;
  const featureData = tableToUse.filter(
    (elem) => elem.jira_id === featureId
  )[0]; //finding the feature from feature table

  // for navigating to different routes
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full flex flex-col overflow-y-auto  space-y-2 py-2 px-3">
        <Card className="p-3">
          <div className="text-lg font-bold">
            Jira ID :{" "}
            <span className="text-blue-500">{featureData.jira_id}</span>
            <span className="ml-3 bg-cyan-400 py-2 px-3 rounded-lg text-white font-bold text-lg">
              ACTIVE RELEASE
            </span>
          </div>
        </Card>
        <div className="w-full  flex flex-row justify-evenly items-center">
          <div className="w-fit p-4 pl-16 flex flex-col space-y-2">
            <Typography className="text-xl">
              Release:{" "}
              <span className="text-blue-600">{featureData.release_name}</span>
            </Typography>

            <Typography className="text-xl">
              Status:{" "}
              <span className="text-blue-600">
                {featureData.feature_status}
              </span>
            </Typography>
            <Typography className="text-xl">
              Dev Managers:{" "}
              <span className="text-blue-600">
                {Array.from(featureData.dev_managers).map((manager) => {
                  return (
                    <>
                      <span
                        className={`px-1 hover:cursor-pointer hover:text-blue-800`}
                        onClick={() => {
                          if (featureData.assigned_under !== "self")
                            navigate(`/active/view/${manager}`);
                        }}
                      >
                        {manager}
                      </span>
                    </>
                  );
                })}
              </span>
            </Typography>
            <Typography className="text-xl">
              Test Managers:{" "}
              <span className="text-blue-600">
                {Array.from(featureData.test_managers).map((manager) => {
                  return (
                    <>
                      <span
                        className={`px-1 hover:cursor-pointer hover:text-blue-800`}
                        onClick={() => {
                          if (featureData.assigned_under !== "self")
                            navigate(`/active/view/${manager}`);
                        }}
                      >
                        {manager}
                      </span>
                    </>
                  );
                })}
              </span>
            </Typography>
          </div>
        </div>
        <Card className="py-3 px-6 flex-col flex">
          <Typography variant="h4" className="text-blue-500">
            Name: {"   "}
            <span className="font-normal text-blue-gray-500">
              {featureData.feature_name}
            </span>
          </Typography>
          <br />
          <hr />
        </Card>
      </div>
    </>
  );
};

export default ActiveFeatureViewPage;
