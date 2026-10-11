import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="bg-background-dark border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ol className="flex items-center gap-2 py-3 font-mono text-xs uppercase tracking-wider overflow-x-auto">
          <li>
            <Link href="/" className="text-gray-400 hover:text-primary transition-colors whitespace-nowrap">
              Home
            </Link>
          </li>
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-gray-600 select-none">/</span>
              {item.href ? (
                <Link href={item.href} className="text-gray-400 hover:text-primary transition-colors whitespace-nowrap">
                  {item.label}
                </Link>
              ) : (
                <span className="text-primary font-bold whitespace-nowrap">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
