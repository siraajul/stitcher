'use server';
import { createClient } from '@libsql/client';

export async function testLibSql() {
  const url = process.env.DATABASE_URL;
  console.log('Testing LibSQL directly in Server Action. process.env.DATABASE_URL:', url);
  try {
    const client = createClient({ url: url as string });
    const res = await client.execute('SELECT 1');
    console.log('Direct LibSQL success:', res);
    return 'success';
  } catch (e: any) {
    console.error('Direct LibSQL error:', e);
    return e.message;
  }
}
