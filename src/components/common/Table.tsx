import { useState } from "react";
import { Input, Button } from "../ui";

interface Column {
  Header: string;
  accessor: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  pageIndex: number;
  keyword: string;
  pageSize: number;
  onPageChange: (newPageIndex: number) => void;
  onPageSizeChange: (newSize: number) => void;
  onKeywordChange?: (newKeyword: string) => void;
  total: number;
  pageSizeOptions?: number[];
}

const Table: React.FC<TableProps> = ({
  columns,
  data,
  pageIndex,
  keyword,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onKeywordChange,
  total,
  pageSizeOptions = [5, 20, 30, 40],
}) => {
  const canPreviousPage = pageIndex !== 0;
  const canNextPage = (pageIndex + 1) * pageSize < total;
  const [key, setKey] = useState<string>(keyword);

  const handlePageChange = (newPageIndex: number) => {
    onPageChange(newPageIndex);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = Number(e.target.value);
    onPageSizeChange(newSize);
  };

  const handleSearch = () => {
    if (onKeywordChange) {
      onKeywordChange(key);
    }
  };

  return (
    <div className="container mx-auto bg-white rounded-lg p-4 shadow-2xl border-solid border-2 border-gray-200">
      <div className="overflow-x-auto shadow-md rounded-lg border-solid border-2 border-gray-300 border-b-0">
      <table className="w-full min-w-full divide-y divide-gray-200 bg-white shadow-lg rounded-lg">
  <thead className="bg-gray-400 text-white">
    <tr>
      {columns.map((column, index) => (
        <th
          key={index}
          className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
        >
          {column.Header}
        </th>
      ))}
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    {data.map((row, rowIndex) => (
      <tr
        key={rowIndex}
        className="hover:bg-gray-50 transition duration-150 ease-in-out"
      >
        {columns.map((column, colIndex) => (
          <td
            key={colIndex}
            className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-800"
          >
            {row[column.accessor]}
          </td>
        ))}
      </tr>
    ))}
  </tbody>
</table>

      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 items-center justify-between">
        <div className="flex items-center">
          <button
            className={`px-4 py-2 border rounded-lg ${
              canPreviousPage
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={!canPreviousPage}
          >
            {"<"}
          </button>
          <button
            className={`px-4 py-2 border rounded-lg ml-2 ${
              canNextPage
                ? "bg-green-500 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={!canNextPage}
          >
            {">"}
          </button>
          <span className="ml-4 text-sm text-gray-700">
            Page {pageIndex + 1} of {Math.ceil(total / pageSize)}
          </span>
        </div>
        {onKeywordChange && (
          <div className="w-full text-center flex col-span-3 col-start-2">
            <div className="w-6/12 mr-2">
              <Input
                placeholder="Search..."
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />  
            </div>
            <Button className="rounded-r-lg " onClick={handleSearch}>
              Search
            </Button>
          </div>
        )}

        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-700">Show</span>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
            className="px-2 py-1 border rounded-lg bg-white text-black"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Table;
