import {CheckCircle, Clock} from "lucide-react";
import {type TrainingCell} from "@/components/scheduleComponents/DescriptionLesson.tsx";


interface Row {
    time: string;
    days: TrainingCell[];
}

interface DailyViewProps {
    scheduleData: Row[];
    onTrainingClick: (cell: TrainingCell, time: string) => void;
}


export function DailyView({scheduleData, onTrainingClick}: DailyViewProps) {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayIndex = new Date().getDay();
    const todayName = dayNames[todayIndex];

    const dailyRows = scheduleData.map((row) => {
        const cell = row.days.find((d) => d.name === todayName) || {
            name: todayName,
            activity: "",
            description: "",
            trainer: "",
            status: null,
        } as TrainingCell;
        return {time: row.time, cell};
    });

    return (
        <div className="space-y-4">
            <div className="text-center text-gray-500">
                <h3 className="text-lg font-medium">Daily View</h3>
                <p>Showing schedule for {todayName} (Today).</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

                {/* Header */}
                <div
                    className="grid grid-cols-[100px_1fr] bg-gradient-to-r from-sky-50 to-blue-50 border-b border-gray-200">
                    <div className="px-4 py-4 font-semibold text-gray-900">Time</div>
                    <div className="px-3 py-4 text-center font-medium text-sm border-l border-gray-200">
                        {todayName}
                    </div>
                </div>

                {/* Rows */}
                {dailyRows.map((row) => (
                    <div
                        key={row.time}
                        onClick={() => {
                            if (row.cell.activity) {
                                onTrainingClick(row.cell, row.time);
                            }
                        }}
                        className="grid grid-cols-[100px_1fr] border-b border-gray-100 last:border-b-0"
                    >
                        {/* Time */}
                        <div className="px-4 py-3 text-sm font-medium text-gray-600 flex items-center">
                            {row.time}
                            <Clock className="w-3 h-3 ml-1 text-gray-400"/>
                        </div>

                        {/* Cell */}
                        <div
                            className={`relative px-2 py-3 border-l border-gray-100 hover:bg-gray-50 transition-colors min-h-[48px] flex items-center ${
                                row.cell.status ? "cursor-pointer" : ""
                            }`}
                        >
                            {row.cell.activity ? (
                                <div
                                    className="w-full line-clamp-2 text-xs bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                                    <div className="font-medium text-gray-900 mb-0.5">
                                        {row.cell.activity}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        {row.cell.status === "completed" && (
                                            <CheckCircle className="w-3 h-3 text-emerald-500"/>
                                        )}
                                        {row.cell.status === "scheduled" && (
                                            <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"/>
                                        )}
                                        <span>30 min</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg"/>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}