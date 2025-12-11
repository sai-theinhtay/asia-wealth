import React from "react";

type PageContainerProps = {
  title?: string;
  children: React.ReactNode;
};

export default function PageContainer({ title, children }: PageContainerProps) {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto">
        {title && (
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">{title}</h2>
          </div>
        )}
        <div className="bg-white rounded-lg shadow p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
