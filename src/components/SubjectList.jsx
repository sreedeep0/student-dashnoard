import React, { useState, useMemo, useEffect } from 'react';
import { calculateGrade, convertGpaForDisplay } from '../utils/gradeHelpers.js';

export default function SubjectList({
  subjects = [],
  onOpenSubjectModal,
  onEditSubject,
  onDeleteSubject,
  gpaScale = '4.0',
  passingMark = 50,
}) {
  const effectivePassingMark =
    typeof passingMark === 'number' && passingMark > 0 && passingMark <= 100
      ? passingMark
      : Number(passingMark) > 0 && Number(passingMark) <= 100
      ? Number(passingMark)
      : 50;

  const availableTerms = useMemo(() => {
    const terms = new Set();
    subjects.forEach((s) => {
      if (s.term && String(s.term).trim()) {
        terms.add(String(s.term).trim());
      }
    });
    return Array.from(terms).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [subjects]);

  const [selectedTerm, setSelectedTerm] = useState('All Terms');

  useEffect(() => {
    if (selectedTerm !== 'All Terms' && !availableTerms.includes(selectedTerm)) {
      setSelectedTerm('All Terms');
    }
  }, [availableTerms, selectedTerm]);

  const filteredSubjects = useMemo(() => {
    if (selectedTerm === 'All Terms') return subjects;
    return subjects.filter((s) => (s.term || '').trim() === selectedTerm);
  }, [subjects, selectedTerm]);

  return (
    <div className="bg-white border border-slate-300 rounded p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-800">Registered Subjects and Grades</h3>
          <p className="text-xs text-slate-500">Academic courses, credit weightings, and grade conversion</p>
        </div>
        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          {availableTerms.length > 0 && (
            <div className="flex items-center space-x-1.5">
              <label htmlFor="subject-table-term-filter" className="text-xs font-semibold text-slate-600">
                Term:
              </label>
              <select
                id="subject-table-term-filter"
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
            onClick={() => onOpenSubjectModal()}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-medium transition-colors"
          >
            + Add Subject
          </button>
        </div>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-200 rounded mt-3">
          No registered subjects yet. Click "+ Add Subject" to get started.
        </div>
      ) : filteredSubjects.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-200 rounded mt-3">
          No subjects recorded for {selectedTerm}.
        </div>
      ) : (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-50 text-slate-700 font-semibold text-xs uppercase tracking-wider">
                <th className="py-2.5 px-3">Subject</th>
                <th className="py-2.5 px-3">Term</th>
                <th className="py-2.5 px-3 text-center">Credits</th>
                <th className="py-2.5 px-3 text-center">Score (%)</th>
                <th className="py-2.5 px-3 text-center">Letter Grade</th>
                <th className="py-2.5 px-3 text-center">Grade Point ({gpaScale})</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSubjects.map((sub) => {
                const gradeInfo = calculateGrade(sub.score);
                const isBelowPassing = Number(sub.score) < effectivePassingMark;
                return (
                  <tr key={sub.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {sub.name}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {sub.term || 'Term 1'}
                    </td>
                    <td className="py-2.5 px-3 text-center text-slate-700">
                      {sub.credits || 1}
                    </td>
                    <td 
                      className={`py-2.5 px-3 text-center font-semibold ${isBelowPassing ? 'text-red-700' : 'text-slate-900'}`}
                      title={isBelowPassing ? `Score is below passing mark (${effectivePassingMark}%)` : `Passing mark: ${effectivePassingMark}%`}
                    >
                      {sub.score}%
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${gradeInfo.color}`}>
                        {gradeInfo.letter}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-medium text-slate-800">
                      {convertGpaForDisplay(gradeInfo.gpa, gpaScale).toFixed(1)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="inline-flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => onEditSubject(sub)}
                          className="px-2 py-1 text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-50 border border-slate-300 rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteSubject(sub.id)}
                          className="px-2 py-1 text-xs text-red-700 hover:text-red-900 hover:bg-red-50 border border-slate-300 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
