import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Plus, Trash2, Upload, User, FileText, Briefcase,
  GraduationCap, Wrench, FolderGit2, Trophy, Award, Languages, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../utils/api';
import { useResume } from '../context/ResumeContext';
import { getTemplateMeta } from '../constants/templates';
import DesignControls from './DesignControls';
import TemplateSelector from './TemplateSelector';
import AccordionSection from './AccordionSection';
import DraggableList from './DraggableList';
import AiImproveModal from './builder/AiImproveModal';

const AIPolishButton = ({ onClick, loading, label = 'Improve with AI' }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-3 py-1.5 rounded-lg font-semibold disabled:opacity-50 transition shadow-sm"
  >
    <Sparkles className="w-3.5 h-3.5" />
    {label}
  </button>
);

const ItemCard = ({ children, onRemove, className = '' }) => (
  <div className={`p-5 pl-10 bg-slate-100/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl relative group ${className}`}>
    <button type="button" onClick={onRemove}
      className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition flex items-center gap-1 text-xs">
      <Trash2 className="w-3 h-3" /> Remove
    </button>
    {children}
  </div>
);

const ResumeForm = () => {
  const {
    resumeData, updatePersonalInfo, updateSummary,
    addExperience, updateExperience, removeExperience, reorderExperience,
    addEducation, updateEducation, removeEducation,
    addProject, updateProject, removeProject, reorderProjects,
    addAchievement, updateAchievement, removeAchievement,
    addCertification, updateCertification, removeCertification,
    addLanguage, updateLanguage, removeLanguage,
    addSkill, removeSkill,
  } = useResume();

  const [isGenerating, setIsGenerating] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const templateMeta = getTemplateMeta(resumeData.settings.template);

  // AI Improvement Modal Trigger States
  const [improveOpen, setImproveOpen] = useState(false);
  const [textToImprove, setTextToImprove] = useState('');
  const [improveFieldName, setImproveFieldName] = useState('');
  const [onImproveAccept, setOnImproveAccept] = useState(() => () => {});

  const triggerAiImprove = (text, fieldName, onAccept) => {
    if (!text?.trim()) {
      toast.error(`Please enter some text in the ${fieldName} field first!`);
      return;
    }
    setTextToImprove(text);
    setImproveFieldName(fieldName);
    setOnImproveAccept(() => onAccept);
    setImproveOpen(true);
  };

  const inputClass = 'w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition';
  const smallInputClass = 'w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm';

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error('Photo must be under 2MB');
    const reader = new FileReader();
    reader.onload = () => updatePersonalInfo('photo', reader.result);
    reader.readAsDataURL(file);
  };

  const generateAISummary = async () => {
    if (!resumeData.personalInfo.jobTitle) return toast.error('Please enter a Job Title first!');
    setIsGenerating(true);
    try {
      const { data } = await API.post('/ai/generate-summary', { jobTitle: resumeData.personalInfo.jobTitle });
      updateSummary(data.summary);
      toast.success('Summary generated successfully!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to generate summary.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderFields = (item, index, fields, onChange) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map(({ name, label, type = 'text', colSpan = 1 }) => (
        <div key={name} className={colSpan === 2 ? 'md:col-span-2' : ''}>
          <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</label>
          {type === 'textarea' ? (
            <div>
              <textarea value={item[name] || ''} onChange={(e) => onChange(index, name, e.target.value)} rows={3}
                className={`${smallInputClass} resize-none`} />
              <div className="text-right text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                {(item[name] || '').length} characters
              </div>
            </div>
          ) : (
            <input type={type} value={item[name] || ''} onChange={(e) => onChange(index, name, e.target.value)}
              className={smallInputClass} />
          )}
        </div>
      ))}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
      <TemplateSelector />
      <DesignControls />

      {/* Personal Info */}
      <AccordionSection title="Personal Information" icon={User} defaultOpen badge={resumeData.personalInfo.fullName ? '✓' : null}>
        {templateMeta.hasPhoto && (
          <div className="mb-5 p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-xl">
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Profile Photo</label>
            <div className="flex items-center gap-4">
              {resumeData.personalInfo.photo && (
                <img src={resumeData.personalInfo.photo} alt="" className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500" />
              )}
              <label className="flex items-center gap-2 cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                <Upload className="w-4 h-4" /> Upload
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              {resumeData.personalInfo.photo && (
                <button type="button" onClick={() => updatePersonalInfo('photo', '')} className="text-sm text-slate-400 hover:text-red-400">Remove</button>
              )}
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            ['fullName', 'Full Name'], ['jobTitle', 'Job Title'], ['email', 'Email'],
            ['phone', 'Phone'], ['location', 'Location'], ['linkedin', 'LinkedIn / Portfolio'],
          ].map(([name, label]) => (
            <div key={name}>
              <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{label}</label>
              <input type="text" value={resumeData.personalInfo[name] || ''} onChange={(e) => updatePersonalInfo(name, e.target.value)} className={inputClass} />
            </div>
          ))}
        </div>
      </AccordionSection>

      {/* Summary */}
      <AccordionSection title="Professional Summary" icon={FileText} badge={resumeData.summary ? '✓' : null}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">Brief summary of your career history</span>
          <div className="flex gap-2">
            <button type="button" onClick={generateAISummary} disabled={isGenerating}
              className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50 transition">
              {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              Write with AI
            </button>
            <AIPolishButton 
              label="Improve Summary"
              onClick={() => triggerAiImprove(resumeData.summary, 'Professional Summary', (polished) => updateSummary(polished))}
            />
          </div>
        </div>
        <div className="relative">
          <textarea value={resumeData.summary} onChange={(e) => updateSummary(e.target.value)} rows={5}
            className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none text-sm"
            placeholder="e.g. Passionate software engineer with 5+ years of experience..."
          />
          <div className="text-right text-xs text-slate-400 dark:text-slate-500 mt-1">
            {resumeData.summary?.length || 0} / 500 characters
          </div>
        </div>
      </AccordionSection>

      {/* Work Experience */}
      <AccordionSection title="Work Experience" icon={Briefcase} badge={resumeData.experience.length || null}>
        <div className="flex justify-end mb-4">
          <button type="button" onClick={addExperience} className="flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg">
            <Plus className="w-4 h-4" /> Add Experience
          </button>
        </div>
        <DraggableList
          items={resumeData.experience}
          onReorder={reorderExperience}
          droppableId="experience"
          renderItem={(exp, index) => (
            <ItemCard onRemove={() => removeExperience(index)}>
              {renderFields(exp, index, [
                { name: 'company', label: 'Company' }, { name: 'position', label: 'Position' },
                { name: 'startDate', label: 'Start Date' }, { name: 'endDate', label: 'End Date' },
              ], updateExperience)}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Description</label>
                  <AIPolishButton 
                    onClick={() => triggerAiImprove(exp.description, 'Experience Description', (polished) => updateExperience(index, 'description', polished))} 
                  />
                </div>
                <textarea value={exp.description || ''} onChange={(e) => updateExperience(index, 'description', e.target.value)} rows={4}
                  className={`${smallInputClass} resize-none`} placeholder="Describe your roles, impact and tools here..." />
                <div className="text-right text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  {(exp.description || '').length} / 1000 characters
                </div>
              </div>
            </ItemCard>
          )}
        />
      </AccordionSection>

      {/* Education */}
      <AccordionSection title="Education" icon={GraduationCap} badge={resumeData.education.length || null}>
        <div className="flex justify-end mb-4">
          <button type="button" onClick={addEducation} className="flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg">
            <Plus className="w-4 h-4" /> Add Education
          </button>
        </div>
        <div className="space-y-4">
          {resumeData.education.map((edu, index) => (
            <ItemCard key={index} onRemove={() => removeEducation(index)}>
              {renderFields(edu, index, [
                { name: 'school', label: 'School / University' }, { name: 'degree', label: 'Degree' },
                { name: 'startDate', label: 'Start Date' }, { name: 'endDate', label: 'End Date' },
              ], updateEducation)}
            </ItemCard>
          ))}
        </div>
      </AccordionSection>

      {/* Projects */}
      <AccordionSection title="Projects" icon={FolderGit2} badge={resumeData.projects.length || null}>
        <div className="flex justify-end mb-4">
          <button type="button" onClick={addProject} className="flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg">
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>
        <DraggableList items={resumeData.projects} onReorder={reorderProjects} droppableId="projects"
          renderItem={(proj, index) => (
            <ItemCard onRemove={() => removeProject(index)}>
              {renderFields(proj, index, [
                { name: 'name', label: 'Project Name' }, { name: 'url', label: 'URL' },
                { name: 'startDate', label: 'Start Date' }, { name: 'endDate', label: 'End Date' },
              ], updateProject)}
              <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Description</label>
                  <AIPolishButton 
                    onClick={() => triggerAiImprove(proj.description, 'Project Description', (polished) => updateProject(index, 'description', polished))} 
                  />
                </div>
                <textarea value={proj.description || ''} onChange={(e) => updateProject(index, 'description', e.target.value)} rows={4}
                  className={`${smallInputClass} resize-none`} placeholder="Describe project requirements and technologies used..." />
                <div className="text-right text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                  {(proj.description || '').length} / 1000 characters
                </div>
              </div>
            </ItemCard>
          )}
        />
      </AccordionSection>

      {/* Achievements */}
      <AccordionSection title="Achievements" icon={Trophy} badge={resumeData.achievements.length || null}>
        <div className="flex justify-end mb-4">
          <button type="button" onClick={addAchievement} className="flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg">
            <Plus className="w-4 h-4" /> Add Achievement
          </button>
        </div>
        <div className="space-y-4">
          {resumeData.achievements.map((item, index) => (
            <ItemCard key={index} onRemove={() => removeAchievement(index)}>
              {renderFields(item, index, [
                { name: 'title', label: 'Title' }, { name: 'date', label: 'Date' },
                { name: 'description', label: 'Description', type: 'textarea', colSpan: 2 },
              ], updateAchievement)}
            </ItemCard>
          ))}
        </div>
      </AccordionSection>

      {/* Certifications */}
      <AccordionSection title="Certifications" icon={Award} badge={resumeData.certifications.length || null}>
        <div className="flex justify-end mb-4">
          <button type="button" onClick={addCertification} className="flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg">
            <Plus className="w-4 h-4" /> Add Certification
          </button>
        </div>
        <div className="space-y-4">
          {resumeData.certifications.map((item, index) => (
            <ItemCard key={index} onRemove={() => removeCertification(index)}>
              {renderFields(item, index, [
                { name: 'name', label: 'Certification Name' }, { name: 'issuer', label: 'Issuer' }, { name: 'date', label: 'Date' },
              ], updateCertification)}
            </ItemCard>
          ))}
        </div>
      </AccordionSection>

      {/* Languages */}
      <AccordionSection title="Languages" icon={Languages} badge={resumeData.languages.length || null}>
        <div className="flex justify-end mb-4">
          <button type="button" onClick={addLanguage} className="flex items-center gap-1 text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg">
            <Plus className="w-4 h-4" /> Add Language
          </button>
        </div>
        <div className="space-y-4">
          {resumeData.languages.map((item, index) => (
            <ItemCard key={index} onRemove={() => removeLanguage(index)}>
              {renderFields(item, index, [
                { name: 'language', label: 'Language' }, { name: 'proficiency', label: 'Proficiency (e.g. Native, Fluent)' },
              ], updateLanguage)}
            </ItemCard>
          ))}
        </div>
      </AccordionSection>

      {/* Skills */}
      <AccordionSection title="Skills" icon={Wrench} badge={resumeData.skills.length || null}>
        <form onSubmit={(e) => { e.preventDefault(); if (skillInput.trim()) { addSkill(skillInput); setSkillInput(''); } }} className="flex gap-3 mb-4">
          <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
            className="flex-grow px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="React, Python, Leadership..." />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-medium">Add</button>
        </form>
        <div className="flex flex-wrap gap-2">
          {resumeData.skills.map((skill, index) => (
            <span key={index} className="bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full text-sm flex items-center">
              {skill}
              <button type="button" onClick={() => removeSkill(index)} className="ml-2 hover:text-red-400">✕</button>
            </span>
          ))}
        </div>
      </AccordionSection>

      {/* AI Improvement Modal */}
      <AiImproveModal
        isOpen={improveOpen}
        onClose={() => setImproveOpen(false)}
        originalText={textToImprove}
        fieldName={improveFieldName}
        onAccept={onImproveAccept}
      />
    </motion.div>
  );
};

export default ResumeForm;
