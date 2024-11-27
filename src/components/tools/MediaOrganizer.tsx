import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';
import { Upload, X } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface MediaOrganizerProps {
  onMediaAdd: (files: File[]) => void;
  onMediaRemove: (index: number) => void;
  media: { file: File; preview: string }[];
}

export default function MediaOrganizer({ onMediaAdd, onMediaRemove, media }: MediaOrganizerProps) {
  useAppStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onMediaAdd(acceptedFiles);
  }, [onMediaAdd]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'video/*': ['.mp4', '.mov', '.avi']
    },
    multiple: true
  });

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary bg-primary/10' 
            : 'border-border hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {isDragActive
            ? "Drop your media files here..."
            : "Drag & drop media files here, or click to select"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supports images (PNG, JPG, GIF) and videos (MP4, MOV, AVI)
        </p>
      </div>

      {media.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {media.map((item, index) => (
            <Card key={index} className="group relative">
              <CardContent className="p-2">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img
                    src={item.preview}
                    alt={`Media ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onMediaRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}