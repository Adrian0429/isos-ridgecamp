import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.log('=== API Route Called ===');
    
    const { ticketNumber } = await req.json();
    console.log('Received ticket number:', ticketNumber);

    if (!ticketNumber) {
      console.error('Error: Ticket number is missing');
      return NextResponse.json(
        { error: 'Ticket number is required' },
        { status: 400 }
      );
    }

    console.log('Checking environment variables...');
    console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'Set ✓' : 'Missing ✗');
    console.log('GOOGLE_PRIVATE_KEY:', process.env.GOOGLE_PRIVATE_KEY ? 'Set ✓' : 'Missing ✗');
    console.log('GOOGLE_SHEET_ID:', process.env.GOOGLE_SHEET_ID ? 'Set ✓' : 'Missing ✗');

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
      console.error('Error: Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: Missing credentials' },
        { status: 500 }
      );
    }

    // Get current time in UTC+9 (JST/KST)
    const now = new Date();
    const utc9Time = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    const timestamp = utc9Time.toISOString().replace('T', ' ').substring(0, 19);
    console.log('Generated timestamp (UTC+9):', timestamp);

    // Setup Google Sheets authentication
    console.log('Setting up Google Sheets authentication...');
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    console.log('Google Sheets client created');

    // Append data to the "tembagapura" sheet
    console.log('Attempting to append data to sheet...');
    console.log('Sheet ID:', process.env.GOOGLE_SHEET_ID);
    console.log('Range: Ridge Camp!A1:B1');
    console.log('Data:', [[ticketNumber, timestamp]]);

    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Ridge Camp!A1:B1',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[ticketNumber, timestamp]],
      },
    });

    console.log('Append successful!');
    console.log('Response:', JSON.stringify(appendResponse.data, null, 2));

    return NextResponse.json({ 
      success: true,
      data: {
        ticketNumber,
        timestamp,
        updatedRange: appendResponse.data.updates?.updatedRange
      }
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('=== ERROR OCCURRED ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    if (error.response) {
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to submit ticket',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}