import { signIn } from './src/auth';

async function main() {
  const formData = new FormData();
  formData.append('email', 'admin@sticher.com');
  formData.append('password', 'password123');

  try {
    await signIn('credentials', formData);
  } catch (e: any) {
    console.log(e.name, e.message);
  }
}
main()
