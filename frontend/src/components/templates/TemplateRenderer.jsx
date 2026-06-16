import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { getTheme, getFont } from '../../constants/resumeTheme';
import { TEXT_TEMPLATES } from './textTemplates';
import { PHOTO_TEMPLATES } from './photoTemplates';
import { ClassicTemplate } from './textTemplates';

const ALL_TEMPLATES = { ...TEXT_TEMPLATES, ...PHOTO_TEMPLATES };

const TemplateRenderer = ({ resumeData }) => {
  const { settings } = resumeData;
  const theme = getTheme(settings?.color);
  const fontClass = getFont(settings?.font);
  const templateId = settings?.template || 'classic';
  const Template = ALL_TEMPLATES[templateId] || ClassicTemplate;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={templateId}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="resume-preview-root"
      >
        <Template data={resumeData} theme={theme} fontClass={fontClass} />
      </motion.div>
    </AnimatePresence>
  );
};

export default TemplateRenderer;
