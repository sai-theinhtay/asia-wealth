import React from 'react';

export default function RoleBadge({ role }: { role?: string | null }) {
  if (!role) return null;
  const color = role === 'owner' ? 'bg-amber-500' : role === 'admin' ? 'bg-indigo-500' : role === 'repair_staff' ? 'bg-rose-500' : 'bg-green-500';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-white ${color}`}>
      {role}
    </span>
  );
}
