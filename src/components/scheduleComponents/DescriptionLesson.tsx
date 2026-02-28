import {useEffect} from "react";
import {CheckCircle, Clock, X} from "lucide-react";

export type TrainingCell = {
    name: string;
    activity: string;
    status: string | null;
    type?: string;
    description?: string;
    trainer?: string | null;
};

type TrainingModalProps = {
    open: boolean;
    training: TrainingCell | null;
    onClose: () => void;
};

export function TrainingModal({ open, training, onClose }: TrainingModalProps) {
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open || !training) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="w-full max-w-md rounded-xl bg-white shadow-xl"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-4 rounded-t-xl">
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">
                            {training.activity}
                        </h3>
                        <p className="text-xs text-gray-500">
                            {training.name}
                        </p>

                        {training.description ? (
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {training.description}
                            </p>
                        ) : (
                            <p className="text-sm text-gray-400">No description.</p>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-md p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="px-5 py-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-sky-500" />
                        <span>Duration: 30 min</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">

                        <CheckCircle
                            className={`h-4 w-4 ${
                                training.status === "completed"
                                    ? "text-emerald-500"
                                    : training.status === "scheduled"
                                        ? "text-amber-500"
                                        : "text-gray-400"
                            }`}
                        />
                        <span>Status: {training.status ?? "empty"}</span>
                    </div>
                    <span className="text-sm text-gray-600">Trainer: {training.trainer ?? "empty"}</span>
                </div>

                <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
