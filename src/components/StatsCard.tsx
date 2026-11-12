interface StatsCardProps {
    title: string;
    value: string | number;
    change?: string;
    changeType?: "up" | "down";
    icon?: React.ReactNode;
}

export default function StatsCard({
    title,
    value,
    change,
    changeType = "up",
    icon,
}: StatsCardProps) {
    return (
        <div className="rounded-xl border border-primary-300 bg-primary-100 p-4 shadow-sm dark:border-primary-500 dark:bg-primary-800">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-primary dark:text-primary-100">{title}</p>
                    <p className="mt-1 text-2xl font-bold text-primary-800 dark:text-white">{value}</p>
                </div>
                {icon && <div className="rounded-full bg-primary-50 p-2 dark:bg-primary-900">{icon}</div>}
            </div>
            {change && (
                <div className="mt-2 flex items-center gap-1 text-xs">
                    <span
                        className={
                            changeType === "up" ? "text-primary-500" : "text-red-500"
                        }
                    >
                        {changeType === "up" ? "↑" : "↓"} {change}
                    </span>
                    <span className="text-primary-400 dark:text-primary-100">vs mês passado</span>
                </div>
            )}
        </div>
    );
}