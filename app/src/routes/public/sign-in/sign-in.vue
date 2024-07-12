

<template>
  <div>
    <nav class="navbar">
      <div class="navbar-logo">
        <img src="/supaflare.png" alt="Supaflare Logo"" />
      </div>
      <div class="navbar-links">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>
    </nav>

    <div class="features-section">
      <h2>Features</h2>
      <p>Our very own cool features</p>
      <div class="accordion">
        <div class="accordion-item" @click="toggleAccordion(1)">
          <h3 class="accordion-header">Shorten It Up</h3>
          <div class="accordion-content" v-if="activeAccordion === 1">
            <p>Make long URLs tiny for easy sharing. Edit them later if needed!</p>
          </div>
        </div>
        <div class="accordion-item" @click="toggleAccordion(2)">
          <h3 class="accordion-header">Make it Disappear</h3>
          <div class="accordion-content" v-if="activeAccordion === 2">
            <p>Set an expiration date for your shortened URL.</p>
          </div>
        </div>
        <div class="accordion-item" @click="toggleAccordion(3)">
          <h3 class="accordion-header">Secret Knock</h3>
          <div class="accordion-content" v-if="activeAccordion === 3">
            <p>Password protect your URL for added security.</p>
          </div>
        </div>
        <div class="accordion-item" @click="toggleAccordion(4)">
          <h3 class="accordion-header">Who Opened It?</h3>
          <div class="accordion-content" v-if="activeAccordion === 4">
            <p>Track who opened your shortened URL and when.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="signin-section">
      <div class="signin-left">
        <h2>Keep your links short and secure!</h2>
        <p>
          Go beyond short links! Shorten URLs and share them with a select group, but keep the contents a secret. Set
          expiration dates and track access to your shortened URLs. Know exactly who sees your info, and when it
          disappears forever.
        </p>
      </div>
      <div class="signin-right">
        <div class="signin-box">
          <h2>Welcome to TwistURL!</h2>
          <h3>Sign In</h3>
          <form @submit.prevent="signIn">
            <div class="form-group">
              <label for="username">Username</label>
              <input type="text" id="username" v-model="username" required />
            </div>
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" v-model="password" required />
            </div>
            <button type="submit">Sign In</button>
          </form>
          <p>
            Don't have an account? <a href="#">Sign-Up</a>
          </p>
          <div class="oauth-buttons">
            <button @click="signInWith('github')">GitHub</button>
            <button @click="signInWith('google')">Google</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeAccordion: null,
      username: "",
      password: "",
    };
  },
  methods: {
    toggleAccordion(index) {
      this.activeAccordion = this.activeAccordion === index ? null : index;
    },
    signIn() {
      // Implement sign-in logic here
      alert(`Username: ${this.username}, Password: ${this.password}`);
    },
    signInWith(provider) {
      // Implement OAuth sign-in logic here
      alert(`Sign in with ${provider}`);
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  padding: 1rem;
}

.navbar-logo img {
  height: 40px;
}

.navbar-links a {
  color: white;
  text-decoration: none;
  margin-left: 1rem;
}

.features-section {
  padding: 2rem;
}

.features-section h2,
.features-section p {
  text-align: center;
}

.accordion {
  max-width: 600px;
  margin: 0 auto;
}

.accordion-item {
  background-color: #f1f1f1;
  margin-bottom: 1rem;
  cursor: pointer;
  padding: 1rem;
  border: 1px solid #ccc;
}

.accordion-header {
  margin: 0;
}

.accordion-content {
  padding: 1rem;
}

.signin-section {
  display: flex;
  justify-content: space-between;
  padding: 2rem;
}

.signin-left,
.signin-right {
  flex: 1;
  padding: 1rem;
}

.signin-box {
  background-color: #f1f1f1;
  padding: 2rem;
  border: 1px solid #ccc;
}

.signin-box h2,
.signin-box h3 {
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
}

button[type="submit"] {
  width: 100%;
  padding: 0.75rem;
  background-color: #333;
  color: white;
  border: none;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #555;
}

.oauth-buttons {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.oauth-buttons button {
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
}

.oauth-buttons button:hover {
  background-color: #ddd;
}
</style>

