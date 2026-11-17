import React, { useState, useEffect } from 'react';

export default function SubjectForm({ isOpen, onClose, onSave, initialData = null }) {
  const [formData, setFormData] = useState({
    name: '',
    term: 'Term 1',
    score: '',
    maxScore: '100',
    credits: '3',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        term: initialData.term || 'Term 1',
        score: initialData.score !== undefined ? String(initialData.score) : '',
        maxScore: initialData.maxScore ? String(initialData.maxScore) : '100',
        credits: initialData.credits ? String(initialData.credits) : '3',
      });
    } else {
      setFormData({
        name: '',
        term: 'Term 1',
        score: '',
        maxScore: '100',
        credits: '3',
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please enter a valid subject name.');
      return;
    }

    const scoreStr = String(formData.score).trim();
    const maxScoreStr = String(formData.maxScore).trim();

    if (scoreStr === '' || isNaN(Number(scoreStr))) {
      setError('Please enter a valid number for Marks Obtained.');
      return;
    }
    const numScore = Number(scoreStr);

    if (maxScoreStr === '' || isNaN(Number(maxScoreStr))) {
      setError('Please enter a valid number for Maximum Marks.');
      return;
    }
    const numMax = Number(maxScoreStr);

    if (numMax <= 0) {
      setError('Maximum Marks must be greater than zero.');
      return;
    }

    if (numScore < 0) {
      setError('Marks Obtained must be greater than or equal to zero.');
      return;
    }

    if (numScore > numMax) {
      setError(`Marks Obtained cannot exceed Maximum Marks (${numMax}).`);
      return;
    }

    const numCredits = Number(formData.credits);
    if (isNaN(numCredits) || numCredits <= 0) {
      setError('Credits must be at least 1.');
      return;
    }

    // Convert score to normalized percentage if maxScore is different
    const normalizedScore = numMax === 100 ? numScore : Math.round((numScore / numMax) * 100);

    onSave({
      id: initialData ? initialData.id : Date.now().toString(),
      name: formData.name.trim(),
      term: formData.term,
      score: normalizedScore,
      credits: numCredits,
      rawScore: numScore,
      maxScore: numMax,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">
      <div className="bg-white rounded border border-slate-300 max-w-md w-full shadow-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
          <h3 className="font-bold text-slate-800 text-sm">
            {initialData ? 'Edit Subject' : 'Add New Subject'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 font-bold text-base leading-none"
          >
            ×
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-sm">
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-300 rounded text-xs text-red-800">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Operating Systems"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Term / Semester
              </label>
              <select
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-blue-600 bg-white"
              >
                <option value="Term 1">Term 1</option>
                <option value="Term 2">Term 2</option>
                <option value="Term 3">Term 3</option>
                <option value="Term 4">Term 4</option>
                <option value="Term 5">Term 5</option>
                <option value="Term 6">Term 6</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Credits
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Marks Obtained *
              </label>
              <input
                type="number"
                min="0"
                max={Number(formData.maxScore) > 0 ? formData.maxScore : undefined}
                required
                placeholder={Number(formData.maxScore) > 0 ? `0 - ${formData.maxScore}` : '0 - 100'}
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Maximum Marks *
              </label>
              <input
                type="number"
                min="1"
                required
                value={formData.maxScore}
                onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-300 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-medium text-white bg-blue-700 hover:bg-blue-800 rounded transition-colors"
            >
              {initialData ? 'Save Changes' : 'Add Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
