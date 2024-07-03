// services/links.ts

import axios from 'axios';
import { supabase } from '@/services/supabase';
import { Link } from '@/types/global';
import { useAppStore } from '@/stores/appStore';

const supaflareWorkerUpdateURL = import.meta.env.VITE_SUPAFLARE_WORKER_URL + '/supaflare_cfw_update';
const appStore = useAppStore();

const options = {
  headers: {
    'Content-Type': 'application/json',
  },
};

async function fetchLinks() {
  try {
    const { data, error } = await supabase.from('links').select('*').order('inserted_at', { ascending: false });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching links:', error.message);
    throw error;
  }
}

async function addLink(link: Link) {
  try {
    const { data: insertedLink, error } = await supabase.from('links').insert(link).single();
    if (error) {
      throw error;
    }

    // Generate the shortened URL
    const shortUrl = `https://your-domain.com/${insertedLink.slug}`; // Replace with your actual domain

    // Update the link with the shortened URL
    await supabase.from('links').update({ shortUrl }).eq('id', insertedLink.id).single();

    // Trigger update to Supaflare worker
    await axios.post(supaflareWorkerUpdateURL, { token: appStore.supabaseSession!.access_token, link_id: insertedLink.id }, options);

    return { data: insertedLink, shortUrl }; // Return both the inserted link and the shortened URL
  } catch (error) {
    console.error('Error adding link:', error.message);
    throw error;
  }
}

async function editLink(link: Link, edits: Partial<Link>) {
  try {
    const { error } = await supabase.from('links').update(edits).eq('id', link.id).single();
    if (error) {
      throw error;
    }
    await axios.post(supaflareWorkerUpdateURL, { token: appStore.supabaseSession!.access_token, link_id: link.id }, options);
  } catch (error) {
    console.error('Error editing link:', error.message);
    throw error;
  }
}

async function deleteLink(link: Link) {
  try {
    await supabase.from('links').delete().eq('id', link.id);
    await axios.post(supaflareWorkerUpdateURL, { token: appStore.supabaseSession!.access_token, link_id: link.id, slug: link.slug }, options);
  } catch (error) {
    console.error('Error deleting link:', error.message);
    throw error;
  }
}

export { fetchLinks, addLink, editLink, deleteLink };
