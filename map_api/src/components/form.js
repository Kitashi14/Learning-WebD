/** @format */

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import Map from "./map";

const MapForm = () => {
  const [model, setModel] = useState(false);

  const latInputRef = useRef();
  const longInputRef = useRef();

  const openMap = () => {
    setModel(true);
  };
  const closeMap = () => {
    setModel(false);
  };

  const submitCooridnates = (e) => {
    e.preventDefault(); //using this will make the checks present in input fiels faulty but we need this to stop refreshing of page
    if (!latInputRef.current.value || !longInputRef.current.value) {
      toast.error("Both fields are required to be filled.");
    } else if (
      latInputRef.current.value < -90 ||
      latInputRef.current.value > 90
    ) {
      toast.error("Latitude value out of range.");
    } else if (
      longInputRef.current.value < -180 ||
      longInputRef.current.value > 180
    ) {
      toast.error("Longitude value out of range.");
    } else {
      console.log(latInputRef.current.value, longInputRef.current.value);
    }
  };
  return (
    <>
      <div className="flex flex-col justify-between p-2 bg-orange-200 container mx-auto w-3/4  mt-10 rounded-lg border ">
        <div className="px-8 pt-6 pb-8 mb-0 bg-white rounded">
          <div className="flex flex-col justify-around   p-3 space-y-4 items-center">
            <div className="block text-xl font-bold text-orange-500">
              Choose Coordinates
            </div>
            <hr className="h-0.5 bg-orange-500 mx-4 w-full" />
            <div className="w-full flex flex-row justify-around"></div>
            <form className="w-full flex flex-row items-center space-x-4">
              <div className="w-full">
                <label
                  htmlFor="lat"
                  className="block mb-0 text-sm font-bold text-gray-700"
                >
                  Latitude :
                </label>
                <input
                  id="lat"
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none mb-4 focus:outline-none focus:shadow-outline"
                  type="number"
                  placeholder="Enter latitude"
                  required
                  step="any"
                  min="-90"
                  max="90"
                  ref={latInputRef}
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="long"
                  className="block mb-0 text-sm font-bold text-gray-700"
                >
                  Longitude :
                </label>
                <input
                  id="long"
                  className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none mb-4 focus:outline-none focus:shadow-outline"
                  type="number"
                  placeholder="Enter longitude"
                  ref={longInputRef}
                  required
                  min="-180"
                  max="180"
                  step="any"
                />
              </div>
              <button
                className="py-2 px-4 border text-white rounded-lg w-1/6 bg-green-400"
                onClick={submitCooridnates}
              >
                Submit
              </button>
            </form>
            <div className="w-full flex flex-row justify-center space-x-2">
              <button
                className="p-2 border text-white rounded-lg w-1/6 bg-blue-600"
                onClick={openMap}
              >
                Open Map
              </button>
            </div>
          </div>
        </div>
      </div>
      {model ? <Map closeMap={closeMap} /> : <></>}
    </>
  );
};

export default MapForm;
