import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

// Creates the MarksBarChart component and receives subjects and passing marks through props.
export default function MarksBarChart({ subjects = [], passingMark = 50 }) {
  
  // Validates the passing mark and uses 50% as the default if the value is invalid.
  const effectivePassingMark =
    typeof passingMark === 'number' && passingMark > 0 && passingMark <= 100
      ? passingMark
      : Number(passingMark) > 0 && Number(passingMark) <= 100
        ? Number(passingMark)
        : 50;

// Extracts unique academic terms from subjects and sorts them for the dropdown.
  const availableTerms = useMemo(() => {
    const terms = new Set();
    subjects.forEach((s) => {
      if (s.term && String(s.term).trim()) {
        terms.add(String(s.term).trim());
      }
    });
    return Array.from(terms).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  }, [subjects]);

  // Stores the currently selected academic term, initially set to All Terms.
  const [selectedTerm, setSelectedTerm] = useState('All Terms');

  // Resets the selection to All Terms if the previously selected term no longer exists.
  useEffect(() => {
    if (selectedTerm !== 'All Terms' && !availableTerms.includes(selectedTerm)) {
      setSelectedTerm('All Terms');
    }
  }, [availableTerms, selectedTerm]);

  // Filters out subjects that do not have valid numerical marks.
  const validSubjects = useMemo(() => {
    return subjects.filter(
      (s) => s.score !== undefined && s.score !== null && !isNaN(Number(s.score))
    );
  }, [subjects]);

// Displays either all valid subjects or only those belonging to the selected term.
  const displayedSubjects = useMemo(() => {
    if (selectedTerm === 'All Terms') return validSubjects;
    return validSubjects.filter((s) => (s.term || '').trim() === selectedTerm);
  }, [validSubjects, selectedTerm]);


  // Displays a message instead of a chart when no valid subjects are available.
  if (validSubjects.length === 0) {
    return (
      <div className="bg-white border border-slate-300 rounded p-6 flex flex-col items-center justify-center h-80 text-center">
        <h3 className="text-base font-bold text-slate-800 mb-1">Subject Marks Comparison</h3>
        <p className="text-slate-500 text-sm">No subjects recorded yet.</p>
        <p className="text-slate-400 text-xs mt-1">Add your first subject to display the marks comparison chart.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-300 rounded p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">

        // Displays the chart title and the current minimum passing percentage.
        <div>
          <h3 className="text-base font-bold text-slate-800">Subject Marks Comparison</h3>
          <p className="text-xs text-slate-500">Marks obtained vs. {effectivePassingMark}% minimum passing threshold</p>
        </div>
        {availableTerms.length > 0 && (
          <div className="flex items-center space-x-1.5 self-start sm:self-auto">
            <label htmlFor="chart-term-filter" className="text-xs font-semibold text-slate-600">
              Term:
            </label>

            // Creates a dropdown that allows users to filter marks by academic term.
            <select
              id="chart-term-filter"
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-300 rounded focus:outline-none focus:border-blue-600 bg-white font-medium text-slate-700"
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
      </div>


      {displayedSubjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-72 text-center text-slate-500 text-sm border border-dashed border-slate-200 rounded">
          No subjects recorded for {selectedTerm}.
        </div>
      ) : (

         // Chart is displayed here.
        <div className="h-80 w-full">

          // Makes the bar chart fit its parent container and supplies the filtered subject dataset.
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displayedSubjects} margin={{ top: 15, right: 20, left: -10, bottom: 20 }}>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

              <XAxis
                dataKey="name"
                stroke="#475569"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={75}
                dx={-4}
                dy={4}
              />

              <YAxis
                stroke="#475569"
                fontSize={12}
                domain={[0, 100]}
                tickLine={false}
                axisLine={{ stroke: '#cbd5e1' }}
                tickFormatter={(v) => `${v}%`}
              />

              <Tooltip
                formatter={(value) => [`${value}% (${Number(value) >= effectivePassingMark ? 'Pass' : 'Fail'})`, 'Score']}
                labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '4px', fontSize: '12px' }}
              />

              <ReferenceLine
                y={effectivePassingMark}
                stroke="#dc2626"
                strokeDasharray="4 4"
                label={{ value: `Passing Threshold (${effectivePassingMark}%)`, position: 'insideTopLeft', fill: '#dc2626', fontSize: 11 }}
              />

              <Bar
                dataKey="score"
                fill="#2563eb"
                maxBarSize={48}
                isAnimationActive={false}
              >
                {displayedSubjects.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.score < effectivePassingMark ? '#dc2626' : '#2563eb'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}