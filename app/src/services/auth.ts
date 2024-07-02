import { supabase } from '@/services/supabase';
import { Provider, UserCredentials } from '@supabase/supabase-js';

async function handleSignIn(credentials: UserCredentials) {
    try {
        const { error, user } = await supabase.auth.signIn({
            email: credentials.email,
            password: credentials.password,
        });
        return { error, user };
    } catch (error) {
        console.error('Error signing in:', error.message);
        return { error: error.message, user: null };
    }
}

async function handleSignUp(credentials: UserCredentials) {
    try {
        const { error, user } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
        });
        return { error, user };
    } catch (error) {
        console.error('Error signing up:', error.message);
        return { error: error.message, user: null };
    }
}

async function handleOAuthLogin(provider: Provider) {
    try {
        const { error } = await supabase.auth.signIn({ provider });
        return { error };
    } catch (error) {
        console.error(`Error logging in with ${provider}:`, error.message);
        return { error: error.message };
    }
}

async function handlePasswordReset(credentials: UserCredentials) {
    try {
        const { error } = await supabase.auth.api.resetPasswordForEmail(credentials.email);
        return { error };
    } catch (error) {
        console.error('Error resetting password:', error.message);
        return { error: error.message };
    }
}

async function handleUpdateUser(credentials: UserCredentials) {
    try {
        const { error } = await supabase.auth.update(credentials);
        return { error };
    } catch (error) {
        console.error('Error updating user:', error.message);
        return { error: error.message };
    }
}

async function handleSignOut() {
    try {
        const { error } = await supabase.auth.signOut();
        return { error };
    } catch (error) {
        console.error('Error signing out:', error.message);
        return { error: error.message };
    }
}

export {
    handleSignIn,
    handleOAuthLogin,
    handleSignUp,
    handleSignOut,
    handlePasswordReset,
    handleUpdateUser,
};
