import type { DirectusUser, DirectusFile } from "@directus/sdk";

export interface Schema {
  ai_prompts: AiPrompt[];
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
  form_fields: FormField[];
  form_submission_values: FormSubmissionValue[];
  form_submissions: FormSubmission[];
  forms: Form[];
  globals: Globals;
  navigation: Navigation[];
  navigation_items: NavigationItem[];
  page_blocks: PageBlock[];
  pages: Page[];
  posts: Post[];
  redirects: Redirect[];
  directus_settings: CustomDirectusSettings;
  directus_users: CustomDirectusUser;
}

export interface AiPrompt {
  id: string;
  sort: number | null;
  name: string | null;
  status: "draft" | "in_review" | "published";
  description: string | null;
  messages: unknown | null;
  system_prompt: string | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}

export interface BlockButton {
  id: string;
  sort: number | null;
  type: "page" | "post" | "url" | null;
  page: string | Page | null;
  post: string | Post | null;
  label: string | null;
  variant: "default" | "outline" | "soft" | "ghost" | "link" | null;
  button_group: string | BlockButtonGroup | null;
  url: string | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}

export interface BlockButtonGroup {
  id: string;
  sort: number | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
  buttons: string[] | BlockButton[];
}

export interface BlockForm {
  id: string;
  form: string | Form | null;
  headline: string | null;
  tagline: string | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}

export interface BlockGallery {
  headline: string | null;
  id: string;
  tagline: string | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
  items: string[] | BlockGalleryItem[];
}

export interface BlockGalleryItem {
  id: string;
  block_gallery: string | BlockGallery | null;
  directus_file: string | DirectusFile<Schema> | null;
  sort: number | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}

export interface BlockHero {
  headline: string | null;
  id: string;
  image: string | DirectusFile<Schema> | null;
  button_group: string | BlockButtonGroup | null;
  description: string | null;
  tagline: string | null;
  layout: string | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}

export interface BlockPost {
  id: string;
  headline: string | null;
  collection: "posts" | null;
  tagline: string | null;
  limit: number | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}

export interface BlockPricing {
  id: string;
  headline: string | null;
  tagline: string | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
  pricing_cards: string[] | BlockPricingCard[];
}

export interface BlockPricingCard {
  id: string;
  title: string | null;
  description: string | null;
  price: string | null;
  badge: string | null;
  features: unknown | null;
  button: string | BlockButton | null;
  pricing: string | BlockPricing | null;
  is_highlighted: boolean | null;
  sort: number | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}

export interface BlockRichtext {
  content: string | null;
  headline: string | null;
  id: string;
  alignment: "left" | "center" | null;
  tagline: string | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}

export interface FormField {
  id: string;
  name: string | null;
  type: string | null;
  label: string | null;
  placeholder: string | null;
  help: string | null;
  validation: string | null;
  width: "100" | "67" | "50" | "33" | null;
  choices: Array<{ text: string; value: string }> | null;
  form: string | Form | null;
  sort: number | null;
  required: boolean | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}

export interface FormSubmissionValue {
  id: string;
  form_submission: string | FormSubmission | null;
  field: string | FormField | null;
  value: string | null;
  sort: number | null;
  file: string | DirectusFile<Schema> | null;
  timestamp: string | null;
}

export interface FormSubmission {
  id: string;
  timestamp: string | null;
  form: string | Form | null;
  values: string[] | FormSubmissionValue[];
}

export interface Form {
  id: string;
  on_success: "redirect" | "message" | null;
  sort: number | null;
  submit_label: string | null;
  success_message: string | null;
  title: string | null;
  success_redirect_url: string | null;
  is_active: boolean | null;
  emails: Array<{ to: unknown; subject: string; message: string }> | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
  fields: string[] | FormField[];
  submissions: string[] | FormSubmission[];
}

export interface Globals {
  description: string | null;
  id: string;
  social_links: unknown | null;
  tagline: string | null;
  title: string | null;
  url: string | null;
  favicon: string | DirectusFile<Schema> | null;
  logo: string | DirectusFile<Schema> | null;
  openai_api_key: string | null;
  directus_url: string | null;
  logo_dark_mode: string | DirectusFile<Schema> | null;
  accent_color: string | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}

export interface Navigation {
  id: string;
  title: string | null;
  is_active: boolean | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
  items: string[] | NavigationItem[];
}

export interface NavigationItem {
  id: string;
  navigation: string | Navigation | null;
  page: string | Page | null;
  parent: string | NavigationItem | null;
  sort: number | null;
  title: string | null;
  type: "page" | "post" | "url" | "group" | null;
  url: string | null;
  post: string | Post | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
  children: string[] | NavigationItem[];
}

export interface PageBlock {
  id: string;
  sort: number | null;
  page: string | Page | null;
  item:
    | string
    | BlockHero
    | BlockRichtext
    | BlockForm
    | BlockPost
    | BlockGallery
    | BlockPricing
    | null;
  collection:
    | string
    | "block_hero"
    | "block_richtext"
    | "block_form"
    | "block_posts"
    | "block_gallery"
    | "block_pricing"
    | null;
  hide_block: boolean | null;
  background: "light" | "dark" | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}

export interface Page {
  id: string;
  sort: number | null;
  title: string | null;
  permalink: string | null;
  status: "draft" | "in_review" | "published";
  published_at: string | null;
  seo: unknown | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
  blocks: string[] | PageBlock[];
}

export interface Post {
  content: string | null;
  id: string;
  image: string | DirectusFile<Schema> | null;
  slug: string | null;
  sort: number | null;
  status: "draft" | "in_review" | "published";
  title: string | null;
  description: string | null;
  author: string | DirectusUser<Schema> | null;
  published_at: string | null;
  seo: unknown | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}

export interface Redirect {
  id: string;
  response_code: string | null;
  url_from: string | null;
  url_to: string | null;
  note: string | null;
  date_created: string | null;
  user_created: string | DirectusUser<Schema> | null;
  date_updated: string | null;
  user_updated: string | DirectusUser<Schema> | null;
}

export interface CustomDirectusSettings {
  command_palette_settings: unknown | null;
}

export interface CustomDirectusUser {
  posts: string[] | Post[];
}

// GeoJSON Types

export interface GeoJSONPoint {
  type: "Point";
  coordinates: [number, number];
}

export interface GeoJSONLineString {
  type: "LineString";
  coordinates: Array<[number, number]>;
}

export interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: Array<Array<[number, number]>>;
}

export interface GeoJSONMultiPoint {
  type: "MultiPoint";
  coordinates: Array<[number, number]>;
}

export interface GeoJSONMultiLineString {
  type: "MultiLineString";
  coordinates: Array<Array<[number, number]>>;
}

export interface GeoJSONMultiPolygon {
  type: "MultiPolygon";
  coordinates: Array<Array<Array<[number, number]>>>;
}

export interface GeoJSONGeometryCollection {
  type: "GeometryCollection";
  geometries: Array<
    | GeoJSONPoint
    | GeoJSONLineString
    | GeoJSONPolygon
    | GeoJSONMultiPoint
    | GeoJSONMultiLineString
    | GeoJSONMultiPolygon
  >;
}
