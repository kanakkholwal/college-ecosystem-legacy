    // types/component.ts
import type { FC } from 'react';
import { z } from 'zod';
import { componentMapper } from '.';


// 🔧 Infers props from zod schema to enforce type-safety
// 1. Define helper to extract props type from Zod schema
export type SchemaProps<TSchema extends z.ZodTypeAny> = z.infer<TSchema>;

// 2. Create generic ComponentVariant type
export type ComponentVariant<TSchema extends z.ZodTypeAny = z.ZodTypeAny> = {
  id: string;
  name: string;
  component: FC<SchemaProps<TSchema>>;
  schema: z.ZodType<TSchema>;
};

// 🔧 Generic: Definition holding all variants
export type ComponentDefinition = {
  id: string;
  name: string;
  variants: Record<string, ComponentVariant<any>>;
};

// 🔧 Type-safe component mapper
export type ComponentMapperType =typeof componentMapper;

// 5. Create mapped types for instance validation
export type ComponentType = keyof ComponentMapperType;
export type VariantMap<T extends ComponentType> = ComponentMapperType[ComponentType]['variants'];
export type VariantId<T extends ComponentType> = keyof VariantMap<T>;

export type SchemaType<
  TType extends ComponentType,
  TVariant extends VariantId<TType>
> = z.infer<VariantMap<TType>[TVariant]['schema']>;

// 6. Component instance with strict props type
export type ComponentInstance<
  TType extends ComponentType = ComponentType,
  TVariant extends VariantId<TType> = VariantId<TType>
> = {
  id: string;
  type: TType;
  variant: TVariant;
  props: SchemaProps<VariantMap<TType>[TVariant]['schema']>;
};



// // 1. First, create a helper to extract config types from your component mapper
type ExtractConfigTypes<TMapper extends  ComponentMapperType> = {
  [TType in keyof TMapper]: {
    type: TType;// @ts-ignore
    variant: keyof TMapper[TType]['variants'];// @ts-ignore
    props: z.infer<TMapper[TType]['variants'][keyof TMapper[TType]['variants']]['schema']>;
  };
};

// 2. Define the main config interface 
// @ts-ignore
interface SiteConfig<TMapper extends ComponentMapper<any>> {
  layout: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    font: string;
    // Add other theme properties as needed
  };
  sections: Array<{
    id: string;
    type: keyof TMapper;
    variant: keyof TMapper[keyof TMapper]['variants'];
    props: z.infer<
      TMapper[keyof TMapper]['variants'][keyof TMapper[keyof TMapper]['variants']]['schema']
    >;
    visibility?: boolean;
    order?: number;
  }>;
  metadata?: {
    title?: string;
    description?: string;
    favicon?: string;
  };
}

// 3. Create a pre-typed version for your specific component mapper
type AppSiteConfig = SiteConfig<typeof componentMapper>;

// 4. Helper type for individual sections
// @ts-ignore
type ConfigSection<TMapper extends ComponentMapper<any>> = 
  SiteConfig<TMapper>['sections'][number];


// 6. Utility type for creating new sections
// @ts-ignore
// @ts-ignore
type NewSectionParams<TMapper extends ComponentMapper<any>, TType extends keyof TMapper> = {
  type: TType;
  variant: keyof TMapper[TType]['variants'];
  props?: Partial<
    z.infer<TMapper[TType]['variants'][keyof TMapper[TType]['variants']]['schema']>
  >;
  id?: string;
};

// Example usage of NewSectionParams
const newHeroParams: NewSectionParams<typeof componentMapper, 'hero'> = {
  type: 'hero',
  variant: 'hero-mockup',
  props: {
    title: 'New Hero Section',
  },
};