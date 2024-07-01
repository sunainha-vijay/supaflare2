import { ref } from 'vue';
import { supabase } from '@/services/supabase';
import { Session, Provider, UserCredentials } from '@supabase/gotrue-js/dist/main/lib/types';

async function signUpNewUser() {
  const { data, error } = await supabase.auth.signUp({
    email: 'sunainha7@email.com',
    password: '1234',
    options: {
      emailRedirectTo: 'https://supaflare2.pages.dev/links',
    },
  })
}


async function handleSignIn(credentials: UserCredentials) {
	const { error, user } = await supabase.auth.signIn({
		email: credentials.email,
		password: credentials.password,
	});
	return { error, user };
}

async function handleSignup(credentials: UserCredentials) {
  const { email, password } = credentials;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return { error };

  // Signup successful, display message or redirect
  console.log("Signup successful! Please check your email to verify.");
  return { error: null }; // Indicate successful signup
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
	handleSignup,
	handleSignOut,
	handlePasswordReset,
	handleUpdateUser,
};
