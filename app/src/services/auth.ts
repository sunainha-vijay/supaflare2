
import { ref } from 'vue';
import { supabase } from '@/services/supabase';
import { Session, Provider, UserCredentials } from '@supabase/gotrue-js/dist/main/lib/types';

async function handleSignIn(credentials: UserCredentials) {
	const { error, user } = await supabase.auth.signIn({
		email: credentials.email,
		password: credentials.password,
	});
	return { error, user };
}

async function handleSignUp(credentials: UserCredentials) {
    const { email, password } = credentials;
    try {
        const { error, user } = await supabase.auth.signUp({ email, password });
        if (error) {
            throw new Error(error.message); // Throw a new Error object with the error message
        }
        return { error: null, user };
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Error signing up:', err.message);
            return { error: err.message, user: null };
        } else {
            console.error('Unknown error:', err);
            return { error: 'Unknown error occurred', user: null };
        }
    }
}

async function handleOAuthLogin(provider: Provider) {
	const { error } = await supabase.auth.signIn({ provider });
	return { error };
}

async function handlePasswordReset(credentials: UserCredentials) {
	const { email } = credentials;
	const { error } = await supabase.auth.api.resetPasswordForEmail(String(email));
	return { error };
}

async function handleUpdateUser(credentials: UserCredentials) {
	const { error } = await supabase.auth.update(credentials);

	return { error };
}

async function handleSignOut() {
	const { error } = await supabase.auth.signOut();
	return { error };
}

export {
	handleSignIn,
	handleOAuthLogin,
	handleSignUp,
	handleSignOut,
	handlePasswordReset,
	handleUpdateUser,
};
