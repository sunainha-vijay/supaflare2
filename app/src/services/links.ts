import { supabase } from '@/services/supabase';
import { Axios } from 'axios';
import { useAppStore } from '@/stores/appStore';

export type Link = {
  id: number;
  slug: string;
  original_url: string;
  inserted_at: string;
};

const supaflareWorkerUpdateURL = import.meta.env.VITE_SUPAFLARE_WORKER_URL + '/supaflare_cfw_update';
const appStore = useAppStore();

const options = {
  headers: {
    'content-type': 'application/json',
  },
};

async function fetchLinks(): Promise<{ data: Link[]; error: null | Error }> {
  const { data, error } = await supabase.from('links').select('*').order('inserted_at', { ascending: false });
  return { data, error };
}

async function addLink(link: Link): Promise<{ data: Link; error: null | Error }> {
  const { data, error } = await supabase.from('links').insert(link).single();
  await axios.post(
    supaflareWorkerUpdateURL,
    { token: appStore.supabaseSession!.access_token, link_id: data.id },
    options
  );
  return { data, error };
}

async function editLink(link: Link, edits: any): Promise<{ error: null | Error }> {
  const { error } = await supabase.from('links').update(edits).eq('id', link.id).single();
  await axios.post(
    supaflareWorkerUpdateURL,
    { token: appStore.supabaseSession!.access_token, link_id: link.id },
    options
  );
  return { error };
}

async function deleteLink(link: Link): Promise<void> {
  await supabase.from('links').delete().eq('id', link.id);
  await axios.post(
    supaflareWorkerUpdateURL,
    { token: appStore.supabaseSession!.access_token, link_id: link.id, slug: link.slug },
    options
  );
}

export { fetchLinks, addLink, editLink, deleteLink, Link };
