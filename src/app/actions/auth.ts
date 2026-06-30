'use server';

import { signIn, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!name || !email || !password || password.length < 4) {
    return { success: false, error: 'Invalid input data' };
  }
  
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { success: false, error: 'Email already exists' };
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Auto-assign admin if this is the very first user
    const usersCount = await prisma.user.count();
    const role = usersCount === 0 ? 'ADMIN' : 'CLIENT';
    
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Failed to register' };
  }
}

export async function loginUser(formData: FormData) {
  try {
    const credentials = Object.fromEntries(formData.entries());
    await signIn('credentials', { ...credentials, redirectTo: '/' });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === 'CredentialsSignin') {
        return { success: false, error: 'Invalid credentials.' };
      }
      return { success: false, error: 'Something went wrong.' };
    }
    throw error; // Next.js redirect needs to bubble up
  }
}

export async function handleSignOut() {
  await signOut({ redirectTo: '/login' });
}
