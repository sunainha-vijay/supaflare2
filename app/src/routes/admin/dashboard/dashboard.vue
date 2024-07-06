<template>
  <admin-view>
    <h1>Dashboard</h1>
    <n-table :columns="columns" :data="links">
      <template #cell-start_date="{ row }">
        {{ new Date(row.start_date).toLocaleString() }}
      </template>
      <template #cell-end_date="{ row }">
        {{ new Date(row.end_date).toLocaleString() }}
      </template>
    </n-table>
  </admin-view>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { fetchLinks } from '@/services/links';

export default defineComponent({
  components: {},
  setup() {
    const links = ref<any[]>([]); // Initialize with an empty array
    const columns = ref([
      { title: 'Short URL', key: 'slug' },
      { title: 'Long URL', key: 'url' },
      { title: 'Start Date', key: 'start_date' },
      { title: 'End Date', key: 'end_date' },
      // Additional columns...
    ]);

    onMounted(async () => {
      const { data } = await fetchLinks();
      links.value = data || [];
    });

    return { links, columns };
  },
});
</script>
