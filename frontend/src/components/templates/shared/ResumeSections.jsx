import React from 'react';
import { Mail, Phone, MapPin, Link2 } from 'lucide-react';

export const A4_CLASSES = 'w-full max-w-[210mm] min-h-[297mm] bg-white mx-auto shadow-2xl text-slate-800 print:shadow-none print:max-w-none';

export const PageWrapper = ({ children, fontClass, className = '', style = {} }) => (
  <div className={`${A4_CLASSES} ${fontClass} ${className}`} style={style}>{children}</div>
);

export const SectionTitle = ({ children, theme, className = '', variant = 'default' }) => {
  if (variant === 'block') {
    return <h2 className={`text-sm font-bold uppercase tracking-wider text-white px-3 py-1.5 mb-4 inline-block ${theme.bg} ${className}`}>{children}</h2>;
  }
  if (variant === 'line') {
    return <h2 className={`text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b ${theme.titleBorder} text-slate-900 ${className}`}>{children}</h2>;
  }
  return <h2 className={`text-lg font-bold text-slate-900 border-b-2 pb-2 mb-4 uppercase tracking-wider ${theme.titleBorder} ${className}`}>{children}</h2>;
};

const ContactItem = ({ icon: Icon, label, value, theme, light = false }) => {
  if (!value) return null;
  return (
    <div className={`flex items-center gap-2 text-sm ${light ? 'text-white/90' : 'text-slate-600'}`}>
      <Icon className={`w-3.5 h-3.5 shrink-0 ${light ? 'text-white/70' : theme.text}`} />
      <span className="font-semibold text-slate-700 dark:text-inherit">{label}:</span>
      <span>{value}</span>
    </div>
  );
};

export const ContactLine = ({ personalInfo, theme, className = '', vertical = false, light = false, variant = 'labeled' }) => {
  const { email, phone, location, linkedin } = personalInfo;
  const hasData = email || phone || location || linkedin;

  if (variant === 'inline') {
    const parts = [];
    if (email) parts.push(<span key="e"><strong>Email:</strong> {email}</span>);
    if (phone) parts.push(<span key="p"><strong>Phone:</strong> {phone}</span>);
    if (location) parts.push(<span key="l"><strong>Location:</strong> {location}</span>);
    if (linkedin) parts.push(<span key="li" className={theme.text}><strong>LinkedIn:</strong> {linkedin}</span>);
    if (!parts.length) return <div className={`text-sm text-slate-500 ${className}`}><strong>Email:</strong> email@example.com | <strong>Phone:</strong> (555) 123-4567</div>;
    return (
      <div className={`flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600 ${className}`}>
        {parts.map((part, i) => (
          <span key={i}>{part}{i < parts.length - 1 && <span className="text-slate-300 mx-2 hidden sm:inline">|</span>}</span>
        ))}
      </div>
    );
  }

  const items = [
    { icon: Mail, label: 'Email', value: email },
    { icon: Phone, label: 'Phone', value: phone },
    { icon: MapPin, label: 'Location', value: location },
    { icon: Link2, label: 'LinkedIn', value: linkedin },
  ].filter((i) => i.value);

  if (!hasData) {
    return (
      <div className={`space-y-1 text-sm text-slate-500 ${vertical ? '' : 'flex flex-wrap gap-4'} ${className}`}>
        <ContactItem icon={Mail} label="Email" value="email@example.com" theme={theme} light={light} />
        <ContactItem icon={Phone} label="Phone" value="(555) 123-4567" theme={theme} light={light} />
      </div>
    );
  }

  return (
    <div className={`${vertical ? 'space-y-1.5' : 'flex flex-wrap gap-x-5 gap-y-1.5'} ${className}`}>
      {items.map(({ icon, label, value }) => (
        <ContactItem key={label} icon={icon} label={label} value={value} theme={theme} light={light} />
      ))}
    </div>
  );
};

export const SummaryBlock = ({ summary, className = '' }) =>
  summary ? <p className={`text-sm text-slate-700 leading-relaxed ${className}`}>{summary}</p> : null;

export const ExperienceBlock = ({ experience, theme, variant = 'default' }) => {
  if (!experience?.length) return null;
  return (
    <div className="space-y-5 resume-section">
      {experience.map((exp, index) => (
        <div key={index} className="resume-item break-inside-avoid">
          {variant === 'timeline' ? (
            <div className="flex gap-4">
              <div className={`w-2 shrink-0 rounded-full ${theme.bg} mt-1.5`} />
              <div className="flex-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-800">{exp.position || 'Job Title'}</h3>
                  <span className="text-xs text-slate-500">{exp.startDate || 'Start'} – {exp.endDate || 'End'}</span>
                </div>
                <div className={`text-sm font-semibold mb-1 ${theme.text}`}>{exp.company || 'Company'}</div>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-slate-800">{exp.position || 'Job Title'}</h3>
                <span className="text-xs font-medium text-slate-500">{exp.startDate || 'Start'} – {exp.endDate || 'End'}</span>
              </div>
              <div className={`text-sm font-semibold mb-1 ${theme.text}`}>{exp.company || 'Company'}</div>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export const EducationBlock = ({ education, theme }) => {
  if (!education?.length) return null;
  return (
    <div className="space-y-4 resume-section">
      {education.map((edu, index) => (
        <div key={index} className="resume-item break-inside-avoid">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="font-bold text-slate-800">{edu.degree || 'Degree'}</h3>
            <span className="text-xs text-slate-500">{edu.startDate || 'Start'} – {edu.endDate || 'End'}</span>
          </div>
          <div className={`text-sm font-semibold ${theme.text}`}>{edu.school || 'School'}</div>
        </div>
      ))}
    </div>
  );
};

export const SkillsBlock = ({ skills, theme, variant = 'tags' }) => {
  if (!skills?.length) return null;
  if (variant === 'list') {
    return (
      <ul className="text-sm space-y-1 text-slate-700">
        {skills.map((skill, i) => (
          <li key={i} className="flex items-center gap-2"><span className={`w-1.5 h-1.5 rounded-full ${theme.bg}`} />{skill}</li>
        ))}
      </ul>
    );
  }
  if (variant === 'bars') {
    return (
      <div className="space-y-2">
        {skills.map((skill, i) => (
          <div key={i} className="text-sm">
            <span className="font-medium text-slate-700">{skill}</span>
            <div className={`h-1 mt-1 rounded ${theme.bgLight}`}>
              <div className={`h-1 rounded ${theme.bg}`} style={{ width: `${Math.min(100, 60 + (i % 4) * 10)}%` }} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, i) => (
        <span key={i} className={`px-2.5 py-1 text-xs font-medium border rounded ${theme.border} ${theme.bgLight} text-slate-700`}>{skill}</span>
      ))}
    </div>
  );
};

export const ProjectsBlock = ({ projects, theme }) => {
  if (!projects?.length) return null;
  return (
    <div className="space-y-4 resume-section">
      {projects.map((proj, i) => (
        <div key={i} className="resume-item break-inside-avoid">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="font-bold text-slate-800">{proj.name || 'Project'}</h3>
            <span className="text-xs text-slate-500">{proj.startDate} – {proj.endDate}</span>
          </div>
          {proj.url && <div className={`text-xs mb-1 ${theme.text}`}>{proj.url}</div>}
          <p className="text-sm text-slate-600 whitespace-pre-wrap">{proj.description}</p>
        </div>
      ))}
    </div>
  );
};

export const AchievementsBlock = ({ achievements, theme }) => {
  if (!achievements?.length) return null;
  return (
    <div className="space-y-3 resume-section">
      {achievements.map((a, i) => (
        <div key={i} className="resume-item break-inside-avoid">
          <div className="flex justify-between items-baseline">
            <h3 className="font-bold text-slate-800">{a.title}</h3>
            {a.date && <span className="text-xs text-slate-500">{a.date}</span>}
          </div>
          {a.description && <p className="text-sm text-slate-600 mt-1">{a.description}</p>}
        </div>
      ))}
    </div>
  );
};

export const CertificationsBlock = ({ certifications, theme }) => {
  if (!certifications?.length) return null;
  return (
    <div className="space-y-2 resume-section">
      {certifications.map((c, i) => (
        <div key={i} className="resume-item break-inside-avoid flex justify-between text-sm">
          <span><strong className="text-slate-800">{c.name}</strong> — <span className={theme.text}>{c.issuer}</span></span>
          {c.date && <span className="text-slate-500">{c.date}</span>}
        </div>
      ))}
    </div>
  );
};

export const LanguagesBlock = ({ languages, theme }) => {
  if (!languages?.length) return null;
  return (
    <div className="flex flex-wrap gap-3 resume-section">
      {languages.map((l, i) => (
        <span key={i} className={`text-sm px-2 py-1 border rounded ${theme.border}`}>
          <strong>{l.language}</strong> — {l.proficiency}
        </span>
      ))}
    </div>
  );
};

/** Renders optional sections only when data exists */
export const ExtraSections = ({ data, theme, titleVariant = 'default' }) => {
  const { projects, achievements, certifications, languages } = data;
  return (
    <>
      {projects?.length > 0 && (
        <div className="mb-8">
          <SectionTitle theme={theme} variant={titleVariant}>Projects</SectionTitle>
          <ProjectsBlock projects={projects} theme={theme} />
        </div>
      )}
      {achievements?.length > 0 && (
        <div className="mb-8">
          <SectionTitle theme={theme} variant={titleVariant}>Achievements</SectionTitle>
          <AchievementsBlock achievements={achievements} theme={theme} />
        </div>
      )}
      {certifications?.length > 0 && (
        <div className="mb-8">
          <SectionTitle theme={theme} variant={titleVariant}>Certifications</SectionTitle>
          <CertificationsBlock certifications={certifications} theme={theme} />
        </div>
      )}
      {languages?.length > 0 && (
        <div className="mb-8">
          <SectionTitle theme={theme} variant={titleVariant}>Languages</SectionTitle>
          <LanguagesBlock languages={languages} theme={theme} />
        </div>
      )}
    </>
  );
};
