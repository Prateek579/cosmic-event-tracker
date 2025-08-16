# 🔐 Authentication System - Cosmic Event Tracker

This document describes the comprehensive authentication system implemented using Supabase React SDK for the Cosmic Event Tracker application.

## ✨ Features

### 🔑 User Authentication
- **Email/Password Registration & Login**: Secure user account creation and authentication
- **Google OAuth Integration**: One-click sign-in using Google accounts
- **Password Reset**: Secure password recovery via email
- **Email Verification**: Automatic email confirmation for new accounts

### 👤 User Management
- **User Profiles**: View and edit personal information (first name, last name)
- **Session Management**: Automatic token refresh and persistent sessions
- **Profile Updates**: Real-time profile editing with validation
- **Account Security**: Secure sign-out functionality

### 🎨 User Interface
- **Responsive Design**: Mobile-friendly authentication modals
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Error Handling**: Clear error messages and validation feedback
- **Success Notifications**: Confirmation messages for successful actions

## 🏗️ Architecture

### Components Structure
```
src/
├── components/
│   └── auth/
│       ├── AuthHeader.jsx          # Main auth header with user menu
│       ├── AuthModal.jsx           # Modal container for auth views
│       ├── Login.jsx               # Sign-in form
│       ├── SignUp.jsx              # Registration form
│       ├── UserProfile.jsx         # User profile management
│       └── SupabaseConfigWarning.jsx # Configuration warning
├── contexts/
│   └── AuthContext.jsx             # Authentication state management
└── lib/
    └── supabase.js                 # Supabase client configuration
```

### State Management
- **React Context**: Centralized authentication state
- **Local Storage**: Persistent session storage
- **Real-time Updates**: Automatic state synchronization

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### 2. Installation
```bash
# Install dependencies
npm install

# Install Supabase SDK
npm install @supabase/supabase-js
```

### 3. Configuration
1. Create a `.env.local` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. Follow the detailed setup guide in `SUPABASE_SETUP.md`

### 4. Start Development
```bash
npm run dev
```

## 📱 Usage

### For Users

#### Signing Up
1. Click "Sign Up" in the header
2. Fill in your information (first name, last name, email, password)
3. Confirm your password
4. Click "Create Account"
5. Check your email for verification

#### Signing In
1. Click "Sign In" in the header
2. Enter your email and password
3. Click "Sign In" or use "Continue with Google"

#### Managing Profile
1. Click your profile picture in the header
2. Select "Profile" from the dropdown
3. Edit your information and click "Save Changes"

#### Signing Out
1. Click your profile picture in the header
2. Select "Sign Out" from the dropdown

### For Developers

#### Using Authentication Context
```jsx
import { useAuth } from '../contexts/AuthContext'

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  
  return user ? (
    <button onClick={signOut}>Sign Out</button>
  ) : (
    <button onClick={() => signIn('email', 'password')}>Sign In</button>
  )
}
```

#### Protected Routes (Future Implementation)
```jsx
import { useAuth } from '../contexts/AuthContext'

function ProtectedComponent() {
  const { user } = useAuth()
  
  if (!user) {
    return <div>Please sign in to access this feature</div>
  }
  
  return <div>Protected content here</div>
}
```

## 🔧 Configuration Options

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key | Yes |

### Supabase Settings
- **Site URL**: Set to your development/production URL
- **Redirect URLs**: Configure OAuth callback URLs
- **Email Templates**: Customize confirmation and reset emails
- **Password Policy**: Configure password requirements

## 🛡️ Security Features

### Built-in Security
- **JWT Tokens**: Secure authentication tokens
- **Password Hashing**: Automatic password encryption
- **Session Management**: Secure session handling
- **CSRF Protection**: Built-in CSRF protection
- **Rate Limiting**: API rate limiting (Supabase managed)

### Best Practices
- **Environment Variables**: Secure credential storage
- **Input Validation**: Client and server-side validation
- **Error Handling**: Secure error messages
- **Token Refresh**: Automatic token renewal

## 🔄 API Reference

### Authentication Methods

#### `signUp(email, password, userData)`
Creates a new user account.
```jsx
const { data, error } = await signUp('user@example.com', 'password123', {
  first_name: 'John',
  last_name: 'Doe'
})
```

#### `signIn(email, password)`
Signs in an existing user.
```jsx
const { data, error } = await signIn('user@example.com', 'password123')
```

#### `signInWithGoogle()`
Signs in using Google OAuth.
```jsx
const { data, error } = await signInWithGoogle()
```

#### `signOut()`
Signs out the current user.
```jsx
const { error } = await signOut()
```

#### `updateProfile(updates)`
Updates user profile information.
```jsx
const { data, error } = await updateProfile({
  data: { first_name: 'Jane' }
})
```

#### `resetPassword(email)`
Sends password reset email.
```jsx
const { data, error } = await resetPassword('user@example.com')
```

### User Object Properties
```jsx
{
  id: 'uuid',
  email: 'user@example.com',
  user_metadata: {
    first_name: 'John',
    last_name: 'Doe'
  },
  created_at: '2024-01-01T00:00:00Z',
  last_sign_in_at: '2024-01-01T00:00:00Z'
}
```

## 🧪 Testing

### Manual Testing
1. **Registration Flow**: Test account creation
2. **Login Flow**: Test authentication
3. **Profile Management**: Test profile updates
4. **OAuth Flow**: Test Google sign-in
5. **Error Handling**: Test invalid inputs
6. **Session Persistence**: Test page refresh

### Automated Testing (Future)
- Unit tests for auth functions
- Integration tests for auth flows
- E2E tests for user journeys

## 🚨 Troubleshooting

### Common Issues

#### "Invalid API key" Error
- Verify your anon key is correct
- Ensure you're using the anon key, not service role key
- Check environment variable names

#### OAuth Redirect Errors
- Verify redirect URLs in Supabase settings
- Check that URLs match exactly (including protocol)
- Ensure OAuth provider is properly configured

#### Email Not Sending
- Check Supabase email settings
- Verify email templates are configured
- Check spam/junk folders

#### Session Not Persisting
- Check browser storage settings
- Verify Supabase client configuration
- Check for JavaScript errors

### Debug Mode
Enable debug logging by checking the browser console for:
- Supabase connection status
- Authentication state changes
- Error messages and stack traces

## 🔮 Future Enhancements

### Planned Features
- **Multi-factor Authentication**: SMS/email verification codes
- **Social Login Providers**: GitHub, Discord, Twitter
- **Role-based Access Control**: Admin, moderator, user roles
- **User Preferences**: Theme, language, notification settings
- **Account Linking**: Link multiple authentication methods

### Integration Opportunities
- **User Favorites**: Save favorite NEO events
- **Personalized Alerts**: Custom notification preferences
- **Data Export**: Download personal data
- **API Access**: Personal API keys for authenticated users

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase React SDK](https://supabase.com/docs/reference/javascript)
- [Authentication Best Practices](https://supabase.com/docs/guides/auth)
- [Security Guidelines](https://supabase.com/docs/guides/security)

## 🤝 Contributing

When contributing to the authentication system:

1. **Follow Security Guidelines**: Never expose sensitive information
2. **Test Thoroughly**: Test all authentication flows
3. **Update Documentation**: Keep this README current
4. **Security Review**: Request security review for auth changes

## 📄 License

This authentication system is part of the Cosmic Event Tracker project. See the main project license for details.

---

**Note**: This authentication system is designed for demo and educational purposes. For production use, implement additional security measures and compliance requirements.
