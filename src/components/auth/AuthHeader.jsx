import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import AuthModal from './AuthModal'

const AuthHeader = ({ showSignUpModal, onSignUpModalClose, currentAuthView, onAuthViewChange }) => {
  const { user, loading, signOut } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authView, setAuthView] = useState('signup')
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Sync with parent component's modal state
  useEffect(() => {
    if (showSignUpModal) {
      setAuthView('signup')
      setShowAuthModal(true)
    }
  }, [showSignUpModal])

  const handleAuthClick = (view) => {
    setAuthView(view)
    setShowAuthModal(true)
    // Notify parent component about the view change
    onAuthViewChange?.(view)
  }

  const handleProfileClick = () => {
    setAuthView('profile')
    setShowAuthModal(true)
    setShowUserMenu(false)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      setShowUserMenu(false)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleModalClose = () => {
    setShowAuthModal(false)
    onSignUpModalClose?.()
  }

  // Handle header button click - toggle between signup and signin
  const handleHeaderAuthClick = () => {
    if (currentAuthView === 'signup') {
      handleAuthClick('login')
    } else {
      handleAuthClick('signup')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-end space-x-4">
        <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
      </div>
    )
  }

  return (
    <>
      {user ? (
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {user.user_metadata?.first_name?.[0] || user.email?.[0] || 'U'}
              </span>
            </div>
            <span className="hidden md:block text-sm font-medium">
              {user.user_metadata?.first_name || user.email?.split('@')[0]}
            </span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${
                showUserMenu ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-900">
                  {user.user_metadata?.first_name && user.user_metadata?.last_name
                    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
                    : 'User'
                  }
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              
              <button
                onClick={handleProfileClick}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profile</span>
                </div>
              </button>
              
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Sign Out</span>
                </div>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <button
            onClick={handleHeaderAuthClick}
            className={`font-medium py-2 px-4 rounded-lg transition-all duration-200 ${
              currentAuthView === 'signup'
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {currentAuthView === 'signup' ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleModalClose}
        initialView={authView}
        onViewChange={onAuthViewChange}
      />

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  )
}

export default AuthHeader
