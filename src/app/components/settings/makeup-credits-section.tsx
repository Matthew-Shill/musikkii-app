import { Ticket } from 'lucide-react';
import { formatLessonDate } from '@/lib/lesson-ui-helpers';
import { useMakeupCredits } from '@/app/dashboard/hooks/useMakeupCredits';

export function MakeupCreditsSection() {
  const { rows, loading, error, reload } = useMakeupCredits();

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-violet-600 flex items-center justify-center">
          <Ticket className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Make-up credits</h2>
          <p className="text-sm text-gray-600">
            Deferred replacement lessons from converted schedule rows (read-only; redemption is not wired yet).
          </p>
        </div>
      </div>

      {loading ? <p className="text-sm text-gray-500">Loading…</p> : null}
      {error ? (
        <p className="text-sm text-red-600 mb-2" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error && rows.length === 0 ? (
        <p className="text-sm text-gray-600">No make-up credits on file.</p>
      ) : null}

      {rows.length > 0 ? (
        <div className="overflow-x-auto border border-gray-100 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
              <tr>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Original lesson</th>
                <th className="px-3 py-2">Minutes</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Redeemed lesson</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-3 py-2 whitespace-nowrap">{formatLessonDate(r.created_at)}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.original_lesson_id.slice(0, 8)}…</td>
                  <td className="px-3 py-2">{r.duration_minutes}</td>
                  <td className="px-3 py-2 capitalize">{r.status}</td>
                  <td className="px-3 py-2 font-mono text-xs">
                    {r.redeemed_lesson_id ? `${r.redeemed_lesson_id.slice(0, 8)}…` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => void reload()}
        className="mt-3 text-sm font-medium text-violet-700 hover:text-violet-900"
      >
        Refresh list
      </button>
    </div>
  );
}
