import { AlertTriangle, X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
  confirming?: boolean;
};

/**
 * Billable cancellation warning — Musikkii-styled overlay (not a route change).
 */
export function LearnerLessonCancelDialog({ open, onClose, onConfirmCancel, confirming }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true" aria-labelledby="cancel-lesson-title">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div className="min-w-0">
              <h2 id="cancel-lesson-title" className="text-lg font-semibold text-gray-900">
                Cancel lesson?
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            This will cancel your scheduled lesson and <span className="font-semibold">cannot be undone</span>.{' '}
            <span className="font-semibold">Cancelled lessons are still billable.</span>
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            If you cannot attend live, <span className="font-semibold">Request NML Video</span> is usually the better option.
            If your lesson is at least <span className="font-semibold">24 hours</span> away, you may also be eligible to{' '}
            <span className="font-semibold">Reschedule</span> or <span className="font-semibold">Request make-up credit</span>{' '}
            instead.
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={confirming}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-semibold border border-gray-300 bg-white text-gray-800 hover:bg-gray-50 disabled:opacity-50"
            >
              Keep lesson
            </button>
            <button
              type="button"
              onClick={onConfirmCancel}
              disabled={confirming}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60"
            >
              {confirming ? 'Cancelling…' : 'Cancel lesson'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
