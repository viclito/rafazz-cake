import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('items.menuItem');

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Fetch admin orders error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id, status, adminAssignedTime } = await req.json();

    await connectDB();

    const order = await Order.findByIdAndUpdate(
      id,
      { status, adminAssignedTime },
      { new: true }
    ).populate('user', 'email name');

    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Send email notification to user about status update
    if (process.env.RESEND_API_KEY && order.user?.email) {
      try {
        await resend.emails.send({
          from: 'Rafazz Orders <onboarding@resend.dev>',
          to: order.user.email,
          subject: `Order Update #${order._id.toString().slice(-6)}`,
          html: `
            <h1>Order Update</h1>
            <p>Hi ${order.user.name},</p>
            <p>Your order status has been updated to: <strong>${status}</strong></p>
            ${adminAssignedTime ? `<p><strong>Expected Delivery:</strong> ${adminAssignedTime}</p>` : ''}
            <br/>
            <p>Thank you for choosing Rafazz!</p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }

    return NextResponse.json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
