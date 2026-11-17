import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

export default function MarksBarChart({ subjects = [] }) {
  const validSubjects = subjects.filter(
    (s) => s.score !== undefined && s.score !== null && !isNaN(Number(s.score))
  );

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
      <div className="mb-3">
        <h3 className="text-base font-bold text-slate-800">Subject Marks Comparison</h3>
        <p className="text-xs text-slate-500">Marks obtained vs. 50% minimum passing threshold</p>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={validSubjects} margin={{ top: 15, right: 20, left: -10, bottom: 20 }}>
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
              formatter={(value) => [`${value}%`, 'Score']}
              labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '4px', fontSize: '12px' }}
            />
            <ReferenceLine 
              y={50} 
              stroke="#dc2626" 
              strokeDasharray="4 4" 
              label={{ value: 'Passing Threshold (50%)', position: 'insideTopLeft', fill: '#dc2626', fontSize: 11 }} 
            />
            <Bar 
              dataKey="score" 
              fill="#2563eb"
              maxBarSize={48}
              isAnimationActive={false}
            >
              {validSubjects.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.score < 50 ? '#dc2626' : '#2563eb'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
