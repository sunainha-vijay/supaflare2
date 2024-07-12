
<template>
  <div id="content">
    <div class="container">
      <div class="features">
        <h1>Keep your links short and secure!</h1>
        <p>
          Go beyond short links! Shorten URLs and share them with a select group, but keep the contents a secret. Set expiration dates and track access to your shortened URLs. Know exactly who sees your info, and when it disappears forever.
        </p>
      </div>
      <div class="auth">
        <h2>Welcome to TwistURL!</h2>
        <h1>Sign In</h1>
        <n-form ref="formRef" :model="model" :rules="rules">
          <n-form-item path="email" label="Username">
            <n-input
              v-model:value="model.email"
              placeholder="Enter Username"
              @keydown.enter="handleValidateButtonClick"
            />
          </n-form-item>
          <n-form-item path="password" label="Password">
            <n-input
              v-model:value="model.password"
              type="password"
              placeholder="Enter Password"
              @keydown.enter="handleValidateButtonClick"
            />
          </n-form-item>
          <div class="button-container">
            <n-button round type="primary" @click="handleValidateButtonClick">
              Sign In
            </n-button>
          </div>
        </n-form>
        <n-divider title-placement="left">
          <router-link to="/signup">Don't have an account? Sign-Up</router-link>
        </n-divider>
        <n-divider title-placement="left">Or continue with</n-divider>
        <n-space justify="space-around">
          <n-button @click="oauthLogin('github')" class="oauth-button github">
            <template #icon>
              <n-icon>
                <Github />
              </n-icon>
            </template>
            GitHub
          </n-button>
          <n-button @click="oauthLogin('google')" class="oauth-button google">
            <template #icon>
              <n-icon>
                <Google />
              </n-icon>
            </template>
            Google
          </n-button>
        </n-space>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { handleSignIn, handleOAuthLogin } from '@/services/auth';
import { useMessage, NForm, NFormItem, NInput, NButton, NDivider, NSpace, NIcon } from 'naive-ui';
import { Github, Google } from '@vicons/fa';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Auth',
  components: {
    NForm,
    NFormItem,
    NInput,
    NButton,
    NDivider,
    NSpace,
    NIcon,
    Github,
    Google,
  },
  setup() {
    const messageDuration = 5000;
    const formRef = ref();
    const message = useMessage();
    const modelRef = ref({
      email: '',
      password: '',
    });

    const rules = {
      email: [
        {
          required: true,
          validator(rule: any, value: any) {
            if (!value) {
              return new Error('Email is required');
            } else if (
              !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
                value
              )
            ) {
              return new Error('Please enter a valid email address');
            }
            return true;
          },
          trigger: ['input', 'blur'],
        },
      ],
      password: [
        {
          validator(rule: any, value: any) {
            if (value && value.length < 6) {
              return new Error('Invalid Password');
            }
            return true;
          },
          trigger: ['input', 'blur'],
        },
      ],
    };

    async function oauthLogin(provider: any) {
      try {
        const { error } = await handleOAuthLogin(provider);
        if (error) throw error;
      } catch (error) {
        message.error('Error authenticating with ' + provider + '...', { duration: messageDuration });
      }
    }

    function handleValidateButtonClick(e: any) {
      e.preventDefault();

      if (formRef.value) {
        formRef.value.validate(async (error: any) => {
          if (!error) {
            try {
              const { error, user } = await handleSignIn({
                email: modelRef.value.email,
                password: modelRef.value.password,
              });

              if (error) {
                throw new Error(error.message);
              }

              if (user) {
                const router = useRouter();
                router.push('/links'); // Redirect to dashboard or home page
              }
            } catch (error) {
              message.error('Error signing in...', { duration: messageDuration });
            }
          } else {
            message.error('Please confirm your sign in details...', { duration: messageDuration });
          }
        });
      }
    }

    return {
      oauthLogin,
      formRef,
      model: modelRef,
      rules,
      handleValidateButtonClick,
    };
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

#content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #2c2c2c;
  overflow: hidden;
  position: relative;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
}

#content::before, #content::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,0,0.2) 20%, transparent 20%) center center / 10px 10px;
  border-radius: 50%;
  mix-blend-mode: color-dodge;
  animation: swirl 20s linear infinite;
  z-index: 0;
}

#content::after {
  background: radial-gradient(circle, rgba(0,0,255,0.2) 20%, transparent 20%) center center / 10px 10px;
  animation: swirl 20s linear infinite reverse;
}

@keyframes swirl {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  padding: 60px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  max-width: 1200px;
  width: 100%;
  animation: fadeIn 1s ease-in-out;
  position: relative;
  z-index: 1;
}

.features {
  flex: 1;
  padding-right: 40px;
}

.auth {
  flex: 1;
  padding-left: 40px;
  text-align: center;
}

.features h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  color: #333;
  font-weight: 700;
}

.features p {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.6;
}

.auth h1, .auth h2 {
  margin-bottom: 20px;
  color: #333;
  font-weight: 700;
}

.n-form-item {
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.n-space {
  margin-top: 20px;
}

.n-button {
  width: 100%;
  transition: background-color 0.3s;
}

.n-button:hover {
  background-color: #007bff;
  color: #fff;
}

.n-divider {
  margin: 20px 0;
}

.oauth-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
}

.github {
  background-color: #333;
  color: #fff;
}

.github:hover {
  background-color: #444;
}

.google {
  background-color: #db4437;
  color: #fff;
}

.google:hover {
  background-color: #e74c3c;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
