// src/services/auth.ts

// Import UserCredentials type from your types file
import { UserCredentials } from '@/types';

import { supabase } from '@/services/supabase';
import { ApiError } from '@/types'; // Ensure ApiError is imported correctly from your types

async function handleSignUp(credentials: UserCredentials) {
  const { email, password } = credentials;
  try {
    const { error, user } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw new Error(error.message); // Throw an error if sign up fails
    }
    return { user }; // Return the user object if sign up is successful
  } catch (error) {
    console.error('Error signing up:', error);
    return { error: error as ApiError }; // Return the error object
  }
}

async function handleSignIn(credentials: UserCredentials) {
  const { email, password } = credentials;
  try {
    const { error, user } = await supabase.auth.signIn({ email, password });
    return { error, user }; // Return both error and user
  } catch (error) {
    console.error('Error signing in:', error);
    return { error: error as ApiError }; // Return the error object
  }
}

async function handleOAuthLogin(provider: any) {
  try {
    const { error } = await supabase.auth.signIn({ provider });
    return { error };
  } catch (error) {
    console.error(`Error authenticating with ${provider}:`, error);
    return { error: error as ApiError };
  }
}

async function handlePasswordReset(credentials: UserCredentials) {
  const { email } = credentials;
  try {
    const { error } = await supabase.auth.api.resetPasswordForEmail(String(email));
    return { error };
  } catch (error) {
    console.error('Error resetting password:', error);
    return { error: error as ApiError };
  }
}

async function handleUpdateUser(credentials: UserCredentials) {
  try {
    const { error } = await supabase.auth.update(credentials);
    return { error };
  } catch (error) {
    console.error('Error updating user:', error);
    return { error: error as ApiError };
  }
}

async function handleSignOut() {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    console.error('Error signing out:', error);
    return { error: error as ApiError };
  }
}

export {
  handleSignIn,
  handleSignUp,
  handleSignOut,
  handlePasswordReset,
  handleOAuthLogin,
  handleUpdateUser,
};
