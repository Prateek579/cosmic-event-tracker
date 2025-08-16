import React, { useState, useEffect } from 'react'
import Login from './Login'
import SignUp from './SignUp'
import UserProfile from './UserProfile'

const AuthModal = ({ isOpen, onClose, initialView, onViewChange }) => {
  const [currentView, setCurrentView] = useState(initialView)

  useEffect(() => {
    setCurrentView(initialView)
  }, [initialView])

  const handleViewChange = (view) => {
    setCurrentView(view)
    onViewChange?.(view)
  }

  if (!isOpen) return null

  return (
    <>
      {currentView === 'login' && (
        <Login 
          onSwitchToSignUp={() => handleViewChange('signup')} 
          onClose={onClose}
        />
      )}
      {currentView === 'signup' && (
        <SignUp 
          onSwitchToLogin={() => handleViewChange('login')} 
          onClose={onClose}
        />
      )}
      {currentView === 'profile' && (
        <UserProfile onClose={onClose} />
      )}
    </>
  )
}

export default AuthModal
