// NASA Near-Earth Object API Integration
const NASA_API_KEY = '60k9R6gTi7rIjQ6Q90kCZIypqcq4LePHq6q7CsES';
const NASA_NEO_API_BASE = 'https://api.nasa.gov/neo/rest/v1/feed';

/**
 * Fetch NEO data from NASA API for a given date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Object>} NEO data grouped by date
 */
export const fetchNeoData = async (startDate, endDate) => {
  try {
    const url = `${NASA_NEO_API_BASE}?start_date=${startDate}&end_date=${endDate}&api_key=${NASA_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching NEO data:', error);
    throw error;
  }
};

/**
 * Get formatted date string for API calls
 * @param {Date} date - Date object
 * @returns {string} Formatted date string (YYYY-MM-DD)
 */
export const formatDateForAPI = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Get date range for initial load (current date + next 7 days)
 * @returns {Object} Object with startDate and endDate strings
 */
export const getInitialDateRange = () => {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 7);
  
  return {
    startDate: formatDateForAPI(today),
    endDate: formatDateForAPI(endDate)
  };
};

/**
 * Get next date range for "Load More" functionality
 * @param {string} lastEndDate - Last end date used
 * @param {number} days - Number of days to add (default: 7)
 * @returns {Object} Object with startDate and endDate strings
 */
export const getNextDateRange = (lastEndDate, days = 7) => {
  const startDate = new Date(lastEndDate);
  startDate.setDate(startDate.getDate() + 1);
  
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + days);
  
  return {
    startDate: formatDateForAPI(startDate),
    endDate: formatDateForAPI(endDate)
  };
};

/**
 * Process NEO data to extract relevant information
 * @param {Object} neoData - Raw NEO data from API
 * @returns {Array} Processed NEO events grouped by date
 */
export const processNeoData = (neoData) => {
  const processedData = [];
  
  if (neoData.near_earth_objects) {
    Object.keys(neoData.near_earth_objects).forEach(date => {
      const neosForDate = neoData.near_earth_objects[date].map(neo => {
        // Calculate average diameter
        const diameterData = neo.estimated_diameter.kilometers;
        const avgDiameter = (diameterData.estimated_diameter_min + diameterData.estimated_diameter_max) / 2;
        
        // Get closest approach data
        const closeApproach = neo.close_approach_data[0]; // First approach is usually the closest
        
        return {
          id: neo.id,
          name: neo.name,
          isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid,
          estimatedDiameter: avgDiameter.toFixed(3), // in kilometers
          closeApproachDate: closeApproach.close_approach_date_full,
          closeApproachDateFormatted: closeApproach.close_approach_date,
          velocity: parseFloat(closeApproach.relative_velocity.kilometers_per_hour).toFixed(2),
          missDistance: parseFloat(closeApproach.miss_distance.kilometers).toFixed(2),
          nasaJplUrl: neo.nasa_jpl_url,
          absoluteMagnitude: neo.absolute_magnitude_h,
          orbitingBody: closeApproach.orbiting_body
        };
      });
      
      processedData.push({
        date: date,
        neos: neosForDate
      });
    });
  }
  
  // Sort by date
  processedData.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return processedData;
};