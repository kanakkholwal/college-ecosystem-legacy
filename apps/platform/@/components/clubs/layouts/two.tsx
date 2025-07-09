import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { ClubComponentData, ClubSections, ClubTheme } from '~/types/clubs';

interface LayoutProps {
  theme: ClubTheme;
  componentsData: ClubComponentData;
  sections: ClubSections;
}

export function LayoutTwo({ theme, componentsData, sections }: LayoutProps) {
  return (
    <div className={cn('space-y-8', theme.font)} style={{ backgroundColor: theme.secondaryColor }}>
      {sections.visibility.hero && (
        <motion.section
          className="p-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold text-white drop-shadow-md">
            {componentsData.hero?.title}
          </h1>
          <p className="mt-3 text-white/90 max-w-xl mx-auto">
            {componentsData.hero?.description}
          </p>
        </motion.section>
      )}

      {sections.visibility.about && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="mx-6">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold">{componentsData.about?.title}</h2>
              <p className="mt-2 text-gray-700">{componentsData.about?.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {sections.visibility.events && (
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {componentsData.events?.events?.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="bg-white">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                  <p className="text-sm mt-1">{event.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.section>
      )}
    </div>
  );
}
