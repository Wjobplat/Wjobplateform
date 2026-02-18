const { db } = require('./database');
const bcrypt = require('bcryptjs');

const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || 'Utilisateur';

if (!email || !password) {
    console.log('Usage: node add-user.js <email> <password> [name]');
    process.exit(1);
}

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync(password, salt);

try {
    db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)').run(email, hash, name);
    console.log(`✅ Utilisateur ajouté avec succès : ${email}`);
} catch (e) {
    console.error('❌ Erreur lors de la création de l\'utilisateur :', e.message);
}
