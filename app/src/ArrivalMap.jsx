import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
export default function ArrivalMap() {
  const element = useRef(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let map, timer, fallbackTimer;
    try {
      const mobile = matchMedia("(max-width: 760px)").matches;
      const destination = mobile ? [-2.9608, 53.4308] : [-2.98, 53.429];
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      map = new maplibregl.Map({
        container: element.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution:
                '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            },
          },
          layers: [
            {
              id: "tiles",
              type: "raster",
              source: "osm",
              paint: {
                "raster-saturation": -1,
                "raster-brightness-max": 0.52,
                "raster-brightness-min": 0.05,
                "raster-contrast": 0.25,
              },
            },
          ],
        },
        center: reduced ? destination : [-3.025, 53.4],
        zoom: reduced ? 13.8 : 10.8,
        pitch: reduced ? 0 : 35,
        bearing: -18,
        interactive: false,
        attributionControl: true,
      });
      const marker = document.createElement("div");
      marker.className = "anfield-marker";
      marker.innerHTML = "<span></span><b>ANFIELD</b>";
      new maplibregl.Marker({
        element: marker,
        anchor: "left",
        offset: [-8, 0],
      })
        .setLngLat([-2.9608, 53.4308])
        .addTo(map);
      map.on("load", () => {
        if (!reduced)
          timer = setTimeout(
            () =>
              map.flyTo({
                center: destination,
                zoom: 13.8,
                pitch: mobile ? 15 : 42,
                duration: 2200,
                essential: false,
              }),
            350,
          );
      });
      let hasLoadedTile = false;
      map.on("sourcedata", (event) => {
        if (event.sourceId === "osm" && event.tile?.state === "loaded") {
          hasLoadedTile = true;
          clearTimeout(fallbackTimer);
          setFailed(false);
        }
      });
      // One missing tile is not an outage. Show a fallback only if none arrives.
      fallbackTimer = setTimeout(() => {
        if (!hasLoadedTile) setFailed(true);
      }, 7000);
    } catch {
      setFailed(true);
    }
    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
      map?.remove();
    };
  }, []);
  return (
    <div
      className="arrival-map"
      aria-label="Geographic context: Anfield, northeast of Liverpool city centre"
    >
      <div ref={element} className="map-canvas" />
      {failed && (
        <div className="map-fallback" role="status">
          MERSEYSIDE <span>→ LIVERPOOL → ANFIELD</span>
          <small>Live map unavailable. All analysis remains available.</small>
        </div>
      )}
    </div>
  );
}
