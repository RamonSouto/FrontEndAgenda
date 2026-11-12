interface BarChartProps {
    data: { label: string; value: number }[];
    color?: string;
    height?: number;
}

export default function BarChart({
    data,
    color = "bg-blue-500",
    height = 150,
}: BarChartProps) {

    if (!data || data.length === 0) {
        return <div className="text-center text-primary dark:text-primary-100">Sem dados</div>;
    }

    const max = Math.max(...data.map((d) => d.value), 1);

    return (

        <div className="w-full" style={{ height: `${height}px` }}>
            <div className="flex h-full items-end justify-between gap-1">
                {data.map((item, idx) => (
                    <div key={idx} className="flex flex-1 flex-col justify-end items-center gap-1 h-full">
                        <div
                            className={`w-full rounded-t-sm ${color}`}
                            style={{
                                height: `${(item.value / max) * 100}%`,
                                minHeight: "4px", // mantém mínimo, mas se valor >0 já terá mais
                                transition: "height 0.3s ease",
                            }}
                        />
                        <span className="text-xs text-primary dark:text-white">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>

        // <div className="w-full">
        //     <div className="flex items-end justify-between gap-1" style={{ height }}>
        //         {data.map((item, idx) => (
        //             <div key={idx} className="flex flex-1 flex-col items-center gap-1">
        //                 <div
        //                     className={`w-full rounded-t-sm ${color}`}
        //                     style={{
        //                         maxHeight: `${(item.value / max) * 100}%`,
        //                         minHeight: "4px",
        //                         transition: "height 0.3s ease",
        //                     }}
        //                 />
        //                 <span className="text-xs text-primary dark:text-white">
        //                     {item.label}
        //                 </span>
        //             </div>
        //         ))}
        //     </div>
        // </div>
    );
}