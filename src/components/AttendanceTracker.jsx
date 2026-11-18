import React, { useState, useMemo, useEffect } from 'react';

export default function AttendanceTracker({
  enrichedSubjects = [],
  onQuickAttend,
  onQuickMiss,
  onOpenAttendanceModal
}) {
  const availableTerms = useMemo(() => {
    const terms = new Set();
    enrichedSubjects.forEach((s) => {
      if (s.term && String(s.term).trim()) {
        terms.add(String(s.term).trim());
      }
    });
    return Array.from(terms).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [enrichedSubjects]);

  const [selectedTerm, setSelectedTerm] = useState('All Terms');

  useEffect(() => {
    if (selectedTerm !== 'All Terms' && !availableTerms.includes(selectedTerm)) {
      setSelectedTerm('All Terms');
    }
  }, [availableTerms, selectedTerm]);

  const displayedSubjects = useMemo(() => {
    if (selectedTerm === 'All Terms') return enrichedSubjects;
    return enrichedSubjects.filter((s) => (s.term || '').trim() === selectedTerm);
  }, [enrichedSubjects, selectedTerm]);

  const getStatus = (hasData, pct) => {
    if (!hasData || pct === null) {
      return { label: 'Not Recorded', badge: 'bg-slate-100 text-slate-600 border-slate-300', bar: 'bg-slate-300' };
    }
    if (pct >= 85) {
      return { label: 'Good (≥85%)', badge: 'bg-emerald-50 text-emerald-800 border-emerald-300', bar: 'bg-emerald-600' };
    }
    if (pct >= 75) {
      return { label: 'Satisfactory (75-84%)', badge: 'bg-orange-50 text-orange-800 border-orange-300', bar: 'bg-orange-500' };
    }
    return { label: 'Shortage (<75%)', badge: 'bg-red-50 text-red-800 border-red-300', bar: 'bg-red-600' };
  };

  return (
    <div className="bg-white border border-slate-300 rounded p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-800">Subject Attendance Monitor</h3>
          <p className="text-xs text-slate-500">Track class attendance and 75% minimum eligibility</p>
        </div>
        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          {availableTerms.length > 0 && (
            <div className="flex items-center space-x-1.5">
              <label htmlFor="attendance-term-filter" className="text-xs font-semibold text-slate-600">
                Term:
              </label>
              <select
                id="attendance-term-filter"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-blue-600 bg-white font-medium text-slate-700"
              >
                <option value="All Terms">All Terms</option>
                {availableTerms.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button
            type="button"
            onClick={onOpenAttendanceModal}
            disabled={enrichedSubjects.length === 0}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded text-xs font-medium transition-colors disabled:opacity-50"
          >
            Update Attendance Record
          </button>
        </div>
      </div>

      {enrichedSubjects.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm">
          No registered subjects found. Add your first subject to start tracking attendance.
        </div>
      ) : displayedSubjects.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-200 rounded mt-4">
          No subjects found for {selectedTerm}.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedSubjects.map((sub) => {
            const att = sub.attendance;
            const hasData = Boolean(att && att.hasData && att.totalClasses > 0);
            const total = hasData ? att.totalClasses : 0;
            const attended = hasData ? att.attendedClasses : 0;
            const pct = hasData ? att.percentage : null;
            const status = getStatus(hasData, pct);

            let requirementNote = '';
            if (hasData) {
              if (pct < 75) {
                const needed = Math.ceil((0.75 * total - attended) / 0.25);
                requirementNote = `Needs ~${needed} more consecutive classes to reach 75%`;
              } else {
                const canMiss = Math.floor((attended - 0.75 * total) / 0.75);
                requirementNote = canMiss > 0
                  ? `Can miss up to ${canMiss} class${canMiss > 1 ? 'es' : ''} safely`
                  : 'On track (maintain attendance to stay ≥75%)';
              }
            } else {
              requirementNote = 'No classes logged yet';
            }

            return (
              <div
                key={sub.id}
                className="border border-slate-200 rounded p-3.5 bg-slate-50/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900">{sub.name}</h4>
                      <span className="text-xs text-slate-500">{sub.term || 'Term 1'}</span>
                    </div>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${status.badge}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Attendance Percentage & Counts */}
                  <div className="mt-3 flex items-baseline justify-between">
                    <span className={`text-2xl font-bold ${hasData ? 'text-slate-900' : 'text-slate-400'}`}>
                      {hasData ? `${pct}%` : '—'}
                    </span>
                    <span className="text-xs text-slate-600">
                      {hasData ? `${attended} / ${total} classes attended` : '0 classes recorded'}
                    </span>
                  </div>

                  {/* Simple Flat Progress Bar */}
                  <div className="mt-2 w-full bg-slate-200 rounded h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded transition-all duration-200 ${status.bar}`}
                      style={{ width: `${hasData ? Math.min(100, Math.max(0, pct)) : 0}%` }}
                    />
                  </div>

                  {/* Eligibility Note */}
                  <p className={`mt-2 text-xs font-medium ${hasData && pct < 75 ? 'text-red-700' : 'text-slate-600'}`}>
                    {requirementNote}
                  </p>
                </div>

                {/* Quick Action Buttons */}
                <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Quick Log:</span>
                  <div className="space-x-1.5">
                    <button
                      type="button"
                      onClick={() => onQuickAttend && onQuickAttend(sub.id)}
                      className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition-colors"
                      title="Mark attended (+1 attended, +1 total)"
                    >
                      + Attended
                    </button>
                    <button
                      type="button"
                      onClick={() => onQuickMiss && onQuickMiss(sub.id)}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors"
                      title="Mark absent (+0 attended, +1 total)"
                    >
                      + Absent
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
