import React from "react";

interface PerkCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function PerkCard({ icon, title, description }: PerkCardProps) {
  return (
    <div className="border rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}