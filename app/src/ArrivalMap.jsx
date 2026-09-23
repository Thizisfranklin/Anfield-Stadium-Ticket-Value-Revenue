import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
export default function ArrivalMap() {
  const element = useRef(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let map, timer;
    try {
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
        center: reduced ? [-2.9608, 53.4308] : [-3.025, 53.4],
        zoom: reduced ? 14 : 10.8,
        pitch: reduced ? 0 : 35,
        bearing: -18,
        interactive: false,
        attributionControl: true,
      });
      const marker = document.createElement("div");
      marker.className = "anfield-marker";
      marker.innerHTML = "<span></span><b>ANFIELD</b>";
      new maplibregl.Marker({ element: marker })
        .setLngLat([-2.9608, 53.4308])
        .addTo(map);
      map.on("load", () => {
        if (!reduced)
          timer = setTimeout(
            () =>
              map.flyTo({
                center: [-2.975, 53.429],
                zoom: 13.8,
                pitch: 42,
                duration: 2600,
                essential: false,
              }),
            350,
          );
      });
      map.on("error", () => setFailed(true));
    } catch {
      setFailed(true);
    }
    return () => {
      clearTimeout(timer);
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
        <div className="map-fallback">
          MERSEYSIDE <span>→ LIVERPOOL → ANFIELD</span>
          <small>Live map unavailable. All analysis remains available.</small>
        </div>
      )}
    </div>
  );
}
