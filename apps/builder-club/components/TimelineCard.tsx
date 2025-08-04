
interface TimelineCardProps {
  week: number;
  title: string;
  description: string;
}

export default function TimelineCard({ week, title, description }: TimelineCardProps) {
  return (
    <div className="flex flex-col items-center text-center hover:scale-[1.02] transition-transform">
      <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
        <span className="text-white text-xl font-bold">W{week}</span>
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}