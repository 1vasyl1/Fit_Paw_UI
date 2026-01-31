import {Calendar, CheckCircle, Clock} from "lucide-react";
import {useState} from "react";
import {TimeRange} from "@/components/SchedulComponents/TimeRange.tsx";
import {DailyView} from "@/components/SchedulComponents/ScheduleDayView.tsx";
import {FilterLessons} from "@/components/SchedulComponents/FilterLessons.tsx";
import {useScheduleFilter} from "@/components/hooks/useFilterlessons.ts";
import {type TrainingCell, TrainingModal} from "@/components/SchedulComponents/DescriptionLesson.tsx";


const scheduleData = [
    {
        time: "07:00",
        days: [
            {
                name: "Monday",
                activity: "Morning Walk",
                status: "completed",
                description: " morning walk descriptionPlanned features include smarter workout scheduling synced with your dog's routine, basic progress tracking for",
                trainer: "MP"
            },
            {name: "Tuesday", activity: "", status: null, description: "", trainer: "MP"},
            {name: "Wednesday", activity: "", status: null, description: "", trainer: "MP"},
            {name: "Thursday", activity: "", status: null, description: "", trainer: "MP"},
            {name: "Friday", activity: "Morning Walk", status: "completed", description: " ", trainer: "MP"},
            {name: "Saturday", activity: "", status: null, description: "", trainer: "MP"},
            {name: "Sunday", activity: "", status: null, description: "", trainer: "MP"},
        ],
    },
    {
        time: "09:00",
        days: [
            {name: "Monday", activity: "", status: null, description: "", trainer: "MP"},
            {name: "Tuesday", activity: "Gym Session", status: "scheduled", description: " ", trainer: "MP"},
            {name: "Wednesday", activity: "", status: null, description: "", trainer: "MP"},
            {name: "Thursday", activity: "", status: null, description: "", trainer: "MP"},
            {name: "Friday", activity: "", status: null, description: "", trainer: "MP"},
            {
                name: "Saturday",
                activity: "Gym Session",
                status: "scheduled",
                description: "Planned features include smarter workout scheduling synced with your dog's routine, basic progress tracking for",
                trainer: "MP"
            },
            {name: "Sunday", activity: "", status: null, description: "", trainer: "MP"},
        ],
    },
    {
        time: "11.00",
        days: [
            {name: "Monday", activity: "Gym Session", status: "scheduled", trainer: "MP"},
            {name: "Tuesday", activity: "", status: null, description: " ", trainer: "MP"},
            {name: "Wednesday", activity: "Agility Training", status: "scheduled", description: " ", trainer: "MP"},
            {name: "Thursday", activity: "", status: null, description: " ", trainer: "MP"},
            {name: "Friday", activity: "Agility Training", status: "scheduled", description: " ", trainer: "MP"},
            {name: "Saturday", activity: "", status: null, description: "", trainer: "MP"},
            {name: "Sunday", activity: "Long Walk", status: "scheduled", description: " ", trainer: "MP"},
        ],
    },
    {
        time: "16:00",
        days: [
            {name: "Monday", activity: "Long Walk", status: null},
            {name: "Tuesday", activity: "", status: null},
            {name: "Wednesday", activity: "", status: "scheduled"},
            {name: "Thursday", activity: "Agility Training", status: null},
            {name: "Friday", activity: "Gym Session", status: "scheduled"},
            {name: "Saturday", activity: "", status: null},
            {name: "Sunday", activity: "Agility Trainings", status: "completed"},
        ],
    },
];

type TimeRange = "week" | "day";

export function SchedulePage() {
    const [selectedType, setSelectedType] = useState("all");
    const [timeRange, setTimeRange] = useState<TimeRange>("week");
    const filteredSchedule = useScheduleFilter(scheduleData, selectedType);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState<TrainingCell | null>(null);

    const openTraining = (cell: TrainingCell) => {
        if (!cell.activity) return;
        setSelectedTraining({...cell,});
        setModalOpen(true);
    };

    const closeTraining = () => {
        setModalOpen(false);
        setSelectedTraining(null);
    };

    const trainingTypes = [
        {value: "all", label: "All Training "},
        {value: "walk", label: "Walk"},
        {value: "gym", label: "Gym Session"},
        {value: "agility", label: "Agility Training"},
    ];

    return (
        <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-6">
            <TrainingModal open={modalOpen} training={selectedTraining} onClose={closeTraining}/>
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-sky-600"/>
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Schedule</h1>
                            <p className="text-sm text-gray-500">Training January</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* filter */}
                    <FilterLessons
                        selectedType={selectedType}
                        onTypeChange={setSelectedType}
                        trainingTypes={trainingTypes}
                    />

                    <div className="flex-1"/>

                    <TimeRange value={timeRange} onChange={setTimeRange}/>
                </div>

                {/* WEEK */}
                {timeRange === "week" && (
                    <div className="space-y-4">
                        <div className="text-center text-gray-500">
                            <h3 className="text-lg font-medium">Weekly View</h3>
                            <p>Showing full week calendar.</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Days Header */}
                            <div
                                className="grid grid-cols-[100px_repeat(7,1fr)] bg-gradient-to-r from-sky-50 to-blue-50 border-b border-gray-200">
                                <div className="px-4 py-4 font-semibold text-gray-900">Time</div>
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                    <div
                                        key={day}
                                        className="px-3 py-4 text-center font-medium text-sm border-l border-gray-200 first:border-l-0"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Time Rows */}
                            {filteredSchedule.map((row) => (
                                <div
                                    key={row.time}
                                    className="grid grid-cols-[100px_repeat(7,1fr)] border-b border-gray-100 last:border-b-0"
                                >
                                    {/* Time column */}
                                    <div className="px-4 py-3 text-sm font-medium text-gray-600 flex items-center">
                                        {row.time}
                                        <Clock className="w-3 h-3 ml-1 text-gray-400"/>
                                    </div>

                                    {/* Day cells */}
                                    {row.days.map((cell) => (
                                        <div
                                            key={`${row.time}-${cell.name}`}
                                            onClick={() => openTraining(cell)}
                                            className={`relative px-2 py-3 border-l border-gray-100 first:border-l-0 hover:bg-gray-50 transition-colors min-h-[48px] flex items-center ${
                                                cell.status ? "cursor-pointer" : ""
                                            }`}
                                        >
                                            {cell.activity ? (
                                                <div
                                                    className="w-full line-clamp-2 text-xs bg-white rounded-lg p-2 shadow-sm border border-gray-200">
                                                    <div className="font-medium text-gray-900 mb-0.5">
                                                        {cell.activity}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        {cell.status === "completed" && (
                                                            <CheckCircle className="w-3 h-3 text-emerald-500"/>
                                                        )}
                                                        {cell.status === "scheduled" && (
                                                            <div
                                                                className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"/>
                                                        )}
                                                        <span>30 min</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="w-full h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg"/>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* DAY */}
                {timeRange === "day" && <DailyView scheduleData={filteredSchedule} onTrainingClick={openTraining}/>}
            </div>
        </div>
    );
}