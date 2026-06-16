import React from 'react';
import { PageWrapper, SectionTitle, ContactLine, SummaryBlock, ExperienceBlock, EducationBlock, SkillsBlock, ExtraSections } from './shared/ResumeSections';
import PhotoFrame from './shared/PhotoFrame';

export const SidebarPhotoTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-0 flex">
      <aside className={`w-[32%] p-6 text-white ${theme.bg}`}>
        <div className="flex justify-center mb-6">
          <PhotoFrame src={personalInfo.photo} shape="circle" size="xl" borderClass="border-4 border-white/30" />
        </div>
        <h1 className="text-xl font-bold text-center mb-1">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className="text-sm text-center opacity-90 mb-6">{personalInfo.jobTitle || 'Title'}</p>
        <ContactLine personalInfo={personalInfo} theme={{ text: 'text-white/90' }} vertical className="text-white/80 text-xs mb-8" />
        {skills.length > 0 && <><h2 className="text-xs font-bold uppercase tracking-wider mb-3 opacity-80">Skills</h2><SkillsBlock skills={skills} theme={{ ...theme, border: 'border-white/30', bgLight: 'bg-white/10' }} variant="list" /></>}
      </aside>
      <main className="flex-1 p-8">
        {summary && <div className="mb-6"><SectionTitle theme={theme}>Summary</SectionTitle><SummaryBlock summary={summary} /></div>}
        {experience.length > 0 && <div className="mb-6"><SectionTitle theme={theme}>Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} /></div>}
        {education.length > 0 && <div><SectionTitle theme={theme}>Education</SectionTitle><EducationBlock education={education} theme={theme} /></div>}
      </main>
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const BannerPhotoTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-0">
      <div className={`relative px-8 py-10 ${theme.bgLight}`}>
        <div className="flex items-center gap-8">
          <PhotoFrame src={personalInfo.photo} shape="square" size="xl" borderClass={`border-4 ${theme.border}`} />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
            <p className={`text-lg ${theme.text}`}>{personalInfo.jobTitle || 'Professional Title'}</p>
            <ContactLine personalInfo={personalInfo} theme={theme} className="mt-3" />
          </div>
        </div>
      </div>
      <div className="p-8 space-y-6">
        {summary && <SummaryBlock summary={summary} />}
        {experience.length > 0 && <div><SectionTitle theme={theme}>Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} /></div>}
        {education.length > 0 && <div><SectionTitle theme={theme}>Education</SectionTitle><EducationBlock education={education} theme={theme} /></div>}
        {skills.length > 0 && <div><SectionTitle theme={theme}>Skills</SectionTitle><SkillsBlock skills={skills} theme={theme} /></div>}
      </div>
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const CircleHeaderTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-10">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <PhotoFrame src={personalInfo.photo} shape="circle" size="xl" borderClass={`border-4 ${theme.border}`} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className={`text-lg ${theme.text}`}>{personalInfo.jobTitle || 'Title'}</p>
        <ContactLine personalInfo={personalInfo} theme={theme} className="justify-center mt-3" />
      </div>
      {summary && <div className="mb-8 text-center max-w-xl mx-auto"><SummaryBlock summary={summary} /></div>}
      {experience.length > 0 && <div className="mb-8"><SectionTitle theme={theme}>Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} /></div>}
      {education.length > 0 && <div className="mb-8"><SectionTitle theme={theme}>Education</SectionTitle><EducationBlock education={education} theme={theme} /></div>}
      {skills.length > 0 && <div><SectionTitle theme={theme}>Skills</SectionTitle><SkillsBlock skills={skills} theme={theme} /></div>}
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const SplitPhotoTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-0 flex flex-col">
      <div className="flex min-h-[200px]">
        <div className="w-1/2 overflow-hidden">
          <PhotoFrame src={personalInfo.photo} shape="none" size="split" className="w-full h-full min-h-[200px] rounded-none" borderClass="" />
        </div>
        <div className={`w-1/2 p-8 flex flex-col justify-center ${theme.bgLight}`}>
          <h1 className="text-2xl font-bold text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
          <p className={`text-base font-semibold mt-1 ${theme.text}`}>{personalInfo.jobTitle || 'Title'}</p>
          <ContactLine personalInfo={personalInfo} theme={theme} vertical className="mt-4 text-sm" />
        </div>
      </div>
      <div className="p-8 space-y-6">
        {summary && <SummaryBlock summary={summary} />}
        {experience.length > 0 && <div><SectionTitle theme={theme}>Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} /></div>}
        {education.length > 0 && <div><SectionTitle theme={theme}>Education</SectionTitle><EducationBlock education={education} theme={theme} /></div>}
        {skills.length > 0 && <div><SectionTitle theme={theme}>Skills</SectionTitle><SkillsBlock skills={skills} theme={theme} /></div>}
      </div>
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const CardPhotoTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-8">
      <div className="flex justify-between items-start mb-8">
        <div className="flex-1 pr-6">
          <h1 className="text-3xl font-bold text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
          <p className={`text-lg ${theme.text}`}>{personalInfo.jobTitle || 'Title'}</p>
          <ContactLine personalInfo={personalInfo} theme={theme} className="mt-3" />
        </div>
        <PhotoFrame src={personalInfo.photo} shape="rounded" size="lg" borderClass={`border-2 ${theme.border} shadow-lg`} />
      </div>
      {summary && <div className={`p-4 rounded-xl mb-6 ${theme.bgLight}`}><SummaryBlock summary={summary} /></div>}
      {experience.length > 0 && <div className="mb-6"><SectionTitle theme={theme}>Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} /></div>}
      {education.length > 0 && <div className="mb-6"><SectionTitle theme={theme}>Education</SectionTitle><EducationBlock education={education} theme={theme} /></div>}
      {skills.length > 0 && <div><SectionTitle theme={theme}>Skills</SectionTitle><SkillsBlock skills={skills} theme={theme} /></div>}
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const RibbonPhotoTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-0 overflow-hidden">
      <div className={`relative ${theme.bg} px-8 py-12`}>
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rotate-45" />
        <div className="relative flex items-center gap-6">
          <PhotoFrame src={personalInfo.photo} shape="circle" size="lg" borderClass="border-4 border-white/40" />
          <div className="text-white">
            <h1 className="text-2xl font-bold">{personalInfo.fullName || 'YOUR NAME'}</h1>
            <p className="opacity-90">{personalInfo.jobTitle || 'Title'}</p>
          </div>
        </div>
      </div>
      <div className="p-8 space-y-6">
        <ContactLine personalInfo={personalInfo} theme={theme} />
        {summary && <SummaryBlock summary={summary} />}
        {experience.length > 0 && <div><SectionTitle theme={theme}>Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} /></div>}
        {education.length > 0 && <div><SectionTitle theme={theme}>Education</SectionTitle><EducationBlock education={education} theme={theme} /></div>}
        {skills.length > 0 && <div><SectionTitle theme={theme}>Skills</SectionTitle><SkillsBlock skills={skills} theme={theme} /></div>}
      </div>
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const GridPhotoTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-6">
      <div className="grid grid-cols-12 gap-4 mb-6">
        <div className={`col-span-5 row-span-2 overflow-hidden rounded-2xl ${theme.bgLight}`}>
          <PhotoFrame src={personalInfo.photo} shape="none" size="split" className="w-full h-full min-h-[160px] rounded-2xl" borderClass="" />
        </div>
        <div className="col-span-7 flex flex-col justify-center">
          <h1 className="text-2xl font-bold text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
          <p className={`font-semibold ${theme.text}`}>{personalInfo.jobTitle || 'Title'}</p>
        </div>
        <div className={`col-span-7 p-4 rounded-xl ${theme.bgLight}`}>
          <ContactLine personalInfo={personalInfo} theme={theme} vertical className="text-sm" />
        </div>
      </div>
      {summary && <div className="mb-6"><SummaryBlock summary={summary} /></div>}
      <div className="grid grid-cols-2 gap-6">
        <div>
          {experience.length > 0 && <><SectionTitle theme={theme} variant="line">Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} /></>}
        </div>
        <div>
          {education.length > 0 && <><SectionTitle theme={theme} variant="line">Education</SectionTitle><EducationBlock education={education} theme={theme} /></>}
          {skills.length > 0 && <div className="mt-6"><SectionTitle theme={theme} variant="line">Skills</SectionTitle><SkillsBlock skills={skills} theme={theme} /></div>}
        </div>
      </div>
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const StackPhotoTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-10">
      <div className="flex flex-col items-center mb-8">
        <PhotoFrame src={personalInfo.photo} shape="circle" size="xl" borderClass={`border-4 ${theme.border}`} className="mb-4" />
        <h1 className="text-3xl font-bold text-slate-900 text-center">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <div className={`w-12 h-1 mt-3 mb-2 ${theme.bg}`} />
        <p className={`text-lg ${theme.text}`}>{personalInfo.jobTitle || 'Title'}</p>
        <ContactLine personalInfo={personalInfo} theme={theme} className="justify-center mt-3" />
      </div>
      {summary && <div className="mb-8"><SummaryBlock summary={summary} className="text-center" /></div>}
      {experience.length > 0 && <div className="mb-8"><SectionTitle theme={theme}>Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} /></div>}
      {education.length > 0 && <div className="mb-8"><SectionTitle theme={theme}>Education</SectionTitle><EducationBlock education={education} theme={theme} /></div>}
      {skills.length > 0 && <div><SectionTitle theme={theme}>Skills</SectionTitle><SkillsBlock skills={skills} theme={theme} /></div>}
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const CornerPhotoTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-10 relative">
      <div className="absolute top-8 right-8">
        <PhotoFrame src={personalInfo.photo} shape="square" size="lg" borderClass={`border-2 ${theme.border}`} />
      </div>
      <div className="pr-36 mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
        <p className={`text-lg ${theme.text}`}>{personalInfo.jobTitle || 'Title'}</p>
        <ContactLine personalInfo={personalInfo} theme={theme} className="mt-3" />
      </div>
      {summary && <div className="mb-8"><SummaryBlock summary={summary} /></div>}
      {experience.length > 0 && <div className="mb-8"><SectionTitle theme={theme}>Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} /></div>}
      {education.length > 0 && <div className="mb-8"><SectionTitle theme={theme}>Education</SectionTitle><EducationBlock education={education} theme={theme} /></div>}
      {skills.length > 0 && <div><SectionTitle theme={theme}>Skills</SectionTitle><SkillsBlock skills={skills} theme={theme} /></div>}
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const FramePhotoTemplate = ({ data, theme, fontClass }) => {
  const { personalInfo, summary, experience, education, skills } = data;
  return (
    <PageWrapper fontClass={fontClass} className="p-10">
      <div className="flex gap-8 mb-8">
        <div className={`p-2 ${theme.bgLight} rounded-2xl shrink-0`}>
          <div className={`p-1 border-2 ${theme.titleBorder} rounded-xl`}>
            <PhotoFrame src={personalInfo.photo} shape="rounded" size="xl" borderClass="" />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-slate-900">{personalInfo.fullName || 'YOUR NAME'}</h1>
          <p className={`text-lg ${theme.text}`}>{personalInfo.jobTitle || 'Title'}</p>
          <ContactLine personalInfo={personalInfo} theme={theme} className="mt-3" />
        </div>
      </div>
      {summary && <div className="mb-8 pl-4 border-l-4 border-slate-200"><SummaryBlock summary={summary} /></div>}
      {experience.length > 0 && <div className="mb-8"><SectionTitle theme={theme}>Experience</SectionTitle><ExperienceBlock experience={experience} theme={theme} /></div>}
      {education.length > 0 && <div className="mb-8"><SectionTitle theme={theme}>Education</SectionTitle><EducationBlock education={education} theme={theme} /></div>}
      {skills.length > 0 && <div><SectionTitle theme={theme}>Skills</SectionTitle><SkillsBlock skills={skills} theme={theme} /></div>}
      <ExtraSections data={data} theme={theme} />
    </PageWrapper>
  );
};

export const PHOTO_TEMPLATES = {
  'sidebar-photo': SidebarPhotoTemplate,
  'banner-photo': BannerPhotoTemplate,
  'circle-header': CircleHeaderTemplate,
  'split-photo': SplitPhotoTemplate,
  'card-photo': CardPhotoTemplate,
  'ribbon-photo': RibbonPhotoTemplate,
  'grid-photo': GridPhotoTemplate,
  'stack-photo': StackPhotoTemplate,
  'corner-photo': CornerPhotoTemplate,
  'frame-photo': FramePhotoTemplate,
};
