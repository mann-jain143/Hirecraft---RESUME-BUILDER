import React from 'react';
import { PageWrapper, SectionTitle, ContactLine, SummaryBlock, ExperienceBlock, EducationBlock, SkillsBlock, ExtraSections } from './shared/ResumeSections';

export const ClassicTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-10">
      <div className={`text-center border-b-2 pb-6 mb-6 ${theme.border}`}>
        <h1 className="text-4xl font-bold uppercase tracking-widest text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className={`text-xl font-medium mt-2 ${theme.text}`}>{personalInfo.jobTitle || 'Professional Title'}</p>
        <ContactLine personalInfo={personalInfo} theme={theme} className="justify-center mt-4" />
      </div>
      {summary && <div className="mb-8"><SummaryBlock summary={summary} className="text-justify" /></div>}
      {experience.length > 0 && <div className="mb-8"><SectionTitle theme={theme}>Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} /></div>}
      {education.length > 0 && <div className="mb-8"><SectionTitle theme={theme}>Education</SectionTitle><EducationBlock education={education} theme={theme} /></div>}
      {skills.length > 0 && <div><SectionTitle theme={theme}>Skills</SectionTitle><SkillsBlock skills={skills} theme={theme} /></div>}
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const AtsMinimalTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-12">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">{personalInfo.fullName || 'YOUR NAME'}</h1>
      <p className="text-base text-slate-600 mb-1">{personalInfo.jobTitle || 'Professional Title'}</p>
      <ContactLine personalInfo={personalInfo} theme={theme} className="mb-6" />
      {summary && <div className="mb-6"><p className="text-xs font-bold uppercase text-slate-500 mb-2">Summary</p><SummaryBlock summary={summary} /></div>}
      {experience.length > 0 && <div className="mb-6"><p className="text-xs font-bold uppercase text-slate-500 mb-3">Experience</p><ExperienceBlock experience={experience} theme={theme} /></div>}
      {education.length > 0 && <div className="mb-6"><p className="text-xs font-bold uppercase text-slate-500 mb-3">Education</p><EducationBlock education={education} theme={theme} /></div>}
      {skills.length > 0 && <div><p className="text-xs font-bold uppercase text-slate-500 mb-2">Skills</p><p className="text-sm text-slate-700">{skills.join(' • ')}</p></div>}
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const CorporateTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-0">
      <div className={`px-10 py-8 border-b-4 ${theme.titleBorder}`}>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className={`text-lg mt-1 ${theme.text}`}>{personalInfo.jobTitle || 'Professional Title'}</p>
        <ContactLine personalInfo={personalInfo} theme={theme} className="mt-3" />
      </div>
      <div className="px-10 py-8 space-y-8">
        {summary && <div><SectionTitle theme={theme} variant="line">Professional Summary</SectionTitle><SummaryBlock summary={summary} /></div>}
        {experience.length > 0 && <div><SectionTitle theme={theme} variant="line">Professional Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} /></div>}
        {education.length > 0 && <div><SectionTitle theme={theme} variant="line">Education</SectionTitle><EducationBlock education={education} theme={theme} /></div>}
        {skills.length > 0 && <div><SectionTitle theme={theme} variant="line">Core Competencies</SectionTitle><SkillsBlock skills={skills} theme={theme} variant="list" /></div>}
      </div>
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const TwoColumnTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-0 flex">
      <aside className={`w-[35%] p-8 ${theme.bgLight}`}>
        <h1 className="text-2xl font-bold text-slate-900 mb-1">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className={`text-sm font-semibold mb-6 ${theme.text}`}>{personalInfo.jobTitle || 'Title'}</p>
        <ContactLine personalInfo={personalInfo} theme={theme} vertical className="mb-8 text-slate-600" />
        {skills.length > 0 && <><SectionTitle theme={theme} variant="line">Skills</SectionTitle><SkillsBlock skills={skills} theme={theme} variant="list" /></>}
        {education.length > 0 && <div className="mt-8"><SectionTitle theme={theme} variant="line">Education</SectionTitle><EducationBlock education={education} theme={theme} /></div>}
      </aside>
      <main className="flex-1 p-8">
        {summary && <div className="mb-8"><SectionTitle theme={theme}>Summary</SectionTitle><SummaryBlock summary={summary} /></div>}
        {experience.length > 0 && <div><SectionTitle theme={theme}>Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} /></div>}
      </main>
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const TimelineTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className={`text-lg ${theme.text}`}>{personalInfo.jobTitle || 'Professional Title'}</p>
        <ContactLine personalInfo={personalInfo} theme={theme} className="mt-2" />
      </div>
      {summary && <div className="mb-8 pl-4 border-l-4 border-slate-200"><SummaryBlock summary={summary} /></div>}
      {experience.length > 0 && <div className="mb-8"><SectionTitle theme={theme}>Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} variant="timeline" /></div>}
      {education.length > 0 && <div className="mb-8"><SectionTitle theme={theme}>Education</SectionTitle><EducationBlock education={education} theme={theme} /></div>}
      {skills.length > 0 && <div><SectionTitle theme={theme}>Skills</SectionTitle><SkillsBlock skills={skills} theme={theme} /></div>}
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const MinimalSerifTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-900 italic">{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-lg text-slate-600 mt-2">{personalInfo.jobTitle || 'Professional Title'}</p>
        <div className={`w-16 h-0.5 mx-auto mt-4 ${theme.bg}`} />
        <ContactLine personalInfo={personalInfo} theme={theme} className="justify-center mt-4" />
      </div>
      {summary && <div className="mb-8 text-center max-w-lg mx-auto"><SummaryBlock summary={summary} className="italic" /></div>}
      {experience.length > 0 && <div className="mb-8"><h2 className="text-center text-sm uppercase tracking-[0.3em] text-slate-500 mb-6">Experience</h2><ExperienceBlock experience={experience} theme={theme} /></div>}
      {education.length > 0 && <div className="mb-8"><h2 className="text-center text-sm uppercase tracking-[0.3em] text-slate-500 mb-6">Education</h2><EducationBlock education={education} theme={theme} /></div>}
      {skills.length > 0 && <div><h2 className="text-center text-sm uppercase tracking-[0.3em] text-slate-500 mb-4">Skills</h2><SkillsBlock skills={skills} theme={theme} className="justify-center" /></div>}
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const BoldBlocksTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-8">
      <div className={`${theme.bg} text-white p-6 -mx-2 mb-8 rounded-lg`}>
        <h1 className="text-3xl font-bold">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className="text-lg opacity-90 mt-1">{personalInfo.jobTitle || 'Professional Title'}</p>
        <ContactLine personalInfo={personalInfo} theme={{ ...theme, text: 'text-white/90' }} className="mt-3 text-white/80" />
      </div>
      {summary && <div className="mb-6"><SectionTitle theme={theme} variant="block">Summary</SectionTitle><SummaryBlock summary={summary} /></div>}
      {experience.length > 0 && <div className="mb-6"><SectionTitle theme={theme} variant="block">Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} /></div>}
      {education.length > 0 && <div className="mb-6"><SectionTitle theme={theme} variant="block">Education</SectionTitle><EducationBlock education={education} theme={theme} /></div>}
      {skills.length > 0 && <div><SectionTitle theme={theme} variant="block">Skills</SectionTitle><SkillsBlock skills={skills} theme={theme} /></div>}
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const CompactTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-8 text-sm">
      <div className="flex justify-between items-start border-b pb-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
          <p className={`font-medium ${theme.text}`}>{personalInfo.jobTitle || 'Title'}</p>
        </div>
        <ContactLine personalInfo={personalInfo} theme={theme} className="text-right text-xs" />
      </div>
      {summary && <p className="mb-4 text-slate-600 leading-snug">{summary}</p>}
      {experience.length > 0 && <div className="mb-4"><h2 className={`text-xs font-bold uppercase mb-2 ${theme.text}`}>Experience</h2><ExperienceBlock experience={experience} theme={theme} /></div>}
      {education.length > 0 && <div className="mb-4"><h2 className={`text-xs font-bold uppercase mb-2 ${theme.text}`}>Education</h2><EducationBlock education={education} theme={theme} /></div>}
      {skills.length > 0 && <div><h2 className={`text-xs font-bold uppercase mb-2 ${theme.text}`}>Skills</h2><p className="text-slate-600">{skills.join(' · ')}</p></div>}
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const ModernLinesTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-10">
      <div className="flex items-center gap-6 mb-8">
        <div className={`h-1 flex-1 ${theme.bg}`} />
        <div className="text-center shrink-0">
          <h1 className="text-2xl font-bold text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
          <p className={`text-sm ${theme.text}`}>{personalInfo.jobTitle || 'Title'}</p>
        </div>
        <div className={`h-1 flex-1 ${theme.bg}`} />
      </div>
      <ContactLine personalInfo={personalInfo} theme={theme} className="justify-center mb-8" />
      {summary && <div className="mb-8"><div className={`h-0.5 w-12 mb-3 ${theme.bg}`} /><SummaryBlock summary={summary} /></div>}
      {experience.length > 0 && <div className="mb-8"><SectionTitle theme={theme} variant="line">Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} /></div>}
      {education.length > 0 && <div className="mb-8"><SectionTitle theme={theme} variant="line">Education</SectionTitle><EducationBlock education={education} theme={theme} /></div>}
      {skills.length > 0 && <div><SectionTitle theme={theme} variant="line">Skills</SectionTitle><SkillsBlock skills={skills} theme={theme} /></div>}
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const ExecutiveTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-0">
      <div className={`h-3 ${theme.bg}`} />
      <div className="px-10 py-8">
        <h1 className="text-4xl font-light text-slate-900 tracking-wide">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className={`text-sm font-bold uppercase tracking-widest mt-2 ${theme.text}`}>{personalInfo.jobTitle || 'Executive Title'}</p>
        <ContactLine personalInfo={personalInfo} theme={theme} className="mt-4 uppercase text-xs tracking-wide" />
      </div>
      <div className={`h-px ${theme.bg} mx-10 opacity-30`} />
      <div className="px-10 py-8 space-y-8">
        {summary && <SummaryBlock summary={summary} className="text-base" />}
        {experience.length > 0 && <div><SectionTitle theme={theme}>Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} /></div>}
        {education.length > 0 && <div><SectionTitle theme={theme}>Education</SectionTitle><EducationBlock education={education} theme={theme} /></div>}
        {skills.length > 0 && <div><SectionTitle theme={theme}>Expertise</SectionTitle><SkillsBlock skills={skills} theme={theme} variant="bars" /></div>}
      </div>
      <ExtraSections data={data} theme={theme} />
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
