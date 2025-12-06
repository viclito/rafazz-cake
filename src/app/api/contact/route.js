import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import Admin from '@/models/Admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// POST: Submit a new contact message
export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Save to database
    const contact = await Contact.create({
      name,
      email,
      message,
    });

    // Fetch all admins to notify
    const admins = await Admin.find({}, 'email');
    const adminEmails = admins.map(admin => admin.email);

    // Send email notification to admins
    if (process.env.RESEND_API_KEY && adminEmails.length > 0) {
      try {
        await resend.emails.send({
          from: 'Rafazz Contact <onboarding@resend.dev>',
          to: 'berglin1998@gmail.com', // Primary admin for testing/fallback
          cc: adminEmails.filter(e => e !== 'berglin1998@gmail.com'),
          subject: `New Contact Message from ${name}`,
          html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <br/>
            <p>Login to the admin dashboard to view all messages.</p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }

    return NextResponse.json(
      { message: 'Message sent successfully', contact },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// GET: Fetch messages (Admin: all, User: own)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    let query = {};
    if (session.user.role !== 'admin') {
      // If not admin, only fetch own messages by email
      query = { email: session.user.email };
    }

    const messages = await Contact.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// PUT: Reply to message (Admin only)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, reply } = await request.json();

    if (!id || !reply) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await connectDB();

    const contact = await Contact.findByIdAndUpdate(
      id,
      { 
        reply, 
        repliedAt: Date.now(),
        read: true 
      },
      { new: true }
    );

    if (!contact) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Send email to user
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Rafazz Support <onboarding@resend.dev>',
          to: contact.email,
          subject: 'Re: Your message to Rafazz',
          html: `
            <h2>Hello ${contact.name},</h2>
            <p>Thank you for contacting us. Here is our reply to your message:</p>
            <blockquote style="border-left: 4px solid #eee; padding-left: 16px; margin: 16px 0; color: #666;">
              ${contact.message}
            </blockquote>
            <p><strong>Our Reply:</strong></p>
            <p>${reply}</p>
            <br/>
            <p>Best regards,<br/>The Rafazz Team</p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send reply email:', emailError);
      }
    }

    return NextResponse.json({ message: 'Reply sent successfully', contact }, { status: 200 });
  } catch (error) {
    console.error('Error sending reply:', error);
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    );
  }
}
