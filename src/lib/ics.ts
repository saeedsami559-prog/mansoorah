function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function stamp(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}

function escape(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, ';').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export interface IcsEvent {
  uid: string;
  title: string;
  description: string;
  location: string;
  date: string; // YYYY-MM-DD (Oman time)
  slot: string; // HH:MM (Oman time)
  durationMinutes: number;
}

/** Oman is UTC+4 all year (no daylight saving). */
export function buildIcs(e: IcsEvent, now = new Date()): string {
  const [y, m, d] = e.date.split('-').map(Number);
  const [h, min] = e.slot.split(':').map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, h - 4, min));
  const end = new Date(start.getTime() + e.durationMinutes * 60_000);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mansoorah//Booking//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${e.uid}@mansoorah`,
    `DTSTAMP:${stamp(now)}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escape(e.title)}`,
    `DESCRIPTION:${escape(e.description)}`,
    `LOCATION:${escape(e.location)}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Mansoorah visit reminder',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadFile(filename: string, content: string, type = 'text/calendar'): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
