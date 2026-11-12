interface LineChartProps {
    data: number[];
    color?: string;
    height?: number;
}

export default function LineChart({
    data,
    color = "stroke-blue-500",
    height = 150,
}: LineChartProps) {
    const max = Math.max(...data, 1);
    const points = data
        .map((val, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - (val / max) * 100;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <div className="w-full" style={{ height }}>
            <svg viewBox={`0 0 100 100`} className="h-full w-full overflow-visible">
                <polyline
                    points={points}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={color}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Pontos */}
                {data.map((val, i) => {
                    const x = (i / (data.length - 1)) * 100;
                    const y = 100 - (val / max) * 100;
                    return (
                        <circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="1.5"
                            fill="currentColor"
                            className={color.replace("stroke-", "fill-")}
                        />
                    );
                })}
            </svg>
        </div>
    );
}