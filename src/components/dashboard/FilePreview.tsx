import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Eye, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  File,
  ExternalLink
} from 'lucide-react';
import { 
  ActionPlanResource, 
  ActionPlanEvidence,
  getFileTypeIcon,
  isPreviewableImage,
  isPreviewablePDF,
  formatFileSize
} from '@/types/actionPlan';

interface FilePreviewProps {
  file: ActionPlanResource | ActionPlanEvidence;
  type: 'resource' | 'evidence';
}

export const FilePreview = ({ file, type }: FilePreviewProps) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // Get file info
  const fileName = file.file_name || (type === 'resource' ? file.resource_name : 'Unknown File');
  const filePath = file.file_path || file.resource_path;
  const fileType = file.file_type || 'application/octet-stream';
  const fileSize = file.file_size;

  // Construct file URL (assuming files are served from /uploads)
  const fileUrl = filePath ? `${'https://aps2.zemenbank.com/ZAMS/api' || 'https://aps2.zemenbank.com/ZAMS/api'}/${filePath}` : null;

  // Handle file download
  const handleDownload = async () => {
    if (!fileUrl) {
      toast.error('File URL not available');
      return;
    }

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error('Failed to download file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  };

  // Handle image load
  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  // Handle image error
  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Render file icon
  const renderFileIcon = () => {
    if (isPreviewableImage(fileType)) {
      return <ImageIcon className="h-5 w-5" />;
    } else if (isPreviewablePDF(fileType)) {
      return <FileText className="h-5 w-5" />;
    } else {
      return <File className="h-5 w-5" />;
    }
  };

  // Render preview content
  const renderPreviewContent = () => {
    if (!fileUrl) {
      return (
        <div className="flex items-center justify-center h-64 text-gray-500">
          File not available for preview
        </div>
      );
    }

    if (isPreviewableImage(fileType)) {
      return (
        <div className="flex items-center justify-center">
          {imageLoading && (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Loading image...
            </div>
          )}
          {imageError && (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Failed to load image
            </div>
          )}
          <img
            src={fileUrl}
            alt={fileName}
            className={`max-w-full max-h-96 object-contain ${imageLoading || imageError ? 'hidden' : ''}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      );
    } else if (isPreviewablePDF(fileType)) {
      return (
        <div className="w-full h-96">
          <iframe
            src={fileUrl}
            className="w-full h-full border-0"
            title={fileName}
          />
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <File className="h-16 w-16 mb-4" />
          <p>Preview not available for this file type</p>
          <p className="text-sm">Click download to view the file</p>
        </div>
      );
    }
  };

  return (
    <Card className="p-4">
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {renderFileIcon()}
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate" title={fileName}>
                {fileName}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Badge variant="outline" className="text-xs">
                  {getFileTypeIcon(fileType)} {fileType.split('/')[1]?.toUpperCase()}
                </Badge>
                {fileSize && (
                  <span>{formatFileSize(fileSize)}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {(isPreviewableImage(fileType) || isPreviewablePDF(fileType)) && (
              <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {renderFileIcon()}
                      {fileName}
                    </DialogTitle>
                    <DialogDescription>
                      File preview - {fileType}
                      {fileSize && ` • ${formatFileSize(fileSize)}`}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">
                    {renderPreviewContent()}
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// File upload component for forms
interface FileUploadProps {
  label: string;
  accept: string;
  value?: File;
  onChange: (file: File | undefined) => void;
  maxSize?: number; // in bytes
  required?: boolean;
}

export const FileUpload = ({ 
  label, 
  accept, 
  value, 
  onChange, 
  maxSize = 10 * 1024 * 1024, // 10MB default
  required = false 
}: FileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // Validate file size
      if (file.size > maxSize) {
        toast.error(`File size must be less than ${formatFileSize(maxSize)}`);
        return;
      }
      
      // Validate file type
      const allowedTypes = accept.split(',').map(type => type.trim());
      const isValidType = allowedTypes.some(type => {
        if (type.startsWith('.')) {
          return file.name.toLowerCase().endsWith(type.toLowerCase());
        } else {
          return file.type === type;
        }
      });
      
      if (!isValidType) {
        toast.error('Please upload a valid file type');
        return;
      }
      
      onChange(file);
    } else {
      onChange(undefined);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      {value ? (
        <Card className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <File className="h-4 w-4" />
              <div>
                <div className="font-medium text-sm">{value.name}</div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(value.size)}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRemove}>
              Remove
            </Button>
          </div>
        </Card>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          <File className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <div className="text-sm text-gray-600 mb-2">
            Click to upload or drag and drop
          </div>
          <div className="text-xs text-gray-500 mb-4">
            Max size: {formatFileSize(maxSize)}
          </div>
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
          />
          <label
            htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
          >
            Choose File
          </label>
        </div>
      )}
    </div>
  );
};
