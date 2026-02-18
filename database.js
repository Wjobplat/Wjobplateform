const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'wjob.json');

// Memory store
let store = {
    users: [],
    jobs: [],
    recruiters: [],
    applications: [],
    activity_timeline: [],
    webhook_config: {
        id: 1,
        outgoing_url: '',
        secret: require('crypto').randomBytes(32).toString('hex'),
        events: JSON.stringify({
            'job.created': true,
            'recruiter.found': true,
            'application.generated': true,
            'application.status_changed': true
        }),
        enabled: 0,
        agent_url: ''
    },
    webhook_logs: [],
    agent_actions: []
};

// Persistence
function loadData() {
    if (fs.existsSync(dbPath)) {
        try {
            const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
            store = { ...store, ...data };
        } catch (e) {
            console.error('Error loading JSON database:', e);
        }
    } else {
        seedData();
        saveData();
    }
}

function saveData() {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(store, null, 2), 'utf8');
    } catch (e) {
        console.error('Error saving JSON database:', e);
    }
}

function seedData() {
    console.log('Seeding initial data...');
    // Admin
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('moha2004', salt);
    store.users.push({ id: 1, email: 'admin', password: hash, name: 'Admin', role: 'admin', created_at: new Date().toISOString() });

    // Initial jobs
    store.jobs = [
        { id: 1, company: "TechCorp Solutions", title: "Développeur Full Stack Senior", location: "Paris, France (Remote)", contract_type: "CDI", salary: "55k - 70k €", source: "LinkedIn", compatibility: 92, description: "Nous recherchons un développeur Full Stack passionné pour rejoindre notre équipe. Vous travaillerez sur des projets innovants utilisant React, Node.js et PostgreSQL.", skills: ["React", "Node.js", "PostgreSQL", "TypeScript"], posted_date: "2026-01-15", remote: 1 },
        { id: 2, company: "DataFlow Analytics", title: "Ingénieur Data Senior", location: "Lyon, France (Hybride)", contract_type: "CDI", salary: "60k - 75k €", source: "Welcome to the Jungle", compatibility: 88, description: "Rejoignez notre équipe data pour construire des pipelines de données robustes et des solutions d'analyse avancées.", skills: ["Python", "Spark", "AWS", "SQL"], posted_date: "2026-01-14", remote: 0 }
    ];

    // Initial applications
    store.applications = [
        { id: 1, job_id: 1, status: "pending", created_date: "2026-01-16", sent_date: null, response_date: null, cover_letter: "Madame, Monsieur...", custom_email: "Bonjour Sophie...", notes: "Entreprise intéressante" },
        { id: 2, job_id: 2, status: "sent", created_date: "2026-01-15", sent_date: "2026-01-16", response_date: null, cover_letter: "Madame, Monsieur...", custom_email: "Bonjour Thomas...", notes: "Relance prévue" }
    ];

    // Recruiters
    store.recruiters = [
        { id: 1, name: "Sophie Martin", email: "sophie.martin@techcorp.com", linkedin: "linkedin.com/in/sophiemartin", company: "TechCorp Solutions", position: "Tech Recruiter" },
        { id: 2, name: "Thomas Dubois", email: "t.dubois@dataflow.fr", linkedin: "linkedin.com/in/thomasdubois", company: "DataFlow Analytics", position: "Talent Acquisition Manager" }
    ];

    // Activity Timeline
    store.activity_timeline = [
        { id: 1, date: "2026-02-17", time: "10:30", type: "job_found", title: "Nouvelle offre découverte", description: "Développeur Full Stack Senior chez TechCorp Solutions" },
        { id: 2, date: "2026-02-17", time: "11:15", type: "app_sent", title: "Candidature envoyée", description: "Votre candidature pour DataFlow Analytics a été envoyée." },
        { id: 3, date: "2026-02-16", time: "15:45", type: "app_created", title: "Brouillon créé", description: "Nouvelle candidature préparée pour TechCorp." }
    ];

    console.log('Database seeded successfully.');
}

// Database Wrapper
const dbWrapper = {
    prepare(sql) {
        const query = sql.toLowerCase().trim();

        return {
            get(...params) {
                if (query.includes('select * from users where email = ?')) {
                    return store.users.find(u => u.email === params[0]);
                }
                if (query.includes('select * from users where id = ?')) {
                    return store.users.find(u => u.id === params[0]);
                }
                if (query.includes('select * from jobs where id = ?')) {
                    return store.jobs.find(j => j.id === params[0]);
                }
                if (query.includes('select * from applications where id = ?')) {
                    return store.applications.find(a => a.id === params[0]);
                }
                if (query.includes('select count(*)')) {
                    const tableMatch = query.match(/from\s+([a_z0-9_]+)/);
                    if (!tableMatch) return { c: 0, count: 0 };
                    const table = tableMatch[1];
                    let list = store[table] || [];

                    if (query.includes('where status =')) {
                        const statusMatch = query.match(/status\s*=\s*'([^']+)'/);
                        if (statusMatch) {
                            const status = statusMatch[1];
                            list = list.filter(i => i.status === status);
                        }
                    }
                    return { c: list.length, count: list.length };
                }
                if (query.includes('select * from webhook_config')) {
                    return store.webhook_config;
                }
                return null;
            },

            all(...params) {
                if (query.startsWith('select * from jobs')) {
                    return store.jobs.map(j => ({ ...j, skills: JSON.stringify(j.skills) }));
                }
                if (query.includes('from applications a left join jobs j')) {
                    return store.applications.map(app => {
                        const job = store.jobs.find(j => j.id === app.job_id) || {};
                        return { ...app, ...job, id: app.id, job_id: app.job_id };
                    });
                }
                if (query.startsWith('select * from recruiters')) {
                    return store.recruiters;
                }
                if (query.startsWith('select * from activity_timeline')) {
                    return [...store.activity_timeline].sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
                }
                if (query.startsWith('select * from webhook_logs')) {
                    return store.webhook_logs;
                }
                return [];
            },

            run(...params) {
                let paramsObj = params[0];

                if (query.includes('insert into users')) {
                    const id = store.users.length > 0 ? Math.max(...store.users.map(u => u.id)) + 1 : 1;
                    const newUser = { id, email: params[0], password: params[1], name: params[2], role: params[3] || 'user', created_at: new Date().toISOString() };
                    store.users.push(newUser);
                    saveData();
                    return { lastInsertRowid: id, changes: 1 };
                }

                if (query.startsWith('update users set password = ? where email = ?')) {
                    const user = store.users.find(u => u.email === params[1]);
                    if (user) { user.password = params[0]; saveData(); }
                    return { changes: user ? 1 : 0 };
                }

                if (query.startsWith('update applications set')) {
                    const id = parseInt(paramsObj ? paramsObj.id : params[params.length - 1]);
                    const app = store.applications.find(a => a.id === id);
                    if (app) {
                        if (query.includes('status = @status')) app.status = paramsObj.status;
                        if (query.includes('sent_date')) app.sent_date = paramsObj.sent_date || app.sent_date;
                        if (query.includes('response_date')) app.response_date = paramsObj.response_date || app.response_date;
                        if (query.includes('cover_letter')) app.cover_letter = paramsObj.coverLetter || app.cover_letter;
                        if (query.includes('custom_email')) app.custom_email = paramsObj.customEmail || app.custom_email;
                        if (query.includes('notes')) app.notes = paramsObj.notes || app.notes;
                        if (query.includes('cv_path')) app.cv_path = params[0];
                        saveData();
                        return { changes: 1 };
                    }
                }

                if (query.startsWith('insert into jobs')) {
                    const id = store.jobs.length + 1;
                    const job = typeof params[0] === 'object' ? { id, ...params[0] } : { id, ...params };
                    store.jobs.push(job);
                    saveData();
                    return { lastInsertRowid: id, changes: 1 };
                }

                if (query.startsWith('insert into applications')) {
                    const id = store.applications.length + 1;
                    const app = typeof params[0] === 'object' ? { id, ...params[0] } : { id, ...params };
                    store.applications.push(app);
                    saveData();
                    return { lastInsertRowid: id, changes: 1 };
                }

                if (query.startsWith('update webhook_config')) {
                    Object.assign(store.webhook_config, paramsObj);
                    saveData();
                    return { changes: 1 };
                }

                if (query.startsWith('insert into activity_timeline')) {
                    const id = store.activity_timeline.length + 1;
                    const item = typeof params[0] === 'object' ? { id, ...params[0] } : { id, ...params };
                    store.activity_timeline.unshift(item);
                    saveData();
                    return { lastInsertRowid: id, changes: 1 };
                }

                if (query.startsWith('insert into webhook_logs')) {
                    const log = { id: store.webhook_logs.length + 1, direction: params[0], event: params[1], status: params[2], details: params[3], timestamp: new Date().toISOString() };
                    store.webhook_logs.unshift(log);
                    saveData();
                    return { lastInsertRowid: log.id, changes: 1 };
                }

                return { lastInsertRowid: 0, changes: 0 };
            },

            transaction(fn) {
                return (...args) => {
                    const result = fn(...args);
                    saveData();
                    return result;
                };
            }
        };
    }
};

loadData();

function initDatabase() {
    loadData();
    // Ensure 'admin' exists with 'moha2004'
    const customUser = store.users.find(u => u.email === 'admin');
    const customSalt = bcrypt.genSaltSync(10);
    const customHash = bcrypt.hashSync('moha2004', customSalt);
    if (!customUser) {
        store.users.push({ id: store.users.length + 1, email: 'admin', password: customHash, name: 'Admin', role: 'admin', created_at: new Date().toISOString() });
    } else {
        customUser.password = customHash;
    }
    saveData();
}

module.exports = {
    init: initDatabase,
    db: dbWrapper
};
