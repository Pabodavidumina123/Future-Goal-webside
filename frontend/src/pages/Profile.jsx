import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Spinner from '../components/Common/Spinner';
import Toast from '../components/Common/Toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState('success');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setProfileImage(user.profileImage || '');
    }
  }, [user]);

  const triggerToast = (message, type = 'success') => {
    setToastMsg(message);
    setToastType(type);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      triggerToast('Please use a JPEG, PNG or WEBP image for your profile photo.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      triggerToast('Profile photo must be smaller than 5MB.', 'error');
      return;
    }

    setPhotoFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      let updatedProfile = { name, email, phone };

      if (photoFile) {
        const formData = new FormData();
        formData.append('profileImage', photoFile);

        const uploadRes = await api.post('/auth/profile/photo', formData);

        if (!uploadRes.data.success) {
          throw new Error(uploadRes.data.message || 'Profile photo upload failed.');
        }

        updatedProfile = { ...updatedProfile, profileImage: uploadRes.data.profileImage };
        setProfileImage(uploadRes.data.profileImage);
        triggerToast('Profile photo uploaded successfully.');
      }

      const profileRes = await api.put('/auth/profile', { name, email, phone });
      if (profileRes.data.success) {
        const latestUser = {
          ...profileRes.data.user,
          profileImage: updatedProfile.profileImage || profileImage,
        };
        updateUser(latestUser);
        triggerToast('Profile updated successfully.');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      triggerToast(error.response?.data?.message || error.message || 'Unable to update profile.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="py-28">
        <Spinner size="large" />
      </div>
    );
  }

  const avatarSrc =
    previewImage ||
    profileImage ||
    `https://ui-avatars.com/api/?background=2A4365&color=fff&name=${encodeURIComponent(user.name)}`;

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <img src={avatarSrc} alt="Profile" className="h-32 w-32 rounded-full object-cover border-4 border-indigo-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-100">{user.name}</h2>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-400">
            <div className="space-y-1">
              <p className="uppercase tracking-[0.3em] text-[10px] text-slate-500 font-semibold">Phone</p>
              <p>{user.phone || 'Not provided yet'}</p>
            </div>
            <div className="space-y-1">
              <p className="uppercase tracking-[0.3em] text-[10px] text-slate-500 font-semibold">Role</p>
              <p className="capitalize">{user.role}</p>
            </div>
            <div className="space-y-1">
              <p className="uppercase tracking-[0.3em] text-[10px] text-slate-500 font-semibold">Join Date</p>
              <p>{new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">My Profile</h1>
              <p className="text-sm text-slate-500">Update your personal details and upload your latest profile photo.</p>
            </div>
            <div className="rounded-3xl bg-slate-900/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-slate-400 border border-slate-800">
              Account</div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm text-slate-300">
                Name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
                />
              </label>
              <label className="block text-sm text-slate-300">
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
                />
              </label>
            </div>

            <label className="block text-sm text-slate-300">
              Phone Number
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none"
              />
            </label>

            <label className="block text-sm text-slate-300">
              Profile Photo
              <div className="mt-3 flex flex-col gap-3 rounded-3xl border border-dashed border-slate-800 bg-slate-950/80 p-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800">
                    <img src={avatarSrc} alt="Profile preview" className="h-full w-full object-cover" />
                  </div>
                  <div className="space-y-1 text-slate-400 text-xs">
                    <p className="text-slate-200">Upload a JPEG, PNG, or WEBP image.</p>
                    <p>Max size 5MB.</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoChange}
                  className="text-sm text-slate-400 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center w-full rounded-3xl bg-indigo-600 px-6 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-indigo-500 transition-colors disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>

      {toastMsg && <Toast message={toastMsg} type={toastType} onClose={() => setToastMsg(null)} />}
    </div>
  );
};

export default Profile;
