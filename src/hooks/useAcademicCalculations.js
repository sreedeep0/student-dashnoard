import { useMemo } from 'react';
import { calculateGrade, calculateWeightedAverage } from '../utils/gradeHelpers.js';

export function useAcademicCalculations({ subjects = [], attendance = [], assignments = [] }) {
  return useMemo(() => {
    // 1. Overall GPA and Marks
    const weighted = calculateWeightedAverage(subjects);

    // 2. Attendance metrics
    let totalClassesHeld = 0;
    let totalClassesAttended = 0;
    const subjectAttendanceMap = {};

    attendance.forEach(att => {
      const held = Number(att.totalClasses) || 0;
      const attended = Number(att.attendedClasses) || 0;
      totalClassesHeld += held;
      totalClassesAttended += attended;

      const pct = held > 0 ? Math.round((attended / held) * 100) : null;
      subjectAttendanceMap[att.subjectId] = {
        ...att,
        totalClasses: held,
        attendedClasses: attended,
        percentage: pct,
        isWarning: held > 0 && pct < 75,
        hasData: held > 0,
      };
    });

    const hasAttendanceData = totalClassesHeld > 0;
    const overallAttendancePct = hasAttendanceData
      ? Math.round((totalClassesAttended / totalClassesHeld) * 100) 
      : null;

    const overallAttendanceWarning = hasAttendanceData && overallAttendancePct < 75;

    // Subjects enriched with their attendance details
    const enrichedSubjects = subjects.map(sub => {
      const att = subjectAttendanceMap[sub.id] || {
        totalClasses: 0,
        attendedClasses: 0,
        percentage: null,
        isWarning: false,
        hasData: false,
      };
      const grade = calculateGrade(sub.score);
      return {
        ...sub,
        grade,
        attendance: att,
      };
    });

    // 3. Low attendance alerts list (only for subjects with recorded classes and percentage < 75%)
    const attendanceAlerts = enrichedSubjects
      .filter(sub => sub.attendance && sub.attendance.hasData && sub.attendance.percentage !== null && sub.attendance.percentage < 75)
      .map(sub => ({
        id: sub.id,
        name: sub.name,
        percentage: sub.attendance.percentage,
        attended: sub.attendance.attendedClasses,
        total: sub.attendance.totalClasses,
        deficit: Math.ceil((0.75 * sub.attendance.totalClasses - sub.attendance.attendedClasses) / 0.25),
      }));

    // 4. Assignment Metrics
    const totalAssignments = assignments.length;
    const completedAssignments = assignments.filter(
      a => a.status === 'Completed' || a.status === 'Submitted' || a.status === 'Graded'
    ).length;
    const pendingAssignments = assignments.filter(
      a => a.status === 'Pending' || a.status === 'In Progress'
    ).length;
    const completionRate = totalAssignments > 0 
      ? Math.round((completedAssignments / totalAssignments) * 100) 
      : null;

    // 5. Term / Semester Trends (only from subjects with valid scores)
    const termMap = {};
    subjects.forEach(sub => {
      if (sub.score !== undefined && sub.score !== null && !isNaN(Number(sub.score))) {
        const termName = sub.term || 'Term 1';
        if (!termMap[termName]) {
          termMap[termName] = { term: termName, totalScore: 0, totalCredits: 0, count: 0, totalGpa: 0 };
        }
        const credits = Number(sub.credits) || 1;
        const score = Number(sub.score) || 0;
        const { gpa } = calculateGrade(score);

        termMap[termName].totalScore += score * credits;
        termMap[termName].totalGpa += gpa * credits;
        termMap[termName].totalCredits += credits;
        termMap[termName].count += 1;
      }
    });

    const termTrends = Object.values(termMap).map(t => ({
      term: t.term,
      averageScore: t.totalCredits > 0 ? Math.round((t.totalScore / t.totalCredits) * 10) / 10 : 0,
      gpa: t.totalCredits > 0 ? Math.round((t.totalGpa / t.totalCredits) * 100) / 100 : 0,
    }));

    return {
      hasSubjects: weighted.hasData,
      averageScore: weighted.averageScore,
      overallGpa: weighted.overallGpa,
      overallGrade: weighted.letter,
      gradeColor: weighted.color,
      totalCredits: weighted.totalCredits,
      totalSubjects: subjects.length,
      
      // Attendance
      hasAttendanceData,
      overallAttendancePct,
      totalClassesHeld,
      totalClassesAttended,
      overallAttendanceWarning,
      attendanceAlerts,
      enrichedSubjects,

      // Assignments
      totalAssignments,
      completedAssignments,
      pendingAssignments,
      completionRate,

      // Trends
      termTrends,
    };
  }, [subjects, attendance, assignments]);
}

export default useAcademicCalculations;
