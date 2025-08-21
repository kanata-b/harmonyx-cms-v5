# HarmonyX CMS Schema Documentation

This document provides comprehensive documentation for the HarmonyX CMS database schema and TypeScript interfaces. The schema is designed to support a flexible, block-based content management system with multi-language support and advanced form handling.

## Table of Contents

- [Core Schema Overview](#core-schema-overview)
- [Content Management](#content-management)
- [Block System](#block-system)
- [Forms & Submissions](#forms--submissions)
- [Navigation System](#navigation-system)
- [AI Integration](#ai-integration)
- [System Configuration](#system-configuration)
- [GeoJSON Support](#geojson-support)
- [Common Patterns](#common-patterns)
- [Usage Examples](#usage-examples)

---

## Core Schema Overview

The main schema interface defines all collections available in the CMS:

```typescript
interface Schema {
  // AI & Content Generation
  ai_prompts: AiPrompt[];
  
  // Block Components
  block_button: BlockButton[];
  block_button_group: BlockButtonGroup[];
  block_form: BlockForm[];
  block_gallery: BlockGallery[];
  block_gallery_items: BlockGalleryItem[];
  block_hero: BlockHero[];
  block_posts: BlockPost[];
  block_pricing: BlockPricing[];
  block_pricing_cards: BlockPricingCard[];
  block_richtext: BlockRichtext[];
  
  // Forms System
  form_fields: FormField[];
  form_submission_values: FormSubmissionValue[];
  form_submissions: FormSubmission[];
  forms: Form[];
  
  // Core Content
  pages: Page[];
  posts: Post[];
  page_blocks: PageBlock[];
  
  // Navigation & Site Structure
  navigation: Navigation[];
  navigation_items: NavigationItem[];
  redirects: Redirect[];
  
  // System & Configuration
  globals: Globals;
  directus_settings: CustomDirectusSettings;
  directus_users: CustomDirectusUser;
}
```

---

## Content Management

### Pages

Pages are the main content containers that support block-based layouts:

```typescript
interface Page {
  id: string;
  sort: number | null;
  title: string | null;
  permalink: string | null;
  status: "draft" | "in_review" | "published";
  published_at: string | null;
  seo: unknown | null; // SEO metadata
  blocks: string[] | PageBlock[]; // Associated content blocks
  
  // Audit fields
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}
```

**Key Features:**
- **Block-based content**: Pages are composed of reusable content blocks
- **SEO support**: Built-in SEO metadata handling
- **Publishing workflow**: Draft → In Review → Published status flow
- **Permalink management**: Custom URL structures

### Posts

Posts represent blog entries and news articles:

```typescript
interface Post {
  id: string;
  title: string | null;
  slug: string | null;
  content: string | null; // Rich text content
  description: string | null; // Short description/excerpt
  image: string | DirectusFile<Schema> | null; // Featured image
  author: string | DirectusUser<Schema> | null;
  status: "draft" | "in_review" | "published";
  published_at: string | null;
  seo: unknown | null;
  sort: number | null;
  
  // Audit fields
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}
```

**Key Features:**
- **Author management**: Link posts to specific authors
- **Featured images**: Support for post thumbnails
- **SEO optimization**: Individual SEO settings per post
- **Publishing workflow**: Same status system as pages

---

## Block System

The CMS uses a flexible block-based content system. Each page can contain multiple blocks arranged in order.

### Page Blocks

The connector between pages and their content blocks:

```typescript
interface PageBlock {
  id: string;
  sort: number | null; // Display order
  page: string | Page | null;
  collection: "block_hero" | "block_richtext" | "block_form" | "block_posts" | "block_gallery" | "block_pricing" | null;
  item: string | BlockHero | BlockRichtext | BlockForm | BlockPost | BlockGallery | BlockPricing | null;
  hide_block: boolean | null; // Visibility toggle
  background: "light" | "dark" | null; // Theme variant
  
  // Audit fields
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}
```

### Block Types

#### Hero Block
Large banner sections with call-to-action buttons:

```typescript
interface BlockHero {
  id: string;
  headline: string | null;
  tagline: string | null;
  description: string | null;
  image: string | DirectusFile<Schema> | null;
  button_group: string | BlockButtonGroup | null;
  layout: string | null; // Layout variant
  
  // Audit fields...
}
```

#### Rich Text Block
Flexible text content with formatting:

```typescript
interface BlockRichtext {
  id: string;
  headline: string | null;
  tagline: string | null;
  content: string | null; // Rich text/HTML content
  alignment: "left" | "center" | null;
  
  // Audit fields...
}
```

#### Gallery Block
Image galleries with multiple items:

```typescript
interface BlockGallery {
  id: string;
  headline: string | null;
  tagline: string | null;
  items: string[] | BlockGalleryItem[]; // Gallery images
  
  // Audit fields...
}

interface BlockGalleryItem {
  id: string;
  block_gallery: string | BlockGallery | null;
  directus_file: string | DirectusFile<Schema> | null;
  sort: number | null; // Display order
  
  // Audit fields...
}
```

#### Pricing Block
Pricing tables and plans:

```typescript
interface BlockPricing {
  id: string;
  headline: string | null;
  tagline: string | null;
  pricing_cards: string[] | BlockPricingCard[];
  
  // Audit fields...
}

interface BlockPricingCard {
  id: string;
  title: string | null;
  description: string | null;
  price: string | null;
  badge: string | null; // "Popular", "Best Value", etc.
  features: unknown | null; // Array of features
  button: string | BlockButton | null;
  is_highlighted: boolean | null; // Featured plan
  sort: number | null;
  
  // Audit fields...
}
```

#### Posts Block
Display lists of blog posts:

```typescript
interface BlockPost {
  id: string;
  headline: string | null;
  tagline: string | null;
  collection: "posts" | null;
  limit: number | null; // Number of posts to show
  
  // Audit fields...
}
```

#### Button System
Flexible button components with multiple link types:

```typescript
interface BlockButton {
  id: string;
  label: string | null;
  type: "page" | "post" | "url" | null;
  variant: "default" | "outline" | "soft" | "ghost" | "link" | null;
  
  // Link targets (one of these based on type)
  page: string | Page | null;
  post: string | Post | null;
  url: string | null;
  
  button_group: string | BlockButtonGroup | null;
  sort: number | null;
  
  // Audit fields...
}

interface BlockButtonGroup {
  id: string;
  buttons: string[] | BlockButton[];
  sort: number | null;
  
  // Audit fields...
}
```

---

## Forms & Submissions

Advanced form builder with field validation and submission handling.

### Forms

```typescript
interface Form {
  id: string;
  title: string | null;
  submit_label: string | null; // Button text
  is_active: boolean | null;
  
  // Success handling
  on_success: "redirect" | "message" | null;
  success_message: string | null;
  success_redirect_url: string | null;
  
  // Email notifications
  emails: Array<{
    to: unknown;
    subject: string;
    message: string;
  }> | null;
  
  fields: string[] | FormField[]; // Form fields
  submissions: string[] | FormSubmission[]; // Received submissions
  sort: number | null;
  
  // Audit fields...
}
```

### Form Fields

```typescript
interface FormField {
  id: string;
  form: string | Form | null;
  name: string | null; // Field identifier
  type: string | null; // Input type (text, email, select, etc.)
  label: string | null; // Display label
  placeholder: string | null;
  help: string | null; // Help text
  validation: string | null; // Validation rules
  required: boolean | null;
  width: "100" | "67" | "50" | "33" | null; // Grid width percentage
  choices: Array<{
    text: string;
    value: string;
  }> | null; // For select/radio fields
  sort: number | null;
  
  // Audit fields...
}
```

### Form Submissions

```typescript
interface FormSubmission {
  id: string;
  form: string | Form | null;
  timestamp: string | null;
  values: string[] | FormSubmissionValue[]; // Field values
}

interface FormSubmissionValue {
  id: string;
  form_submission: string | FormSubmission | null;
  field: string | FormField | null;
  value: string | null; // The submitted value
  file: string | DirectusFile<Schema> | null; // For file uploads
  timestamp: string | null;
  sort: number | null;
}
```

---

## Navigation System

Hierarchical navigation with multiple link types.

### Navigation

```typescript
interface Navigation {
  id: string;
  title: string | null; // Navigation menu name
  is_active: boolean | null;
  items: string[] | NavigationItem[];
  
  // Audit fields...
}
```

### Navigation Items

```typescript
interface NavigationItem {
  id: string;
  navigation: string | Navigation | null;
  title: string | null; // Display text
  type: "page" | "post" | "url" | "group" | null;
  
  // Link targets (based on type)
  page: string | Page | null;
  post: string | Post | null;
  url: string | null;
  
  // Hierarchy
  parent: string | NavigationItem | null;
  children: string[] | NavigationItem[];
  sort: number | null;
  
  // Audit fields...
}
```

**Key Features:**
- **Multi-level hierarchy**: Support for nested navigation items
- **Flexible linking**: Link to pages, posts, external URLs, or create groups
- **Multiple menus**: Different navigation menus for different areas

---

## AI Integration

Built-in AI prompt management for content generation.

```typescript
interface AiPrompt {
  id: string;
  name: string | null; // Prompt name/identifier
  description: string | null;
  status: "draft" | "in_review" | "published";
  system_prompt: string | null; // System-level instructions
  messages: unknown | null; // Conversation history
  sort: number | null;
  
  // Audit fields...
}
```

**Use Cases:**
- Content generation templates
- SEO optimization prompts
- Translation assistance
- Content improvement suggestions

---

## System Configuration

### Global Settings

Site-wide configuration and branding:

```typescript
interface Globals {
  id: string;
  title: string | null; // Site title
  tagline: string | null; // Site tagline
  description: string | null; // Site description
  url: string | null; // Base URL
  
  // Branding
  logo: string | DirectusFile<Schema> | null;
  logo_dark_mode: string | DirectusFile<Schema> | null;
  favicon: string | DirectusFile<Schema> | null;
  accent_color: string | null; // Brand color
  
  // Integrations
  social_links: unknown | null; // Social media links
  openai_api_key: string | null; // AI integration
  directus_url: string | null; // CMS URL
  
  // Audit fields...
}
```

### URL Redirects

```typescript
interface Redirect {
  id: string;
  url_from: string | null; // Source URL
  url_to: string | null; // Target URL
  response_code: string | null; // HTTP status (301, 302, etc.)
  note: string | null; // Admin note
  
  // Audit fields...
}
```

---

## GeoJSON Support

The schema includes comprehensive GeoJSON type definitions for location-based features:

```typescript
// Basic geometry types
interface GeoJSONPoint {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: Array<Array<[number, number]>>;
}

// Collection types
interface GeoJSONGeometryCollection {
  type: "GeometryCollection";
  geometries: Array<
    GeoJSONPoint | GeoJSONLineString | GeoJSONPolygon | 
    GeoJSONMultiPoint | GeoJSONMultiLineString | GeoJSONMultiPolygon
  >;
}
```

---

## Common Patterns

### Audit Fields

All entities include standard audit fields:

```typescript
interface AuditFields {
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}
```

### Status Workflow

Content items use a three-stage publishing workflow:

```typescript
type ContentStatus = "draft" | "in_review" | "published";
```

### Relationships

Relationships can be represented as either IDs or full objects:

```typescript
// Can be just the ID
page: string | null;

// Or the full related object
page: string | Page | null;

// Arrays work the same way
blocks: string[] | PageBlock[];
```

---

## Usage Examples

### Creating a New Page with Blocks

```typescript
// Create a page
const page: Page = {
  id: "new-page-id",
  title: "Welcome to Our Site",
  permalink: "/welcome",
  status: "draft",
  published_at: null,
  blocks: [], // Will be populated with PageBlock references
  // ... audit fields
};

// Create a hero block
const heroBlock: BlockHero = {
  id: "hero-1",
  headline: "Welcome to HarmonyX",
  tagline: "Build amazing websites",
  description: "The ultimate CMS for modern websites",
  image: "hero-image-id",
  button_group: "cta-buttons-id",
  // ... audit fields
};

// Connect the block to the page
const pageBlock: PageBlock = {
  id: "page-block-1",
  page: page.id,
  collection: "block_hero",
  item: heroBlock.id,
  sort: 1,
  hide_block: false,
  background: "light",
  // ... audit fields
};
```

### Building a Navigation Menu

```typescript
const mainNav: Navigation = {
  id: "main-nav",
  title: "Main Navigation",
  is_active: true,
  items: [
    {
      id: "nav-home",
      title: "Home",
      type: "page",
      page: "home-page-id",
      sort: 1,
      // ... other fields
    },
    {
      id: "nav-about",
      title: "About",
      type: "url",
      url: "/about",
      sort: 2,
      // ... other fields
    }
  ],
  // ... audit fields
};
```

### Creating a Contact Form

```typescript
const contactForm: Form = {
  id: "contact-form",
  title: "Contact Us",
  submit_label: "Send Message",
  is_active: true,
  on_success: "message",
  success_message: "Thank you for your message!",
  emails: [{
    to: "admin@example.com",
    subject: "New Contact Form Submission",
    message: "A new message has been received."
  }],
  fields: [
    {
      id: "name-field",
      name: "name",
      type: "text",
      label: "Full Name",
      required: true,
      width: "50",
      sort: 1,
      // ... other fields
    },
    {
      id: "email-field",
      name: "email",
      type: "email",
      label: "Email Address",
      required: true,
      width: "50",
      sort: 2,
      // ... other fields
    }
  ],
  // ... audit fields
};
```

---

## File Location

The complete schema definitions can be found in:
```
apps/cms/lib/directus/directus-schemas.ts
```

This file serves as the single source of truth for all TypeScript interfaces used throughout the CMS application.

---

## Contributing

When modifying the schema:

1. Update the TypeScript interfaces in `directus-schemas.ts`
2. Update this documentation
3. Run type checking to ensure consistency
4. Update any related query functions in `directus-queries.ts`

---

*Last updated: August 2025*
