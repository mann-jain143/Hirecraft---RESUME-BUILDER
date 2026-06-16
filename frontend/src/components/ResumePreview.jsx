import React from 'react';
import TemplateRenderer from './templates/TemplateRenderer';

const ResumePreview = ({ resumeData }) => {
  return <TemplateRenderer resumeData={resumeData} />;
};

export default ResumePreview;
