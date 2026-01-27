import { useState, useRef } from 'react';
import { Upload, X, FileImage, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface LicenseImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  disabled?: boolean;
  isPublic?: boolean; // For registration (no auth required)
}

export function LicenseImageUpload({ onImageUploaded, currentImageUrl, disabled, isPublic = false }: LicenseImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Faqat JPEG, PNG va WebP formatdagi rasmlar qabul qilinadi');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Fayl hajmi 5MB dan oshmasligi kerak');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = isPublic ? '/upload/license-image-public' : '/upload/license-image';
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.imageUrl;
      onImageUploaded(imageUrl);
      toast.success('Rasm muvaffaqiyatli yuklandi');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Rasm yuklashda xatolik');
      setPreviewUrl(currentImageUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label className="text-red-500 mb-2 block">
        Haydovchilik guvohnomasi rasmi
      </Label>
      
      <div className="border-2 border-dashed border-border rounded-lg p-4">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Haydovchilik guvohnomasi"
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                disabled={disabled || uploading}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="text-white text-sm">Yuklanmoqda...</div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileImage className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Haydovchilik guvohnomasining rasmini yuklang
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleUploadClick}
              disabled={disabled || uploading}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Yuklanmoqda...' : 'Rasm tanlash'}
            </Button>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      <div className="flex items-start gap-2 text-xs text-muted-foreground">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p>• Faqat JPEG, PNG, WebP formatlar qabul qilinadi</p>
          <p>• Maksimal fayl hajmi: 5MB</p>
          <p>• Guvohnoma aniq va o'qilishi mumkin bo'lishi kerak</p>
        </div>
      </div>
    </div>
  );
}