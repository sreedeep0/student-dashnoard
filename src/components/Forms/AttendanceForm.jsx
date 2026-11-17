import React, { useState, useEffect } from 'react';

export default function AttendanceForm({
  isOpen,
  onClose,
  onSave,
  subjects = [],
  attendanceList = [],
  selectedSubjectId = null
}) {
  const [subjectId, setSubjectId] = useState('');
  const [totalClasses, setTotalClasses] = useState('');
  const [attendedClasses, setAttendedClasses] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const initialSubId = selectedSubjectId || (subjects[0]?.id || '');
    setSubjectId(initialSubId);

    const existing = attendanceList.find(a => a.subjectId === initialSubId);
    if (existing) {
      setTotalClasses(String(existing.totalClasses));
      setAttendedClasses(String(existing.attendedClasses));
    } else {
      setTotalClasses('0');
      setAttendedClasses('0');
    }
    setError('');
  }, [isOpen, selectedSubjectId, subjects, attendanceList]);

  const handleSubjectChange = (id) => {
    setSubjectId(id);
    const existing = attendanceList.find(a => a.subjectId === id);
    if (existing) {
      setTotalClasses(String(existing.totalClasses));
      setAttendedClasses(String(existing.attendedClasses));
    } else {
      setTotalClasses('0');
      setAttendedClasses('0');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subjectId) {
      setError('Please select a subject.');
      return;
    }

    const total = Number(totalClasses);
    const attended = Number(attendedClasses);

    if (isNaN(total) || total < 0) {
      setError('Total classes must be a non-negative number.');
      return;
    }
    if (isNaN(attended) || attended < 0) {
      setError('Attended classes must be a non-negative number.');
      return;
    }
    if (attended > total) {
      setError('Attended classes cannot exceed total classes held.');
      return;
    }

    onSave({
      subjectId,
      totalClasses: total,
      attendedClasses: attended,
    });
    onClose();
  };

  const calculatedPct = Number(totalClasses) > 0
    ? Math.round((Number(attendedClasses) / Number(totalClasses)) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white rounded border border-slate-300 max-w-md w-full shadow-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800 text-sm">
            Log Class Attendance
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 font-bold text-base leading-none"
          >
            ×
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-sm">
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-300 rounded text-xs text-red-800">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Subject *
            </label>
            {subjects.length === 0 ? (
              <p className="text-xs text-red-600">Please add at least one subject first.</p>
            ) : (
              <select
                value={subjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-blue-600 bg-white"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} ({sub.term || 'Term 1'})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Classes Held *
              </label>
              <input
                type="number"
                min="0"
                required
                value={totalClasses}
                onChange={(e) => setTotalClasses(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Classes Attended *
              </label>
              <input
                type="number"
                min="0"
                required
                value={attendedClasses}
                onChange={(e) => setAttendedClasses(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {Number(totalClasses) > 0 && (
            <div className="p-2.5 bg-slate-100 rounded text-xs flex justify-between items-center text-slate-700">
              <span>Calculated Attendance:</span>
              <span className={`font-bold ${calculatedPct >= 75 ? 'text-emerald-700' : 'text-red-700'}`}>
                {calculatedPct}% {calculatedPct < 75 ? '(Below 75% Requirement)' : '(Eligible)'}
              </span>
            </div>
          )}

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-300 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={subjects.length === 0}
              className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded transition-colors"
            >
              Save Attendance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
