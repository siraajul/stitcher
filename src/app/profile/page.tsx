import { auth } from '@/auth';
import { handleSignOut } from '@/app/actions/auth';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="w-full px-6 pt-8 pb-12 md:-mt-24 md:pt-36 bg-gradient-to-b from-rose-950 via-rose-900 to-zinc-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">My Profile</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto p-6 md:p-12 -mt-8">
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-900 text-3xl font-bold">
              {session.user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{session.user.name}</h2>
              <p className="text-gray-500 mb-2">{session.user.email}</p>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase rounded-full tracking-wider">
                Role: {session.user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h3>
          <form action={handleSignOut}>
            <button className="w-full md:w-auto bg-red-50 text-red-600 hover:bg-red-100 font-bold py-3 px-8 rounded-xl transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
