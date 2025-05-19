import React from "react";

type Props = {
  className?: string;
  data?: bigint[];
  note?: string;
  title: string;
  width?: number;
  height?: number;
};

export const Line: React.FC<Props> = ({
  className = "",
  data = [0,1,4,4,4,9,12,44,45,45,46,56,67,68,76,89,132,142,165],
  note,
  title,
  width = 600,
  height = 400,
}) => {
  if (data.length < 2) return null;

  const maxData = Math.max(...data.map(Number));
  const padding = 35;

  const calculateStep = (max: number) => {
    const range = max - yMin;
    const niceSteps = [1, 2, 3, 5, 10, 20, 25, 50, 100];
    for (const step of niceSteps) {
      const divisions = Math.ceil(range / step);
      if (divisions >= 4 && divisions <= 5) {
          return step;
      }
    }
    return Math.ceil(maxData / 4 ); // fallback
  };
  
  const yMin = 0;

  const step = calculateStep(maxData );
  const yMax = (maxData / step + 1)  * step;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * chartWidth + padding;
    const y = ((yMax - Number(d)) / (yMax - yMin)) * chartHeight + padding;
    return { x, y };
  });

  const pathD = points.reduce((path, point, i, arr) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    const prev = arr[i - 1];
    const cx1 = prev.x + (point.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (point.x - prev.x) / 2;
    const cy2 = point.y;
    return path + ` C ${cx1},${cy1} ${cx2},${cy2} ${point.x},${point.y}`;
  }, "");


  const yLines = [];
  for (let val = yMin; val <= yMax; val += step) {
    const y = ((yMax - val) / (yMax - yMin)) * chartHeight + padding;
    yLines.push({ val, y });
  }


  return (
    <div className="m-2 ml-4 p-2 bg-[#22224050] rounded-3xl">
      <h1 className="m- text-gray-300 text-center">{title}</h1>

      {note && <div className=" absolute ml-20 text-gray-400 text-[14px]">{note}</div>}

      <svg
        className={` h-auto w-full md:w-[600px] ${className}`}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Líneas horizontales grises cada 10 unidades */}
        {yLines.map(({ y }, i) => (
          <line
            key={`line-${i}`}
            x1={padding }
            y1={y}
            x2={width - padding}
            y2={y}
            stroke="#888"
            strokeWidth="0.25"
          />
        ))}

        {/* Ejes */}
        <line
          x1={padding}
          y1={padding }
          x2={padding}
          y2={height - padding}
          stroke="#444"
          strokeWidth="1"
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#444"
          strokeWidth="1"
        />

        {/* Etiquetas del eje Y */}
        {yLines.map(({ val, y }, i) => (
          <text
            key={`label-${i}`}
            x={0}
            y={y + 4}
            fontSize="15"
            fill="#888"
          >
            {val}
          </text>
        ))}

        {/* Línea de datos */}
        <path
          d={pathD}
          stroke="#00FF99"
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default Line
