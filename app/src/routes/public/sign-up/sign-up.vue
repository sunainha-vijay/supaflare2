<template>
  <public-view>
    <div id="content">
      <n-form ref="formRef" :model="model" :rules="rules">
        <img class="logo" src="/supaflare.png" />
        <h1>Sign Up</h1>
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
        <div style="display: flex; justify-content: flex-end">
          <n-button round type="primary" @click="handleSignUpButtonClick">Sign Up</n-button>
        </div>
        <n-divider title-placement="left">Already have an account? <router-link to="/signin">Sign In</router-link></n-divider>
      </n-form>
    </div>
  </public-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useMessage, NForm, NFormItem, NInput, NButton, NDivider } from 'naive-ui';
import { handleSignUp } from '@/services/auth'; // Import your sign-up function if available
import { router } from '@/router';

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
              // Assuming you have a handleSignUp function in your services/auth.ts
              const { error, user } = await handleSignUp({
                email: modelRef.value.email,
                password: modelRef.value.password,
              });
              if (error) throw error;
              if (user) {
                // Navigate to a success page or redirect as needed
                router.push('/success');
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
