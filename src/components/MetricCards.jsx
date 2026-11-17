import React from 'react';

export default function MetricCards({
  hasSubjects = false,
  overallGpa = null,
  overallGrade = 'N/A',
  averageScore = null,
  totalCredits = 0,
  hasAttendanceData = false,
  overallAttendancePct = null,
  totalClassesAttended = 0,
  totalClassesHeld = 0,
  overallAttendanceWarning = false,
  pendingAssignments = 0,
  completedAssignments = 0,
  totalAssignments = 0,
  completionRate = null,
  attendanceAlerts = [],
}) {
  return (
    <div className="space-y-4">
      {/* Attendance Shortage Alert - only displayed when valid attendance is below 75% */}
      {attendanceAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded p-4 text-red-900 text-sm">
          <div className="font-semibold text-red-800 mb-1">
            Attendance Warning
          </div>
          <div className="space-y-1">
            {attendanceAlerts.map(sub => (
              <p key={sub.id}>
                Attendance Alert: <strong>{sub.name}</strong> attendance is currently <strong>{sub.percentage}%</strong> ({sub.attended}/{sub.total} classes). You need to attend approximately <strong>{sub.deficit}</strong> consecutive classes to reach 75%.
              </p>
            ))}
          </div>
        </div>
      )}

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Cumulative GPA */}
        <div className="bg-white border border-slate-300 rounded p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Cumulative GPA
          </div>
          {hasSubjects && overallGpa !== null ? (
            <>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {overallGpa.toFixed(2)} <span className="text-sm font-normal text-slate-500">/ 4.00</span>
              </div>
              <div className="mt-2 text-xs text-slate-600 flex justify-between">
                <span>Grade: <strong>{overallGrade}</strong></span>
                <span>{totalCredits} Total Credits</span>
              </div>
            </>
          ) : (
            <>
              <div className="mt-2 text-2xl font-bold text-slate-400">
                —
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Add a subject to calculate GPA
              </div>
            </>
          )}
        </div>

        {/* Card 2: Average Marks */}
        <div className="bg-white border border-slate-300 rounded p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Average Marks
          </div>
          {hasSubjects && averageScore !== null ? (
            <>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {averageScore.toFixed(1)}%
              </div>
              <div className="mt-2 text-xs text-slate-600">
                Weighted across registered credits
              </div>
            </>
          ) : (
            <>
              <div className="mt-2 text-2xl font-bold text-slate-400">
                —
              </div>
              <div className="mt-2 text-xs text-slate-500">
                No marks recorded yet
              </div>
            </>
          )}
        </div>

        {/* Card 3: Overall Attendance */}
        <div className="bg-white border border-slate-300 rounded p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Overall Attendance
          </div>
          {hasAttendanceData && overallAttendancePct !== null ? (
            <>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                <span className={overallAttendanceWarning ? 'text-red-700' : 'text-slate-900'}>
                  {overallAttendancePct}%
                </span>
              </div>
              <div className="mt-2 text-xs text-slate-600">
                {totalClassesAttended} of {totalClassesHeld} total classes attended
              </div>
            </>
          ) : (
            <>
              <div className="mt-2 text-2xl font-bold text-slate-400">
                —
              </div>
              <div className="mt-2 text-xs text-slate-500">
                No attendance logged yet
              </div>
            </>
          )}
        </div>

        {/* Card 4: Assignments Overview */}
        <div className="bg-white border border-slate-300 rounded p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
            Assignments
          </div>
          {totalAssignments > 0 ? (
            <>
              <div className="mt-2 text-2xl font-bold text-slate-900">
                {pendingAssignments} <span className="text-sm font-normal text-slate-500">Pending</span>
              </div>
              <div className="mt-2 text-xs text-slate-600">
                {completionRate !== null ? `${completionRate}% completed` : ''} ({completedAssignments} of {totalAssignments})
              </div>
            </>
          ) : (
            <>
              <div className="mt-2 text-2xl font-bold text-slate-400">
                0 <span className="text-sm font-normal text-slate-500">Pending</span>
              </div>
              <div className="mt-2 text-xs text-slate-500">
                No assignments yet
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
