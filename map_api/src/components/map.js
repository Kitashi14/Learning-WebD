/** @format */
import "leaflet/dist/leaflet.css";
import "./../App.css";
import omm from "./../map_attributes";

import { MapContainer, TileLayer } from "react-leaflet";
import { Marker } from "react-leaflet";
import { Popup } from "react-leaflet";
import L from "leaflet";
import { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

const MapDiv = (props) => {
  const mapRef = useRef();
  const markerRef = useRef();

  const zoom_level = 10;

  const [currentLocation, setCurrentLocation] = useState({
    lat: 25.4964846804421,
    long: 81.86880267764181,
  });
  const [draggable, setDraggable] = useState(false);

  const markerIcon = new L.Icon({
    iconUrl: require("./../images/placeholder.png"),
    iconSize: [35, 40],
    iconAnchor: [17, 40],
    popupAnchor: [0, -46],
  });

  const findCurrentLocation = () => {
    const onSuccess = (location) => {
      setCurrentLocation({
        lat: location.coords.latitude,
        long: location.coords.longitude,
      });
      mapRef.current.flyTo(
        [location.coords.latitude, location.coords.longitude],
        18,
        {
          animate: true,
        }
      );
    };

    const onError = () => {
      toast.error("Permission Denied");
    };
    setDraggable(false);
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  };
  const toggleDraggable = () => {
    setDraggable(!draggable);
  };

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        console.log(markerRef.current.getLatLng());
        setCurrentLocation({
          lat : markerRef.current.getLatLng().lat,
          long : markerRef.current.getLatLng().lng
        })
      },
    }),
    []
  );

  const closeMap  = ()=>{

    props.closeMap(currentLocation.lat,currentLocation.long);
  }

  return (
    <>
      <div className="w-screen h-screen backdrop-blur-md fixed top-0 ">
        <div className="flex flex-col justify-between items-center p-3 space-y-2 container mx-auto h-3/4 mt-20 w-2/3 rounded-lg border-2 border-gray-200 bg-blue-400">
          <div className=" w-full h-full mb-0 bg-red-600 rounded">
            <MapContainer
              center={[currentLocation.lat, currentLocation.long]}
              zoom={zoom_level}
              ref={mapRef}
            >
              <TileLayer
                attribution={omm.openStreet.attribution}
                url={omm.openStreet.url}
              />

              <Marker
                draggable={draggable}
                position={[currentLocation.lat, currentLocation.long]}
                icon={markerIcon}
                eventHandlers={eventHandlers}
                ref={markerRef}
              >
                <Popup>
                  {draggable
                    ? "Draggable mode on"
                    : `${currentLocation.lat}, ${currentLocation.long}`}
                  <br />
                  <span onClick={toggleDraggable}>
                    <a href="#">
                      {draggable
                        ? "Click here to see coordinates"
                        : "Click here to make marker draggable"}
                    </a>
                  </span>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <div className="flex flex-row justify-center space-x-2">
            <button
              className="px-4 py-2 border rounded-lg  bg-green-600 text-white"
              onClick={closeMap}
            >
              Select
            </button>
            <button
              className="px-4 py-2 border rounded-lg  bg-green-600 text-white"
              onClick={findCurrentLocation}
            >
              Locate Me
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MapDiv;
