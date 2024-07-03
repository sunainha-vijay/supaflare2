<template>
  <admin-view>
    <h1>Dashboard</h1>
    <table id="urls">
      <thead>
        <tr>
          <th>Short URL</th>
          <th>Original URL</th>
          <th>Slug</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="link in links" :key="link.id">
          <td><a :href="'https://supaflare2.pages.dev/' + link.slug" target="_blank">https://supaflare2.pages.dev/{{ link.slug }}</a></td>
          <td>{{ link.original_url }}</td>
          <td>{{ link.slug }}</td>
        </tr>
      </tbody>
    </table>
  </admin-view>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { fetchLinks } from '@/link';

export default defineComponent({
  components: {},
  data() {
    return {
      links: [],
    };
  },
  async mounted() {
    const { data, error } = await fetchLinks();
    if (error) {
      console.error(error);
    } else {
      this.links = data;
    }
  },
});
</script>
