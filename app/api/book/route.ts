import { google } from 'googleapis';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';

const {
  GOOGLE_SERVICE_ACCOUNT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_CALENDAR_ID,
} = process.env;

if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_CALENDAR_ID) {
  throw new Error('Missing Google Calendar environment variables');
}

const privateKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

const auth = new JWT({
  email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
  key: privateKey,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, date, time, opportunity } = body;

    // Basic validation
    if (!name || !email || !date || !time || !opportunity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate formats
    const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const isoTimeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    if (!isoDateRegex.test(date)) {
      return NextResponse.json({ error: 'Invalid date format (expected YYYY-MM-DD)' }, { status: 400 });
    }

    if (!isoTimeRegex.test(time)) {
      return NextResponse.json({ error: 'Invalid time format (expected HH:mm)' }, { status: 400 });
    }

    // Construct start and end times
    const startDateTime = new Date(`${date}T${time}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

    const event = {
      summary: `Meeting – ${opportunity}`,
      description: `Scheduled with ${name} (${email})`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Australia/Brisbane',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Australia/Brisbane',
      },
      attendees: [{ email }],
    };

    console.log('[Booking Payload]', {
      calendarId: GOOGLE_CALENDAR_ID,
      event,
    });

    const response = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    return NextResponse.json({
      success: true,
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
    });
  } catch (error: any) {
    console.error('[Booking Error]', {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      {
        error: 'Booking failed',
        message: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}