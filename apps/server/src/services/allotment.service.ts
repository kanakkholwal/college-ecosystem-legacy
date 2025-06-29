import { Workbook } from 'exceljs';

type Student = {
  name: string;
  rollNo: string;
  soe: string;
  gender: string;
  [key: string]: string;
};

type RoomDistribution = Record<number, number>;

export async function allotRooms(
  students: Student[],
  roomDistribution: RoomDistribution,
  targetGender: string,
  extraFields: string[] = []
): Promise<Workbook> {
  // Filter by gender
  const filtered = students.filter((s) => s.gender === targetGender);

  // Group by SOE
  const soeMap: Record<string, Student[]> = {};
  for (const s of filtered) {
    const key = s.soe;
    if (!soeMap[key]) {
      soeMap[key] = [];
    }
    soeMap[key].push(s);
  }

  // Sort SOE groups by descending size
  const sortedGroups = Object.values(soeMap).sort((a, b) => b.length - a.length);

  // Create room shells with proper sizes
  const roomList: Student[][] = [];
  for (const [, count] of Object.entries(roomDistribution)) {
    for (let i = 0; i < count; i++) {
      roomList.push(new Array<Student>());
    }
  }

  // Round-robin assign students to rooms, respecting room capacities
  let currentRoomIndex = 0;
  for (const group of sortedGroups) {
    for (const student of group) {
      // Find next available room with space
      let attempts = 0;
      while (attempts < roomList.length) {
        const roomSize = parseInt(Object.keys(roomDistribution)[Math.floor(currentRoomIndex / roomList.length)]);
        if (roomList[currentRoomIndex].length < roomSize) {
          roomList[currentRoomIndex].push(student);
          break;
        }
        currentRoomIndex = (currentRoomIndex + 1) % roomList.length;
        attempts++;
      }
      currentRoomIndex = (currentRoomIndex + 1) % roomList.length;
    }
  }

  // Create Excel workbook
  const wb = new Workbook();
  const ws = wb.addWorksheet('Allotment');

  // Add headers
  const headers = ['Name', 'Roll No', 'SOE', 'Gender', ...extraFields];
  ws.addRow(headers);

  // Add student data with room separators
  for (const room of roomList) {
    for (const student of room) {
      const row = [
        student.name,
        student.rollNo,
        student.soe,
        student.gender,
        ...extraFields.map((f) => student[f])
      ];
      ws.addRow(row);
    }
    ws.addRow([]); // empty row between rooms
  }

  return wb;
}