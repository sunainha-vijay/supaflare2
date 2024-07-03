<template>
  <div>
    <h1>Dashboard</h1>
    <ul>
      <li v-for="link in links" :key="link.id">
        <a :href="link.original_url">{{ link.slug }}</a>
      </li>
    </ul>
    <form @submit.prevent="addLink">
      <input type="text" v-model="newLink.slug" placeholder="Slug">
      <input type="text" v-model="newLink.original_url" placeholder="Original URL">
      <button type="submit">Add Link</button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { fetchLinks, addLink, Link } from '@/services/links'; // Ensure Link type is imported correctly

export default defineComponent({
  setup() {
    const links = ref<Link[]>([]); // Initialize ref for links
    const newLink = ref<Link>({ slug: '', original_url: '' }); // Initialize ref for newLink

    const fetchLinksData = async () => {
      const { data, error } = await fetchLinks();
      if (error) {
        console.error(error);
      } else {
        links.value = data;
      }
    };

    const addLink = async () => {
      const { data, error } = await addLink(newLink.value);
      if (error) {
        console.error(error);
      } else {
        links.value.push(data);
        newLink.value = { slug: '', original_url: '' };
      }
    };

    // Fetch data on component mount
    fetchLinksData();

    return {
      links,
      newLink,
      addLink,
    };
  },
});
</script>
