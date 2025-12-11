// Accordion.tsx
import React from 'react'
export function Accordion({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>
}
export function AccordionItem({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <details className="bg-[var(--card-bg)] rounded p-2">
      <summary className="cursor-pointer font-medium">{title}</summary>
      <div className="mt-2">{children}</div>
    </details>
  )
}
