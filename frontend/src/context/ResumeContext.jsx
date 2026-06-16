import React, { createContext, useContext, useState, useCallback } from 'react';

export const DEFAULT_RESUME_DATA = {
  settings: {
    template: 'classic',
    color: 'blue',
    font: 'sans',
  },
  personalInfo: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    photo: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  achievements: [],
  certifications: [],
  languages: [],
};

const mergeDefaults = (data) => ({
  ...DEFAULT_RESUME_DATA,
  ...data,
  settings: { ...DEFAULT_RESUME_DATA.settings, ...data?.settings },
  personalInfo: { ...DEFAULT_RESUME_DATA.personalInfo, ...data?.personalInfo },
  experience: data?.experience ?? [],
  education: data?.education ?? [],
  skills: data?.skills ?? [],
  projects: data?.projects ?? [],
  achievements: data?.achievements ?? [],
  certifications: data?.certifications ?? [],
  languages: data?.languages ?? [],
});

const ResumeContext = createContext(null);

export const ResumeProvider = ({ children, initialData, initialId = null, initialTitle = '' }) => {
  const [resumeData, setResumeData] = useState(() => mergeDefaults(initialData));
  const [resumeId, setResumeId] = useState(initialId);
  const [title, setTitle] = useState(initialTitle);

  const mergeResumeData = useCallback((updater) => {
    setResumeData((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  const updateSettings = useCallback((key, value) => {
    setResumeData((prev) => ({ ...prev, settings: { ...prev.settings, [key]: value } }));
  }, []);

  const updatePersonalInfo = useCallback((field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  }, []);

  const updateSummary = useCallback((summary) => {
    setResumeData((prev) => ({ ...prev, summary }));
  }, []);

  const reorderList = useCallback((key, fromIndex, toIndex) => {
    setResumeData((prev) => {
      const list = [...prev[key]];
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      return { ...prev, [key]: list };
    });
  }, []);

  const createListHandlers = (key, emptyItem) => ({
    add: () => setResumeData((prev) => ({ ...prev, [key]: [...prev[key], { ...emptyItem }] })),
    update: (index, field, value) =>
      setResumeData((prev) => {
        const list = [...prev[key]];
        list[index] = { ...list[index], [field]: value };
        return { ...prev, [key]: list };
      }),
    remove: (index) =>
      setResumeData((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) })),
    reorder: (from, to) => reorderList(key, from, to),
  });

  const experienceHandlers = createListHandlers('experience', {
    company: '', position: '', startDate: '', endDate: '', description: '',
  });
  const educationHandlers = createListHandlers('education', {
    school: '', degree: '', startDate: '', endDate: '',
  });
  const projectHandlers = createListHandlers('projects', {
    name: '', url: '', startDate: '', endDate: '', description: '',
  });
  const achievementHandlers = createListHandlers('achievements', {
    title: '', date: '', description: '',
  });
  const certificationHandlers = createListHandlers('certifications', {
    name: '', issuer: '', date: '',
  });
  const languageHandlers = createListHandlers('languages', {
    language: '', proficiency: '',
  });

  const addSkill = useCallback((skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    setResumeData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
  }, []);

  const removeSkill = useCallback((index) => {
    setResumeData((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  }, []);

  const loadResume = useCallback(({ _id, title: docTitle, resumeData: data }) => {
    setResumeId(_id);
    setTitle(docTitle || 'Untitled Resume');
    setResumeData(mergeDefaults(data));
  }, []);

  const resetResume = useCallback(() => {
    setResumeId(null);
    setTitle('');
    setResumeData(mergeDefaults(null));
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        resumeId,
        title,
        setResumeId,
        setTitle,
        setResumeData: mergeResumeData,
        updateSettings,
        updatePersonalInfo,
        updateSummary,
        addExperience: experienceHandlers.add,
        updateExperience: experienceHandlers.update,
        removeExperience: experienceHandlers.remove,
        reorderExperience: experienceHandlers.reorder,
        addEducation: educationHandlers.add,
        updateEducation: educationHandlers.update,
        removeEducation: educationHandlers.remove,
        addProject: projectHandlers.add,
        updateProject: projectHandlers.update,
        removeProject: projectHandlers.remove,
        reorderProjects: projectHandlers.reorder,
        addAchievement: achievementHandlers.add,
        updateAchievement: achievementHandlers.update,
        removeAchievement: achievementHandlers.remove,
        addCertification: certificationHandlers.add,
        updateCertification: certificationHandlers.update,
        removeCertification: certificationHandlers.remove,
        addLanguage: languageHandlers.add,
        updateLanguage: languageHandlers.update,
        removeLanguage: languageHandlers.remove,
        addSkill,
        removeSkill,
        loadResume,
        resetResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error('useResume must be used within ResumeProvider');
  return ctx;
};
