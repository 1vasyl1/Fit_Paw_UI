import { Filter } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";

interface TrainingType {
    value: string;
    label: string;
}

interface FilterLessonsProps {
    selectedType: string;
    onTypeChange: (value: string) => void;
    trainingTypes: TrainingType[];
}

export function FilterLessons({
                                  selectedType,
                                  onTypeChange,
                                  trainingTypes,
                              }: FilterLessonsProps) {
    return (
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
            <Filter className="w-4 h-4 text-gray-500" />
            <Select value={selectedType} onValueChange={onTypeChange}>
                <SelectTrigger className="w-full max-w-48 text-sm border-none shadow-none px-0 focus:ring-0">
                    <SelectValue placeholder="All training types" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel className="text-xs text-gray-400">
                            Training types
                        </SelectLabel>
                        {trainingTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value} className="text-sm">
                                {type.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
