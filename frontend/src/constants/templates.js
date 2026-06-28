export const TEMPLATE_LIST = [
  { id: 'classic', name: 'Classic ATS', category: 'ATS Friendly', hasPhoto: false, description: 'Clean centered header, ATS-friendly' },
  { id: 'ats-minimal', name: 'ATS Minimal', category: 'ATS Friendly', hasPhoto: false, description: 'Ultra-minimal single column' },
  { id: 'corporate', name: 'Corporate Pro', category: 'Professional', hasPhoto: false, description: 'Formal executive layout' },
  { id: 'two-column', name: 'Dual Column', category: 'Modern', hasPhoto: false, description: 'Skills sidebar, content main' },
  { id: 'timeline', name: 'Timeline', category: 'Modern', hasPhoto: false, description: 'Vertical timeline experience' },
  { id: 'minimal-serif', name: 'Elegant Serif', category: 'Professional', hasPhoto: false, description: 'Refined serif typography' },
  { id: 'bold-blocks', name: 'Bold Blocks', category: 'Creative', hasPhoto: false, description: 'Color-block section headers' },
  { id: 'compact', name: 'Compact Pro', category: 'ATS Friendly', hasPhoto: false, description: 'Dense information layout' },
  { id: 'modern-lines', name: 'Modern Lines', category: 'Modern', hasPhoto: false, description: 'Horizontal accent rules' },
  { id: 'executive', name: 'Executive', category: 'Executive', hasPhoto: false, description: 'Top accent bar, premium feel' },
  { id: 'sidebar-photo', name: 'Sidebar Portrait', category: 'Professional', hasPhoto: true, description: 'Left sidebar with circular photo' },
  { id: 'banner-photo', name: 'Banner Profile', category: 'Executive', hasPhoto: true, description: 'Full-width banner with square photo' },
  { id: 'circle-header', name: 'Circle Header', category: 'Modern', hasPhoto: true, description: 'Centered circular photo header' },
  { id: 'split-photo', name: 'Split Profile', category: 'Creative', hasPhoto: true, description: '50/50 photo and details split' },
  { id: 'card-photo', name: 'Card Profile', category: 'Modern', hasPhoto: true, description: 'Photo card with floating layout' },
  { id: 'ribbon-photo', name: 'Ribbon Accent', category: 'Creative', hasPhoto: true, description: 'Diagonal ribbon with photo' },
  { id: 'grid-photo', name: 'Grid Creative', category: 'Creative', hasPhoto: true, description: 'CSS grid asymmetric layout' },
  { id: 'stack-photo', name: 'Stack Portrait', category: 'Professional', hasPhoto: true, description: 'Stacked photo above name' },
  { id: 'corner-photo', name: 'Corner Square', category: 'Professional', hasPhoto: true, description: 'Square photo top-left corner' },
  { id: 'frame-photo', name: 'Framed Portrait', category: 'Creative', hasPhoto: true, description: 'Decorative framed photo' },
];

export const PHOTO_TEMPLATES = TEMPLATE_LIST.filter((t) => t.hasPhoto);
export const TEXT_TEMPLATES = TEMPLATE_LIST.filter((t) => !t.hasPhoto);

export const getTemplateMeta = (id) => TEMPLATE_LIST.find((t) => t.id === id) || TEMPLATE_LIST[0];
