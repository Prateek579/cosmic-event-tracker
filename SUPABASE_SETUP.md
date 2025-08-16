# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication for the Cosmic Event Tracker application.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in the project details:
   - Name: `cosmic-event-tracker` (or any name you prefer)
   - Database Password: Choose a strong password
   - Region: Select the region closest to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## 3. Update Configuration

1. Open `src/lib/supabase.js`
2. Replace the placeholder values with your actual credentials:

```javascript
const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseAnonKey = 'your-actual-anon-key'
```

## 4. Configure Authentication Settings

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:

### Site URL
- Set to `http://localhost:5173` for development
- Set to your production URL when deploying

### Redirect URLs
Add these redirect URLs:
- `http://localhost:5173/auth/callback`
- `http://localhost:5173/auth/reset-password`
- Your production URLs when deploying

### Email Templates
Customize email templates for:
- Confirm signup
- Reset password
- Magic link

## 5. Enable Authentication Providers

### Email/Password (Required)
- Go to **Authentication** → **Providers**
- Ensure "Email" is enabled
- Configure password requirements if needed

### Google OAuth (Optional)
1. Go to **Authentication** → **Providers**
2. Enable "Google"
3. Get your Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing one
   - Enable Google+ API
   - Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client IDs**
   - Set authorized redirect URIs to: `https://your-project.supabase.co/auth/v1/callback`
4. Copy the Client ID and Client Secret to Supabase

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Try to sign up with a new account
3. Check your email for confirmation
4. Try signing in
5. Test the profile functionality

## 7. Environment Variables (Production)

For production, create a `.env.local` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Then update `src/lib/supabase.js`:

```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

## 8. Database Schema (Optional)

If you want to store additional user data, you can create custom tables:

```sql
-- Create a profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## 9. Troubleshooting

### Common Issues

1. **"Invalid API key" error**
   - Check that you're using the correct anon key (not the service role key)
   - Ensure the key starts with `eyJ...`

2. **Redirect errors**
   - Verify your redirect URLs in Supabase settings
   - Check that your site URL matches exactly

3. **Email not sending**
   - Check your Supabase project's email settings
   - Verify your email templates are configured

4. **Google OAuth not working**
   - Ensure redirect URIs match exactly
   - Check that Google+ API is enabled
   - Verify client ID and secret are correct

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## 10. Security Best Practices

1. **Never expose your service role key** - only use the anon key in client-side code
2. **Enable Row Level Security** on any custom tables
3. **Use environment variables** for sensitive configuration
4. **Regularly rotate your API keys**
5. **Monitor your authentication logs** in the Supabase dashboard

## 11. Next Steps

Once authentication is working, you can:

1. Add user-specific features (favorites, preferences, etc.)
2. Implement role-based access control
3. Add social login providers (GitHub, Discord, etc.)
4. Set up email verification workflows
5. Add two-factor authentication
6. Implement user management for admins

---

**Note**: This is a demo setup. For production applications, consider additional security measures and compliance requirements.
