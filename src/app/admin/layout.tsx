import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-serif text-lg font-bold text-blair-midnight">
              blair admin
            </Link>
            <div className="flex gap-4">
              <Link href="/admin" className="text-sm text-gray-600 hover:text-gray-900">
                Customers
              </Link>
              <Link href="/admin/reviews" className="text-sm text-gray-600 hover:text-gray-900">
                Pending Reviews
              </Link>
            </div>
          </div>
          <span className="text-xs text-gray-400">Internal</span>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
