export const ACCENT_COLORS = ['blue', 'emerald', 'violet', 'rose', 'amber', 'cyan', 'indigo', 'orange'];

export const themeColors = {
  blue: {
    text: 'text-blue-600',
    bg: 'bg-blue-600',
    bgLight: 'bg-blue-50',
    border: 'border-blue-200',
    titleBorder: 'border-blue-600',
    ring: 'ring-blue-500',
    hex: '#2563eb',
  },
  emerald: {
    text: 'text-emerald-600',
    bg: 'bg-emerald-600',
    bgLight: 'bg-emerald-50',
    border: 'border-emerald-200',
    titleBorder: 'border-emerald-600',
    ring: 'ring-emerald-500',
    hex: '#059669',
  },
  violet: {
    text: 'text-violet-600',
    bg: 'bg-violet-600',
    bgLight: 'bg-violet-50',
    border: 'border-violet-200',
    titleBorder: 'border-violet-600',
    ring: 'ring-violet-500',
    hex: '#7c3aed',
  },
  rose: {
    text: 'text-rose-600',
    bg: 'bg-rose-600',
    bgLight: 'bg-rose-50',
    border: 'border-rose-200',
    titleBorder: 'border-rose-600',
    ring: 'ring-rose-500',
    hex: '#e11d48',
  },
  amber: {
    text: 'text-amber-600',
    bg: 'bg-amber-600',
    bgLight: 'bg-amber-50',
    border: 'border-amber-200',
    titleBorder: 'border-amber-600',
    ring: 'ring-amber-500',
    hex: '#d97706',
  },
  cyan: {
    text: 'text-cyan-600',
    bg: 'bg-cyan-600',
    bgLight: 'bg-cyan-50',
    border: 'border-cyan-200',
    titleBorder: 'border-cyan-600',
    ring: 'ring-cyan-500',
    hex: '#0891b2',
  },
  indigo: {
    text: 'text-indigo-600',
    bg: 'bg-indigo-600',
    bgLight: 'bg-indigo-50',
    border: 'border-indigo-200',
    titleBorder: 'border-indigo-600',
    ring: 'ring-indigo-500',
    hex: '#4f46e5',
  },
  orange: {
    text: 'text-orange-600',
    bg: 'bg-orange-600',
    bgLight: 'bg-orange-50',
    border: 'border-orange-200',
    titleBorder: 'border-orange-600',
    ring: 'ring-orange-500',
    hex: '#ea580c',
  },
};

export const colorPickerClasses = {
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500',
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
  cyan: 'bg-cyan-500',
  indigo: 'bg-indigo-500',
  orange: 'bg-orange-500',
};

export const fontFamilies = {
  sans: 'font-sans',
  serif: 'font-serif',
  mono: 'font-mono',
};

export const getTheme = (colorKey) => themeColors[colorKey] || themeColors.blue;
export const getFont = (fontKey) => fontFamilies[fontKey] || fontFamilies.sans;
