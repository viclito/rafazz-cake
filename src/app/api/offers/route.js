import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import Offer from '@/models/Offer';

// GET: Fetch the active offer (Public) or all offers (Admin - optional, but for now just active)
export async function GET(request) {
  try {
    await connectDB();
    
    // Find the most recently updated active offer
    // We could also just have one single document that gets updated
    const offer = await Offer.findOne({ isActive: true }).sort({ updatedAt: -1 });

    return NextResponse.json({ offer }, { status: 200 });
  } catch (error) {
    console.error('Error fetching offer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch offer' },
      { status: 500 }
    );
  }
}

// POST: Create or Update the Offer (Admin only)
// We'll treat this as "Upsert" - if an ID is provided, update; otherwise create/replace.
// For simplicity in this use case, we might just want ONE active offer at a time.
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    await connectDB();

    // Strategy: Deactivate all other offers first to ensure only one is active
    if (data.isActive) {
      await Offer.updateMany({}, { isActive: false });
    }

    let offer;
    if (data._id) {
      // Update existing
      offer = await Offer.findByIdAndUpdate(
        data._id,
        { ...data, updatedAt: Date.now() },
        { new: true }
      );
    } else {
      // Create new
      offer = await Offer.create(data);
    }

    return NextResponse.json({ message: 'Offer saved successfully', offer }, { status: 200 });
  } catch (error) {
    console.error('Error saving offer:', error);
    return NextResponse.json(
      { error: 'Failed to save offer' },
      { status: 500 }
    );
  }
}
