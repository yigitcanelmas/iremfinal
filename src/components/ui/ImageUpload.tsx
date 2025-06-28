"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (newImages: string[]) => void;
  maxImages?: number;
  title?: string;
  description?: string;
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
  title = "Fotoğraflar",
  description = "Emlak fotoğraflarını sürükleyip bırakın veya seçin"
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const uploadFiles = async (files: File[]) => {
    setIsUploading(true);
    try {
      // Upload multiple files simultaneously
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const result = await response.json();
        return result.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      return uploadedUrls;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    try {
      const uploadedUrls = await uploadFiles(acceptedFiles);
      onImagesChange([...images, ...uploadedUrls].slice(0, maxImages));
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      // Hata durumunda kullanıcıya bilgi verilebilir
    }
  }, [images, maxImages, onImagesChange]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true, // Enable multiple file selection
    maxFiles: maxImages - images.length, // Limit based on remaining slots
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
    onDropRejected: () => setIsDragging(false)
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`
          relative border-2 border-dashed rounded-2xl p-8 cursor-pointer
          transition-all duration-300 ease-in-out
          ${isDragging 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105 shadow-lg' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }
          ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="text-center">
          <div className="mx-auto w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            {title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            {description}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            {images.length}/{maxImages} fotoğraf • Birden fazla dosya seçebilirsiniz
          </p>
          
          <button
            type="button"
            disabled={isUploading || images.length >= maxImages}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isUploading ? (
              <>
                <svg className="w-5 h-5 mr-2 -ml-1 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Yükleniyor...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {images.length >= maxImages ? 'Maksimum Limit' : images.length === 0 ? 'Fotoğraf Seç' : 'Daha Fazla Ekle'}
              </>
            )}
          </button>
        </div>

        {/* Progress Bar when images are being uploaded */}
        {(isDragging || isUploading) && (
          <div className="absolute inset-4 flex items-center justify-center">
            <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <div className="text-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isUploading ? 'Dosyalar yükleniyor...' : 'Dosyalar bırakın'}
                </span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full bg-blue-500 rounded-full ${isUploading ? 'animate-pulse' : 'animate-pulse'}`}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-w-16 aspect-h-9">
              <img
                src={image}
                alt={`Emlak fotoğrafı ${index + 1}`}
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform transition-transform duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              {/* Image Number Badge */}
              <div className="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-50 rounded-md">
                <span className="text-white text-sm font-medium">
                  {index + 1}/{images.length}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
