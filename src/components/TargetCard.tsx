interface TargetCardProps {
    percentage: number;
    change: string;
    message: string;
}

export default function TargetCard({ percentage, change, message }: TargetCardProps) {
    return (
        <div className="rounded-xl border border-primary-300 bg-primary-100 p-4 shadow-sm dark:border-primary-500 dark:bg-primary-800">
            <h3 className="text-sm font-medium text-primary-700 dark:text-white">
                Monthly Target
            </h3>
            <p className="text-sm text-primary-700 dark:text-primary-100">
                Target you've set for each month
            </p>
            <div className="mt-2 flex items-end gap-3">
                <span className="text-3xl font-bold text-primary-800 dark:text-white">
                    {percentage}%
                </span>
                <span className="text-sm font-medium text-green-500">+{change}</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-primary-300 dark:bg-primary-300">
                <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <p className="mt-3 text-sm text-primary-700 dark:text-gray-300">{message}</p>
        </div>
    );
}