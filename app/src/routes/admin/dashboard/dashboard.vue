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
          <p>{{ link.title }}</p>
          <p>Original URL: <a :href="link.originalUrl" target="_blank">{{ link.originalUrl }}</a></p>
          <p>Shortened URL: <a :href="link.shortUrl" target="_blank">{{ link.shortUrl }}</a></p>
          <button @click="deleteLink(link)">Delete</button>
        </li>
      </ul>
    </div>
  </admin-view>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { fetchLinks, deleteLink } from '@/services/links';
import { Link } from '@/types/global'; // Adjust for your specific global types

export default defineComponent({
  name: 'Dashboard',
  components: {
    // Add any necessary components here
  },
  setup() {
    const links = ref<Link[]>([]);
    const loading = ref<boolean>(true); // Flag to indicate loading state

    const loadLinks = async () => {
      try {
        const { data, error } = await fetchLinks();
        if (error) {
          console.error('Error fetching links:', error);
          return;
        }
        links.value = data.map((link: Link) => ({
          ...link,
          shortUrl: `https://supaflare2.pages.dev/${link.slug}`, // Replace with your actual domain
        }));
      } catch (error) {
        console.error('Error loading links:', error);
      } finally {
        loading.value = false; // Update loading state after fetching links
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

    onMounted(() => {
      loadLinks();
    });

    return {
      links,
      loading,
      deleteLink: deleteLinkHandler,
    };
  },
});
</script>
