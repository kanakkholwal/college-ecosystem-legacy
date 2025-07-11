// app/clubs/[slug]/customizer/page.tsx
'use client';

import { componentMapper, ComponentRenderer, } from '@/components/clubs/layouts';
import { ComponentInstance, ComponentMapperType, ComponentType } from '@/components/clubs/layouts/types';
import { ThemeSwitcher } from '@/components/common/theme-switcher';
import { ApplicationSquareLogo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const defaultConfig = {
  layout: 'layout-one',
  theme: {
    primaryColor: '#1e293b',
    secondaryColor: '#facc15',
    font: 'font-sans',
  },
  sections: [
    {
      id: 'hero1',
      type: 'hero',
      variant: 'hero-mockup',
      props: {
        title: 'Welcome to Our Club',
        description: 'We build cool things and host events.',
      },
    },
    {
      id: 'events1',
      type: 'events',
      variant: 'events-grid',
      props: {
        events: [
          {
            id: '1',
            title: 'Hackathon',
            description: '24-hour coding event',
            date: '2023-11-01',
          },
        ],
      },
    },
  ],
};

export default function ClubCustomizePage() {
  const [config, setConfig] = useState(defaultConfig);

  const updateSectionProps = (sectionId: string, newProps: any) => {
    setConfig(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, props: newProps } : section
      ),
    }));
  };

  return (
    <div className="min-h-screen">
      <div className='sticky top-0 z-10000 w-full bg-card py-2 px-4 h-12 inline-flex items-center gap-2'>
        <Link href="dashboard" >
          <ApplicationSquareLogo className='size-7' />
        </Link>
        <div>
          <h3 className="text-sm font-medium">
            Club Customizes
          </h3>
          <p className="text-muted-foreground text-xs font-normal">
            Customize your club's page layout and content.
          </p>
        </div>
        <div className="ml-auto inline-flex items-center gap-2">
          <Button size="sm" variant="default_light" onClick={() => setConfig(defaultConfig)}>
            Reset to Default
          </Button>
          <ThemeSwitcher />
        </div>

      </div>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 w-full h-full'>
        <main className='lg:col-span-8'>
          <div className="text-base font-medium py-1.5 px-3 mb-2 bg-card rounded-lg">Live Preview</div>
          <div className="rounded-xl p-2 border border-dotted border-primary shadow">
            {config.sections.map(section => (
              <ComponentRenderer
                key={section.id}
                type={section.type as keyof typeof componentMapper}
                variant={section.variant as keyof typeof componentMapper[keyof typeof componentMapper]['variants']}
                props={section.props as typeof componentMapper[keyof typeof componentMapper]['variants'][keyof typeof componentMapper[keyof typeof componentMapper]['variants']]['schema']['_output']}
              />
            ))}
          </div>
        </main>
        <aside className='lg:col-span-4'>
          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="ui_components">UI Components</TabsTrigger>
              <TabsTrigger value="theme_settings">Theme Settings</TabsTrigger>
            </TabsList>
            <div className='bg-card rounded-lg'>
              <TabsContent value="content">
                {config.sections.map(section => (
                  <SectionEditor
                    key={section.id}
                    // @ts-ignore
                    section={section}
                    onChange={updateSectionProps}
                  />
                ))}
              </TabsContent>
              <TabsContent value="theme_settings" className='p-3'>
                  <h5 className='text-base text-primary'>
                    Not Implemented
                  </h5>
              </TabsContent>
              <TabsContent value="ui_components" className="h-full">
                {/* Component Library */}
                <div className="rounded-lg overflow-hidden">
                  <div className="p-4 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search components to add ..."
                        className="pl-10"
                      // Add search functionality
                      />
                    </div>
                  </div>

                </div>

                {/* Current Components List */}
                <div className="">
                  <div className="p-4 border-b">
                    <h3 className="font-medium text-sm">Current Layout</h3>
                  </div>
                  <ScrollArea className="h-[540px] p-4">
                    <div className="space-y-4">
                      {config.sections.map((section, index) => (
                        <div
                          key={section.id}
                          className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium">
                                {componentMapper[section.type as ComponentType].name}
                                <span className="text-muted-foreground"> - </span>
                                {/* @ts-ignore */}
                                {componentMapper[section.type as ComponentType].variants[section.variant as keyof typeof componentMapper[ComponentType]['variants']]?.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {section.id}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Move up
                                  if (index > 0) {
                                    const newSections = [...config.sections];
                                    [newSections[index], newSections[index - 1]] = [
                                      newSections[index - 1],
                                      newSections[index],
                                    ];
                                    setConfig(prev => ({ ...prev, sections: newSections }));
                                  }
                                }}
                                disabled={index === 0}
                              >
                                ↑
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Move down
                                  if (index < config.sections.length - 1) {
                                    const newSections = [...config.sections];
                                    [newSections[index], newSections[index + 1]] = [
                                      newSections[index + 1],
                                      newSections[index],
                                    ];
                                    setConfig(prev => ({ ...prev, sections: newSections }));
                                  }
                                }}
                                disabled={index === config.sections.length - 1}
                              >
                                ↓
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // Duplicate
                                  const newSection = {
                                    ...section,
                                    id: `${section.type}-${Date.now()}`,
                                  };
                                  setConfig(prev => ({
                                    ...prev,
                                    sections: [
                                      ...prev.sections.slice(0, index + 1),
                                      newSection,
                                      ...prev.sections.slice(index + 1),
                                    ],
                                  }));
                                }}
                              >
                                Copy
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => {
                                  // Remove
                                  setConfig(prev => ({
                                    ...prev,
                                    sections: prev.sections.filter(s => s.id !== section.id),
                                  }));
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>

                          {/* Variant selector */}
                          <div className="mt-2">
                            <Select
                              value={section.variant}
                              onValueChange={(newVariant) => {
                                // @ts-ignore
                                const variantDef = componentMapper[section.type].variants[newVariant as keyof typeof componentMapper[typeof section.type]['variants']];
                                setConfig(prev => ({
                                  ...prev,
                                  sections: prev.sections.map(s =>
                                    s.id === section.id
                                      ? {
                                        ...s,
                                        variant: newVariant,
                                        props: getDefaultValues(variantDef.schema),
                                      }
                                      : s
                                  ),
                                }));
                              }}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select variant" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(
                                  componentMapper[section.type as keyof typeof componentMapper].variants
                                ).map(([id, variant]) => (
                                  <SelectItem key={id} value={id}>
                                    {id}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </aside>

      </div>


    </div>
  );
}


function getDefaultValues(schema: z.ZodTypeAny): any {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    return Object.fromEntries(
      Object.entries(shape).map(([key, value]) => [
        key,
        // @ts-ignore
        getDefaultValues(value),
      ])
    );
  }
  if (schema instanceof z.ZodString) return "";
  if (schema instanceof z.ZodNumber) return 0;
  if (schema instanceof z.ZodBoolean) return false;
  if (schema instanceof z.ZodArray) return [];
  if (schema instanceof z.ZodDefault) return schema._def.defaultValue();
  return null;
}
interface SectionEditorProps<TMapper extends keyof ComponentMapperType> {
  section: ComponentInstance<TMapper>;
  onChange: (
    sectionId: string,
    newProps: ComponentInstance<TMapper>['schema']
  ) => void;
  className?: string;
}

function SectionEditor<TMapper extends keyof ComponentMapperType>({
  section,
  onChange,
  className,
}: SectionEditorProps<TMapper>) {

  const form = useForm<z.infer<typeof section.schema>>({
    resolver: zodResolver(section.schema),
    defaultValues: section.defaultValues,
  });

  const handleSubmit = form.handleSubmit((values) => {
    onChange(section.id, values);
  });

  return (
    <div className={cn('space-y-4 p-4 border rounded-lg', className)}>
      <h3 className="font-medium">
        {componentMapper[section.type].name} -{' '}
        {section.id}
      </h3>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* {(Object.entries(section.defaultValues)
          .filter(([fieldName]) =>
              fieldName !== undefined && fieldName !== null
        )).map(([fieldName, fieldSchema]) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {fieldName.replace(/([A-Z])/g, ' $1').trim()}
                  </FormLabel>
                  <FormControl>
                    {renderFormControl(fieldName, section.schema[fieldName], field)}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))} */}
          <Button type="submit" size="sm">
            Update Section
          </Button>
        </form>
      </Form>
    </div>
  );
}

function renderFormControl(
  fieldName: string,
  schema: z.ZodTypeAny,
  field: any
) {
  switch (schema._def.typeName) {
    case 'ZodString':
      return fieldName.toLowerCase().includes('description') ? (
        <Textarea {...field} />
      ) : (
        <Input {...field} />
      );
    case 'ZodBoolean':
      return <Switch checked={field.value} onCheckedChange={field.onChange} />;
    case 'ZodNumber':
      return <Input type="number" {...field} />;
    case 'ZodArray':
      return (
        <div className="space-y-2">
          {/* Implement array editor based on your needs */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {/* Add item logic */ }}
          >
            Add Item
          </Button>
        </div>
      );
    default:
      return <Input {...field} />;
  }
}