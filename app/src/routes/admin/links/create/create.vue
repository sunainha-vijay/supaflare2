<template>
    <admin-view>
        <h1>Create Link</h1>
        <n-spin :show="showLoadingSpinner">
            <n-form ref="formRef" class="centered-form" :model="model" :rules="rules">
                <!-- Other form items -->
                <n-form-item path="start_date" label="Start Date">
                    <n-date-picker v-model:value="model.start_date" type="datetime" placeholder="Select Start Date and Time"></n-date-picker>
                </n-form-item>
                <n-form-item path="end_date" label="End Date">
                    <n-date-picker v-model:value="model.end_date" type="datetime" placeholder="Select End Date and Time"></n-date-picker>
                </n-form-item>
                <!-- Other form items -->

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
import {
    useMessage,
    NSpin,
    NForm,
    NFormItem,
    NInput,
    NInputGroup,
    NInputGroupLabel,
    NIcon,
    NButton,
    NRow,
    NDatePicker // Import NDatePicker from naive-ui
} from 'naive-ui';
import { Plus, Sync } from '@vicons/fa';
import { customAlphabet } from 'nanoid';
import { Link } from '@/types/global'; // Ensure Link interface is imported

export default defineComponent({
    components: { NSpin, NForm, NFormItem, NInput, NInputGroup, NInputGroupLabel, NIcon, NButton, NRow, NDatePicker, Plus, Sync },
    setup() {
        const showLoadingSpinner = ref(false);
        const formRef = ref();
        const messageDuration = 5000;
        const appStore = useAppStore();
        const linksStore = useLinksStore();
        const message = useMessage();
        const modelRef = ref<Link>({
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
            start_date: null, // Initialize start_date and end_date as null
            end_date: null,
	
        });

        const rules = {
            // Your validation rules here
        };

        // Function to generate slug
        const nanoid = customAlphabet('1234567890abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ', 6);

        async function handleGenerateSlug() {
            modelRef.value.slug = nanoid();
            try {
                await formRef.value.validate();
            } catch (error) {
                return;
            }
        }

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

        // Handlers for URL updates
        // Ensure these functions are updated based on your specific requirements

        return {
            showLoadingSpinner,
            formRef,
            model: modelRef,
            rules,
            handleGenerateSlug,
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
