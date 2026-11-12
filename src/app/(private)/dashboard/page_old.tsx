//src/app/(private)/dashboard/page.tsx
import StatsCard from "@/components/StatsCard";
import BarChart from "@/components/BarChart";
import LineChart from "@/components/LineChart";
import TargetCard from "@/components/TargetCard";
import {
    ShoppingCart,
    DollarSign,
    Users,
    TrendingUp,
    Target,
} from "lucide-react";

const monthlySalesData = [
    { label: "Jan", value: 180 },
    { label: "Fev", value: 220 },
    { label: "Mar", value: 300 },
    { label: "Abr", value: 250 },
    { label: "Mai", value: 280 },
    { label: "Jun", value: 340 },
    { label: "Jul", value: 400 },
    { label: "Ago", value: 370 },
    { label: "Set", value: 420 },
    { label: "Out", value: 390 },
    { label: "Nov", value: 450 },
    { label: "Dez", value: 500 },
];

const statisticsData = [120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Título */}
            <h1 className="text-2xl font-bold text-primary-800 dark:text-white">
                Monthly Target
            </h1>
            <p className="text-sm text-primary dark:text-white">
                Target you've set for each month
            </p>

            {/* Cards de estatísticas (desktop) */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Orders"
                    value="5,359"
                    change="11.01%"
                    changeType="up"
                    icon={<ShoppingCart size={20} className="text-blue-500" />}
                />
                <StatsCard
                    title="Customers"
                    value="3,782"
                    change="9.05%"
                    changeType="up"
                    icon={<Users size={20} className="text-green-500" />}
                />
                <StatsCard
                    title="Revenue"
                    value="$20,000"
                    change="12.5%"
                    changeType="up"
                    icon={<DollarSign size={20} className="text-yellow-500" />}
                />
                <StatsCard
                    title="Today"
                    value="$3,287"
                    change="8.2%"
                    changeType="up"
                    icon={<TrendingUp size={20} className="text-purple-500" />}
                />
            </div>

            {/* Gráficos (desktop) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Monthly Sales - BarChart */}
                <div className="rounded-xl border border-primary-300 bg-primary-100 p-4 shadow-sm dark:border-primary-500 dark:bg-primary-800">
                    <h3 className="text-lg font-semibold text-primary-800 dark:text-white">
                        Monthly Sales
                    </h3>
                    <div className="mt-4">
                        <BarChart data={monthlySalesData} color="bg-primary" height={180} />
                    </div>
                </div>

                {/* Statistics - LineChart */}
                <div className="rounded-xl border border-primary-300 bg-primary-100 p-4 shadow-sm dark:border-primary-500 dark:bg-primary-800">
                    <h3 className="text-lg font-semibold text-primary-800 dark:text-white">
                        Statistics
                    </h3>
                    <p className="text-sm text-primary dark:text-primary-100">
                        Target you've set for each month
                    </p>
                    <div className="mt-4">
                        <LineChart data={statisticsData} color="stroke-primary" height={180} />
                    </div>
                </div>
            </div>

            {/* Versão mobile: cards empilhados com TargetCard e indicadores */}
            <div className="mt-6 block lg:hidden">
                <div className="grid grid-cols-1 gap-4">
                    {/* Customers e Orders (usando StatsCard) */}
                    <div className="grid grid-cols-2 gap-4">
                        <StatsCard title="Customers" value="3,782" />
                        <StatsCard title="Orders" value="5,359" />
                    </div>

                    {/* Monthly Sales (gráfico) */}
                    <div className="rounded-xl border border-primary-300 bg-primary-100 p-4 shadow-sm dark:border-primary-500 dark:bg-primary-800">
                        <h3 className="text-sm font-medium text-primary-800 dark:text-white">
                            Monthly Sales
                        </h3>
                        <BarChart data={monthlySalesData} color="bg-primary" height={100} />
                    </div>

                    {/* Monthly Target (card especial) */}
                    <TargetCard
                        percentage={75.55}
                        change="10%"
                        message="You earn $3287 today, it's higher than last month. Keep up your good work!"
                    />

                    {/* Três indicadores pequenos */}
                    <div className="grid grid-cols-3 gap-4">
                        <StatsCard title="Target" value="$20K" />
                        <StatsCard title="Revenue" value="$20K" changeType="up" />
                        <StatsCard title="Today" value="$20K" changeType="up" />
                    </div>
                </div>
            </div>
            <p className="text-primary-800 dark:text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi nobis perspiciatis, obcaecati dolorum quaerat ab culpa aspernatur magnam possimus? Delectus sunt maxime voluptates eum adipisci optio tempora eaque sit ad!</p>
            <p className="text-primary-800 dark:text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi nobis perspiciatis, obcaecati dolorum quaerat ab culpa aspernatur magnam possimus? Delectus sunt maxime voluptates eum adipisci optio tempora eaque sit ad!</p>
            <p className="text-primary-800 dark:text-white">Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi nobis perspiciatis, obcaecati dolorum quaerat ab culpa aspernatur magnam possimus? Delectus sunt maxime voluptates eum adipisci optio tempora eaque sit ad!</p>
            {/* Para desktop, exibir os três indicadores adicionais (Target, Revenue, Today) como cards extras? A imagem 1 mostra apenas os dois gráficos, mas a imagem 2 tem esses indicadores. Vou mantê-los apenas mobile, mas se quiser pode adicionar também. */}
        </div>
    );
}