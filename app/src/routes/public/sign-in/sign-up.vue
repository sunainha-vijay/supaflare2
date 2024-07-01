<template>
  <div class="sign-up">
    <h2>Sign Up</h2>
    <form @submit.prevent="signUp">
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" v-model="password" required />
      </div>
      <button type="submit">Sign Up</button>
    </form>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useSupabase } from '@supabase/supabase-js'

export default {
  name: 'SignUp',
  setup() {
    const email = ref('')
    const password = ref('')
    const error = ref(null)
    const supabase = useSupabase()

    const signUp = async () => {
      error.value = null
      const { user, session, error: signUpError } = await supabase.auth.signUp({
        email: email.value,
        password: password.value
      })
      if (signUpError) {
        error.value = signUpError.message
      } else {
        console.log('User signed up:', user)
        console.log('Session:', session)
      }
    }

    return {
      email,
      password,
      signUp,
      error
    }
  }
}
</script>

<style scoped>
.sign-up {
  max-width: 400px;
  margin: 0 auto;
}
</style>

