import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Camera, GraduationCap, Link2, Plus, Trash2, Save, 
  ArrowLeft, Upload, HelpCircle, Key, RefreshCw, X, Check, Award
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';

// --- Zero-Dependency Canvas Cropper Component ---
function ImageCropperModal({ image, aspectRatio, onCrop, onClose }) {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const maskWidth = aspectRatio === 1 ? 260 : 380;
  const maskHeight = aspectRatio === 1 ? 260 : 130;

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch support for mobile devices
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - offset.x,
      y: e.touches[0].clientY - offset.y
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleSave = () => {
    const img = imgRef.current;
    if (!img) return;

    const canvas = document.createElement('canvas');
    // Set output crop dimensions
    canvas.width = aspectRatio === 1 ? 400 : 1200;
    canvas.height = aspectRatio === 1 ? 400 : 400;
    const ctx = canvas.getContext('2d');

    // Draw background color if transparent
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions
    const scaleFactor = scale;
    const destWidth = canvas.width * scaleFactor;
    const destHeight = (canvas.width / (img.naturalWidth / img.naturalHeight)) * scaleFactor;

    // Center offsets corresponding to UI mask viewport
    // Map offset from screen coordinate back to canvas coordinates
    const scaleUItoCanvas = canvas.width / maskWidth;
    
    // UI centers the image
    const uiCenterX = maskWidth / 2;
    const uiCenterY = maskHeight / 2;

    const dx = (canvas.width / 2) + (offset.x * scaleUItoCanvas);
    const dy = (canvas.height / 2) + (offset.y * scaleUItoCanvas);

    ctx.save();
    ctx.translate(dx, dy);
    ctx.drawImage(img, -destWidth / 2, -destHeight / 2, destWidth, destHeight);
    ctx.restore();

    const croppedBase64 = canvas.toDataURL('image/jpeg', 0.85);
    onCrop(croppedBase64);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white dark:bg-[#0b0e24] border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col gap-5"
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Crop Your Image</h3>
            <p className="text-xs text-slate-400 mt-0.5">Drag to reposition, use slider to zoom</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Frame */}
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseDown={handleMouseDown}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          onTouchStart={handleTouchStart}
          className="relative w-full h-[280px] bg-slate-100 dark:bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center cursor-move select-none"
        >
          {/* Output Mask */}
          <div 
            style={{ width: `${maskWidth}px`, height: `${maskHeight}px` }}
            className={`absolute z-10 pointer-events-none border-2 border-indigo-500 shadow-[0_0_0_9999px_rgba(5,8,22,0.65)] ${
              aspectRatio === 1 ? 'rounded-full' : 'rounded-lg'
            }`}
          />
          
          <img 
            ref={imgRef}
            src={image}
            alt="Source profile crop"
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
              maxWidth: '80%',
              maxHeight: '80%',
              objectFit: 'contain',
              pointerEvents: 'none'
            }}
            className="transition-transform duration-75"
          />
        </div>

        {/* Zoom Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Zoom Out</span>
            <span>Zoom In ({Math.round(scale * 100)}%)</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="3" 
            step="0.05" 
            value={scale} 
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" /> Save cropped image
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// --- Main Profile Page View ---
export default function ProfilePage() {
  const { user, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  // Form States
  const [name, setName] = useState('');
  const [careerField, setCareerField] = useState('');
  const [portfolioUsername, setPortfolioUsername] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [phone, setPhone] = useState('');
  
  // Tag editor for skills
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');

  // Education Sub-arrays
  const [education, setEducation] = useState([]);
  const [newEd, setNewEd] = useState({ school: '', degree: '', startYear: '', endYear: '' });

  // Social Links
  const [socialLinks, setSocialLinks] = useState({ github: '', linkedin: '', twitter: '', website: '' });

  // Cropper helper state
  const [activeCrop, setActiveCrop] = useState(null); // { image, aspectRatio, type: 'avatar' | 'cover' }
  const [submitting, setSubmitting] = useState(false);

  // Sync profile details when user context loads
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setCareerField(user.careerField || '');
      setPortfolioUsername(user.portfolioUsername || '');
      setProfilePicture(user.profilePicture || '');
      setCoverImage(user.coverImage || '');
      setPhone(user.phone || '');
      setSkills(user.skills || []);
      setEducation(user.education || []);
      setSocialLinks(user.socialLinks || { github: '', linkedin: '', twitter: '', website: '' });
    }
  }, [user]);

  // Image Upload helper functions
  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file format');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setActiveCrop({
        image: reader.result,
        aspectRatio: type === 'avatar' ? 1 : 3,
        type
      });
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset file input
  };

  const savePhotoUpdate = async (type, imageValue) => {
    try {
      const updates = {
        name,
        careerField,
        portfolioUsername,
        profilePicture: type === 'avatar' ? imageValue : profilePicture,
        coverImage: type === 'cover' ? imageValue : coverImage,
        education,
        skills,
        socialLinks,
        phone
      };
      
      const res = await updateProfile(updates);
      if (res.success) {
        if (type === 'avatar') {
          setProfilePicture(imageValue);
          toast.success(imageValue ? 'Profile picture updated & saved!' : 'Profile picture removed!');
        } else {
          setCoverImage(imageValue);
          toast.success(imageValue ? 'Cover banner updated & saved!' : 'Cover banner removed!');
        }
      } else {
        toast.error(res.error || 'Failed to auto-save image');
      }
    } catch (err) {
      toast.error('Error saving image changes');
    }
  };

  const handleCropComplete = async (croppedBase64) => {
    const cropType = activeCrop.type;
    setActiveCrop(null);
    await savePhotoUpdate(cropType, croppedBase64);
  };

  const removePhoto = async (type) => {
    await savePhotoUpdate(type, '');
  };

  // Add / Delete education items
  const addEducation = () => {
    if (!newEd.school.trim() || !newEd.degree.trim()) {
      toast.error('School and Degree are required');
      return;
    }
    setEducation(prev => [...prev, newEd]);
    setNewEd({ school: '', degree: '', startYear: '', endYear: '' });
    toast.success('Education record added!');
  };

  const deleteEducation = (index) => {
    setEducation(prev => prev.filter((_, idx) => idx !== index));
    toast.success('Education record deleted');
  };

  // Add / Delete Skills tags
  const addSkill = (e) => {
    e.preventDefault();
    const val = skillInput.trim();
    if (!val) return;
    if (skills.includes(val)) {
      toast.error('Skill already added!');
      return;
    }
    setSkills(prev => [...prev, val]);
    setSkillInput('');
  };

  const deleteSkill = (skillToDelete) => {
    setSkills(prev => prev.filter(s => s !== skillToDelete));
  };

  // Form Submit Action
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Compulsory details validations
    if (!name || !name.trim()) {
      toast.error('Full Name is required');
      return;
    }
    if (!careerField || !careerField.trim()) {
      toast.error('Career Field is required');
      return;
    }
    if (!phone || !phone.trim()) {
      toast.error('Phone Number is required');
      return;
    }
    if (!skills || skills.length === 0) {
      toast.error('Please add at least one professional skill');
      return;
    }
    if (!education || education.length === 0) {
      toast.error('Please add at least one education record');
      return;
    }

    setSubmitting(true);
    try {
      const updates = {
        name,
        careerField,
        portfolioUsername,
        profilePicture,
        coverImage,
        education,
        skills,
        socialLinks,
        phone,
        onboardingCompleted: true
      };
      
      const res = await updateProfile(updates);
      if (res.success) {
        toast.success('Profile updated successfully!');
        navigate('/dashboard');
      } else {
        toast.error(res.error || 'Failed to update profile');
      }
    } catch (err) {
      toast.error('Error saving profile changes');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-white relative transition-colors duration-300 font-sans pb-16">
      <PremiumAnimatedBackground />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 relative z-10">
        
        {/* Navigation Breadcrumb */}
        {user?.onboardingCompleted && (
          <div className="flex items-center gap-2 mb-6">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 hover:text-slate-950 dark:hover:text-white transition flex items-center gap-1 text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </button>
          </div>
        )}

        <div className="space-y-6">
          
          {/* 1. Profile Banner Card (Covers + Avatar Upload) */}
          <div className="relative bg-white dark:bg-[#0b0e24]/60 border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl overflow-hidden backdrop-blur-2xl">
            {/* Cover Picture */}
            <div className="relative h-44 sm:h-56 bg-slate-200 dark:bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-200 dark:border-white/10">
              {coverImage ? (
                <img 
                  src={coverImage} 
                  alt="User cover banner" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-indigo-950 via-[#0c0a24] to-[#1e1145] relative overflow-hidden flex items-center justify-center">
                  <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[140%] rounded-full bg-indigo-600/10 blur-[80px]" />
                  <div className="absolute bottom-[-30%] right-[-10%] w-[40%] h-[120%] rounded-full bg-pink-500/10 blur-[80px]" />
                  <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
                  <div className="text-slate-400 dark:text-slate-500 text-xs font-semibold flex flex-col items-center gap-1.5 z-10">
                    <Upload className="w-5 h-5 text-indigo-400/80" />
                    <span>Upload a custom cover photo (Recommended 3:1)</span>
                  </div>
                </div>
              )}

              {/* Cover Image Upload Action Triggers */}
              <div className="absolute bottom-3 right-3 flex gap-2 z-20 no-print">
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1 border border-white/10 shadow-lg cursor-pointer"
                  title="Change Cover Banner"
                >
                  <Camera className="w-4 h-4" />
                  <span className="hidden sm:inline">Change Banner</span>
                </button>
                {coverImage && (
                  <button
                    type="button"
                    onClick={() => removePhoto('cover')}
                    className="p-2 rounded-xl bg-red-600/90 hover:bg-red-600 text-white font-bold text-xs border border-transparent shadow-lg cursor-pointer"
                    title="Remove Cover Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <input 
                  type="file" 
                  ref={coverInputRef} 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, 'cover')} 
                  className="hidden" 
                />
              </div>
            </div>

            {/* Profile Avatar Picture (Absolute placement overlapping Banner) */}
            <div className="px-6 pb-6 pt-16 sm:pt-20 relative">
              <div className="absolute -top-14 sm:-top-16 left-6">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-[#0b0e24] bg-indigo-600 shadow-xl overflow-hidden group flex items-center justify-center text-white text-3xl font-extrabold select-none">
                  {profilePicture ? (
                    <img 
                      src={profilePicture} 
                      alt="User circular avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{name ? name.charAt(0).toUpperCase() : 'U'}</span>
                  )}

                  {/* Profile Image Action overlays on Hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-300 no-print">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                      title="Upload New Avatar"
                    >
                      <Camera className="w-4.5 h-4.5" />
                    </button>
                    {profilePicture && (
                      <button
                        type="button"
                        onClick={() => removePhoto('avatar')}
                        className="p-1.5 rounded-lg bg-red-600/30 hover:bg-red-600/60 text-red-400 cursor-pointer"
                        title="Remove Avatar"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={(e) => handleFileChange(e, 'avatar')} 
                    className="hidden" 
                  />
                </div>
              </div>

              {/* Title Section details */}
              <div className="sm:pl-36 space-y-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{name || 'Your Profile Name'}</h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 capitalize">{careerField || 'Software Engineer'}</p>
                <div className="flex items-center gap-1 text-[10px] bg-indigo-500/10 text-indigo-500 px-2.5 py-0.5 rounded-full w-max font-bold border border-indigo-500/20 uppercase tracking-wider">
                  <Award className="w-3 h-3" />
                  <span>{user?.role || 'User'} Mode</span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Personal Information Fields Grid */}
          <div className="bg-white dark:bg-[#0b0e24]/60 border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-6 sm:p-8 backdrop-blur-2xl space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-white/5 pb-4">
              <User className="w-5 h-5 text-indigo-500" />
              <h2 className="text-sm font-bold tracking-wide text-slate-900 dark:text-white uppercase">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-0.5">
                  Full Name <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:border-indigo-500 transition-all duration-300"
                />
              </div>

              {/* Email Address (ReadOnly) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-0.5">
                  Email Address (Locked) <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input 
                  type="email" 
                  readOnly 
                  value={user?.email || ''} 
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950 text-slate-400 rounded-xl text-xs outline-none select-all cursor-not-allowed"
                />
              </div>

              {/* Career Field */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-0.5">
                  Career Field <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input 
                  type="text" 
                  value={careerField} 
                  onChange={(e) => setCareerField(e.target.value)} 
                  placeholder="e.g. Software Engineer, UI/UX Designer"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:border-indigo-500 transition-all duration-300"
                />
              </div>

              {/* Portfolio Username */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Portfolio Username</label>
                <input 
                  type="text" 
                  value={portfolioUsername} 
                  onChange={(e) => setPortfolioUsername(e.target.value)} 
                  placeholder="e.g. john-doe (alphanumeric)"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:border-indigo-500 transition-all duration-300"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-0.5">
                  Phone Number <span className="text-red-500 font-extrabold">*</span>
                </label>
                <input 
                  type="tel" 
                  required
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="e.g. +1 234 567 8900"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:border-indigo-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* 3. Skills Tag Editor */}
          <div className="bg-white dark:bg-[#0b0e24]/60 border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-6 sm:p-8 backdrop-blur-2xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-white/5 pb-4">
              <Award className="w-5 h-5 text-indigo-500" />
              <h2 className="text-sm font-bold tracking-wide text-slate-900 dark:text-white uppercase flex items-center gap-1">
                Professional Skills <span className="text-red-500 font-extrabold">*</span>
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={skillInput} 
                  onChange={(e) => setSkillInput(e.target.value)} 
                  placeholder="Add a skill tag (e.g. React, Node.js, Python)"
                  className="flex-grow px-4 py-2.5 border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:border-indigo-500 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {/* Skills Tag Array Display */}
              <div className="flex flex-wrap gap-2 pt-2">
                {skills.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No skills listed yet. Add skills above.</p>
                ) : (
                  skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1.5 bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-xl border border-indigo-500/15 flex items-center gap-1.5 transition select-none"
                    >
                      {skill}
                      <button 
                        type="button"
                        onClick={() => deleteSkill(skill)}
                        className="text-slate-400 hover:text-red-500 transition cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 4. Education Records */}
          <div className="bg-white dark:bg-[#0b0e24]/60 border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-6 sm:p-8 backdrop-blur-2xl space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-white/5 pb-4">
              <GraduationCap className="w-5 h-5 text-indigo-500" />
              <h2 className="text-sm font-bold tracking-wide text-slate-900 dark:text-white uppercase flex items-center gap-1">
                Education Records <span className="text-red-500 font-extrabold">*</span>
              </h2>
            </div>

            {/* List existing education records */}
            <div className="space-y-3">
              {education.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No education records added yet. Submit one below.</p>
              ) : (
                education.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-4 border border-slate-100 dark:border-white/5 rounded-2xl bg-slate-50/50 dark:bg-white/[0.01] flex items-center justify-between gap-4"
                  >
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.degree}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">{item.school}</p>
                      <p className="text-[10px] text-slate-400">{item.startYear} - {item.endYear || 'Present'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteEducation(idx)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition cursor-pointer border border-transparent hover:border-red-500/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add new education block */}
            <div className="pt-4 border-t border-slate-100 dark:border-white/5 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">Add Education Record</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="School / University"
                  value={newEd.school}
                  onChange={(e) => setNewEd(prev => ({ ...prev, school: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:border-indigo-500 transition"
                />
                <input 
                  type="text" 
                  placeholder="Degree (e.g. Bachelor of Science in CS)"
                  value={newEd.degree}
                  onChange={(e) => setNewEd(prev => ({ ...prev, degree: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:border-indigo-500 transition"
                />
                <input 
                  type="text" 
                  placeholder="Start Year (e.g. 2021)"
                  value={newEd.startYear}
                  onChange={(e) => setNewEd(prev => ({ ...prev, startYear: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:border-indigo-500 transition"
                />
                <input 
                  type="text" 
                  placeholder="End Year (e.g. 2025 or Present)"
                  value={newEd.endYear}
                  onChange={(e) => setNewEd(prev => ({ ...prev, endYear: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:border-indigo-500 transition"
                />
              </div>
              <button
                type="button"
                onClick={addEducation}
                className="py-2 px-4 border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold transition hover:bg-indigo-500/20 cursor-pointer"
              >
                + Add Record
              </button>
            </div>
          </div>

          {/* 5. Social Links */}
          <div className="bg-white dark:bg-[#0b0e24]/60 border border-slate-200 dark:border-white/10 shadow-xl rounded-3xl p-6 sm:p-8 backdrop-blur-2xl space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-white/5 pb-4">
              <Link2 className="w-5 h-5 text-indigo-500" />
              <h2 className="text-sm font-bold tracking-wide text-slate-900 dark:text-white uppercase">Social & Portfolio Links</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* GitHub */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase">GitHub URL</label>
                <input 
                  type="url" 
                  value={socialLinks.github}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, github: e.target.value }))}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* LinkedIn */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase">LinkedIn URL</label>
                <input 
                  type="url" 
                  value={socialLinks.linkedin}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Twitter / X */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Twitter / X URL</label>
                <input 
                  type="url" 
                  value={socialLinks.twitter}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                  placeholder="https://twitter.com/username"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* Website */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase">Personal Website</label>
                <input 
                  type="url" 
                  value={socialLinks.website}
                  onChange={(e) => setSocialLinks(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://personalwebsite.com"
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl text-xs outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Form Actions Footer block */}
          <div className="flex gap-4 items-center justify-end">
            <button
              type="button"
              disabled={submitting}
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={handleFormSubmit}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-500 hover:to-brand-500 text-white font-bold text-xs rounded-2xl shadow-glow-brand flex items-center gap-1.5 transition cursor-pointer"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> Save Profile Details
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Zero-Dependency Image Cropping Overlay Modal */}
      <AnimatePresence>
        {activeCrop && (
          <ImageCropperModal 
            image={activeCrop.image} 
            aspectRatio={activeCrop.aspectRatio} 
            onCrop={handleCropComplete} 
            onClose={() => setActiveCrop(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
