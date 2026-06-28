import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  ShieldCheck,
  Languages,
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';

const SECTION_METADATA = {
  summary: { label: 'Summary', icon: FileText },
  experience: { label: 'Experience', icon: Briefcase },
  education: { label: 'Education', icon: GraduationCap },
  skills: { label: 'Skills', icon: Wrench },
  projects: { label: 'Projects', icon: FolderGit2 },
  achievements: { label: 'Achievements', icon: Award },
  certifications: { label: 'Certifications', icon: ShieldCheck },
  languages: { label: 'Languages', icon: Languages },
};

function SortableItem({ id, label, icon: Icon, hasData }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 mb-2.5 rounded-xl border transition-all ${
        isDragging
          ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg scale-[1.02] backdrop-blur-md'
          : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700/80'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {hasData ? (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Active
          </span>
        ) : (
          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/10">
            Empty
          </span>
        )}
      </div>
    </div>
  );
}

export default function SectionReorder() {
  const { resumeData, updateSettings } = useResume();
  const { settings } = resumeData;

  const defaultOrder = [
    'summary',
    'experience',
    'education',
    'skills',
    'projects',
    'achievements',
    'certifications',
    'languages',
  ];

  const order = settings.sectionOrder || defaultOrder;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = order.indexOf(active.id);
    const newIndex = order.indexOf(over.id);

    const newOrder = arrayMove(order, oldIndex, newIndex);
    updateSettings('sectionOrder', newOrder);
  };

  const checkHasData = (sectionId) => {
    const data = resumeData[sectionId];
    if (!data) return false;
    if (Array.isArray(data)) return data.length > 0;
    if (typeof data === 'string') return data.trim().length > 0;
    return Object.keys(data).length > 0;
  };

  return (
    <div className="w-full">
      <div className="mb-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Section Ordering
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Drag handles to prioritize/rearrange details on the resume layout.
        </p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          <div className="max-h-[320px] overflow-y-auto pr-1">
            {order.map((id) => {
              const meta = SECTION_METADATA[id];
              if (!meta) return null;
              return (
                <SortableItem
                  key={id}
                  id={id}
                  label={meta.label}
                  icon={meta.icon}
                  hasData={checkHasData(id)}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
