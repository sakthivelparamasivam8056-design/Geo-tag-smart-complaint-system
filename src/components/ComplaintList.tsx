import React from 'react';
import { Inbox } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ComplaintCard from './ComplaintCard';
import FilterBar from './FilterBar';

const ComplaintList: React.FC = () => {
  const { filteredComplaints, isLoading, theme } = useApp();
  const isDark = theme === 'dark';

  if (isLoading) {
    return (
      <div className={`flex flex-col h-full ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <FilterBar />
        <div className="flex-1 p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-28 rounded-2xl animate-pulse ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <FilterBar />
      <div id="complaint-list" className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredComplaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <Inbox className={`w-7 h-7 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            </div>
            <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              No complaints match your filters
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
              Try adjusting the search or category filters
            </p>
          </div>
        ) : (
          filteredComplaints.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))
        )}
      </div>
    </div>
  );
};

export default ComplaintList;
