import React, { useState } from 'react';
import { X, User, Mail, Image as ImageIcon, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';
import { updateProfile, updateEmail } from 'firebase/auth';
import { cn } from '../lib/utils';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await updateProfile(user, { displayName, photoURL });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Profile Update Error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden p-8 text-left"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-background rounded-full transition-colors">
              <X className="w-5 h-5 text-outline" />
            </button>

            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img 
                    src={photoURL || "https://ui-avatars.com/api/?name=" + displayName} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full border-4 border-primary/10 shadow-inner object-cover"
                  />
                  <label className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:bg-blue-700 transition-all cursor-pointer">
                    <ImageIcon className="w-4 h-4" />
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageChange} 
                    />
                  </label>
                </div>
                <h2 className="text-2xl font-display font-bold text-on-surface mt-4">Edit Profile</h2>
                <p className="text-sm text-on-surface-variant italic">Update your account details</p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 w-4 h-4 text-outline group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-background border border-outline-variant rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-outline group-focus-within:text-primary transition-colors" />
                    <input 
                      type="email" 
                      value={email}
                      disabled // Firebase restriction demo
                      className="w-full bg-surface-container border border-outline-variant rounded-xl py-2.5 pl-10 pr-4 outline-none opacity-70 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-outline uppercase tracking-widest pl-1">Avatar URL</label>
                  <div className="relative group">
                    <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-outline group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      className="w-full bg-background border border-outline-variant rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isUpdating || success}
                  className={cn(
                    "w-full py-3.5 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg",
                    success ? "bg-secondary text-white" : "bg-on-surface text-surface hover:bg-on-surface/90"
                  )}
                >
                  {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                   success ? <Check className="w-5 h-5" /> : "Save Changes"}
                  {success && "Profile Updated!"}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
