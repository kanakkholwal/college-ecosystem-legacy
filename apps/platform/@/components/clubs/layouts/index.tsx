
import { z } from 'zod';
// components
import EventsGrid from './blocks/events_grid';
import HeroMockup from './blocks/hero_mockup';
import { ComponentDefinition, ComponentType, ComponentVariant, SchemaProps, VariantId, VariantMap } from './types';

export const componentMapper = {
  hero: {
    id: 'hero',
    name: 'Hero Section',
    variants: {
      'hero-mockup': {
        id: 'hero-mockup',
        name: 'Hero Mockup',
        component: HeroMockup,
        schema: z.object({
          title: z.string().min(1),
          description: z.string().min(1),
        }),
        defaultValues: {
          title: 'Welcome to Our Club',
          description: 'Join us for exciting events and activities!',
        },
      },

    },
  },
  about: {
    id: 'about',
    name: 'About Section',
    variants: {

    },
  },
  events: {
    id: 'events',
    name: 'Events Section',
    variants: {

      'events-grid': {
        id: 'events-grid',
        name: 'Events Grid View',
        component: EventsGrid,
        schema: z.object({
          events: z.array(
            z.object({
              id: z.string(),
              title: z.string(),
              description: z.string(),
            
            })
          ),
        }),
        defaultValues:{
          events: [
            {
              id: '1',
              title: 'Sample Event 1',
              description: 'This is a sample event description.',
            },
            {
              id: '2',
              title: 'Sample Event 2',
              description: 'This is another sample event description.',
            },
          ],

        }
      },
    },
  },
} as const satisfies Record<string, ComponentDefinition>;



// 7. Type-safe render function
export function ComponentRenderer<
  TType extends ComponentType,
  TVariant extends VariantId<TType>
>({
  type,
  variant,
  props,
}: {
  type: TType;
  variant: TVariant;
  props: SchemaProps<VariantMap<TType>[TVariant]['schema']>;
}) {
  const def = componentMapper[type]?.variants[variant] as ComponentVariant<any>;
  if (!def) return <div className="text-red-500">Unknown component variant</div>;

  const parsed = def.schema.safeParse(props);
  if (!parsed.success) {
    console.log(`⚠️⚠️ Invalid props for ${type} - ${variant} ⚠️⚠️ :`, parsed.error);
    return <div className="text-red-500">Invalid props</div>;
  }

  const Component = def.component;
  return <Component {...parsed.data} />;
}
