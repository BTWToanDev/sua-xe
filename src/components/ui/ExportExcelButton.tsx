import React from 'react';
import { utils, write } from 'xlsx';
import { saveAs } from 'file-saver';

import Button from './Button';

// Định nghĩa kiểu cho props
interface ExportExcelButtonProps {
  data: Array<Record<string, any>>; // Kiểu dữ liệu cho data, có thể thay đổi tùy thuộc vào cấu trúc dữ liệu của bạn
}

const ExportExcelButton: React.FC<ExportExcelButtonProps> = ({ data }) => {
  const exportToExcel = () => {
    const ws = utils.json_to_sheet(data);

    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Sheet1');

    const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'data.xlsx');
  };

  return (
    <Button primary className="m-2" onClick={exportToExcel}>
      Export to Excel
    </Button>
  );
};

export default ExportExcelButton;
