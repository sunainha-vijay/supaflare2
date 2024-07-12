<template>
  <public-view>
    <div id="content">
      <div class="landing-page">
        <img class="logo" src="/supaflare.png" alt="Supaflare Logo" />
        <h1>Sign Up</h1>
        <n-form ref="formRef" :model="model" :rules="rules">
          <n-form-item path="email" label="Email">
            <n-input v-model:value="model.email" placeholder="Enter Email" @keydown.enter="handleSignUpButtonClick" />
          </n-form-item>
          <n-form-item path="password" label="Password">
            <n-input
              v-model:value="model.password"
              type="password"
              placeholder="Enter Password"
              @keydown.enter="handleSignUpButtonClick"
            />
          </n-form-item>
          <div class="button-container">
            <n-button round type="primary" @click="handleSignUpButtonClick">Sign Up</n-button>
          </div>
        </n-form>
        <n-divider title-placement="left">
          Already have an account? <router-link to="/signin">Sign In</router-link>
        </n-divider>
      </div>
    </div>
  </public-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useMessage, NForm, NFormItem, NInput, NButton, NDivider } from 'naive-ui';
import { handleSignUp } from '@/services/auth';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'SignUp',
  components: {
    NForm,
    NFormItem,
    NInput,
    NButton,
    NDivider,
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
              return new Error('Password must be at least 6 characters');
            }
            return true;
          },
          trigger: ['input', 'blur'],
        },
      ],
    };

    async function handleSignUpButtonClick() {
      if (formRef.value) {
        formRef.value.validate(async (error: any) => {
          if (!error) {
            try {
              const { error, user } = await handleSignUp({
                email: modelRef.value.email,
                password: modelRef.value.password,
              });
              if (error) throw error;
              if (user) {
                const router = useRouter();
                router.push('/links');
              } else {
                message.success('User signed up successfully!', { duration: messageDuration });
              }
            } catch (error) {
              message.error('Error signing up...', { duration: messageDuration });
            }
          } else {
            message.error('Please fill in all required fields correctly', { duration: messageDuration });
          }
        });
      }
    }

    return {
      formRef,
      model: modelRef,
      rules,
      handleSignUpButtonClick,
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
  text-align: center;
  overflow: hidden;
  position: relative;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
  background: radial-gradient(circle, rgba(44,44,44,1) 0%, rgba(34,34,34,1) 100%);
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

.landing-page {
  background-color: #fff;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.logo {
  width: 150px;
  margin-bottom: 20px;
}

h1 {
  margin-bottom: 20px;
}

.n-form-item {
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
