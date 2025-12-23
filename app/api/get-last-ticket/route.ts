import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Validate env vars
    if (
      !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
      !process.env.GOOGLE_PRIVATE_KEY ||
      !process.env.GOOGLE_SHEET_ID
    ) {
      console.error('Missing environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Setup auth
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('Fetching sheet data...');

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'tembagapura!A:B',
    });

    const rows = response.data.values || [];

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No ticket data found' },
        { status: 404 }
      );
    }

    // Get last non-empty row
    const lastRow = rows
      .filter(row => row[0]) // ensure ticketNumber exists
      .at(-1);

    if (!lastRow) {
      return NextResponse.json(
        { error: 'No valid ticket found' },
        { status: 404 }
      );
    }

    const [ticketNumber, timestamp] = lastRow;

    console.log('Last ticket found:', ticketNumber, timestamp);

    return NextResponse.json({
      success: true,
      data: {
        ticketNumber,
        timestamp,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('=== ERROR OCCURRED ===');
    console.error('Message:', error.message);
    console.error('Code:', error.code);

    return NextResponse.json(
      {
        error: 'Failed to fetch last ticket',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
