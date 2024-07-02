import { supabase } from '@/services/supabase';
import { Provider, UserCredentials } from '@supabase/gotrue-js/dist/main/lib/types';

async function handleSignIn(credentials: UserCredentials) {
	const { error, user } = await supabase.auth.signIn({
		email: credentials.email,
		password: credentials.password,
	});
	return { error, user };
}

async function handleEmailSignUp(credentials: UserCredentials) {
	const { email, password } = credentials;
	try {
		const { error, user } = await supabase.auth.signUp({
			email,
			password,
		});
		return { error, user };
	} catch (error) {
		console.error('Error signing up:', error.message);
		return { error: error.message, user: null };
	}
}

async function handleOAuthLogin(provider: Provider) {
	const { error } = await supabase.auth.signIn({ provider });
	return { error };
}

async function handlePasswordReset(credentials: UserCredentials) {
	const { email } = credentials;
	try {
		const { error } = await supabase.auth.api.resetPasswordForEmail(String(email));
		return { error };
	} catch (error) {
		console.error('Error resetting password:', error.message);
		return { error: error.message };
	}
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
	handleEmailSignUp, // Updated function name
	handleSignOut,
	handlePasswordReset,
	handleUpdateUser,
};
