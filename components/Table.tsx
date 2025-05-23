"use client";

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  Row,
  getExpandedRowModel,
} from "@tanstack/react-table";

interface TableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  renderSubComponent?: (row: Row<T>) => React.ReactNode;
}

export function Table<T>({ columns, data, renderSubComponent }: TableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => !!renderSubComponent, // Her satır genişleyebilir mi?
  });

  return (
    <table className="min-w-full border-collapse border border-gray-300">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="bg-gray-100">
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="border border-gray-300 p-2 text-left">
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <React.Fragment key={row.id}>
            <tr
              className="even:bg-gray-50 cursor-pointer"
              onClick={() => row.toggleExpanded()}
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border border-gray-300 p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
            {row.getIsExpanded() && renderSubComponent && (
              <tr>
                <td colSpan={row.getVisibleCells().length} className="border border-gray-300 p-4 bg-gray-50">
                  {renderSubComponent(row)}
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  );
}
