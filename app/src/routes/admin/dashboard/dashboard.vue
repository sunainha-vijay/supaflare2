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
import { fetchLinks, addLink, Link } from '@/services/links';

export default defineComponent({
  setup() {
    const links = ref<Link[]>([]);
    const newLink = ref<Link>({ slug: '', original_url: '' });

    const mounted = async () => {
      const result = await fetchLinks();
      if (result.error) {
        console.error(result.error);
      } else {
        links.value = result.data;
      }
    };

    const addLink = async () => {
      const result = await addLink(newLink.value);
      if (result.error) {
        console.error(result.error);
      } else {
        links.value.push(result.data);
        newLink.value = { slug: '', original_url: '' };
      }
    };

    mounted(); // Call the mounted function to fetch data on component mount

    return {
      links,
      newLink,
      addLink,
    };
  },
});
</script>
