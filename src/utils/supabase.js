import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In test environment, if Supabase credentials are missing, create a stub client
const isTestEnvironment = process.env.NODE_ENV === "test";
const hasMissingCredentials = !supabaseUrl || !supabaseKey;

let supabase;

if (isTestEnvironment && hasMissingCredentials) {
  // Create a test stub that returns basic mock responses
  supabase = {
    from: () => ({
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
      upsert: () => Promise.resolve({ data: null, error: null }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signIn: () => Promise.resolve({ data: null, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      signUp: () => Promise.resolve({ data: null, error: null }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        download: () => Promise.resolve({ data: null, error: null }),
      }),
    },
    channel: () => {
      const channelStub = {
        on: () => channelStub,
        subscribe: () => ({ unsubscribe: () => {} }),
        unsubscribe: () => {},
      };
      return channelStub;
    },
  };
  console.log("Using Supabase test stub (no network calls)");
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export default supabase;
