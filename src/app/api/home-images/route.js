import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import HomeImage from '@/models/HomeImage';

// GET all home images
export async function GET() {
  try {
    await connectDB();
    const images = await HomeImage.find({ isActive: true }).sort({ position: 1 });
    return NextResponse.json({ images }, { status: 200 });
  } catch (error) {
    console.error('Error fetching home images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// POST create new home image (protected)
export async function POST(request) {
  try {
    console.log('📸 Creating new home image...');
    
    const session = await getServerSession(authOptions);
    if (!session) {
      console.log('❌ Unauthorized - no session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('✅ Session verified:', session.user.email);
    console.log('📦 Parsing request data...');
    
    const data = await request.json();
    console.log('📊 Data received:', {
      title: data.title,
      label: data.label,
      cardType: data.cardType,
      position: data.position,
      imageDataSize: data.imageData ? `${(data.imageData.length / 1024).toFixed(2)} KB` : 'No image',
    });

    console.log('🔌 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected');

    console.log('💾 Creating image document...');
    const image = await HomeImage.create(data);
    console.log('✅ Image created successfully:', image._id);
    
    return NextResponse.json({ image }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating home image:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3).join('\n'),
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to create image',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// PUT update home image (protected)
export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, ...updateData } = await request.json();
    await connectDB();

    const image = await HomeImage.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true }
    );

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ image }, { status: 200 });
  } catch (error) {
    console.error('Error updating home image:', error);
    return NextResponse.json(
      { error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

// DELETE home image (protected)
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    await connectDB();

    const image = await HomeImage.findByIdAndDelete(id);

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting home image:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
