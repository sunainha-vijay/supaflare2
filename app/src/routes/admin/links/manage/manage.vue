<template>
    <admin-view>
        <!-- Existing Code -->
        <n-modal
            v-model:show="showEditModal"
            preset="card"
            :style="{ width: '600px' }"
            title="Modal"
            :bordered="false"
            size="huge"
            :segmented="{
                content: 'soft',
                footer: 'soft',
            }"
            :closable="false"
            :mask-closable="false"
        >
            <template #header>
                <div>Edit Link</div>
            </template>
            <div>
                <n-spin :show="showLoadingSpinner">
                    <n-form ref="formRef" class="centered-form" :model="model" :rules="rules">
                        <!-- Existing form items -->

                        <!-- New form items for start_date and end_date -->
                        <n-form-item path="start_date" label="Start Date">
                            <n-date-picker v-model:value="model.start_date" placeholder="Select Start Date"></n-date-picker>
                        </n-form-item>
                        <n-form-item path="end_date" label="End Date">
                            <n-date-picker v-model:value="model.end_date" placeholder="Select End Date"></n-date-picker>
                        </n-form-item>
                    </n-form>
                </n-spin>
            </div>
            <template #footer>
                <div>
                    <n-button type="primary" :disabled="showLoadingSpinner" @click="handleSaveEdits">Update</n-button>
                    <n-button style="margin-left: 20px" :disabled="showLoadingSpinner" @click="showEditModal = false">Cancel</n-button>
                </div>
            </template>
        </n-modal>
    </admin-view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, computed } from 'vue';
import { fetchLinks, editLink, deleteLink } from '@/services/links';
import {
    useMessage,
    useDialog,
    NDataTable,
    NButton,
    NModal,
    NSpin,
    NForm,
    NFormItem,
    NInput,
    NInputGroup,
    NInputGroupLabel,
    NIcon,
    NRow,
    NDatePicker, // Import NDatePicker for date pickers
} from 'naive-ui';
import { Sync } from '@vicons/fa';
import { useLinksStore } from '@/stores/linksStore';
import { Link } from '@/types/global';
import { customAlphabet } from 'nanoid';

export default defineComponent({
    components: {
        NDataTable,
        NModal,
        NSpin,
        NButton,
        NForm,
        NFormItem,
        NInput,
        NInputGroup,
        NInputGroupLabel,
        NIcon,
        NRow,
        NDatePicker, // Ensure NDatePicker is included in components
        Sync,
    },
    setup() {
        const linksStore = useLinksStore();
        const message = useMessage();
        const dialog = useDialog();
        const formRef = ref();
        const loadingRef = ref(true);
        const links = ref<Link[]>([]);
        const showEditModal = ref(false);
        const showLoadingSpinner = ref(false);
        const modelRef = ref({
            url: '',
            url_raw: ['', ''],
            slug: '',
            android_url: '',
            android_url_raw: ['', ''],
            ios_url: '',
            ios_url_raw: ['', ''],
            start_date: '', // Initialize start_date and end_date
            end_date: '',
        });
        const editRowRef = ref();

        const rules = {
            url: [
                // Existing rules for validation
            ],
            slug: [
                // Existing rules for validation
            ],
            android_url: [
                // Existing rules for validation
            ],
            ios_url: [
                // Existing rules for validation
            ],
            start_date: [
                { required: true, message: 'Please select start date', trigger: 'change' },
            ],
            end_date: [
                { required: true, message: 'Please select end date', trigger: 'change' },
            ],
        };

        // Function to handle generating slug (existing functionality)
        // Function to handle saving edits (existing functionality)
        // Function to handle date updates (if necessary)

        return {
            formRef,
            loadingRef,
            links,
            showEditModal,
            showLoadingSpinner,
            model: modelRef,
            rules,
            handleSaveEdits, // Ensure existing functions are returned
            // Additional functions for handling start_date and end_date if needed
        };
    },
});
</script>


<style scoped>
.centered-view {
	margin: 0 auto;
}

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
