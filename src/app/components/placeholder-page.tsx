import { LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export function PlaceholderPage({ title, description, icon: Icon }: PlaceholderPageProps) {
  return (
    <div className="min-h-full flex items-center justify-center p-8 bg-gray-50">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" 
             style={{ backgroundColor: 'var(--musikkii-blue)' }}>
          <Icon className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-semibold mb-4">{title}</h1>
        <p className="text-gray-600 text-lg mb-8">{description}</p>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500">
            This page is part of the Musikkii Portal design system. All navigation items share the same 
            layout and design language while displaying role-specific content.
          </p>
        </div>
      </div>
    </div>
  );
}
