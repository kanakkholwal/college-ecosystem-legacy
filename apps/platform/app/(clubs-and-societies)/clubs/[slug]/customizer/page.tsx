// app/clubs/[slug]/customizer/page.tsx
'use client';

import { componentMapper, ComponentRenderer, } from '@/components/clubs/layouts';
import { ComponentType } from '@/components/clubs/layouts/types';
import { HeaderBar } from '@/components/common/header-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Search } from 'lucide-react';
import { useState } from 'react';
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
        ctaText: 'Join Us',
        ctaLink: '#signup',
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
      <HeaderBar
      Icon={Code}
        titleNode="Club Customizes"
        descriptionNode="Customize your club's page layout and content."
        actionNode={
          <Button size="sm" onClick={() => setConfig(defaultConfig)}>
            Reset to Default
          </Button>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6 p-6">
        <div className="lg:w-1/2 w-full space-y-4">
          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="ui_components">UI Components</TabsTrigger>
              <TabsTrigger value="theme_settings">Theme Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              {/* {config.sections.map(section => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  onChange={updateSectionProps}
                />
              ))} */}
            </TabsContent>
            <TabsContent value="theme_settings">
                
            </TabsContent>
            <TabsContent value="ui_components" className="h-full">
                <div className="flex h-[600px] gap-4">
                    {/* Component Library */}
                    <div className="w-1/3 border rounded-lg overflow-hidden">
                    <div className="p-4 border-b">
                        <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search components..."
                            className="pl-10"
                            // Add search functionality
                        />
                        </div>
                    </div>
                
                    </div>

                    {/* Current Components List */}
                    <div className="w-2/3 border rounded-lg overflow-hidden">
                    <div className="p-4 border-b">
                        <h3 className="font-medium">Current Layout</h3>
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
                </div>
                </TabsContent>
          </Tabs>
        </div>

        <div className="lg:w-1/2 w-full">
          <h1 className="text-xl font-bold mb-2">Live Preview</h1>
          <div className="border rounded-xl p-4 bg-white shadow">
            {config.sections.map(section => (
              <ComponentRenderer
                key={section.id}
                type={section.type as keyof typeof componentMapper}
                variant={section.variant as keyof typeof componentMapper[keyof typeof componentMapper]['variants']}
                props={section.props as typeof componentMapper[keyof typeof componentMapper]['variants'][keyof typeof componentMapper[keyof typeof componentMapper]['variants']]['schema']['_output']}
              />
            ))}
          </div>
        </div>
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
// interface SectionEditorProps<TMapper extends ComponentMapperType > {
//   section: ComponentInstance<TMapper>;
//   onChange: (
//     sectionId: string,
//     newProps: ComponentInstance<TMapper>['props']
//   ) => void;
//   className?: string;
// }

// function SectionEditor<TMapper extends ComponentMapperType>({
//   section,
//   onChange,
//   className,
// }: SectionEditorProps<TMapper>) {
//   const schema = componentMapper[section.type].variants[section.variant].schema;
  
//   const form = useForm<z.infer<typeof schema>>({
//     resolver: zodResolver(schema),
//     defaultValues: section.props,
//   });

//   const handleSubmit = form.handleSubmit((values) => {
//     onChange(section.id, values);
//   });

//   return (
//     <div className={cn('space-y-4 p-4 border rounded-lg', className)}>
//       <h3 className="font-medium">
//         {componentMapper[section.type].name} -{' '}
//         {componentMapper[section.type].variants[section.variant].name}
//       </h3>
      
//       <Form {...form}>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {Object.entries(schema.shape).map(([fieldName, fieldSchema]) => (
//             <FormField
//               key={fieldName}
//               control={form.control}
//               name={fieldName}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="capitalize">
//                     {fieldName.replace(/([A-Z])/g, ' $1').trim()}
//                   </FormLabel>
//                   <FormControl>
//                     {renderFormControl(fieldName, fieldSchema, field)}
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           ))}
//           <Button type="submit" size="sm">
//             Update Section
//           </Button>
//         </form>
//       </Form>
//     </div>
//   );
// }

// function renderFormControl(
//   fieldName: string,
//   schema: z.ZodTypeAny,
//   field: any
// ) {
//   switch (schema._def.typeName) {
//     case 'ZodString':
//       return fieldName.toLowerCase().includes('description') ? (
//         <Textarea {...field} />
//       ) : (
//         <Input {...field} />
//       );
//     case 'ZodBoolean':
//       return <Switch checked={field.value} onCheckedChange={field.onChange} />;
//     case 'ZodNumber':
//       return <Input type="number" {...field} />;
//     case 'ZodArray':
//       return (
//         <div className="space-y-2">
//           {/* Implement array editor based on your needs */}
//           <Button
//             type="button"
//             variant="outline"
//             size="sm"
//             onClick={() => {/* Add item logic */}}
//           >
//             Add Item
//           </Button>
//         </div>
//       );
//     default:
//       return <Input {...field} />;
//   }
// }