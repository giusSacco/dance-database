#!/usr/bin/env node
// Uso: node scripts/backup-to-default.js .backups/dance_db_backup_XXXX.json

const fs = require('fs');
const path = require('path');

const backupPath = process.argv[2];
if (!backupPath) {
    console.error('Uso: node scripts/backup-to-default.js <percorso-backup.json>');
    process.exit(1);
}

const moves = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

const bachata = moves.filter(m => m.type === 'bachata');
const salsa   = moves.filter(m => m.type === 'salsa');
const rueda   = moves.filter(m => m.type === 'rueda');

const today = new Date().toISOString().split('T')[0];

const output =
`// Auto-generated from backup
// Last updated: ${today}

export const bachataMoves = ${JSON.stringify(bachata, null, 2)};

export const salsaMoves = ${JSON.stringify(salsa, null, 2)};

export const ruedaMoves = ${JSON.stringify(rueda, null, 2)};
`;

const outPath = path.join(__dirname, '../js/data/default-moves.js');
fs.writeFileSync(outPath, output);

console.log(`✓ default-moves.js aggiornato (${bachata.length} bachata, ${salsa.length} salsa, ${rueda.length} rueda)`);
