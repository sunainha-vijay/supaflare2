<template>
  <public-view>
    <div id="content">
      <n-form ref="formRef" :model="model" :rules="rules">
        <img class="logo" src="/supaflare.png" />
        <h1>Sign Up</h1>
        <n-form-item path="email" label="Email">
          <n-input v-model:value="model.email" placeholder="Enter Email" />
        </n-form-item>
        <n-form-item path="password" label="Password">
          <n-input
            v-model:value="model.password"
            type="password"
            placeholder="Enter Password"
          />
        </n-form-item>
        <n-form-item path="confirmPassword" label="Confirm Password">
          <n-input
            v-model:value="model.confirmPassword"
            type="password"
            placeholder="Confirm Password"
          />
        </n-form-item>
        <n-button round type="primary" @click="handleSignUpButtonClick">
          Sign Up
        </n-button>
      </n-form>
    </div>
  </public-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { handleSignUp } from '@/services/auth'; // Assuming you have an auth service with a signup function
import { useMessage, NForm, NFormItem, NInput, NButton, NDivider, NSpace, NIcon } from 'naive-ui';
import { router } from '@/router';

export default defineComponent({
  name: 'SignUp',
  setup() {
    const messageDuration = 5000;
    const formRef = ref();
    const message = useMessage();
    const modelRef = ref({
      email: '',
      password: '',
      confirmPassword: '',
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
          required: true,
          validator(rule: any, value: any) {
            if (!value) {
              return new Error('Password is required');
            } else if (value.length < 6) {
              return new Error('Password must be at least 6 characters long');
            }
            return true;
          },
          trigger: ['input', 'blur'],
        },
      ],
      confirmPassword: [
        {
          required: true,
          validator(rule: any, value: any) {
            if (value !== modelRef.value.password) {
              return new Error('Passwords do not match');
            }
            return true;
          },
          trigger: ['input', 'blur'],
        },
      ],
    };

    async function handleSignUpButtonClick(e: any) {
      e.preventDefault();
      if (formRef.value) {
        formRef.value.validate(async (error: any) => {
          if (!error) {
            try {
              const credentials = {
                email: modelRef.value.email,
                password: modelRef.value.password,
              };
              const { error } = await handleSignUp(credentials);
              if (error) throw error;
