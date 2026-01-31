import {useMemo} from "react";


interface Cell {
    name: string;
    activity: string;
    status: string | null;
    type?: string;
}

interface Row {
    time: string;
    days: Cell[];
}

export function useScheduleFilter(scheduleData: Row[], selectedType: string) {
    return useMemo(() => {

        if (selectedType === "all") return scheduleData;

        return scheduleData.map((row) => ({
            ...row,
            days: row.days.map((cell) => {

                const match = selectedType === "all" || (cell.activity && cell.activity.toLowerCase().includes(selectedType.toLowerCase()));
                if (match) {
                    return cell;
                }
                return {
                    ...cell,
                    activity: "",
                    status: null,
                };
            }),
        }));
    }, [scheduleData, selectedType]);
}
