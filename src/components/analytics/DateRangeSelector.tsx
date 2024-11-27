import DatePicker from 'react-datepicker';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

interface DateRangeSelectorProps {
  startDate: Date;
  endDate: Date;
  onChange: (dates: [Date | null, Date | null]) => void;
  onQuickSelect: (range: string) => void;
}

export default function DateRangeSelector({
  startDate,
  endDate,
  onChange,
  onQuickSelect
}: DateRangeSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="flex items-center gap-2 bg-muted p-2 rounded-lg">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={(dates) => onChange([dates[0], dates[1]])}
          className="bg-transparent border-none focus:outline-none text-sm"
          dateFormat="MMM d, yyyy"
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickSelect('7d')}
        >
          7D
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickSelect('30d')}
        >
          30D
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickSelect('90d')}
        >
          90D
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onQuickSelect('1y')}
        >
          1Y
        </Button>
      </div>
    </div>
  );
}