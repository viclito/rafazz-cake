import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { items, totalPrice, deliveryAddress, phoneNumber, specialInstructions } = await req.json();

    await connectDB();

    const newOrder = await Order.create({
      user: session.user.id,
      items,
      totalPrice,
      deliveryAddress,
      phoneNumber,
      specialInstructions,
    });

    // Send email to Admin
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'Rafazz Orders <onboarding@resend.dev>',
          to: 'berglin1998@gmail.com', // Admin email
          subject: `New Order #${newOrder._id.toString().slice(-6)}`,
          html: `
            <h1>New Order Received!</h1>
            <p><strong>Order ID:</strong> ${newOrder._id}</p>
            <p><strong>Customer:</strong> ${session.user.name} (${session.user.email})</p>
            <p><strong>Total:</strong> ₹${totalPrice.toFixed(2)}</p>
            <p><strong>Phone:</strong> ${phoneNumber}</p>
            <p><strong>Address:</strong> ${deliveryAddress}</p>
            <br/>
            <h2>Items:</h2>
            <ul>
              ${items.map(item => `
                <li>
                  ${item.name} x ${item.quantity} - ₹${item.price}
                  ${item.selectedCustomizations ? `<br/><small>${JSON.stringify(item.selectedCustomizations)}</small>` : ''}
                </li>
              `).join('')}
            </ul>
            <br/>
            <p>Please login to the admin dashboard to assign a delivery time.</p>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }

    return NextResponse.json({ message: 'Order placed successfully', order: newOrder }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Fetch orders for the logged-in user
    const orders = await Order.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .populate('items.menuItem');

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
