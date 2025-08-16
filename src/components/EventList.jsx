import React, { useState, useEffect } from 'react';
import { fetchNeoData, processNeoData, getInitialDateRange, getNextDateRange, formatDateForAPI } from '../api/neoAPI';
import EventCard from './EventCard';
import LoadingSpinner from './LoadingSpinner';
import SupabaseConfigWarning from './auth/SupabaseConfigWarning';
import AuthenticationRequired from './auth/AuthenticationRequired';
import { useAuth } from '../contexts/AuthContext';

const EventList = ({ onEventClick, onSignUpRequest }) => {
  const { user } = useAuth();
  const [neoData, setNeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [lastEndDate, setLastEndDate] = useState(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [showDateSelector, setShowDateSelector] = useState(false);
  const [showOnlyHazardous, setShowOnlyHazardous] = useState(false);

  // Initial data load - only if user is authenticated
  useEffect(() => {
    if (user) {
      loadInitialData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { startDate, endDate } = getInitialDateRange();
      const rawData = await fetchNeoData(startDate, endDate);
      const processedData = processNeoData(rawData);
      
      setNeoData(processedData);
      setLastEndDate(endDate);
      setHasMoreData(processedData.length > 0);
    } catch (err) {
      setError('Failed to fetch NEO data. Please try again later.');
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreData = async () => {
    if (!lastEndDate || loadingMore) return;
    
    try {
      setLoadingMore(true);
      setError(null);
      
      const { startDate, endDate } = getNextDateRange(lastEndDate, 7);
      const rawData = await fetchNeoData(startDate, endDate);
      const processedData = processNeoData(rawData);
      
      if (processedData.length > 0) {
        setNeoData(prevData => [...prevData, ...processedData]);
        setLastEndDate(endDate);
      } else {
        setHasMoreData(false);
      }
    } catch (err) {
      setError('Failed to load more data. Please try again.');
      console.error('Error loading more data:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const loadCustomDateRange = async () => {
    if (!customDateRange.startDate || !customDateRange.endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const rawData = await fetchNeoData(customDateRange.startDate, customDateRange.endDate);
      const processedData = processNeoData(rawData);
      
      setNeoData(processedData);
      setLastEndDate(customDateRange.endDate);
      setHasMoreData(false); // Reset for custom date range
      setShowDateSelector(false);
    } catch (err) {
      setError('Failed to fetch data for the selected date range. Please try again.');
      console.error('Error loading custom date range:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (neoData.length === 0) {
      loadInitialData();
    } else {
      loadMoreData();
    }
  };

  const resetToInitialData = () => {
    setCustomDateRange({ startDate: '', endDate: '' });
    setShowDateSelector(false);
    setShowOnlyHazardous(false);
    loadInitialData();
  };

  // Filter data based on hazardous status
  const filteredData = showOnlyHazardous 
    ? neoData.map(dateGroup => ({
        ...dateGroup,
        neos: dateGroup.neos.filter(neo => neo.isPotentiallyHazardous)
      })).filter(dateGroup => dateGroup.neos.length > 0)
    : neoData;

  // Get today's date for date input max attribute
  const today = new Date().toISOString().split('T')[0];

  // If user is not authenticated, show authentication required message
  if (!user) {
    return <AuthenticationRequired onSignUpClick={onSignUpRequest} />;
  }

  if (loading) {
    return <LoadingSpinner message="Fetching cosmic events..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Supabase Configuration Warning */}
      <SupabaseConfigWarning />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Cosmic Event Tracker</h1>
        <p className="text-gray-600">Discover Near-Earth Objects approaching our planet</p>
      </div>

      {/* Date Range Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDateSelector(!showDateSelector)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {showDateSelector ? 'Hide Date Selector' : 'Select Custom Date Range'}
            </button>
            
            {/* Hazardous Filter Toggle */}
            <button
              onClick={() => setShowOnlyHazardous(!showOnlyHazardous)}
              className={`font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${
                showOnlyHazardous
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {showOnlyHazardous ? '🚨 Show All' : '⚠️ Show Hazardous Only'}
            </button>
            
            {neoData.length > 0 && (
              <button
                onClick={resetToInitialData}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Reset to Current Week
              </button>
            )}
          </div>

          {/* Hazardous Count Display */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {neoData.reduce((count, dateGroup) => 
                  count + dateGroup.neos.filter(neo => neo.isPotentiallyHazardous).length, 0
                )} Hazardous
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">
                {neoData.reduce((count, dateGroup) => 
                  count + dateGroup.neos.filter(neo => !neo.isPotentiallyHazardous).length, 0
                )} Safe
              </span>
            </div>
          </div>
        </div>

        {/* Current Date Range Display */}
        {neoData.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">Current Date Range:</span>
              <span>
                {new Date(neoData[0]?.date).toLocaleDateString()} - {new Date(neoData[neoData.length - 1]?.date).toLocaleDateString()}
              </span>
              <span className="text-gray-400">•</span>
              <span>{neoData.length} day{neoData.length !== 1 ? 's' : ''}</span>
              <span className="text-gray-400">•</span>
              <span>{neoData.reduce((count, dateGroup) => count + dateGroup.neos.length, 0)} total events</span>
            </div>
          </div>
        )}

        {/* Custom Date Range Selector */}
        {showDateSelector && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={customDateRange.startDate}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  max={today}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={customDateRange.endDate}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  min={customDateRange.startDate}
                  max={today}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={loadCustomDateRange}
                disabled={!customDateRange.startDate || !customDateRange.endDate}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                Load Date Range
              </button>
            </div>
          </div>
        )}

        {/* Filter Status */}
        {showOnlyHazardous && (
          <div className="mt-4 pt-4 border-t border-red-200">
            <div className="flex items-center gap-2 text-red-700">
              <span className="text-lg">🚨</span>
              <span className="font-medium">Showing only potentially hazardous asteroids</span>
              <span className="text-sm text-red-600">
                ({filteredData.reduce((count, dateGroup) => count + dateGroup.neos.length, 0)} events)
              </span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
              <button 
                onClick={handleRetry}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hazardous Warning Banner */}
      {neoData.length > 0 && neoData.some(dateGroup => dateGroup.neos.some(neo => neo.isPotentiallyHazardous)) && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl">🚨</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Potentially Hazardous Asteroids Detected
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>
                  There are {neoData.reduce((count, dateGroup) => 
                    count + dateGroup.neos.filter(neo => neo.isPotentiallyHazardous).length, 0
                  )} potentially hazardous asteroids in the current date range. 
                  These objects require special attention and monitoring.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredData.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {showOnlyHazardous 
              ? 'No hazardous asteroids found for the selected period.' 
              : 'No cosmic events found for the selected period.'
            }
          </p>
        </div>
      )}

      {filteredData.map((dateGroup, index) => (
        <div key={dateGroup.date} className="mb-8">
          <div className="sticky top-0 bg-white z-10 py-4 border-b border-gray-200 mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {new Date(dateGroup.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
            <div className="flex items-center justify-between mt-2">
              <p className="text-sm text-gray-500">
                {dateGroup.neos.length} event{dateGroup.neos.length !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-red-600 font-medium">
                    {dateGroup.neos.filter(neo => neo.isPotentiallyHazardous).length} hazardous
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">
                    {dateGroup.neos.filter(neo => !neo.isPotentiallyHazardous).length} safe
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            {dateGroup.neos.map((neo) => (
              <EventCard 
                key={neo.id} 
                neo={neo} 
                onClick={onEventClick}
              />
            ))}
          </div>
        </div>
      ))}

      {hasMoreData && !showOnlyHazardous && (
        <div className="text-center mt-8">
          {loadingMore ? (
            <LoadingSpinner message="Loading more events..." />
          ) : (
            <button
              onClick={loadMoreData}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Load More Events (Next 7 Days)
            </button>
          )}
        </div>
      )}

      {!hasMoreData && filteredData.length > 0 && !showOnlyHazardous && (
        <div className="text-center mt-8 py-4">
          <p className="text-gray-500">No more events to load</p>
        </div>
      )}
    </div>
  );
};

export default EventList;