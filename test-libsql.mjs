import { createClient } from '@libsql/client';

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
console.log('dbUrl is:', dbUrl);

try {
  const db = createClient({ url: dbUrl });
  const result = await db.execute('SELECT 1');
  console.log('Success:', result.rows);
} catch (e) {
  console.error('Error:', e.message);
}
