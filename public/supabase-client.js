/* supabase-client.js */
(function () {
    // Prevent errors if loaded multiple times
    if (window.supabase_initialized) return;

    const SUPABASE_URL = 'https://bqobpkwkwypiuhtprjva.supabase.co';
    const SUPABASE_KEY = 'sb_publishable_WDcUefwxHjmASodW8WwhoA_g5U0x4MS';

    if (typeof supabase !== 'undefined' && supabase.createClient) {
        window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        window.supabase_initialized = true;
        console.log('Supabase Client Initialized');
    } else {
        console.error('Supabase SDK missing. Ensure script tag is correct.');
    }
})();
