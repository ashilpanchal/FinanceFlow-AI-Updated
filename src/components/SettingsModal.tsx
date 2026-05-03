import React, { useState } from 'react';
import { X, Shield, Users, Lock, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [activeRole, setActiveRole] = useState('Personal');
  const [isSaving, setIsSaving] = useState(false);

  const roles = [
    { id: 'Personal', name: 'Personal', desc: 'Standard access for personal tracking.', icon: Lock, color: 'bg-primary' },
    { id: 'Business', name: 'Business Owner', desc: 'Add staff and shared expense tracking.', icon: Users, color: 'bg-tertiary' },
    { id: 'Admin', name: 'System Admin', desc: 'Full control over auditing and reports.', icon: Shield, color: 'bg-on-surface' },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 1000);
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
            className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden text-left flex flex-col max-h-[90vh]"
          >
            <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-background">
              <div>
                <h2 className="text-xl font-display font-bold text-on-surface">System Settings</h2>
                <p className="text-xs text-on-surface-variant font-medium">Manage your workspace and permissions</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-outline-variant/30">
                <X className="w-5 h-5 text-outline" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <section className="space-y-4">
                <h3 className="label-caps text-[11px] text-outline px-1">Role-Based Access Control</h3>
                <div className="space-y-3">
                  {roles.map((role) => (
                    <button 
                      key={role.id}
                      onClick={() => setActiveRole(role.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                        activeRole === role.id 
                          ? "bg-primary/5 border-primary shadow-sm" 
                          : "bg-background border-outline-variant hover:border-outline"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform",
                        role.color
                      )}>
                        <role.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-on-surface">{role.name}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">{role.desc}</p>
                      </div>
                      {activeRole === role.id && (
                        <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>

              <section className="p-4 bg-tertiary-container/20 rounded-2xl border border-tertiary-container/30 flex gap-4">
                <AlertCircle className="w-6 h-6 text-tertiary shrink-0 mt-1" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-on-surface">Data Sovereignty</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Changing your role to **Business** or **Admin** will enable multi-user collaboration and audit logging. High security mode will be activated.
                  </p>
                </div>
              </section>
            </div>

            <div className="p-6 border-t border-outline-variant bg-background flex gap-4">
              <button 
                onClick={onClose}
                className="flex-1 py-3 text-on-surface-variant font-bold hover:bg-white rounded-xl border border-outline-variant transition-all active:scale-95"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-3 bg-on-surface text-surface font-bold rounded-xl shadow-lg hover:bg-on-surface/90 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isSaving ? "Saving..." : "Apply Access Settings"}
                {!isSaving && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;
