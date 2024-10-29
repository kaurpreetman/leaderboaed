import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Participant from '@/lib/models/Participant';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const participant = await Participant.findById(params.id);
    
    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(participant);
  } catch (error) {
    console.error('Error fetching participant:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const participant = await Participant.findByIdAndDelete(params.id);
    
    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Participant deleted successfully' });
  } catch (error) {
    console.error('Error deleting participant:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}