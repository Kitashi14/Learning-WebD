import { useNavigate, useParams } from "react-router-dom";
import { Card, Typography } from "@material-tailwind/react";
// import { Progress } from "rsuite";
import { FeatureTimeline } from "../components/featureTimeline";
import { useContext } from "react";
import DataContext from "../context/dataContext";

//page for a particular feature
const DplFeatureViewPage = (props) => {
  const contextData = useContext(DataContext);

  const featureId = useParams().fid; //extracting feature reference and storing it as feature-id
  var tableToUse;
  tableToUse = contextData.dplTable;
  const featureData = tableToUse.filter(
    (elem) => elem.feature_reference === featureId
  )[0]; //finding the feature from feature table

  // for navigating to different routes
  const navigate = useNavigate();

  return (
    <>
      {featureData ? (
        <>
          {" "}
          <div className="w-full h-full flex flex-col overflow-y-auto  space-y-2 py-2 px-3">
            <Card className="p-3">
              <div className=" text-lg font-bold">
                Feature Reference :{" "}
                <span className="text-blue-500">
                  {featureData.feature_reference}
                </span>
              </div>
            </Card>
            <div className="w-full  flex flex-row justify-evenly items-center">
              {/* <div className="w-1/6 p-4 ">
            <Progress.Circle
              percent={featureData.complete_perct}
              strokeColor={
                featureData.complete_perct === 100 ? "#52c41a" : "#3385ff"
              }
              trailColor="white"
              status={featureData.complete_perct === 100 ? "success" : null}
            />
          </div> */}
              <div className="w-fit p-4 pl-16 flex flex-col space-y-2">
                <Typography className="text-xl">
                  No Tie Rank:{" "}
                  <span className="text-blue-600">
                    {featureData.no_tie_rank}
                  </span>
                </Typography>
                <Typography className="text-xl">
                  Release:{" "}
                  <span className="text-blue-600">
                    {featureData.release_name}
                  </span>
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
                    style={{
                      background:
                        featureData.feature_type === "S"
                          ? "#bbf7d0"
                          : featureData.feature_type === "M"
                          ? "#86efac"
                          : featureData.feature_type === "L"
                          ? "#4ade80"
                          : featureData.feature_type === "XL"
                          ? "#22c55e"
                          : "#16a34a",
                    }}
                    className={`font-normal rounded py-1 px-3`}
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
                      navigate(`/dpl/view/${featureData.assigned_to}`);
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
            <Card className="py-3 px-6   flex-col flex">
              <Typography variant="h4" className="text-blue-500">
                Name: {"   "}
                <span className="font-normal text-blue-gray-500">
                  {featureData.feature_name}
                </span>
              </Typography>
              <br />
              <Typography className="font-bold break-words">
                Description: {"   "}
                <span className="font-normal">{featureData.feature_des}</span>
              </Typography>
              <hr />
            </Card>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col justify-center items-center h-full text-3xl font-bold text-blue-gray-400 ">
            <div>Feature with this id ({featureId}) not found.</div>
            Please select another id.
          </div>
        </>
      )}
    </>
  );
};

export default DplFeatureViewPage;
