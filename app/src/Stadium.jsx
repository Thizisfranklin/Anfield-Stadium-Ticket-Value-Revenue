export default function Stadium({ stands, selected, onSelect }) {
  const shapes = [
    { id: "main", d: "M120 58 L580 58 L532 140 L168 140Z", x: 350, y: 105 },
    {
      id: "dalglish",
      d: "M168 350 L532 350 L580 432 L120 432Z",
      x: 350,
      y: 393,
    },
    { id: "kop", d: "M65 100 L150 150 L150 340 L65 390Z", x: 105, y: 250 },
    {
      id: "anfield-road",
      d: "M550 150 L635 100 L635 390 L550 340Z",
      x: 593,
      y: 250,
    },
  ];
  return (
    <svg
      viewBox="0 0 700 490"
      className="stadium"
      aria-label="Original schematic of Anfield. Select one of four stands. Not a seating plan."
    >
      <defs>
        <pattern
          id="pitch-stripes"
          width="52"
          height="200"
          patternUnits="userSpaceOnUse"
        >
          <rect width="26" height="200" fill="#152f2d" />
          <rect x="26" width="26" height="200" fill="#193834" />
        </pattern>
      </defs>
      <path
        d="M50 75 110 40H590L650 75V415L590 450H110L50 415Z"
        fill="none"
        stroke="#273d47"
        strokeDasharray="3 7"
      />
      <rect
        x="183"
        y="156"
        width="334"
        height="178"
        rx="2"
        fill="url(#pitch-stripes)"
        stroke="#6b9990"
      />
      <g fill="none" stroke="#6b9990" strokeWidth="1.4">
        <path d="M350 156V334M183 205H231V285H183M517 205H469V285H517M183 225H201V265H183M517 225H499V265H517" />
        <circle cx="350" cy="245" r="27" />
        <circle cx="350" cy="245" r="2" />
      </g>
      {shapes.map((s) => {
        const stand = stands.find((x) => x.id === s.id);
        return (
          <g
            key={s.id}
            role="button"
            tabIndex="0"
            aria-label={`Select ${stand.name}`}
            aria-pressed={selected === s.id}
            className={`stand ${selected === s.id ? "selected" : ""}`}
            onClick={() => onSelect(s.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(s.id);
              }
            }}
          >
            <path d={s.d} />
            <text
              x={s.x}
              y={s.y}
              textAnchor="middle"
              transform={
                s.id === "kop"
                  ? `rotate(-90 ${s.x} ${s.y})`
                  : s.id === "anfield-road"
                    ? `rotate(90 ${s.x} ${s.y})`
                    : undefined
              }
            >
              {stand.name.toUpperCase()}
            </text>
          </g>
        );
      })}
      <text x="350" y="475" textAnchor="middle" className="svg-note">
        ORIGINAL SCHEMATIC · NOT TO SCALE · NO SEAT-LEVEL METRICS
      </text>
    </svg>
  );
}
