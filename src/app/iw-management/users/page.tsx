"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { User, CreateUserData, UserRole } from "@/types/user";
import AdminHero from "@/components/ui/AdminHero";
import { uploadImageToCDN, isValidImageFile } from "@/lib/cdn";
import usersData from "@/data/users.json";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function UsersManagementPage() {
  const { user, isAuthenticated, isLoading, hasPermission } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<CreateUserData>({
    email: '',
    name: '',
    phone: '',
    password: '',
    role: 'agent'
  });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !hasPermission(['admin']))) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, hasPermission, router]);

  useEffect(() => {
    if (isAuthenticated && hasPermission(['admin'])) {
      fetchUsers();
    }
  }, [isAuthenticated, hasPermission]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      } else {
        console.error('Kullanıcılar getirilemedi');
      }
    } catch (error) {
      console.error('Kullanıcılar getirilirken hata:', error);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      alert('Lütfen geçerli bir görsel dosyası seçin (JPEG, PNG, GIF, WEBP - max 10MB)');
      return;
    }

    setSelectedAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleCreateUser = async () => {
    try {
      // Validation
      if (!newUser.name.trim()) {
        alert('Ad Soyad alanı zorunludur');
        return;
      }
      if (!newUser.email.trim()) {
        alert('Email alanı zorunludur');
        return;
      }
      if (!newUser.password.trim()) {
        alert('Şifre alanı zorunludur');
        return;
      }

      let avatarUrl = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=150&h=150&fit=crop&crop=face`;

      if (selectedAvatar) {
        setIsUploadingAvatar(true);
        const uploadResult = await uploadImageToCDN(selectedAvatar, 'irem-users');
        if (uploadResult.success && uploadResult.url) {
          avatarUrl = uploadResult.url;
        }
        setIsUploadingAvatar(false);
      }

      // Clean phone number - ensure it's a string or undefined
      const cleanPhone = newUser.phone && newUser.phone.trim() ? newUser.phone.trim() : undefined;

      const newUserWithId: User = {
        ...newUser,
        phone: cleanPhone,
        id: `U${String(users.length + 1).padStart(3, '0')}`,
        avatar: avatarUrl,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      console.log('Creating user with data:', newUserWithId);

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUserWithId),
      });

      if (response.ok) {
        const createdUser = await response.json();
        setUsers([...users, createdUser]);
        resetModal();
        alert('Kullanıcı başarıyla eklendi!');
      } else {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        alert(`Kullanıcı eklenirken bir hata oluştu: ${errorText}`);
      }
    } catch (error) {
      console.error('Kullanıcı eklenirken hata:', error);
      alert(`Kullanıcı eklenirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  };

  const handleEditUser = (userToEdit: User) => {
    setEditUser(userToEdit);
    setAvatarPreview(userToEdit.avatar || '');
    setSelectedAvatar(null);
  };

  const handleUpdateUser = async () => {
    if (!editUser) return;

    try {
      // Validation
      if (!editUser.name.trim()) {
        alert('Ad Soyad alanı zorunludur');
        return;
      }
      if (!editUser.email.trim()) {
        alert('Email alanı zorunludur');
        return;
      }

      let avatarUrl = editUser.avatar;

      if (selectedAvatar) {
        setIsUploadingAvatar(true);
        const uploadResult = await uploadImageToCDN(selectedAvatar, 'irem-users');
        if (uploadResult.success && uploadResult.url) {
          avatarUrl = uploadResult.url;
        }
        setIsUploadingAvatar(false);
      }

      // Clean phone number - ensure it's a string or undefined
      const cleanPhone = editUser.phone && editUser.phone.trim() ? editUser.phone.trim() : undefined;

      const updatedUser: User = {
        ...editUser,
        phone: cleanPhone,
        avatar: avatarUrl,
        updatedAt: new Date().toISOString()
      };

      console.log('Updating user with data:', updatedUser);

      const response = await fetch(`/api/users/${editUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        setUsers(users.map(u => u.id === editUser.id ? updatedUserData : u));
        resetEditModal();
        alert('Kullanıcı başarıyla güncellendi!');
      } else {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        alert(`Kullanıcı güncellenirken bir hata oluştu: ${errorText}`);
      }
    } catch (error) {
      console.error('Kullanıcı güncellenirken hata:', error);
      alert(`Kullanıcı güncellenirken bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  };

  const resetModal = () => {
    setNewUser({ email: '', name: '', phone: '', password: '', role: 'agent' });
    setSelectedAvatar(null);
    setAvatarPreview('');
    setIsUploadingAvatar(false);
    setShowCreateModal(false);
  };

  const resetEditModal = () => {
    setEditUser(null);
    setSelectedAvatar(null);
    setAvatarPreview('');
    setIsUploadingAvatar(false);
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const updatedUsers = users.map(u =>
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      );

      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUsers),
      });

      if (response.ok) {
        setUsers(updatedUsers);
      } else {
        alert('Kullanıcı durumu güncellenirken bir hata oluştu!');
      }
    } catch (error) {
      console.error('Kullanıcı durumu güncellenirken hata:', error);
      alert('Kullanıcı durumu güncellenirken bir hata oluştu!');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/users?id=${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setUsers(users.filter(u => u.id !== userId));
          alert('Kullanıcı başarıyla silindi!');
        } else {
          alert('Kullanıcı silinirken bir hata oluştu!');
        }
      } catch (error) {
        console.error('Kullanıcı silinirken hata:', error);
        alert('Kullanıcı silinirken bir hata oluştu!');
      }
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-600/80 text-white border border-red-500/50 backdrop-blur-xl';
      case 'manager':
        return 'bg-blue-600/80 text-white border border-blue-500/50 backdrop-blur-xl';
      case 'agent':
        return 'bg-green-600/80 text-white border border-green-500/50 backdrop-blur-xl';
      default:
        return 'bg-gray-600/80 text-white border border-gray-500/50 backdrop-blur-xl';
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Yönetici';
      case 'manager':
        return 'Müdür';
      case 'agent':
        return 'Temsilci';
      default:
        return role;
    }
  };

    if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-zinc-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !hasPermission(['admin'])) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Hero Section */}
      <AdminHero
        title="Kullanıcı Yönetimi"
        subtitle="Sistem kullanıcılarını yönetin ve yetkilendirin"
        actions={[
          {
            label: "Yeni Kullanıcı",
            href: "#",
            onClick: () => setShowCreateModal(true),
            icon: (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            ),
            variant: "success"
          },
          {
            label: "Dashboard'a Dön",
            href: "/iw-management",
            icon: (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            ),
            variant: "secondary"
          }
        ]}
        stats={[
          { label: "Toplam Kullanıcı", value: users.length },
          { label: "Aktif Kullanıcı", value: users.filter(u => u.isActive).length },
          { label: "Yöneticiler", value: users.filter(u => u.role === 'admin').length },
          { label: "Temsilciler", value: users.filter(u => u.role === 'agent').length }
        ]}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Users Table */}
        <div className="bg-zinc-800/40 backdrop-blur-xl border border-zinc-700/50 shadow-lg rounded-2xl">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-xl font-medium text-white mb-4">
              Kullanıcı Listesi
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zinc-700/50">
                <thead className="bg-zinc-700/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Kullanıcı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Durum
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Son Giriş
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700/50">
                  {users.map((userItem) => (
                    <tr key={userItem.id} className="hover:bg-zinc-700/40 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded-full"
                              src={userItem.avatar}
                              alt={userItem.name}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {userItem.name}
                            </div>
                            <div className="text-sm text-zinc-400">
                              {userItem.email}
                            </div>
                            <div className="text-xs text-zinc-500">
                              {userItem.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-xl ${getRoleBadgeColor(userItem.role)}`}>
                          {getRoleDisplayName(userItem.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-xl ${
                          userItem.isActive 
                            ? 'bg-green-600/80 text-white border border-green-500/50 backdrop-blur-xl'
                            : 'bg-red-600/80 text-white border border-red-500/50 backdrop-blur-xl'
                        }`}>
                          {userItem.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                        {userItem.lastLogin 
                          ? (
                            <div>
                              <div className="font-medium text-white">
                                {new Date(userItem.lastLogin).toLocaleDateString('tr-TR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="text-xs text-zinc-400">
                                {new Date(userItem.lastLogin).toLocaleTimeString('tr-TR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit'
                                })}
                              </div>
                            </div>
                          )
                          : (
                            <span className="text-zinc-500 italic">
                              Hiç giriş yapmamış
                            </span>
                          )
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditUser(userItem)}
                            className="px-3 py-1 rounded-xl text-sm font-medium bg-blue-600/80 backdrop-blur-xl border border-blue-500/50 text-white hover:bg-blue-600 transition-all duration-200"
                          >
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleToggleUserStatus(userItem.id)}
                            className={`px-3 py-1 rounded-xl text-sm font-medium transition-all duration-200 ${
                              userItem.isActive 
                                ? 'bg-red-600/80 backdrop-blur-xl border border-red-500/50 text-white hover:bg-red-600'
                                : 'bg-green-600/80 backdrop-blur-xl border border-green-500/50 text-white hover:bg-green-600'
                            }`}
                          >
                            {userItem.isActive ? 'Pasifleştir' : 'Aktifleştir'}
                          </button>
                          {userItem.id !== user?.id && (
                            <button
                              onClick={() => handleDeleteUser(userItem.id)}
                              className="px-3 py-1 rounded-xl text-sm font-medium bg-red-600/80 backdrop-blur-xl border border-red-500/50 text-white hover:bg-red-600 transition-all duration-200"
                            >
                              Sil
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 w-96 shadow-2xl rounded-2xl bg-zinc-800/90 backdrop-blur-xl border border-zinc-700/50">
            <div className="mt-3">
              <h3 className="text-xl font-medium text-white mb-6">
                Yeni Kullanıcı Ekle
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    placeholder="Kullanıcı adını girin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    placeholder="Email adresini girin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefon
                  </label>
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="TR"
                    value={newUser.phone}
                    onChange={(value) => setNewUser({ ...newUser, phone: value || '' })}
                    className="phone-input"
                    placeholder="Telefon numarasını girin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Şifre
                  </label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    placeholder="Şifre girin"
                  />
                </div>
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profil Fotoğrafı
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-700/50 border border-zinc-600/50">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Avatar önizleme"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-zinc-600/50 rounded-xl shadow-sm text-sm font-medium text-gray-300 bg-zinc-700/50 hover:bg-zinc-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Fotoğraf Seç
                      </label>
                      {selectedAvatar && (
                        <p className="mt-1 text-xs text-zinc-400">
                          {selectedAvatar.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rol
                  </label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                    className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  >
                    <option value="agent">Temsilci</option>
                    <option value="manager">Müdür</option>
                    <option value="admin">Yönetici</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={resetModal}
                  disabled={isUploadingAvatar}
                  className="px-6 py-3 text-sm font-medium text-gray-300 bg-zinc-700/50 hover:bg-zinc-600/50 border border-zinc-600/50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  İptal
                </button>
                <button
                  onClick={handleCreateUser}
                  disabled={isUploadingAvatar}
                  className="px-6 py-3 text-sm font-medium text-white bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadingAvatar ? (
                    <>
                      <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Yükleniyor...
                    </>
                  ) : (
                    'Kullanıcı Ekle'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 w-96 shadow-2xl rounded-2xl bg-zinc-800/90 backdrop-blur-xl border border-zinc-700/50">
            <div className="mt-3">
              <h3 className="text-xl font-medium text-white mb-6">
                Kullanıcı Düzenle
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={editUser.name}
                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    placeholder="Kullanıcı adını girin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editUser.email}
                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    placeholder="Email adresini girin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Telefon
                  </label>
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="TR"
                    value={editUser.phone}
                    onChange={(value) => setEditUser({ ...editUser, phone: value || '' })}
                    className="phone-input"
                    placeholder="Telefon numarasını girin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Şifre (Değiştirmek için yeni şifre girin)
                  </label>
                  <input
                    type="password"
                    value={editUser.password || ''}
                    onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                    placeholder="Yeni şifre (boş bırakılırsa değişmez)"
                  />
                </div>
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profil Fotoğrafı
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-zinc-700/50 border border-zinc-600/50">
                        {avatarPreview ? (
                          <img
                            src={avatarPreview}
                            alt="Avatar önizleme"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        id="avatar-upload-edit"
                      />
                      <label
                        htmlFor="avatar-upload-edit"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-zinc-600/50 rounded-xl shadow-sm text-sm font-medium text-gray-300 bg-zinc-700/50 hover:bg-zinc-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Fotoğraf Değiştir
                      </label>
                      {selectedAvatar && (
                        <p className="mt-1 text-xs text-zinc-400">
                          {selectedAvatar.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rol
                  </label>
                  <select
                    value={editUser.role}
                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value as UserRole })}
                    className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  >
                    <option value="agent">Temsilci</option>
                    <option value="manager">Müdür</option>
                    <option value="admin">Yönetici</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Durum
                  </label>
                  <select
                    value={editUser.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setEditUser({ ...editUser, isActive: e.target.value === 'active' })}
                    className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Pasif</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  onClick={resetEditModal}
                  disabled={isUploadingAvatar}
                  className="px-6 py-3 text-sm font-medium text-gray-300 bg-zinc-700/50 hover:bg-zinc-600/50 border border-zinc-600/50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  İptal
                </button>
                <button
                  onClick={handleUpdateUser}
                  disabled={isUploadingAvatar}
                  className="px-6 py-3 text-sm font-medium text-white bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploadingAvatar ? (
                    <>
                      <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Yükleniyor...
                    </>
                  ) : (
                    'Kullanıcı Güncelle'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
