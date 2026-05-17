import React, { useState, useEffect } from 'react';
import { MapPin, X, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ComplaintFormData, ComplaintCategory, ComplaintPriority, Coordinates } from '../types';
import { CATEGORIES, PRIORITIES, CATEGORY_ICONS } from '../utils/constants';

interface Props {
  initialCoordinates?: Coordinates | null;
}

const ComplaintForm: React.FC<Props> = ({ initialCoordinates }) => {
  const { submitComplaint, toggleForm, theme } = useApp();
  const [submitted, setSubmitted] = useState(false);
  const [locating, setLocating] = useState(false);

  const [form, setForm] = useState<ComplaintFormData>({
    title: '',
    description: '',
    category: 'Road & Infrastructure',
    priority: 'Medium',
    coordinates: initialCoordinates ?? null,
    address: '',
  });

  useEffect(() => {
    if (initialCoordinates) {
      setForm((f) => ({ ...f, coordinates: initialCoordinates }));
    }
  }, [initialCoordinates]);

  const handleChange = <K extends keyof ComplaintFormData>(key: K, value: ComplaintFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setForm((f) => ({ ...f, coordinates: coords, address: `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` }));
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  const isValid = form.title.trim().length >= 5 && form.description.trim().length >= 10 && form.coordinates !== null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    submitComplaint(form);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      toggleForm();
    }, 1800);
  };

  const isDark = theme === 'dark';
  const card = isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900';
  const input = isDark
    ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-indigo-500'
    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-indigo-500';
  const label = isDark ? 'text-gray-300' : 'text-gray-700';

  if (submitted) {
    return (
      <div className={`${card} rounded-2xl p-8 flex flex-col items-center justify-center gap-4 min-h-[300px]`}>
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center animate-bounce">
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <p className="text-xl font-semibold">Complaint Submitted!</p>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Thank you for reporting. We'll look into it.</p>
      </div>
    );
  }

  return (
    <div className={`${card} rounded-2xl shadow-2xl overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Report a Complaint</h2>
          <p className="text-indigo-200 text-xs mt-0.5">Help improve your community</p>
        </div>
        <button
          onClick={toggleForm}
          aria-label="Close form"
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Title */}
        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${label}`}>
            Title *
          </label>
          <input
            id="complaint-title"
            type="text"
            maxLength={100}
            placeholder="Brief summary of the issue…"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${input}`}
          />
        </div>

        {/* Category + Priority */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${label}`}>Category</label>
            <select
              id="complaint-category"
              value={form.category}
              onChange={(e) => handleChange('category', e.target.value as ComplaintCategory)}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors ${input}`}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_ICONS[c]} {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${label}`}>Priority</label>
            <select
              id="complaint-priority"
              value={form.priority}
              onChange={(e) => handleChange('priority', e.target.value as ComplaintPriority)}
              className={`w-full border rounded-xl px-3 py-2.5 text-sm outline-none transition-colors ${input}`}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${label}`}>
            Description *
          </label>
          <textarea
            id="complaint-description"
            rows={3}
            maxLength={500}
            placeholder="Describe the issue in detail…"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors resize-none ${input}`}
          />
          <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {form.description.length}/500
          </p>
        </div>

        {/* Location */}
        <div>
          <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${label}`}>
            Location *
          </label>
          <div className="flex gap-2">
            <input
              id="complaint-address"
              type="text"
              placeholder="Address or click on map…"
              value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className={`flex-1 border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors ${input}`}
            />
            <button
              type="button"
              onClick={detectLocation}
              disabled={locating}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all disabled:opacity-60 whitespace-nowrap"
            >
              <MapPin className="w-3.5 h-3.5" />
              {locating ? 'Detecting…' : 'My Location'}
            </button>
          </div>
          {form.coordinates && (
            <p className="text-xs mt-1.5 text-indigo-400 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {form.coordinates.lat.toFixed(5)}, {form.coordinates.lng.toFixed(5)}
            </p>
          )}
          {!form.coordinates && (
            <p className={`text-xs mt-1.5 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              ⚠ Click on the map to pin the location, or use "My Location"
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          id="complaint-submit"
          disabled={!isValid}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all transform hover:scale-[1.01] active:scale-[0.99] shadow-lg"
        >
          Submit Complaint
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;
