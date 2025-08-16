import React, { useState } from 'react';
import EventList from './components/EventList';
import AuthHeader from './components/auth/AuthHeader';
import './index.css';

function App() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [currentAuthView, setCurrentAuthView] = useState('signup');

  const handleEventClick = (neo) => {
    setSelectedEvent(neo);
    // For now, just log the event. Later this can open a modal or navigate to detail page
    console.log('Selected NEO:', neo);
    // You can implement modal or routing logic here
  };

  const handleSignUpRequest = () => {
    setCurrentAuthView('signup');
    setShowSignUpModal(true);
  };

  const handleAuthViewChange = (view) => {
    setCurrentAuthView(view);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Authentication */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">🌌</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Cosmic Event Tracker</h1>
            </div>
            <AuthHeader 
              showSignUpModal={showSignUpModal}
              onSignUpModalClose={() => setShowSignUpModal(false)}
              currentAuthView={currentAuthView}
              onAuthViewChange={handleAuthViewChange}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <EventList 
          onEventClick={handleEventClick}
          onSignUpRequest={handleSignUpRequest}
        />
      </main>
      
      {/* Enhanced Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">☄️</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">
                        {selectedEvent.name.replace(/[()]/g, '')}
                      </h2>
                      <p className="text-blue-100 text-sm">
                        Near-Earth Object Details
                      </p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-black rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 hover:scale-110 font-bold text-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Hazard Status Banner */}
              {selectedEvent.isPotentiallyHazardous && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">🚨</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-800">
                        Potentially Hazardous Asteroid
                      </h3>
                      <p className="text-red-700 text-sm">
                        This object requires special attention and monitoring
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Physical Characteristics */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📏</span>
                    </span>
                    Physical Characteristics
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Estimated Diameter</span>
                      <span className="text-gray-800 font-semibold">{selectedEvent.estimatedDiameter} km</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Velocity</span>
                      <span className="text-gray-800 font-semibold">{selectedEvent.velocity} km/h</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Hazard Status</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedEvent.isPotentiallyHazardous 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedEvent.isPotentiallyHazardous ? '⚠️ Hazardous' : '✅ Safe'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Approach Information */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🌍</span>
                    </span>
                    Approach Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Miss Distance</span>
                      <span className="text-gray-800 font-semibold">{selectedEvent.missDistance} km</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600 font-medium">Approach Date</span>
                      <span className="text-gray-800 font-semibold">
                        {new Date(selectedEvent.closeApproachDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">Orbiting Body</span>
                      <span className="text-gray-800 font-semibold">{selectedEvent.orbitingBody}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm">ℹ️</span>
                  </span>
                  Additional Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-blue-700 font-medium">Object ID</span>
                    <span className="text-blue-700 font-mono text-sm">{selectedEvent.id}</span>
                  </div>
                  {selectedEvent.nasaJplUrl && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-blue-700 font-medium">NASA JPL Data</span>
                      <a 
                        href={selectedEvent.nasaJplUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        <span>View Details</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Safety Information */}
              {selectedEvent.isPotentiallyHazardous && (
                <div className="bg-red-50 rounded-xl p-5 border border-red-200 mt-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm">⚠️</span>
                    </span>
                    Safety Information
                  </h3>
                  <div className="text-red-700 space-y-2">
                    <p className="text-sm">
                      <strong>What this means:</strong> This asteroid has been classified as potentially hazardous 
                      based on its size and proximity to Earth.
                    </p>
                    <p className="text-sm">
                      <strong>Current status:</strong> While classified as hazardous, this does not mean an impact 
                      is imminent. Scientists continuously monitor these objects.
                    </p>
                    <p className="text-sm">
                      <strong>Monitoring:</strong> NASA and other space agencies track this object's trajectory 
                      and provide regular updates on any changes.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Data provided by NASA Near-Earth Object API
                </p>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
