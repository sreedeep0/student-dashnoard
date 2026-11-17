import React, { useState } from 'react';
import { formatDate, isDueSoon, isOverdue, getRelativeDueLabel } from '../utils/dateUtils.js';

export default function AssignmentManager({
  assignments = [],
  subjects = [],
  onToggleStatus,
  onDeleteAssignment,
  onOpenAssignmentModal,
}) {
  const [filterTab, setFilterTab] = useState('All'); // 'All' | 'Pending' | 'Completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');

  const isCompletedStatus = (status) =>
    status === 'Completed' || status === 'Submitted' || status === 'Graded';
  const isPendingStatus = (status) =>
    status === 'Pending' || status === 'In Progress';

  // Filter assignments
  const filteredAssignments = assignments.filter((item) => {
    if (filterTab === 'Pending' && !isPendingStatus(item.status)) return false;
    if (filterTab === 'Completed' && !isCompletedStatus(item.status)) return false;

    if (subjectFilter !== 'All' && item.subject !== subjectFilter) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchSubject = item.subject?.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject) return false;
    }

    return true;
  });

  return (
    <div className="bg-white border border-slate-300 rounded p-4">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-3 border-b border-slate-200 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800">Assignment and Task Tracker</h3>
          <p className="text-xs text-slate-500">Manage academic assignments, deadlines, and submissions</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="inline-flex border border-slate-300 rounded overflow-hidden text-xs">
            {['All', 'Pending', 'Completed'].map((tab) => {
              const count = tab === 'All' 
                ? assignments.length 
                : tab === 'Pending' 
                  ? assignments.filter(a => isPendingStatus(a.status)).length 
                  : assignments.filter(a => isCompletedStatus(a.status)).length;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterTab(tab)}
                  className={`px-3 py-1.5 font-medium transition-colors ${
                    filterTab === tab
                      ? 'bg-slate-800 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tab} ({count})
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onOpenAssignmentModal}
            className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-medium transition-colors"
          >
            + New Task
          </button>
        </div>
      </div>

      {/* Search and Subject Filter */}
      <div className="mt-3 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search by title or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-blue-600 bg-white"
        />

        {subjects.length > 0 && (
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="sm:w-48 px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-blue-600 bg-white text-slate-800"
          >
            <option value="All">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
            {assignments.some((a) => a.subject === 'General') && !subjects.some((s) => s.name === 'General') && (
              <option value="General">General</option>
            )}
          </select>
        )}
      </div>

      {/* Task List */}
      <div className="mt-3 space-y-2">
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-sm border border-dashed border-slate-200 rounded">
            {assignments.length === 0
              ? 'No assignments yet. Add a task to start tracking deadlines.'
              : 'No assignments match the selected filters.'}
          </div>
        ) : (
          filteredAssignments.map((task) => {
            const isDone = isCompletedStatus(task.status);
            const dueSoon = !isDone && isDueSoon(task.dueDate);
            const overdue = !isDone && isOverdue(task.dueDate);
            const relativeTime = getRelativeDueLabel(task.dueDate);

            return (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 border border-slate-200 rounded bg-white hover:bg-slate-50 transition-colors"
              >
                {/* Left Information */}
                <div className="min-w-0 flex-1 pr-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                      {task.title}
                    </span>
                    <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {task.subject}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-xs flex-wrap">
                    <span className="text-slate-600">
                      Due: <strong>{formatDate(task.dueDate)}</strong>
                    </span>

                    {overdue && (
                      <span className="text-red-700 font-semibold bg-red-50 border border-red-200 px-1.5 py-0.5 rounded text-[11px]">
                        Overdue ({relativeTime})
                      </span>
                    )}

                    {dueSoon && (
                      <span className="text-orange-700 font-semibold bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded text-[11px]">
                        Due within 48h ({relativeTime})
                      </span>
                    )}

                    {!overdue && !dueSoon && relativeTime && !isDone && (
                      <span className="text-slate-500 text-[11px]">
                        ({relativeTime})
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Status and Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(task.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded border transition-colors ${
                      task.status === 'Graded'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : task.status === 'Submitted' || task.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                    }`}
                    title="Click to toggle status (Pending / Completed)"
                  >
                    {task.status || 'Pending'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteAssignment(task.id)}
                    className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 border border-transparent hover:border-red-200 rounded transition-colors"
                    title="Delete task"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
