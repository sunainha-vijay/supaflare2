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
import { fetchLinks, addLink, editLink, deleteLink } from '@/services/links';

export default defineComponent({
  components: {},
  setup() {
    const links = ref<Link[]>([]);
    const newLink = ref<Link>({
      slug: '',
      original_url: '',
    });

    async mounted() {
      const { data, error } = await fetchLinks();
      if (error) {
        console.error(error);
      } else {
        links.value = data;
      }
    }

    async addLink() {
      const { data, error } = await addLink(newLink.value);
      if (error) {
        console.error(error);
      } else {
        links.value.push(data);
        newLink.value = {
          slug: '',
          original_url: '',
        };
      }
    }

    return {
      links,
      newLink,
      addLink,
    };
  },
});
</script>
