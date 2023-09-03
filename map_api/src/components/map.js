/** @format */

const Map = (props) => {
  return (
    <>
      <div className="w-screen h-screen backdrop-blur-md fixed top-0 ">
        <div className="flex flex-col justify-between items-center p-3 space-y-2 container mx-auto mt-20 w-2/3 rounded-lg border-2 border-gray-200 ">
          <div className="px-8 pt-6 pb-8 w-full h-96 mb-0 bg-red-600 rounded"></div>
          <button className="p-2 border rounded-lg w-1/6 bg-green-400 text-white" onClick={props.closeMap}>
            Select
          </button>
        </div>
      </div>
    </>
  );
};

export default Map;
