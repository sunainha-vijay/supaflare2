<template>
  <public-view>
    <div id="content">
      <n-form ref="formRef" :model="model" :rules="rules">
        <div>
          <n-divider title-placement="left">Welcome to our UL Shortener!</n-divider>
          <img class="logo" src="/supaflare.png" />
          <h1>Sign In</h1>
          <n-form-item path="email" label="Email">
            <n-input v-model:value="model.email" placeholder="Enter Email" @keydown.enter="handleValidateButtonClick" />
          </n-form-item>
          <n-form-item path="password" label="Password">
            <n-input v-model:value="model.password" type="password" placeholder="Enter Password" @keydown.enter="handleValidateButtonClick" />
          </n-form-item>
          <div style="display: flex; justify-content: flex-end">
            <n-button round type="primary" @click="handleValidateButtonClick">
              <span v-if="model.password">Sign In</span>
              <span v-else>Send Magic Link</span>
            </n-button>
          </div>
          <n-divider title-placement="left">Don't have an account? <router-link to="/sign-up">Sign-Up</router-link></n-divider>
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
            <n-button @click="oauthLogin('twitter')">
              <template #icon>
                <n-icon>
                  <twitter />
                </n-icon>
              </template>
              Twitter
            </n-button>
          </n-space>
        </div>
      </n-form>
    </div>
  </public-view>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { handleSignIn, handleOAuthLogin } from '@/services/auth';
import { useMessage, NForm, NFormItem, NInput, NButton, NDivider, NSpace, NIcon } from 'naive-ui';
import { Github, Google, Twitter } from '@vicons/fa';
import { router } from '@/router';

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
    Twitter,
  },
  setup() {
    const messageDuration = 5000;
    const formRef = ref<any>(); // Ensure proper typing for formRef
    const model = ref({
      email: '',
      password: '',
    });

    const rules = {
      email: [
        {
          required: true,
          message: 'Email is required',
          trigger: ['blur', 'change'],
        },
        {
          type: 'email',
          message: 'Please enter a valid email address',
          trigger: ['blur', 'change'],
        },
      ],
      password: [
        {
          required: true,
          message: 'Password is required',
          trigger: ['blur', 'change'],
        },
        {
          min: 6,
          message: 'Password must be at least 6 characters',
          trigger: ['blur', 'change'],
        },
      ],
    };

    const message = useMessage();

    async function handleValidateButtonClick() {
      await formRef.value.validate(async (valid: boolean) => {
        if (valid) {
          try {
            const { error, user } = await handleSignIn({
              email: model.value.email,
              password: model.value.password,
            });
            if (error) {
              throw error;
            }
            if (user) {
              router.push('/dashboard'); // Navigate to dashboard on successful login
            } else {
              message.success('Magic Link sent to your email!', { duration: messageDuration });
            }
          } catch (error) {
            message.error('Error signing in...', { duration: messageDuration });
          }
        } else {
          message.error('Please confirm your sign in details...', { duration: messageDuration });
        }
      });
    }

    async function oauthLogin(provider: 'github' | 'google' | 'twitter') {
      try {
        const { error } = await handleOAuthLogin(provider);
        if (error) {
          throw error;
        }
      } catch (error) {
        message.error(`Error authenticating with ${provider}...`, { duration: messageDuration });
      }
    }

    return {
      model,
      rules,
      formRef,
      handleValidateButtonClick,
      oauthLogin,
    };
  },
});
</script>
<style scoped>
.logo {
  width: 300px;
  margin-bottom: 50px;
}
#content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}
form {
  width: 400px;
}
input {
  text-align: center;
  font-size: 20px;
}
h1 {
  text-align: left;
}
</style>
