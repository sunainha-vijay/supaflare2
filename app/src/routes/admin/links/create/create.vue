
<template>
	<admin-view>
		<h1>Create Link</h1>
		<n-spin :show="showLoadingSpinner">
			<n-form ref="formRef" class="centered-form" :model="model" :rules="rules">
				<n-form-item path="url" label="URL">
					<n-input
						v-model:value="model.url_raw"
						class="url-input"
						pair
						clearable
						separator="://"
						:placeholder="['Protocol', 'Web Address']"
						@change="handleUrlUpdate"
						@update:value="handleUrlUpdate"
					></n-input>
				</n-form-item>
				<n-row>
					<n-form-item ref="slugRef" path="slug" label="Slug" style="flex-grow: 1">
						<n-input-group>
							<n-input-group-label class="slug-input-inline">/</n-input-group-label>
							<n-input v-model:value="model.slug" class="slug-input" placeholder="Enter Slug" />
						</n-input-group>
					</n-form-item>
					<n-form-item>
						<n-button type="warning" style="margin-left: 20px" @click="handleGenerateSlug">
							<template #icon>
								<n-icon>
									<sync />
								</n-icon>
							</template>
							Generate Slug
						</n-button>
					</n-form-item>
				</n-row>
				<n-form-item path="android_url" label="Android URL" style="flex-grow: 1">
					<n-input
						v-model:value="model.android_url_raw"
						class="url-input"
						pair
						clearable
						separator="://"
						:placeholder="['Protocol', 'Web Address']"
						@change="handleAndroidUrlUpdate"
						@update:value="handleAndroidUrlUpdate"
					></n-input>
				</n-form-item>
				<n-form-item path="ios_url" label="iOS URL" style="flex-grow: 1">
					<n-input
						v-model:value="model.ios_url_raw"
						class="url-input"
						pair
						clearable
						separator="://"
						:placeholder="['Protocol', 'Web Address']"
						@change="handleIosUrlUpdate"
						@update:value="handleIosUrlUpdate"
					></n-input>
				</n-form-item>
			        <n-form-item path="start_date" label="Start Date">
			          <n-date-picker v-model:value="model.start_date" type="datetime"></n-date-picker>
			        </n-form-item>
			        <n-form-item path="end_date" label="End Date">
			          <n-date-picker v-model:value="model.end_date" type="datetime"></n-date-picker>
			        </n-form-item>
				<div style="display: flex; justify-content: center">
					<n-button round type="primary" :disabled="showLoadingSpinner" @click="handleCreateLink">
						<template #icon>
							<n-icon>
								<plus />
							</n-icon>
						</template>
						Create
					</n-button>
				</div>
			</n-form>
		</n-spin>
	</admin-view>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { addLink } from '@/services/links';
import { useAppStore } from '@/stores/appStore';
import { useLinksStore } from '@/stores/linksStore';
import { useMessage, NSpin, NForm, NFormItem, NInput, NDatePicker, NButton, NRow } from 'naive-ui';

export default defineComponent({
  components: { NSpin, NForm, NFormItem, NInput, NDatePicker, NButton, NRow },
  setup() {
    const showLoadingSpinner = ref(false);
    const formRef = ref();
    const messageDuration = 5000;
    const appStore = useAppStore();
    const linksStore = useLinksStore();
    const message = useMessage();
    const modelRef = ref({
      url: computed(() => {
        if (!modelRef.value.url_raw[0] && !modelRef.value.url_raw[1]) return '';
        return modelRef.value.url_raw[0] + '://' + modelRef.value.url_raw[1];
      }),
      url_raw: ['', ''],
      slug: '',
      android_url: computed(() => {
        if (!modelRef.value.android_url_raw[0] && !modelRef.value.android_url_raw[1]) return '';
        return modelRef.value.android_url_raw[0] + '://' + modelRef.value.android_url_raw[1];
      }),
      android_url_raw: ['', ''],
      ios_url: computed(() => {
        if (!modelRef.value.ios_url_raw[0] && !modelRef.value.ios_url_raw[1]) return '';
        return modelRef.value.ios_url_raw[0] + '://' + modelRef.value.ios_url_raw[1];
      }),
      ios_url_raw: ['', ''],
      start_date: null,
      end_date: null,
    });

    const rules = {
      url: [
        {
          required: true,
          validator(rule: any, value: any) {
            if (!value) {
              return new Error('URL is required');
            } else if (value.length > 2083) {
              return new Error('URL has to be 2083 characters or below.');
            } else if (String(value).startsWith('://')) {
              return new Error('Please enter a protocol.');
            }
            return true;
          },
          trigger: ['input', 'blur'],
        },
      ],
      slug: [
        {
          required: true,
          validator(rule: any, value: any) {
            if (!value) {
              return new Error('Slug is required');
            }
            if (value.length > 50) {
              return new Error('Slug has to be 50 characters or below.');
            }
            return true;
          },
          trigger: ['input', 'blur'],
        },
      ],
      start_date: [
        {
          required: true,
          validator(rule: any, value: any) {
            if (!value) {
              return new Error('Start Date is required');
            }
            return true;
          },
          trigger: ['input', 'blur'],
        },
      ],
      end_date: [
        {
          required: true,
          validator(rule: any, value: any) {
            if (!value) {
              return new Error('End Date is required');
            }
            return true;
          },
          trigger: ['input', 'blur'],
        },
      ],
      // Existing rules...
    };

    async function handleCreateLink() {
      try {
        await formRef.value.validate();
      } catch (error) {
        return;
      }
      try {
        showLoadingSpinner.value = true;
        const { data, error } = await addLink({
          user_id: appStore.supabaseSession!.user!.id,
          url: modelRef.value.url,
          slug: modelRef.value.slug,
          meta: {
            android_url: modelRef.value.android_url,
            ios_url: modelRef.value.ios_url,
          },
          start_date: modelRef.value.start_date,
          end_date: modelRef.value.end_date,
        });
        if (error) throw error;

        linksStore.addLink(data);
        resetForm();
        message.success('Link successfully created!', { duration: messageDuration });
      } catch (error: any) {
        if (error.code == '23505') {
          message.error('Slug already exists. Please change the slug.', { duration: messageDuration });
        } else {
          message.error('Error creating link...', { duration: messageDuration });
        }
      } finally {
        showLoadingSpinner.value = false;
      }
    }

    function resetForm() {
      modelRef.value.url_raw = ['', ''];
      modelRef.value.slug = '';
      modelRef.value.android_url_raw = ['', ''];
      modelRef.value.ios_url_raw = ['', ''];
      modelRef.value.start_date = null;
      modelRef.value.end_date = null;
    }

    return {
      showLoadingSpinner,
      formRef,
      model: modelRef,
      rules,
      handleCreateLink,
    };
  },
});
</script>

<style scoped>
.centered-form {
  width: 500px;
  margin: 0 auto;
}
</style>

<style scoped>
.centered-form {
	width: 500px;
	margin: 0 auto;
}

.slug-input {
	text-align: center;
}

.slug-input-inline {
	width: '33%';
	text-align: 'right';
}

.url-input :deep(.n-input-wrapper):first-child {
	flex-grow: 0;
	width: 80px;
}

.url-input :deep(.n-input-wrapper):first-child input {
	text-align: right;
}

.url-input :deep(.n-input-wrapper):nth-child(3) input {
	text-align: left;
}
</style>
