import React from 'react';

export default function Navbar({ 
  onOpenSubjectModal, 
  onOpenAssignmentModal, 
  onOpenAttendanceModal,
  onClearAllData,
  overallGpa,
  overallGrade,
  hasSubjects = false
}) {
  return (
    <header className="bg-white border-b border-slate-300 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Application Name */}
          <div className="flex items-center space-x-3">
            <span className="font-bold text-base sm:text-lg text-slate-900 tracking-tight">
              Student Academic Performance Dashboard
            </span>
          </div>

          {/* Quick GPA & Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3 text-sm">
            
            {/* Overall GPA display */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 bg-slate-100 border border-slate-300 rounded text-slate-800 font-medium text-xs">
              <span>Overall GPA:</span>
              <span className="font-bold text-slate-900">
                {hasSubjects && overallGpa !== null ? overallGpa.toFixed(2) : '—'}
              </span>
              {hasSubjects && overallGpa !== null && (
                <span className="text-slate-500">({overallGrade})</span>
              )}
            </div>

            {/* Action Buttons */}
            <button
              type="button"
              onClick={onOpenSubjectModal}
              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-medium transition-colors"
            >
              Add Subject
            </button>

            <button
              type="button"
              onClick={onOpenAssignmentModal}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-medium transition-colors"
            >
              Add Task
            </button>

            <button
              type="button"
              onClick={onOpenAttendanceModal}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-medium transition-colors"
            >
              Log Attendance
            </button>

            <button
              type="button"
              onClick={onClearAllData}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-xs font-medium transition-colors"
              title="Clear all stored data and reset dashboard to empty state"
            >
              Clear All Data
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
