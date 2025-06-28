"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AdminHeader from '@/components/ui/AdminHeader';
import { uploadImageToCDN } from '@/lib/cdn';

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  title: string;
  specialization: 'Konut' | 'Ticari' | 'Arsa' | 'Hepsi';
  experience: number;
  languages: string[];
  about: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AgentsPage() {
  const { isAuthenticated, user, hasPermission } = useAuth();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    photo: '',
    title: 'Emlak Danışmanı',
    specialization: 'Hepsi' as Agent['specialization'],
    experience: 0,
    languages: [] as string[],
    about: ''
  });

  useEffect(() => {
    if (isAuthenticated && hasPermission(['admin'])) {
      fetchAgents();
    }
  }, [isAuthenticated]);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async () => {
    if (!selectedPhoto) return '';

    setIsUploadingPhoto(true);
    try {
      const uploadResult = await uploadImageToCDN(selectedPhoto, 'irem-agents');
      if (uploadResult.success && uploadResult.url) {
        return uploadResult.url;
      }
      return '';
    } catch (error) {
      console.error('Error uploading photo:', error);
      return '';
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl = formData.photo;
      if (selectedPhoto) {
        photoUrl = await uploadPhoto();
      }

      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          photo: photoUrl,
          languages: formData.languages.filter(lang => lang.trim() !== '')
        }),
      });

      if (response.ok) {
        const newAgent = await response.json();
        setAgents([newAgent, ...agents]);
        resetModal();
      } else {
        const error = await response.json();
        alert(error.error || 'Emlak danışmanı eklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      alert('Emlak danışmanı eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;

    setLoading(true);

    try {
      let photoUrl = formData.photo;
      if (selectedPhoto) {
        photoUrl = await uploadPhoto();
      }

      const response = await fetch('/api/agents', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingAgent._id,
          ...formData,
          photo: photoUrl,
          languages: formData.languages.filter(lang => lang.trim() !== '')
        }),
      });

      if (response.ok) {
        const updatedAgent = await response.json();
        setAgents(agents.map(agent => 
          agent._id === editingAgent._id ? updatedAgent : agent
        ));
        resetModal();
      } else {
        const error = await response.json();
        alert(error.error || 'Emlak danışmanı güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error updating agent:', error);
      alert('Emlak danışmanı güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!confirm('Bu emlak danışmanını silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/agents?id=${agentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAgents(agents.filter(agent => agent._id !== agentId));
      } else {
        const error = await response.json();
        alert(error.error || 'Emlak danışmanı silinirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      alert('Emlak danışmanı silinirken bir hata oluştu');
    }
  };

  const resetModal = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      photo: '',
      title: 'Emlak Danışmanı',
      specialization: 'Hepsi',
      experience: 0,
      languages: [],
      about: ''
    });
    setSelectedPhoto(null);
    setPhotoPreview('');
    setEditingAgent(null);
    setShowCreateModal(false);
    setIsUploadingPhoto(false);
  };

  const openEditModal = (agent: Agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      photo: agent.photo,
      title: agent.title,
      specialization: agent.specialization,
      experience: agent.experience,
      languages: agent.languages,
      about: agent.about
    });
    setPhotoPreview(agent.photo);
    setShowCreateModal(true);
  };

  const addLanguage = () => {
    setFormData({
      ...formData,
      languages: [...formData.languages, '']
    });
  };

  const updateLanguage = (index: number, value: string) => {
    const newLanguages = [...formData.languages];
    newLanguages[index] = value;
    setFormData({
      ...formData,
      languages: newLanguages
    });
  };

  const removeLanguage = (index: number) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter((_, i) => i !== index)
    });
  };

  if (!isAuthenticated || !hasPermission(['admin'])) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Yetkisiz Erişim</h1>
          <p>Bu sayfaya erişim yetkiniz bulunmamaktadır.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AdminHeader />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Emlak Danışmanları</h1>
            <p className="text-slate-400">Emlak danışmanlarını yönetin</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          >
            + Yeni Danışman
          </button>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent._id} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-700/50 transition-all duration-200">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-700">
                  {agent.photo ? (
                    <img
                      src={agent.photo}
                      alt={agent.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{agent.name}</h3>
                  <p className="text-slate-400 text-sm">{agent.title}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <span className="text-slate-400 w-20">Email:</span>
                  <span className="text-white">{agent.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-slate-400 w-20">Telefon:</span>
                  <span className="text-white">{agent.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-slate-400 w-20">Uzmanlık:</span>
                  <span className="text-white">{agent.specialization}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-slate-400 w-20">Deneyim:</span>
                  <span className="text-white">{agent.experience} yıl</span>
                </div>
              </div>

              {agent.languages.length > 0 && (
                <div className="mb-4">
                  <p className="text-slate-400 text-sm mb-2">Diller:</p>
                  <div className="flex flex-wrap gap-1">
                    {agent.languages.map((lang, index) => (
                      <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => openEditModal(agent)}
                  className="flex-1 bg-blue-600/80 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDeleteAgent(agent._id)}
                  className="flex-1 bg-red-600/80 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>

        {agents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg">Henüz emlak danışmanı eklenmemiş</div>
            <p className="text-slate-500 mt-2">İlk emlak danışmanını eklemek için yukarıdaki butona tıklayın</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingAgent ? 'Emlak Danışmanını Düzenle' : 'Yeni Emlak Danışmanı'}
            </h2>

            <form onSubmit={editingAgent ? handleUpdateAgent : handleCreateAgent} className="space-y-4">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Fotoğraf
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-700">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ad Soyad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+90 555 123 45 67"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Ünvan
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Emlak Danışmanı"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Uzmanlık Alanı
                  </label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value as Agent['specialization'] })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Hepsi">Hepsi</option>
                    <option value="Konut">Konut</option>
                    <option value="Ticari">Ticari</option>
                    <option value="Arsa">Arsa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Deneyim (Yıl)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Diller
                </label>
                <div className="space-y-2">
                  {formData.languages.map((language, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={language}
                        onChange={(e) => updateLanguage(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Dil adı"
                      />
                      <button
                        type="button"
                        onClick={() => removeLanguage(index)}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addLanguage}
                    className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                  >
                    + Dil Ekle
                  </button>
                </div>
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Hakkında
                </label>
                <textarea
                  value={formData.about}
                  onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Emlak danışmanı hakkında bilgi..."
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={resetModal}
                  disabled={loading || isUploadingPhoto}
                  className="flex-1 px-6 py-3 text-sm font-medium text-slate-300 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading || isUploadingPhoto}
                  className="flex-1 px-6 py-3 text-sm font-medium text-white bg-blue-600/80 hover:bg-blue-600 border border-blue-500/50 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading || isUploadingPhoto ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isUploadingPhoto ? 'Fotoğraf Yükleniyor...' : 'Kaydediliyor...'}
                    </>
                  ) : (
                    editingAgent ? 'Güncelle' : 'Ekle'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
