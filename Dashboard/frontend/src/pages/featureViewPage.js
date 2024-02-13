import { useNavigate, useParams } from "react-router-dom";
import { Card, Typography } from "@material-tailwind/react";
import { Progress } from "rsuite";
import { FeatureTimeline } from "../components/featureTimeline";
import { useContext } from "react";
import DataContext from "../context/dataContext";

//page for a particular feature
const FeatureViewPage = (props) => {
  const contextData = useContext(DataContext);

  const featureId = useParams().fid; //extracting feature reference and storing it as feature-id
  var tableToUse;
  if (props.type === "dpl") tableToUse = contextData.dplTable;
  else tableToUse = contextData.jiraTable;
  const featureData = tableToUse.filter(
    (elem) => elem.feature_reference === featureId
  )[0]; //finding the feature from feature table

  // for navigating to different routes
  const navigate = useNavigate();

  return (
    <>
      <div className="w-full flex flex-col overflow-y-auto  space-y-2 py-2 px-3">
        <Card className="p-3">
          <div className=" text-lg font-bold">
            Feature Reference :{" "}
            <span className="text-blue-500">
              {featureData.feature_reference}
            </span>
            {props.type === "active" ? (
              <>
                <span className="ml-3 bg-cyan-400 py-2 px-3 rounded-lg text-white font-bold text-lg">
                  ACTIVE RELEASE
                </span>
              </>
            ) : (
              <></>
            )}
          </div>
        </Card>
        <div className="w-full  flex flex-row justify-evenly items-center">
          <div className="w-1/6 p-4 ">
            <Progress.Circle
              percent={featureData.complete_perct}
              strokeColor={
                featureData.complete_perct === 100 ? "#52c41a" : "#3385ff"
              }
              trailColor="white"
              status={featureData.complete_perct === 100 ? "success" : null}
            />
          </div>
          <div className="w-fit p-4 pl-16 flex flex-col space-y-2">
            <Typography className="text-xl">
              No Tie Rank:{" "}
              <span className="text-blue-600">{featureData.no_tie_rank}</span>
            </Typography>
            <Typography className="text-xl">
              Release:{" "}
              <span className="text-blue-600">{featureData.release_name}</span>
            </Typography>
            <Typography className="text-xl">
              Tag:{" "}
              <span className="text-blue-600">
                {featureData.feature_tag.toUpperCase()}
              </span>
            </Typography>
            <Typography className="text-xl">
              Type:{" "}
              <span
                className={`font-normal font-mono text-white bg-${
                  featureData.feature_type === "small"
                    ? "green-500"
                    : featureData.feature_type === "mid"
                    ? "orange-500"
                    : "red-500"
                } rounded py-1 px-3`}
              >
                {featureData.feature_type}
              </span>{" "}
            </Typography>
            <Typography className="text-xl">
              Status:{" "}
              <span className="text-blue-600">
                {featureData.feature_status}
              </span>
            </Typography>
            <Typography className="text-xl">
              PIN: <span className="text-blue-600">{featureData.pin}</span>
            </Typography>
            <Typography className="text-xl ]">
              Assigned to:{" "}
              <span
                className="text-blue-600 hover:cursor-pointer hover:text-blue-800"
                onClick={() => {
                  navigate(`/${props.type}/view/${featureData.assigned_to}`);
                }}
              >
                {`${contextData.userFullNameMap.get(
                  featureData.assigned_to
                )} (${featureData.assigned_to}) `}
              </span>
            </Typography>
          </div>
          <div className="w-fit pl-4 pt-4 ">
            <FeatureTimeline
              creationDate={featureData.creation_date}
              lastStatusChangeDate={featureData.last_status_change_date}
              createdBy={featureData.created_by}
            />
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
          <Typography className="font-bold">
            Description: {"   "}
            <span className="font-normal">{featureData.feature_des}</span>
          </Typography>
          <hr />
        </Card>
      </div>
    </>
  );
};

export default FeatureViewPage;
