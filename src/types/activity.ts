export type ActivityAction =
  // Emlak işlemleri
  | 'property_create'    // Yeni emlak ekleme
  | 'property_update'    // Emlak güncelleme
  | 'property_delete'    // Emlak silme
  | 'property_price_update'  // Fiyat güncelleme
  | 'property_features_update' // Özellik güncelleme
  | 'property_status_update'  // Durum güncelleme (aktif/pasif)
  | 'property_images_update'  // Resim güncelleme
  | 'property_location_update' // Konum güncelleme
  // Kullanıcı işlemleri
  | 'user_create'     // Yeni kullanıcı ekleme
  | 'user_update'     // Kullanıcı güncelleme
  | 'user_delete'     // Kullanıcı silme
  | 'user_role_update' // Rol güncelleme
  | 'user_status_update' // Durum güncelleme
  | 'user_login'      // Giriş
  | 'user_logout'     // Çıkış
  // Müşteri işlemleri
  | 'customer_create'    // Yeni müşteri ekleme
  | 'customer_update'    // Müşteri güncelleme
  | 'customer_delete'    // Müşteri silme
  | 'customer_status_update' // Müşteri durum güncelleme
  | 'customer_type_update'   // Müşteri tip güncelleme
  | 'customer_agent_assign'  // Temsilci atama
  | 'customer_interaction_create' // Müşteri etkileşimi ekleme
  | 'customer_document_upload'    // Müşteri doküman yükleme
  | 'customer_property_interest'  // Emlak ilgi ekleme
  // Sistem işlemleri
  | 'settings_update' // Ayarlar güncelleme
  | 'password_change' // Şifre değiştirme
  | 'profile_update'; // Profil güncelleme

export interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  userEmail?: string;
  action: ActivityAction;
  description: string;
  status: 'success' | 'failed' | 'pending' | 'warning';
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  targetType?: 'property' | 'user' | 'customer' | 'system' | 'settings';
  targetId?: string;
  details?: {
    // Emlak detayları
    propertyId?: string;
    propertyTitle?: string;
    propertyType?: 'sale' | 'rent';
    oldPrice?: number;
    newPrice?: number;
    oldFeatures?: string[];
    newFeatures?: string[];
    oldStatus?: string;
    newStatus?: string;
    oldLocation?: {
      city: string;
      district: string;
    };
    newLocation?: {
      city: string;
      district: string;
    };
    // Kullanıcı detayları
    userId?: string;
    userName?: string;
    userEmail?: string;
    oldRole?: string;
    newRole?: string;
    oldUserStatus?: string;
    newUserStatus?: string;
    // Genel
    reason?: string;
    changes?: Record<string, { old: any; new: any }>;
    error?: string;
    [key: string]: any;
  };
}

export interface Activity {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  category: 'user' | 'property' | 'customer' | 'system' | 'auth';
  targetId?: string;
  status: 'success' | 'failed' | 'pending';
  metadata?: Record<string, any>;
  timestamp?: Date;
}

export interface ActivityStats {
  _id: string;
  total: number;
  success: number;
  failed: number;
}
