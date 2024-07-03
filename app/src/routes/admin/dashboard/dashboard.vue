<template>
  <admin-view>
    <h1>Dashboard</h1>
    <div v-if="loading">
      <p>Loading...</p>
    </div>
    <div v-else>
      <h2>Your Links</h2>
      <ul>
        <li v-for="link in links" :key="link.id">
          <p>{{ link.title }}</p> <!-- Example of accessing link properties -->
          <p>Original URL: <a :href="link.url" target="_blank">{{ link.url }}</a></p>
          <p>Shortened URL: <a :href="getShortUrl(link)" target="_blank">{{ getShortUrl(link) }}</a></p>
          <button @click="deleteLink(link)">Delete</button>
        </li>
      </ul>
    </div>
  </admin-view>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { fetchLinks, deleteLink } from '@/services/links';
import { Link } from '@/types/global'; // Adjust path as per your setup

export default defineComponent({
  name: 'Dashboard',
  components: {
    // Import necessary components
  },
  setup() {
    const links = ref<Link[]>([]);
    const loading = ref<boolean>(true);

    const loadLinks = async () => {
      try {
        const { data, error } = await fetchLinks();
        if (error) {
          console.error('Error fetching links:', error);
          return;
        }
        links.value = data || []; // Initialize links with fetched data or empty array
      } catch (error) {
        console.error('Error loading links:', error);
      } finally {
        loading.value = false;
      }
    };

    const deleteLinkHandler = async (link: Link) => {
      try {
        await deleteLink(link);
        await loadLinks(); // Reload links after deletion
      } catch (error) {
        console.error('Error deleting link:', error);
      }
    };

    const getShortUrl = (link: Link): string => {
      return `https://supaflare2.pages.dev/${link.slug}`; // Adjust with your actual domain
    };

    onMounted(() => {
      loadLinks();
    });

    return {
      links,
      loading,
      deleteLink: deleteLinkHandler,
      getShortUrl,
    };
  },
});
</script>
