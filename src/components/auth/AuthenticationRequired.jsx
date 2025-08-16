import React from 'react'
import { useAuth } from '../../contexts/AuthContext'

const AuthenticationRequired = ({ onSignUpClick }) => {
  const { user } = useAuth()

  // If user is authenticated, don't show this component
  if (user) {
    return null
  }

  const handleSignUpClick = () => {
    if (onSignUpClick) {
      onSignUpClick()
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center">
        {/* Cosmic Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🌌</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Cosmic Event Tracker
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover and track Near-Earth Objects approaching our planet with detailed information and real-time updates.
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">☄️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Asteroid Tracking</h3>
            <p className="text-gray-600 text-sm">
              Monitor potentially hazardous asteroids and their approach trajectories
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Detailed Analytics</h3>
            <p className="text-gray-600 text-sm">
              Access comprehensive data about size, velocity, and miss distance
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔔</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Real-time Updates</h3>
            <p className="text-gray-600 text-sm">
              Get the latest information about cosmic events as they happen
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Explore the Cosmos? 🚀
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Create your account now to unlock full access to our comprehensive cosmic event tracking system. 
            Start monitoring Near-Earth Objects and stay informed about celestial events in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSignUpClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Create Account & Start Exploring
            </button>
            
            <button
              onClick={handleSignUpClick}
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-lg border-2 border-blue-600 transition-colors duration-200"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            By creating an account, you'll have access to:
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Daily cosmic event updates
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Detailed asteroid information
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Hazardous asteroid alerts
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Custom date range searches
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthenticationRequired
