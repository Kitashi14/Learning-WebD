import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineIcon,
  Typography,
  TimelineHeader,
} from "@material-tailwind/react";
import { ArchiveBoxIcon } from "@heroicons/react/24/solid";

export function FeatureTimeline(props) {
  return (
    <div className="w-fit">
      <Timeline>
        <TimelineItem className="h-28 ">
          <TimelineConnector className="!w-[78px]" />
          <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white hover:shadow-lg py-3 pl-4 pr-8 shadow ">
            <TimelineIcon className="p-3" variant="ghost" color="blue">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </TimelineIcon>
            <div className="flex flex-col gap-1">
              <Typography variant="h6" color="blue-gray">
                Creation
              </Typography>
              <Typography variant="small" color="gray" className="font-normal">
                Date: {props.creationDate}
                <br />
                By: {props.createdBy}
              </Typography>
            </div>
          </TimelineHeader>
        </TimelineItem>
        <TimelineItem className="h-28">
          <TimelineConnector className="!w-[78px]" />
          <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white hover:shadow-lg py-3 pl-4 pr-8 shadow">
            <TimelineIcon className="p-3" variant="ghost" color="orange">
              <ArchiveBoxIcon className="h-5 w-5" />
            </TimelineIcon>
            <div className="flex flex-col gap-1">
              <Typography variant="h6" color="blue-gray">
                Last status change
              </Typography>
              <Typography variant="small" color="gray" className="font-normal">
                Date: {props.lastStatusChangeDate}
              </Typography>
            </div>
          </TimelineHeader>
        </TimelineItem>
        <TimelineItem className="h-28">
          <TimelineHeader className="relative rounded-xl border border-blue-gray-50 bg-white  py-3 pl-4 pr-8 shadow-lg hover:shadow">
            <TimelineIcon className="p-3" variant="ghost" color="green">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path
                  fillRule="evenodd"
                  d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                  clipRule="evenodd"
                />
              </svg>
            </TimelineIcon>
            <div className="flex flex-col gap-1">
              <Typography variant="h6" color="blue-gray">
                Completion
              </Typography>
              <Typography variant="small" color="gray" className="font-normal">
                Date: NA
              </Typography>
            </div>
          </TimelineHeader>
        </TimelineItem>
      </Timeline>
    </div>
  );
}
