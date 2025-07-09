// components/templates/layout-one.tsx
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { ClubTheme, ClubComponentData, ClubSections } from '~/types/clubs';

interface LayoutProps {
  theme: ClubTheme;
  componentsData: ClubComponentData;
  sections: ClubSections;
}

export function LayoutOne({ theme, componentsData, sections }: LayoutProps) {
  return (
    <div className={cn(theme.font)} style={{ backgroundColor: theme.primaryColor }}>
      {sections.visibility.hero && (
        <motion.section
          className="p-8 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">{componentsData.hero?.title}</h1>
          <p className="text-lg mt-2">{componentsData.hero?.description}</p>
        </motion.section>
      )}

      {sections.visibility.about && (
        <motion.section
          className="p-8 bg-white text-black"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold">{componentsData.about?.title}</h2>
          <p className="mt-2">{componentsData.about?.description}</p>
        </motion.section>
      )}

      {sections.visibility.events && (
        <motion.section
          className="p-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold">Upcoming Events</h2>
          <div className="mt-4 space-y-3">
            {componentsData.events?.events?.map((event, idx) => (
              <motion.div
                key={idx}
                className="bg-white text-black p-4 rounded shadow"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="font-bold">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.date}</p>
                <p className="mt-1">{event.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}

