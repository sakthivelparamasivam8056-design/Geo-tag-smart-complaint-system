import React, { useState, useCallback } from 'react';
import { useApp } from './context/AppContext';
import Header from './components/Header';
import MapView from './components/MapView';
import ComplaintList from './components/ComplaintList';
import ComplaintForm from './components/ComplaintForm';
import ComplaintDetail from './components/ComplaintDetail';
import FilterBar from './components/FilterBar';
import { Coordinates } from './types';

const App: React.FC = () => {
  const { view, showForm, theme, selectedComplaint } = useApp();
  const [pinnedCoords, setPinnedCoords] = useState<Coordinates | null>(null);

  const handleMapClick = useCallback((coords: Coordinates) => {
    setPinnedCoords(coords);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div
      className={`h-screen flex flex-col overflow-hidden font-sans antialiased ${
        isDark ? 'bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <Header />

      <main className="flex-1 flex overflow-hidden relative">

        {view === 'map' ? (
          /* ── MAP VIEW ──────────────────────────────────────────────── */
          <div className="flex-1 flex overflow-hidden">
            {/* Desktop Sidebar */}
            <aside
              className={`hidden lg:flex flex-col w-96 flex-shrink-0 border-r overflow-hidden ${
                isDark ? 'border-gray-800' : 'border-gray-200'
              }`}
            >
              <ComplaintList />
            </aside>

            {/* Map canvas */}
            <div className="flex-1 relative overflow-hidden">
              <MapView onMapClick={handleMapClick} />

              {/* Report form overlay */}
              {showForm && (
                <div className="absolute top-4 right-4 w-[360px] z-[1000] max-h-[calc(100vh-100px)] overflow-y-auto shadow-2xl rounded-2xl">
                  <ComplaintForm initialCoordinates={pinnedCoords} />
                </div>
              )}

              {/* Mobile bottom bar */}
              <div
                className={`lg:hidden absolute bottom-0 left-0 right-0 z-[900] border-t ${
                  isDark ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
                } backdrop-blur-md`}
              >
                <FilterBar />
              </div>
            </div>
          </div>
        ) : (
          /* ── LIST VIEW ─────────────────────────────────────────────── */
          <div className="flex-1 flex flex-col overflow-hidden max-w-3xl mx-auto w-full">
            <ComplaintList />
            {showForm && (
              <div className={`border-t p-4 ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <ComplaintForm />
              </div>
            )}
          </div>
        )}

        {/* ── Detail overlay ──────────────────────────────────────────── */}
        {selectedComplaint && <ComplaintDetail />}
      </main>
    </div>
  );
};

export default App;
