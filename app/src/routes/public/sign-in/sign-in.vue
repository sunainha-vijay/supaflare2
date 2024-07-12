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
    <!-- FAQ Section Start -->
    <div id="faq" class="container mx-auto px-5 md:w-4/5">
      <section class="py-16 pt-18">
        <div class="w-4/5 md:w-3/5 mx-auto">
          <h2 class="text-3xl md:text-4xl font-theme-heading font-medium text-center">Features</h2>
          <p class="text-theme-grayish-blue text-center mt-7 font-theme-content text-lg">Our very own cool features</p>
        </div>
        <div class="mt-10 w-full lg:w-3/5 mx-auto">
          <ul class="shadow-lg">
            <template v-for="(faq, index) in faqs" :key="faq.id">
              <li @click="isOpen = faq.id" :class="isOpen === faq.id ? 'text-theme-secondary' : ''" class="font-theme-content font-medium text-xl cursor-pointer hover:text-theme-secondary py-5 flex justify-between items-center transition duration-200 bg-slate-100 px-6">
                <a href="#">{{ faq.title }}</a>
                <svg :class="isOpen === faq.id ? 'rotate-180 text-theme-secondary' : 'rotate-0 text-theme-primary'" class="transform" xmlns="http://www.w3.org/2000/svg" width="18" height="12"><path fill="none" stroke="currentColor" stroke-width="3" d="M1 1l8 8 8-8" /></svg>
              </li>
              <p v-show="isOpen === faq.id" class="bg-slate-50 px-6 font-theme-content text-md lg:text-lg py-5 text-gray-500 text-justify">{{ faq.description }}</p>
            </template>
          </ul>
        </div>
      </section>
    </div>
    <!-- FAQ Section End -->
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
    const isOpen = ref(1);

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

    // FAQ data
    const faqs = ref([
      {
        id: 1,
        title: 'Secure Links',
        description: 'All links are encrypted and can be set to expire after a certain time or number of clicks.',
      },
      {
        id: 2,
        title: 'Custom URLs',
        description: 'Create custom short URLs that are easy to remember and share.',
      },
      {
        id: 3,
        title: 'Analytics',
        description: 'Track who clicked your links and when, with detailed analytics.',
      },
      {
        id: 4,
        title: 'Password Protection',
        description: 'Add an extra layer of security with password-protected links.',
      },
      {
        id: 5,
        title: 'User Management',
        description: 'Manage who can see your links with advanced user management tools.',
      },
    ]);

    return {
      oauthLogin,
      formRef,
      model: modelRef,
      rules,
      handleValidateButtonClick,
      faqs,
      isOpen,
    };
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

#content {
  display: flex;
  flex-direction: column;
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
  animation-duration: 30s;
}

@keyframes swirl {
  from {transform: translate(-50%, -50%) rotate(0deg);}
  to {transform: translate(-50%, -50%) rotate(360deg);}
}

.container {
  z-index: 1;
  width: 100%;
  max-width: 600px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 15px;
}

.features {
  text-align: center;
  margin-bottom: 40px;
}

.features h1 {
  font-size: 2.5em;
  color: #ffffff;
  font-weight: 700;
}

.features p {
  color: #d3d3d3;
  font-size: 1.2em;
  margin-top: 10px;
}

.auth {
  width: 100%;
}

.auth h2 {
  font-size: 2em;
  color: #ffffff;
  font-weight: 400;
  margin-bottom: 10px;
}

.auth h1 {
  font-size: 2.5em;
  color: #ffffff;
  font-weight: 700;
  margin-bottom: 30px;
}

.button-container {
  text-align: center;
  margin-top: 20px;
}

.oauth-button {
  width: 45%;
  margin: 10px 0;
}

.oauth-button.github {
  background-color: #333;
  color: #fff;
}

.oauth-button.google {
  background-color: #db4437;
  color: #fff;
}

#faq {
  width: 100%;
}

#faq section {
  padding: 50px 0;
}

#faq h2 {
  font-size: 2em;
  font-weight: 700;
  margin-bottom: 20px;
}

#faq p {
  font-size: 1.2em;
  color: #666;
  margin-bottom: 30px;
}

#faq ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

#faq li {
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
}

#faq li a {
  text-decoration: none;
  color: #333;
}

#faq li a:hover {
  text-decoration: underline;
}

#faq svg {
  transition: transform 0.2s ease;
}
</style>
