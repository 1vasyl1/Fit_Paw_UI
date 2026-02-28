type TimeRange = 'day' | 'week';

interface TimeRangeProps {
    value: TimeRange;
    onChange: (value: TimeRange) => void;
}

export function TimeRange({value, onChange}: TimeRangeProps) {
    const base = "px-4 py-1.5 text-sm border rounded-lg transition-colors";
    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() => onChange('day')}
                className={
                    value === "day"
                        ? `${base} font-medium text-sky-600 bg-sky-50 border-sky-200`
                        : `${base} text-gray-600 border-gray-200 hover:bg-gray-50`
                }>
                Day
            </button>

            <button
                type="button"
                onClick={() => onChange('week')}
                className={
                    value === "week"
                        ? `${base} font-medium text-sky-600 bg-sky-50 border-sky-200`
                        : `${base} text-gray-600 border-gray-200 hover:bg-gray-50`
                }>
                Week
            </button>
        </div>
    )
}