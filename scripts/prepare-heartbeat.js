// Script to replace environment variables in heartbeat.html during build
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Load environment variables
dotenv.config({ path: join(rootDir, '.env') });
dotenv.config({ path: join(rootDir, '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️  Warning: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env');
  console.warn('   heartbeat.html will not work without these values!');
}

// Read heartbeat.html template
const heartbeatPath = join(rootDir, 'heartbeat.html');
let content = readFileSync(heartbeatPath, 'utf-8');

// Replace placeholders with actual values
content = content
  .replace('__VITE_SUPABASE_URL__', SUPABASE_URL)
  .replace('__VITE_SUPABASE_ANON_KEY__', SUPABASE_ANON_KEY);

// Write to build directory
const buildHeartbeatPath = join(rootDir, 'build', 'heartbeat.html');
writeFileSync(buildHeartbeatPath, content, 'utf-8');

console.log('✅ heartbeat.html prepared successfully!');
console.log(`   Written to: ${buildHeartbeatPath}`);
console.log(`   SUPABASE_URL: ${SUPABASE_URL ? '✓ Set' : '✗ Missing'}`);
console.log(`   SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}`);
