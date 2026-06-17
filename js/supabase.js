const SUPABASE_URL = "https://qozemiqpuqczabsjhxfw.supabase.co";

const SUPABASE_KEY = "sb_publishable_fJxbaXpnB7z0oJj5p5ubYQ_MPy16k2O";

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);