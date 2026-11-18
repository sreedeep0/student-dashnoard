import React from 'react';
import { calculateGrade, convertGpaForDisplay } from '../utils/gradeHelpers.js';

export default function SubjectList({
  subjects = [],
  onOpenSubjectModal,
  onEditSubject,
  onDeleteSubject,
  gpaScale = '4.0',
}) {
  return (
    <div className="bg-white border border-slate-300 rounded p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-800">Registered Subjects and Grades</h3>
          <p className="text-xs text-slate-500">Academic courses, credit weightings, and grade conversion</p>
        </div>
        <button
          type="button"
          onClick={() => onOpenSubjectModal()}
          className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-medium transition-colors self-start sm:self-auto"
        >
          + Add Subject
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center py-8 text-slate-500 text-sm border border-dashed border-slate-200 rounded mt-3">
          No registered subjects yet. Click "+ Add Subject" to get started.
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
              {subjects.map((sub) => {
                const gradeInfo = calculateGrade(sub.score);
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
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-900">
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
