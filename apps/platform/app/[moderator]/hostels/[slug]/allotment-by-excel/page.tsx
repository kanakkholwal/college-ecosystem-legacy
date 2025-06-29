'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import readXlsxFile from 'read-excel-file';
import { hostels } from '~/lib/server-apis/endpoints';

export default function AllotmentPage() {
  const [file, setFile] = useState<File | null>(null);
  const [sheetData, setSheetData] = useState<string[][]>([]);
  const [headerKeys, setHeaderKeys] = useState<string[]>([]);

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || genderKey === undefined || soeKey === undefined) {
      toast.error('Missing file or selected keys.');
      return;
    }

    const genderCol = headerKeys[genderKey];
    const soeCol = headerKeys[soeKey];

    const formData = new FormData();
    formData.append('file', file);
    formData.append('gender', ''); // not used
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
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6">🏢 Hostel Allotment Tool</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="file">Excel File</Label>
          <Input type="file" id="file" accept=".xlsx" onChange={handleExcelUpload} />
        </div>

        {headerKeys.length > 0 && (
          <div className="grid gap-4 @lg:grid-cols-2">
            <div className="space-y-2">
              <Label>Gender Column</Label>
              <Select onValueChange={(v) => setGenderKey(parseInt(v))}>
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
              <Select onValueChange={(v) => setSoeKey(parseInt(v))}>
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
        )}

        <div className="space-y-2">
          <Label htmlFor="roomDistribution">Room Distribution (JSON)</Label>
          <Textarea
            id="roomDistribution"
            value={JSON.stringify(roomDistribution)}
            onChange={(e) => setRoomDistribution(JSON.parse(e.target.value))}
            rows={2}
          />
        </div>

        <Button type="submit" disabled={loading || !file}>
          {loading ? 'Processing...' : 'Submit & Download'}
        </Button>
      </form>
    </div>
  );
}
