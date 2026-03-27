/* supabase-client.js */
(function () {
    if (window.supabase_initialized) return;

    const SUPABASE_URL = 'https://bqobpkwkwypiuhtprjva.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxb2Jwa3drd3lwaXVodHByanZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NjQ3NDMsImV4cCI6MjA4NDQ0MDc0M30.51PFJRHCKHYbLhHB3hw8FdeECmk5HORQ_wJBtJK1yUM';

    if (typeof supabase !== 'undefined' && supabase.createClient) {
        window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        window.supabase_initialized = true;
        console.log('Supabase Client Initialized');
    } else {
        console.error('Supabase SDK missing.');
    }
})();

/* Auth guard — appeler sur les pages protégées */
async function requireAuth() {
    try {
        const { data: { session } } = await window.supabase.auth.getSession();
        if (!session) {
            window.location.replace('login.html');
            return null;
        }
        return session.user;
    } catch (e) {
        window.location.replace('login.html');
        return null;
    }
}

/* Déconnexion */
async function logout() {
    await window.supabase.auth.signOut();
    window.location.replace('login.html');
}
