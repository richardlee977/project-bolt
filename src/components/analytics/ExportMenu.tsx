
import { Share2, FileText, Table } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExportMenuProps {
  onExport: (format: string) => void;
  onShare: () => void;
}

export default function ExportMenu({ onExport, onShare }: ExportMenuProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onExport('pdf')}
      >
        <FileText className="h-4 w-4 mr-2" />
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onExport('csv')}
      >
        <Table className="h-4 w-4 mr-2" />
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onShare}
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
    </div>
  );
}