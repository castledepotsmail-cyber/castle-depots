import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        // Security check
        const authHeader = request.headers.get('authorization');
        if (authHeader !== `Bearer ${process.env.EMAIL_API_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { to, subject, html, text, from } = body;

        if (!to || !subject || (!html && !text)) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_USE_TLS === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_HOST_USER,
                pass: process.env.EMAIL_HOST_PASSWORD,
            },
        });

        // Send email
        const info = await transporter.sendMail({
            from: from || process.env.DEFAULT_FROM_EMAIL || process.env.EMAIL_HOST_USER,
            to,
            subject,
            text,
            html,
        });

        console.log("Email sent: %s", info.messageId);

        return NextResponse.json({ success: true, messageId: info.messageId });
    } catch (error: any) {
        console.error("Error sending email:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
