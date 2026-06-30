import { NextResponse } from 'next/server';
import { testLibSql } from '@/app/actions/test-libsql';

export async function GET() {
  const result = await testLibSql();
  return NextResponse.json({ result });
}
