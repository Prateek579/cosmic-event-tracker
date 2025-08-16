import React from 'react';

const EventCard = ({ neo, onClick }) => {
  const {
    name,
    isPotentiallyHazardous,
    estimatedDiameter,
    closeApproachDateFormatted,
    closeApproachDate,
    velocity,
    missDistance
  } = neo;

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 mb-4 border-l-4 cursor-pointer hover:shadow-lg transition-all duration-200 ${
        isPotentiallyHazardous 
          ? 'border-red-500 bg-red-50 hover:bg-red-100' 
          : 'border-green-500 bg-green-50 hover:bg-green-100'
      }`}
      onClick={() => onClick && onClick(neo)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {name.replace(/[()]/g, '')}
            </h3>
            
            {/* Hazardous Status Badge */}
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
              isPotentiallyHazardous
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-green-100 text-green-800 border border-green-300'
            }`}>
              {isPotentiallyHazardous ? (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  ⚠️ HAZARDOUS
                </>
              ) : (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  ✓ SAFE
                </>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Diameter:</span> {estimatedDiameter} km
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Velocity:</span> {velocity} km/h
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Approach Date:</span> {closeApproachDateFormatted}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Miss Distance:</span> {missDistance} km
              </p>
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex flex-col items-center">
          {/* Status Indicator */}
          <div className={`w-6 h-6 rounded-full mb-2 flex items-center justify-center ${
            isPotentiallyHazardous 
              ? 'bg-red-500 text-white' 
              : 'bg-green-500 text-white'
          }`}>
            {isPotentiallyHazardous ? '⚠️' : '✓'}
          </div>
          
          {/* Additional Hazardous Info */}
          {isPotentiallyHazardous && (
            <div className="text-center">
              <p className="text-xs text-red-700 font-semibold mb-1">HIGH RISK</p>
              <p className="text-xs text-red-600">Monitor Closely</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Click for more details • Approach: {new Date(closeApproachDate).toLocaleString()}
          </p>
          {isPotentiallyHazardous && (
            <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
              <span>🚨</span>
              <span>Requires Attention</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;