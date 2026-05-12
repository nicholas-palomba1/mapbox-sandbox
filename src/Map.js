import { useState, useRef, useEffect } from "react";
import './Map.css'
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { accessToken } from "./authService/externalVar";

const INITIAL_CENTER = [-73.98, 40.7];
const INITIAL_ZOOM = 12.12;

//   useEffect(()=>{
  // using geolocation api to get user's location
//   let userCoords 
//   const showPosition = (position) =>{
//     setUserCoordinates({latitude: position.coords.latitude, longitude: position.coords.longitude})
//   }
  
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition)
//   } else {
//     throw new Error("Geolocation is not supported by the browser")
//   }

  

//   console.log("this is the user's coordinates: ", userCoordinates)
//   }, [])
 


console.log(" this is my current location data: ", navigator.geolocation )

function Map() {
  const [center, setCenter] = useState( INITIAL_CENTER )
  const [zoom, setZoom] = useState(INITIAL_ZOOM)


  const mapRef = useRef(); // this references the actual map object itself
  const mapContainerRef = useRef(); // this references the container in which the map is held

  useEffect(() => {
    mapboxgl.accessToken = accessToken;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: center, // starting position [lng, lat]. Note that lat must be set between -90 and 90
      zoom: zoom, // starting zoom
    });

    // mapRef.current.addControl(
    //     new mapboxgl.GeolocateControl({
    //         positionOptions: {
    //             enableHighAccuracy: true
    //         },
    //         trackUserLocation: true,
    //         showUserHeading: true
    //     })
    // )

    const geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            fitBoundsOptions: {
                maxZoom: 13
            },
        trackUserLocation: true,
        showUserLocation: true,
        showUserHeading: true,
        // zoom: 13,
        showButton: false
    })
    mapRef.current.addControl(geolocate)
    mapRef.current.on('load', ()=> {
        geolocate.trigger()
    })

    mapRef.current.on('move', ()=> { // adding listener for moving/dragging of map
        const mapCenter = mapRef.current.getCenter() // (from API) retrieve new center of map
        const mapZoom = mapRef.current.getZoom()    // (from API) retrieving new zoom of map

        setCenter([mapCenter.lng, mapCenter.lat]) // longitude and lattitude to replace init center
        setZoom(mapZoom)  // setting new  zoom to replace init zoom 
    })

    return () => {
      mapRef.current.remove(); // component unmounting and cleanup after init render
    };
  }, []);

  const handleButtonClick = () => {
    mapRef.current.flyTo({ // (from API) will animate map and drag you to inputted coordinates
        center: INITIAL_CENTER,
        zoom: INITIAL_ZOOM
    })
  }

  return (
    <>
      <div className="sidebar">
        Longitude: {center[0].toFixed(4)} Latitude: {center[1].toFixed(4)} | Zoom: {zoom.toFixed(2)}
      </div>
      <button className="reset-button" onClick={handleButtonClick}>
        Reset
      </button>
      <div
        id="map-container"
        ref={mapContainerRef}
      />
    </>
  );
}

export default Map;
