import React from 'react';
import { PageWrapper, SectionTitle, ContactLine, SummaryBlock, ExperienceBlock, EducationBlock, SkillsBlock, ExtraSections, OrderedSections } from './shared/ResumeSections';

export const ClassicTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-10">
      <div className={`text-center border-b-2 pb-6 mb-6 ${theme.border}`}>
        <h1 className="text-4xl font-bold uppercase tracking-widest text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className={`text-xl font-medium mt-2 ${theme.text}`}>{personalInfo.jobTitle || 'Professional Title'}</p>
        <ContactLine personalInfo={personalInfo} theme={theme} className="justify-center mt-4" />
      </div>
      <OrderedSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const AtsMinimalTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">{personalInfo.fullName || 'YOUR NAME'}</h1>
      <p className="text-base text-slate-600 mb-1">{personalInfo.jobTitle || 'Professional Title'}</p>
      <ContactLine personalInfo={personalInfo} theme={theme} className="mb-6" />
      <OrderedSections data={data} theme={theme} titleVariant="line" />
    </PageWrapper>
  );
};

export const CorporateTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-0">
      <div className={`px-10 py-8 border-b-4 ${theme.titleBorder}`}>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className={`text-lg mt-1 ${theme.text}`}>{personalInfo.jobTitle || 'Professional Title'}</p>
        <ContactLine personalInfo={personalInfo} theme={theme} className="mt-3" />
      </div>
      <div className="px-10 py-8">
        <OrderedSections data={data} theme={theme} titleVariant="line" />
      </div>
    </PageWrapper>
  );
};

export const TwoColumnTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-0 flex min-h-[297mm]">
      <aside className={`w-[35%] p-8 ${theme.bgLight} border-r border-slate-100 flex flex-col`}>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className={`text-sm font-semibold mb-6 ${theme.text}`}>{personalInfo.jobTitle || 'Title'}</p>
        <ContactLine personalInfo={personalInfo} theme={theme} vertical className="mb-8 text-slate-600" />
        <OrderedSections data={data} theme={theme} sectionList={['education', 'skills', 'languages']} titleVariant="line" variant="list" />
      </aside>
      <main className="flex-1 p-8">
        <OrderedSections data={data} theme={theme} sectionList={['summary', 'experience', 'projects', 'achievements', 'certifications']} />
      </main>
    </PageWrapper>
  );
};

export const TimelineTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className={`text-lg ${theme.text}`}>{personalInfo.jobTitle || 'Professional Title'}</p>
        <ContactLine personalInfo={personalInfo} theme={theme} className="mt-2" />
      </div>
      <OrderedSections data={data} theme={theme} variant="timeline" />
    </PageWrapper>
  );
};

export const MinimalSerifTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-900 italic">{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-lg text-slate-600 mt-2">{personalInfo.jobTitle || 'Professional Title'}</p>
        <div className={`w-16 h-0.5 mx-auto mt-4 ${theme.bg}`} />
        <ContactLine personalInfo={personalInfo} theme={theme} className="justify-center mt-4" />
      </div>
      <OrderedSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const BoldBlocksTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-8">
      <div className={`${theme.bg} text-white p-6 -mx-2 mb-8 rounded-lg`}>
        <h1 className="text-3xl font-bold">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className="text-lg opacity-90 mt-1">{personalInfo.jobTitle || 'Professional Title'}</p>
        <ContactLine personalInfo={personalInfo} theme={{ ...theme, text: 'text-white/90' }} className="mt-3 text-white/80" light />
      </div>
      <OrderedSections data={data} theme={theme} titleVariant="block" />
    </PageWrapper>
  );
};

export const CompactTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-8 text-sm">
      <div className="flex justify-between items-start border-b pb-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
          <p className={`font-medium ${theme.text}`}>{personalInfo.jobTitle || 'Title'}</p>
        </div>
        <ContactLine personalInfo={personalInfo} theme={theme} className="text-right text-xs" />
      </div>
      <OrderedSections data={data} theme={theme} titleVariant="line" />
    </PageWrapper>
  );
};

export const ModernLinesTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-10">
      <div className="flex items-center gap-6 mb-8">
        <div className={`h-0.5 flex-1 ${theme.bg}`} />
        <div className="text-center shrink-0">
          <h1 className="text-2xl font-bold text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
          <p className={`text-sm ${theme.text}`}>{personalInfo.jobTitle || 'Title'}</p>
        </div>
        <div className={`h-0.5 flex-1 ${theme.bg}`} />
      </div>
      <ContactLine personalInfo={personalInfo} theme={theme} className="justify-center mb-8" />
      <OrderedSections data={data} theme={theme} titleVariant="line" />
    </PageWrapper>
  );
};

export const ExecutiveTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-0">
      <div className={`h-3 ${theme.bg}`} />
      <div className="px-10 py-8">
        <h1 className="text-4xl font-light text-slate-900 tracking-wide">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className={`text-sm font-bold uppercase tracking-widest mt-2 ${theme.text}`}>{personalInfo.jobTitle || 'Executive Title'}</p>
        <ContactLine personalInfo={personalInfo} theme={theme} className="mt-4 uppercase text-xs tracking-wide" />
      </div>
      <div className={`h-px ${theme.bg} mx-10 opacity-30`} />
      <div className="px-10 py-8">
        <OrderedSections data={data} theme={theme} />
      </div>
    </PageWrapper>
  );
};

export const TEXT_TEMPLATES = {
  'classic': ClassicTemplate,
  'ats-minimal': AtsMinimalTemplate,
  'corporate': CorporateTemplate,
  'two-column': TwoColumnTemplate,
  'timeline': TimelineTemplate,
  'minimal-serif': MinimalSerifTemplate,
  'bold-blocks': BoldBlocksTemplate,
  'compact': CompactTemplate,
  'modern-lines': ModernLinesTemplate,
  'executive': ExecutiveTemplate,
};
