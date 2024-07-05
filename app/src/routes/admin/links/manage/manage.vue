<template>
    <admin-view>
        <h1>Manage Links</h1>
        <n-data-table
            ref="tableRef"
            class="centered-view"
            :row-key="rowKey"
            :loading="loadingRef"
            :columns="columns"
            :data="links"
            :pagination="pagination"
        />

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
        Sync,
    },
    setup() {
        const slugRef = ref();
        const messageDuration = 5000;
        const linksStore = useLinksStore();
        const message = useMessage();
        const dialog = useDialog();
        const formRef = ref();
        const tableRef = ref();
        const loadingRef = ref(true);
        const links = ref<Link[]>([]);
        const showEditModal = ref(false);
        const showLoadingSpinner = ref(false);

        const modelRef = ref({
            id: null,
            url_raw: ['', ''],
            slug: '',
            android_url_raw: ['', ''],
            ios_url_raw: ['', ''],
        });
        const editRowRef = ref();

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
            android_url: [
                {
                    validator(rule: any, value: any) {
                        if (!value) {
                            return true;
                        }
                        if (value.length > 2083) {
                            return new Error('Android URL has to be 2083 characters or below.');
                        } else if (String(value).startsWith('://')) {
                            return new Error('Please enter a protocol.');
                        }
                        return true;
                    },
                    trigger: ['input', 'blur'],
                },
            ],
            ios_url: [
                {
                    validator(rule: any, value: any) {
                        if (!value) {
                            return true;
                        }
                        if (value.length > 2083) {
                            return new Error('iOS URL has to be 2083 characters or below.');
                        } else if (String(value).startsWith('://')) {
                            return new Error('Please enter a protocol.');
                        }
                        return true;
                    },
                    trigger: ['input', 'blur'],
                },
            ],
        };

        const nanoid = customAlphabet('1234567890abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ', 6);

        async function handleGenerateSlug() {
            modelRef.value.slug = nanoid();
            try {
                await slugRef.value.validate();
            } catch (error) {
                return;
            }
        }

        async function handleSaveEdits() {
            try {
                await formRef.value.validate();
            } catch (error) {
                return;
            }

            try {
                showLoadingSpinner.value = true;
                const { error } = await editLink(editRowRef.value, {
                    url: modelRef.value.url,
                    slug: modelRef.value.slug,
                    meta: {
                        android_url: modelRef.value.android_url,
                        ios_url: modelRef.value.ios_url,
                    },
                });
                if (error) throw error;

                for (let link of links.value) {
                    if (link.id === editRowRef.value.id) {
                        link.url = modelRef.value.url;
                        link.slug = modelRef.value.slug;
                        link.meta = {
                            android_url: modelRef.value.android_url,
                            ios_url: modelRef.value.ios_url,
                        };
                    }
                }

                message.success('Link successfully updated!');
                showEditModal.value = false;
            } catch (error: any) {
                if (error.code == '23505') {
                    message.error('Slug already exists. Please change the slug.');
                } else {
                    message.error('Error updating link...');
                }
            } finally {
                showLoadingSpinner.value = false;
            }
        }

        const columns: any[] = [
            {
                title: 'URL',
                key: 'url',
                render(row: any) {
                    return h(
                        'a',
                        {
                            href: row.url,
                            target: '_blank',
                        },
                        { default: () => row.url }
                    );
                },
            },
            {
                title: 'Slug',
                key: 'slug',
                render(row: any) {
                    return h('b', {}, { default: () => '/' + row.slug });
                },
            },
            {
                title: 'Android URL',
                key: 'meta.android_url',
                render(row: any) {
                    return h(
                        'a',
                        {
                            href: row.meta.android_url,
                            target: '_blank',
                        },
                        { default: () => row.meta.android_url }
                    );
                },
            },
            {
                title: 'iOS URL',
                key: 'meta.ios_url',
                render(row: any) {
                    return h(
                        'a',
                        {
                            href: row.meta.ios_url,
                            target: '_blank',
                        },
                        { default: () => row.meta.ios_url }
                    );
                },
            },
            {
                title: 'Actions',
                key: 'actions',
                render(row: any) {
                    return h(
                        'div',
                        {},
                        {
                            default: () => [
                                h(
                                    NButton,
                                    {
                                        type: 'warning',
                                        onClick: () => handleEditLink(row),
                                    },
                                    { default: () => 'Edit' }
                                ),
                                h(
                                    NButton,
                                    {
                                        type: 'error',
                                        onClick: () => handleDeleteLink(row),
                                    },
                                    { default: () => 'Delete' }
                                ),
                            ],
                        }
                    );
                },
            },
        ];

        const pagination = {
            pageSize: 10,
            pageSizes: [10, 20, 50],
            layout: ['Sizes', 'Prev', 'Pager', 'Next', 'Jumper', 'Total'],
        };

        const rowKey = (row: any) => row.id;

        async function fetchData() {
            try {
                loadingRef.value = true;
                const response = await fetchLinks();
                links.value = response.data.links;
            } catch (error) {
                message.error('Failed to fetch links.');
            } finally {
                loadingRef.value = false;
            }
        }

        async function handleEditLink(row: any) {
            editRowRef.value = row;
            modelRef.value.id = row.id;
            modelRef.value.slug = row.slug;

            if (row.url) {
                const fields = String(row.url).split('://');
                modelRef.value.url_raw = [fields[0], fields.slice(1).join('://')];
            } else {
                modelRef.value.url_raw = ['', ''];
            }
            if (row.meta.android_url) {
                const fields = String(row.meta.android_url).split('://');
                modelRef.value.android_url_raw = [fields[0], fields.slice(1).join('://')];
            } else {
                modelRef.value.android_url_raw = ['', ''];
            }
            if (row.meta.ios_url) {
                const fields = String(row.meta.ios_url).split('://');
                modelRef.value.ios_url_raw = [fields[0], fields.slice(1).join('://')];
            } else {
                modelRef.value.ios_url_raw = ['', ''];
            }

            showEditModal.value = true;
        }

        async function handleDeleteLink(row: any) {
            try {
                const { confirmed } = await dialog.warning({
                    title: 'Delete Link',
                    content: 'Are you sure you want to delete this link?',
                    positiveText: 'Delete',
                });

                if (confirmed) {
                    const { error } = await deleteLink(row.id);
                    if (error) throw error;

                    message.success('Link deleted successfully.');
                    await fetchData();
                }
            } catch (error) {
                message.error('Failed to delete link.');
            }
        }

        function handleUrlUpdate(value: string[]) {
            modelRef.value.url = value.join('://');
        }

        function handleAndroidUrlUpdate(value: string[]) {
            modelRef.value.android_url = value.join('://');
        }

        function handleIosUrlUpdate(value: string[]) {
            modelRef.value.ios_url = value.join('://');
        }

        onMounted(() => {
            fetchData();
        });

        return {
            message,
            dialog,
            formRef,
            tableRef,
            loadingRef,
            links,
            showEditModal,
            showLoadingSpinner,
            modelRef,
            editRowRef,
            columns,
            pagination,
            rowKey,
            rules,
            handleGenerateSlug,
            handleSaveEdits,
            handleEditLink,
            handleDeleteLink,
            handleUrlUpdate,
            handleAndroidUrlUpdate,
            handleIosUrlUpdate,
        };
    },
});
</script>

<style scoped>
.centered-view {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.centered-form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.url-input {
    flex-grow: 1;
}

.slug-input-inline {
    padding: 0 5px;
    background-color: #f0f0f0;
}

.slug-input {
    flex-grow: 1;
}
</style>
