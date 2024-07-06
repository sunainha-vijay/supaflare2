<template>
  <public-view>
    <div id="content">
      <div class="landing-page">
        <img class="logo" src="/supaflare.png" alt="Supaflare Logo" />
        <h2>Welcome to TwistURL!</h2>
        <h1>Sign In</h1>
        <n-form ref="formRef" :model="model" :rules="rules">
          <n-form-item path="email" label="Email">
            <n-input v-model:value="model.email" placeholder="Enter Email" @keydown.enter="handleValidateButtonClick" />
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
          <n-button @click="oauthLogin('github')">
            <template #icon>
              <n-icon>
                <github />
              </n-icon>
            </template>
            GitHub
          </n-button>
          <n-button @click="oauthLogin('google')">
            <template #icon>
              <n-icon>
                <google />
              </n-icon>
            </template>
            Google
          </n-button>
        </n-space>
      </div>
    </div>
  </public-view>
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
#content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
  background-image: linear-gradient(to right, #ffecd2 0%, #fcb69f 100%);
  padding: 20px;
}

.landing-page {
  background-color: #fff;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
}

.logo {
  width: 150px;
  margin-bottom: 20px;
}

h1, h2 {
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

.n-space {
  margin-top: 20px;
}
</style>
