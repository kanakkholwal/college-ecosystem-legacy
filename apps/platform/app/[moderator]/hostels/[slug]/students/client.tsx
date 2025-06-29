'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import readXlsxFile from 'read-excel-file';
import { hostels } from '~/lib/server-apis/endpoints';

const GENDER_VALUES = ['male', 'female'];

export default function AllotmentPage() {
  const [file, setFile] = useState<File | null>(null);
  const [headerKeys, setHeaderKeys] = useState<string[]>([]);
  const [sheetData, setSheetData] = useState<string[][]>([]);
  const [genderKey, setGenderKey] = useState<number>();
  const [soeKey, setSoeKey] = useState<number>();
  const [roomDistribution, setRoomDistribution] = useState({ "4": 94, "3": 110 });
  const [loading, setLoading] = useState(false);

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFile(file);

    const [headers, ...rows] = await readXlsxFile(file);
    const validHeaders = headers.filter((h) => typeof h === 'string' && h.trim()) as string[];
    setHeaderKeys(validHeaders);
    setSheetData(rows as string[][]);

    // Auto-detect gender and SOE columns
    const lowerHeaders = validHeaders.map((h) => h.toLowerCase());
    const gIndex = lowerHeaders.findIndex((h) => ['gender', 'sex'].some(k => h.includes(k)));
    const sIndex = lowerHeaders.findIndex((h) => ['soe', 'state'].some(k => h.includes(k)));

    if (gIndex !== -1) setGenderKey(gIndex);
    if (sIndex !== -1) setSoeKey(sIndex);
  };

  const validateGenderColumn = (): boolean => {
    if (genderKey === undefined) return false;
    const values = sheetData.slice(0, 10).map(row => row[genderKey]?.toLowerCase());
    return values.every(val => GENDER_VALUES.includes(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || genderKey === undefined || soeKey === undefined) {
      toast.error('Missing required selections or file.');
      return;
    }

    if (!validateGenderColumn()) {
      toast.error('Gender column must only contain "Male"/"Female" values.');
      return;
    }

    const genderCol = headerKeys[genderKey];
    const soeCol = headerKeys[soeKey];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('gender', '');
    formData.append('roomDistribution', JSON.stringify(roomDistribution));
    formData.append('extraFields', JSON.stringify([genderCol, soeCol]));

    setLoading(true);
    toast.promise(
      fetch(hostels.allotRoomsFromExcel.url, {
        method: 'POST',
        body: formData,
      }).then(async (res) => {
        if (!res.ok) throw new Error('Server Error');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'allotment.xlsx';
        a.click();
        a.remove();
      }),
      {
        loading: 'Processing...',
        success: 'Allotment downloaded!',
        error: 'Upload failed',
      }
    ).finally(() => setLoading(false));
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-6">
      <h1 className="text-2xl font-semibold">🏢 Hostel Allotment Tool</h1>

      <div className="space-y-2">
        <Label htmlFor="file">Excel File</Label>
        <Input id="file" type="file" accept=".xlsx" onChange={handleExcelUpload} />
      </div>

      {headerKeys.length > 0 && (
        <>
          <div className="grid gap-4 @lg:grid-cols-2">
            <div className="space-y-2">
              <Label>Gender Column</Label>
              <Select value={genderKey?.toString()} onValueChange={(v) => setGenderKey(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender Column" />
                </SelectTrigger>
                <SelectContent>
                  {headerKeys.map((key, index) => (
                    <SelectItem key={key} value={index.toString()}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>SOE Column</Label>
              <Select value={soeKey?.toString()} onValueChange={(v) => setSoeKey(Number(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select SOE Column" />
                </SelectTrigger>
                <SelectContent>
                  {headerKeys.map((key, index) => (
                    <SelectItem key={key} value={index.toString()}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Room Distribution (JSON)</Label>
            <Textarea
              value={JSON.stringify(roomDistribution)}
              onChange={(e) => setRoomDistribution(JSON.parse(e.target.value))}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Preview (first 5 rows)</Label>
            <div className="border rounded overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {headerKeys.map((key, idx) => (
                      <TableHead key={idx}>{key}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sheetData.slice(0, 5).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {headerKeys.map((_, colIdx) => (
                        <TableCell key={colIdx}>{row[colIdx]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <Button onClick={handleSubmit} disabled={loading || !file}>
            {loading ? 'Processing...' : 'Submit & Download'}
          </Button>
        </>
      )}
    </div>
  );
}
