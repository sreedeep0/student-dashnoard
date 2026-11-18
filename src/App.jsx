import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import useAcademicCalculations from './hooks/useAcademicCalculations';
import Navbar from './components/Navbar';
import MetricCards from './components/MetricCards';
import MarksBarChart from './components/Charts/MarksBarChart';
import TrendLineChart from './components/Charts/TrendLineChart';
import AttendanceTracker from './components/AttendanceTracker';
import AssignmentManager from './components/AssignmentManager';
import SubjectList from './components/SubjectList';
import SubjectForm from './components/Forms/SubjectForm';
import AssignmentForm from './components/Forms/AssignmentForm';
import AttendanceForm from './components/Forms/AttendanceForm';

// One-time cleanup: remove legacy demonstration records if present in the user's browser
function cleanupLegacyDemoData() {
  if (typeof window === 'undefined') return;
  try {
    const rawSubjects = window.localStorage.getItem('academic_subjects_v1');
    if (rawSubjects) {
      const parsed = JSON.parse(rawSubjects);
      if (Array.isArray(parsed) && parsed.length === 3 &&
        parsed.some(s => s.name === 'Mathematics' && s.id === '1') &&
        parsed.some(s => s.name === 'Computer Science' && s.id === '2') &&
        parsed.some(s => s.name === 'Physics' && s.id === '3')) {
        window.localStorage.removeItem('academic_subjects_v1');
      }
    }

    const rawAttendance = window.localStorage.getItem('academic_attendance_v1');
    if (rawAttendance) {
      const parsed = JSON.parse(rawAttendance);
      if (Array.isArray(parsed) && parsed.length === 3 &&
        parsed.some(a => a.subjectId === '1' && a.totalClasses === 40) &&
        parsed.some(a => a.subjectId === '2' && a.totalClasses === 45) &&
        parsed.some(a => a.subjectId === '3' && a.totalClasses === 38)) {
        window.localStorage.removeItem('academic_attendance_v1');
      }
    }

    const rawAssignments = window.localStorage.getItem('academic_assignments_v1');
    if (rawAssignments) {
      const parsed = JSON.parse(rawAssignments);
      if (Array.isArray(parsed) && parsed.length === 2 &&
        parsed.some(a => a.title === 'Data Structures Lab 3' && a.id === '1') &&
        parsed.some(a => a.title === 'Calculus Problem Set 2' && a.id === '2')) {
        window.localStorage.removeItem('academic_assignments_v1');
      }
    }
  } catch {
    // Ignore JSON parse errors
  }
}

cleanupLegacyDemoData();

export default function App() {
  // LocalStorage state persistence - initialized to empty arrays
  const [subjects, setSubjects] = useLocalStorage('academic_subjects_v1', []);
  const [attendance, setAttendance] = useLocalStorage('academic_attendance_v1', []);
  const [assignments, setAssignments] = useLocalStorage('academic_assignments_v1', []);
  const [gpaScale, setGpaScale] = useLocalStorage('academic_gpa_scale_v1', '4.0');
  const [passingMark, setPassingMark] = useLocalStorage('academic_passing_mark_v1', 50);

  const [passingMarkInput, setPassingMarkInput] = useState(String(passingMark));
  const [passingMarkError, setPassingMarkError] = useState('');

  useEffect(() => {
    setPassingMarkInput(String(passingMark));
  }, [passingMark]);

  const handleApplyPassingMark = (e) => {
    if (e) e.preventDefault();
    const str = String(passingMarkInput).trim();
    if (str === '' || isNaN(Number(str))) {
      setPassingMarkError('Please enter a valid number');
      return;
    }
    const num = parseFloat(str);
    if (num <= 0 || num > 100) {
      setPassingMarkError('Passing mark must be > 0 and ≤ 100');
      return;
    }
    setPassingMark(num);
    setPassingMarkInput(String(num));
    setPassingMarkError('');
  };

  // Modal dialog states
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [selectedSubjectForAttendance, setSelectedSubjectForAttendance] = useState(null);

  // Dynamic calculations engine
  const calculations = useAcademicCalculations({
    subjects,
    attendance,
    assignments,
    gpaScale,
  });

  // ================= SUBJECT HANDLERS =================
  const handleSaveSubject = (subjectData) => {
    if (editingSubject) {
      const oldName = editingSubject.name;
      const newName = subjectData.name;

      setSubjects(prev => prev.map(s => s.id === subjectData.id ? subjectData : s));

      // When a subject is renamed, update the subject name in associated assignments
      if (oldName !== newName) {
        setAssignments(prev =>
          prev.map(a => (a.subject === oldName ? { ...a, subject: newName } : a))
        );
      }
    } else {
      setSubjects(prev => [...prev, subjectData]);
      // Do not assume attendance records before the user enters them
    }
    setEditingSubject(null);
  };

  const handleEditSubject = (subject) => {
    setEditingSubject(subject);
    setIsSubjectModalOpen(true);
  };

  const handleDeleteSubject = (subjectId) => {
    const subjectToDelete = subjects.find(s => s.id === subjectId);
    if (window.confirm('Are you sure you want to delete this subject and its attendance record?')) {
      const deletedSubjectName = subjectToDelete ? subjectToDelete.name : null;

      setSubjects(prev => prev.filter(s => s.id !== subjectId));
      setAttendance(prev => prev.filter(a => a.subjectId !== subjectId));

      // When a subject is deleted, reassign affected assignments to 'General' without deleting them
      if (deletedSubjectName) {
        setAssignments(prev =>
          prev.map(a => (a.subject === deletedSubjectName ? { ...a, subject: 'General' } : a))
        );
      }
    }
  };

  // ================= ATTENDANCE HANDLERS =================
  const handleSaveAttendance = ({ subjectId, totalClasses, attendedClasses }) => {
    setAttendance(prev => {
      const idx = prev.findIndex(a => a.subjectId === subjectId);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], totalClasses, attendedClasses };
        return updated;
      }
      return [...prev, { id: Date.now().toString(), subjectId, totalClasses, attendedClasses }];
    });
  };

  const handleQuickAttend = (subjectId) => {
    setAttendance(prev => {
      const idx = prev.findIndex(a => a.subjectId === subjectId);
      if (idx !== -1) {
        const item = prev[idx];
        const updated = [...prev];
        updated[idx] = {
          ...item,
          totalClasses: (Number(item.totalClasses) || 0) + 1,
          attendedClasses: (Number(item.attendedClasses) || 0) + 1,
        };
        return updated;
      }
      return [...prev, { id: Date.now().toString(), subjectId, totalClasses: 1, attendedClasses: 1 }];
    });
  };

  const handleQuickMiss = (subjectId) => {
    setAttendance(prev => {
      const idx = prev.findIndex(a => a.subjectId === subjectId);
      if (idx !== -1) {
        const item = prev[idx];
        const updated = [...prev];
        updated[idx] = {
          ...item,
          totalClasses: (Number(item.totalClasses) || 0) + 1,
        };
        return updated;
      }
      return [...prev, { id: Date.now().toString(), subjectId, totalClasses: 1, attendedClasses: 0 }];
    });
  };

  // ================= ASSIGNMENT HANDLERS =================
  const handleSaveAssignment = (assignmentData) => {
    if (editingAssignment) {
      setAssignments(prev => prev.map(a => a.id === assignmentData.id ? assignmentData : a));
    } else {
      setAssignments(prev => [assignmentData, ...prev]);
    }
    setEditingAssignment(null);
  };

  const handleToggleAssignmentStatus = (assignmentId) => {
    setAssignments(prev =>
      prev.map(item => {
        if (item.id === assignmentId) {
          const isDone = item.status === 'Completed' || item.status === 'Submitted' || item.status === 'Graded';
          const nextStatus = isDone ? 'Pending' : 'Completed';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleDeleteAssignment = (assignmentId) => {
    setAssignments(prev => prev.filter(a => a.id !== assignmentId));
  };

  // ================= CLEAR ALL DATA =================
  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This will remove all your subjects, attendance records, and assignments.')) {
      setSubjects([]);
      setAttendance([]);
      setAssignments([]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800">
      {/* Navigation Bar */}
      <Navbar
        onOpenSubjectModal={() => {
          setEditingSubject(null);
          setIsSubjectModalOpen(true);
        }}
        onOpenAssignmentModal={() => {
          setEditingAssignment(null);
          setIsAssignmentModalOpen(true);
        }}
        onOpenAttendanceModal={() => {
          setSelectedSubjectForAttendance(subjects[0]?.id || null);
          setIsAttendanceModalOpen(true);
        }}
        onClearAllData={handleClearAllData}
        overallGpa={calculations.overallGpa}
        overallGrade={calculations.overallGrade}
        hasSubjects={calculations.hasSubjects}
        gpaScale={gpaScale}
        onScaleChange={setGpaScale}
        gpaDenominator={calculations.gpaDenominator}
      />

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Simple Heading / Overview Section */}
        <div className="bg-white border border-slate-300 rounded p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Student Academic Performance Dashboard
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Track your grades, attendance, assignments, and academic progress.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm bg-slate-50 border border-slate-200 rounded px-4 py-2 self-start md:self-auto">
              <div>
                <span className="text-xs text-slate-500 block">Current GPA</span>
                <span className="text-base font-bold text-slate-900">
                  {calculations.hasSubjects && calculations.overallGpa !== null
                    ? `${calculations.overallGpa.toFixed(2)} / ${calculations.gpaDenominator} (${calculations.overallGrade})`
                    : '—'}
                </span>
              </div>
              <div className="border-l border-slate-300 pl-4 sm:pl-6">
                <span className="text-xs text-slate-500 block">Overall Attendance</span>
                <span className={`text-base font-bold ${calculations.overallAttendanceWarning ? 'text-red-700' : 'text-slate-900'}`}>
                  {calculations.hasAttendanceData && calculations.overallAttendancePct !== null ? `${calculations.overallAttendancePct}%` : '—'}
                </span>
              </div>
              <div className="border-l border-slate-300 pl-4 sm:pl-6">
                <span className="text-xs text-slate-500 block">Passing Mark</span>
                <form onSubmit={handleApplyPassingMark} className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex items-center">
                    <input
                      type="number"
                      step="any"
                      min="0.01"
                      max="100"
                      value={passingMarkInput}
                      onChange={(e) => {
                        setPassingMarkInput(e.target.value);
                        setPassingMarkError('');
                      }}
                      className="w-16 px-2 py-0.5 text-xs border border-slate-300 rounded font-bold text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                      aria-label="Passing Mark Percentage"
                    />
                    <span className="text-xs font-bold text-slate-600 ml-1">%</span>
                  </div>
                  <button
                    type="submit"
                    className="px-2 py-0.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-medium transition-colors"
                    title="Apply passing mark"
                  >
                    Set
                  </button>
                </form>
                {passingMarkError && (
                  <span className="text-[10px] text-red-600 block mt-0.5 font-medium">{passingMarkError}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 1. Summary Metric Cards & Attendance Warning */}
        <MetricCards
          hasSubjects={calculations.hasSubjects}
          overallGpa={calculations.overallGpa}
          overallGrade={calculations.overallGrade}
          averageScore={calculations.averageScore}
          totalCredits={calculations.totalCredits}
          hasAttendanceData={calculations.hasAttendanceData}
          overallAttendancePct={calculations.overallAttendancePct}
          totalClassesAttended={calculations.totalClassesAttended}
          totalClassesHeld={calculations.totalClassesHeld}
          overallAttendanceWarning={calculations.overallAttendanceWarning}
          pendingAssignments={calculations.pendingAssignments}
          completedAssignments={calculations.completedAssignments}
          totalAssignments={calculations.totalAssignments}
          completionRate={calculations.completionRate}
          attendanceAlerts={calculations.attendanceAlerts}
          gpaScale={gpaScale}
          gpaDenominator={calculations.gpaDenominator}
        />

        {/* 2. Visualizations: Marks Bar Chart and Term-over-Term Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MarksBarChart subjects={calculations.enrichedSubjects} passingMark={passingMark} />
          <TrendLineChart
            termTrends={calculations.termTrends}
            gpaScale={gpaScale}
            gpaDenominator={calculations.gpaDenominator}
          />
        </div>

        {/* 3. Subject Attendance Monitor */}
        <AttendanceTracker
          enrichedSubjects={calculations.enrichedSubjects}
          onQuickAttend={handleQuickAttend}
          onQuickMiss={handleQuickMiss}
          onOpenAttendanceModal={() => {
            setSelectedSubjectForAttendance(subjects[0]?.id || null);
            setIsAttendanceModalOpen(true);
          }}
        />

        {/* 4. Assignment and Task Tracker */}
        <AssignmentManager
          assignments={assignments}
          subjects={subjects}
          onToggleStatus={handleToggleAssignmentStatus}
          onDeleteAssignment={handleDeleteAssignment}
          onOpenAssignmentModal={() => {
            setEditingAssignment(null);
            setIsAssignmentModalOpen(true);
          }}
        />

        {/* 5. Registered Subjects and Grades Table */}
        <SubjectList
          subjects={subjects}
          onOpenSubjectModal={() => {
            setEditingSubject(null);
            setIsSubjectModalOpen(true);
          }}
          onEditSubject={handleEditSubject}
          onDeleteSubject={handleDeleteSubject}
          gpaScale={gpaScale}
          passingMark={passingMark}
        />

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-300 bg-white py-4 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Student Academic Performance Dashboard &bull; Web Technology Project
          </div>
          <div className="text-slate-500">
            Data stored locally in browser via LocalStorage API
          </div>
        </div>
      </footer>

      {/* Forms and Dialogs */}
      <SubjectForm
        isOpen={isSubjectModalOpen}
        onClose={() => {
          setIsSubjectModalOpen(false);
          setEditingSubject(null);
        }}
        onSave={handleSaveSubject}
        initialData={editingSubject}
      />

      <AssignmentForm
        isOpen={isAssignmentModalOpen}
        onClose={() => {
          setIsAssignmentModalOpen(false);
          setEditingAssignment(null);
        }}
        onSave={handleSaveAssignment}
        subjects={subjects}
        initialData={editingAssignment}
      />

      <AttendanceForm
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        onSave={handleSaveAttendance}
        subjects={subjects}
        attendanceList={attendance}
        selectedSubjectId={selectedSubjectForAttendance}
      />
    </div>
  );
}
