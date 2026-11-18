/**
 * Grade Helper Utilities
 */

export const GRADE_SCALE = [
  { min: 90, letter: 'A+', gpa: 4.0, label: 'Outstanding', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { min: 80, letter: 'A', gpa: 3.7, label: 'Excellent', color: 'text-green-600 bg-green-50 border-green-200' },
  { min: 70, letter: 'B', gpa: 3.0, label: 'Good', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { min: 60, letter: 'C', gpa: 2.0, label: 'Satisfactory', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { min: 50, letter: 'D', gpa: 1.0, label: 'Pass', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { min: 0, letter: 'F', gpa: 0.0, label: 'Fail', color: 'text-rose-600 bg-rose-50 border-rose-200' },
];

/**
 * Converts a numerical score (0-100) into letter grade, GPA scale (0.0-4.0), and styling metadata.
 * @param {number} score
 */
export function calculateGrade(score) {
  const numericScore = Number(score) || 0;
  const clamped = Math.max(0, Math.min(100, numericScore));

  const found = GRADE_SCALE.find(item => clamped >= item.min) || GRADE_SCALE[GRADE_SCALE.length - 1];
  return {
    letter: found.letter,
    gpa: found.gpa,
    label: found.label,
    color: found.color,
  };
}

/**
 * Computes weighted average percentage and weighted GPA across subjects.
 * If credits are not provided or zero, defaults to 1 credit per subject.
 * @param {Array<{score: number, credits?: number}>} subjects
 */
export function calculateWeightedAverage(subjects = []) {
  if (!subjects || subjects.length === 0) {
    return {
      averageScore: null,
      overallGpa: null,
      totalCredits: 0,
      letter: 'N/A',
      color: '',
      hasData: false,
    };
  }

  let totalWeightedScore = 0;
  let totalWeightedGpa = 0;
  let totalCredits = 0;
  let validSubjectCount = 0;

  subjects.forEach(sub => {
    if (sub.score !== undefined && sub.score !== null && !isNaN(Number(sub.score))) {
      const score = Number(sub.score);
      const credits = Number(sub.credits) > 0 ? Number(sub.credits) : 1;
      const { gpa } = calculateGrade(score);

      totalWeightedScore += score * credits;
      totalWeightedGpa += gpa * credits;
      totalCredits += credits;
      validSubjectCount++;
    }
  });

  if (validSubjectCount === 0 || totalCredits === 0) {
    return {
      averageScore: null,
      overallGpa: null,
      totalCredits: 0,
      letter: 'N/A',
      color: '',
      hasData: false,
    };
  }

  const averageScore = totalWeightedScore / totalCredits;
  const overallGpa = totalWeightedGpa / totalCredits;
  const gradeInfo = calculateGrade(averageScore);

  return {
    averageScore: Math.round(averageScore * 10) / 10,
    overallGpa: Math.round(overallGpa * 100) / 100,
    totalCredits,
    letter: gradeInfo.letter,
    color: gradeInfo.color,
    hasData: true,
  };
}

/**
 * Converts a canonical 4.0-scale GPA value to the selected display scale ('4.0' or '10.0').
 * Uses the linear display conversion: 10-point scale = 4-point scale * 2.5
 * @param {number|null} gpa4 - Canonical GPA on 4.0 scale
 * @param {'4.0'|'10.0'} scale - Target scale
 * @returns {number|null} Converted GPA value rounded to 2 decimal places
 */
export function convertGpaForDisplay(gpa4, scale = '4.0') {
  if (gpa4 === null || gpa4 === undefined || isNaN(Number(gpa4))) {
    return null;
  }
  const numeric = Number(gpa4);
  if (scale === '10.0') {
    const converted = Math.min(10.0, Math.max(0.0, numeric * 2.5));
    return Math.round(converted * 100) / 100;
  }
  const clamped = Math.min(4.0, Math.max(0.0, numeric));
  return Math.round(clamped * 100) / 100;
}

/**
 * Returns the standard denominator string for the given GPA scale ('4.00' or '10.00').
 * @param {'4.0'|'10.0'} scale
 * @returns {string}
 */
export function getGpaScaleDenominator(scale = '4.0') {
  return scale === '10.0' ? '10.00' : '4.00';
}

