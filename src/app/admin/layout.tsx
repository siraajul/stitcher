export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 flex flex-col font-sans md:-mt-24">
      <main className="flex-1 p-4 pt-24 md:p-10 md:pt-32 lg:p-12 lg:pt-32 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
