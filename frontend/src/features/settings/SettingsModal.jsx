import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Camera, Loader2, Check, Moon, Sun, Monitor } from 'lucide-react'; // Thêm icon
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext'; // Import Theme Hook
import { updateUserDetails } from '../../api/authApi';
import { uploadImage } from '../../api/pageApi';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Label } from '../../components/ui/Label';
import { cn } from '../../utils/cn';

const SettingsModal = ({ open, onOpenChange }) => {
  const { user, dispatch } = useAuth();
  const { theme, setTheme } = useTheme(); // Lấy theme
  
  // State quản lý Tab
  const [activeTab, setActiveTab] = useState('my-account');

  // Form states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [newPassword, setNewPassword] = useState('');
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const data = await uploadImage(file);
      setAvatar(data.url);
    } catch (error) {
      alert('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    setSuccessMsg('');
    try {
      const updateData = { name, email, avatar };
      if (newPassword) updateData.password = newPassword;
      const res = await updateUserDetails(updateData);
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        payload: { user: res.data, token: localStorage.getItem('token') } 
      });
      setSuccessMsg('Settings updated successfully!');
      setNewPassword('');
    } catch (error) {
      alert(error.message || 'Update failed');
    } finally {
      setIsLoading(false);
    }
  };

  // --- SUB-COMPONENTS CHO TỪNG TAB ---

  const SidebarItem = ({ id, label, currentTab, setTab }) => (
    <button
      onClick={() => setTab(id)}
      className={cn(
        "flex items-center w-full px-2 py-1.5 text-sm rounded-md transition-colors",
        currentTab === id 
          ? "bg-neutral-700 text-white font-medium" 
          : "text-gray-400 hover:bg-neutral-800"
      )}
    >
      <span className="truncate">{label}</span>
    </button>
  );

  const ThemeCard = ({ value, label, icon: Icon }) => (
    <div 
      onClick={() => setTheme(value)}
      className={cn(
        "cursor-pointer rounded-lg border p-4 flex flex-col items-center gap-2 transition-all",
        theme === value 
          ? "border-brand bg-brand/10 text-brand" 
          : "border-neutral-700 bg-neutral-800 text-gray-400 hover:bg-neutral-700"
      )}
    >
      <Icon className="h-6 w-6" />
      <span className="text-sm font-medium">{label}</span>
      {/* Radio circle visual */}
      <div className={cn(
        "w-4 h-4 rounded-full border flex items-center justify-center mt-2",
        theme === value ? "border-brand" : "border-gray-500"
      )}>
        {theme === value && <div className="w-2 h-2 rounded-full bg-brand" />}
      </div>
    </div>
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[900px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-neutral-900 border border-neutral-700 shadow-2xl z-[70] flex overflow-hidden data-[state=open]:animate-in data-[state=open]:zoom-in-95 focus:outline-none">
          
          {/* 1. Sidebar Menu */}
          <div className="w-64 bg-neutral-800/50 border-r border-neutral-800 p-4 flex flex-col space-y-1">
            <div className="text-xs font-bold text-gray-500 mb-2 px-2">ACCOUNT</div>
            <SidebarItem id="my-account" label="My account" currentTab={activeTab} setTab={setActiveTab} />
            <SidebarItem id="settings" label="Settings" currentTab={activeTab} setTab={setActiveTab} />
            
            <div className="text-xs font-bold text-gray-500 mb-2 px-2 mt-6">APP SETTINGS</div>
            <SidebarItem id="preferences" label="My settings" currentTab={activeTab} setTab={setActiveTab} />
          </div>

          {/* 2. Nội dung chính */}
          <div className="flex-1 p-8 overflow-y-auto">
            
            {/* --- TAB: MY ACCOUNT --- */}
            {activeTab === 'my-account' && (
              <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Dialog.Title className="text-xl font-bold text-gray-100 mb-6 border-b border-neutral-800 pb-4">
                  My account
                </Dialog.Title>

                <div className="flex items-center mb-8 pb-8 border-b border-neutral-800">
                  <div className="relative group mr-6">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-700 flex items-center justify-center border border-neutral-600">
                      {avatar ? (
                        <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-gray-400">{name.charAt(0)?.toUpperCase()}</span>
                      )}
                    </div>
                    <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                      {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5 mb-1" />}
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-200">Profile photo</h3>
                    <p className="text-xs text-gray-500 mt-1">Click the image to upload.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid gap-2">
                    <Label className="text-gray-400">Preferred name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-neutral-900 border-neutral-700" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-gray-400">Email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-neutral-900 border-neutral-700" />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-gray-400">New Password</Label>
                    <Input type="password" placeholder="Set a new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-neutral-900 border-neutral-700" />
                  </div>
                </div>

                <div className="mt-8 flex items-center space-x-4">
                  <Button onClick={handleUpdate} disabled={isLoading} className="bg-brand hover:bg-brand-medium text-white px-6">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update
                  </Button>
                  {successMsg && (
                    <div className="flex items-center text-green-400 text-sm">
                      <Check className="h-4 w-4 mr-1" /> {successMsg}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* --- TAB: PREFERENCES (CUSTOMIZE APPEARANCE) --- */}
            {activeTab === 'preferences' && (
              <div className="max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Dialog.Title className="text-xl font-bold text-gray-100 mb-6 border-b border-neutral-800 pb-4">
                  My settings
                </Dialog.Title>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-200 mb-4">Appearance</h3>
                  <p className="text-xs text-gray-500 mb-4">Customize how Mini-Notion looks on your device.</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <ThemeCard value="light" label="Light" icon={Sun} />
                    <ThemeCard value="dark" label="Dark" icon={Moon} />
                    <ThemeCard value="system" label="System" icon={Monitor} />
                  </div>
                </div>
              </div>
            )}

          </div>

          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-neutral-800 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SettingsModal;