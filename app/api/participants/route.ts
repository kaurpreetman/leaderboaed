import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import redis from '@/lib/redis';
import Participant from '@/lib/models/Participant';

export async function GET() {
  try {
    await connectDB();
    const participants = await Participant.find({}).sort({ createdAt: -1 });
    return NextResponse.json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    await connectDB();
    const participant = new Participant({ name });
    await participant.save();

    // Clear leaderboard cache when new participant is added
    await redis.del('leaderboard');

    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    console.error('Error creating participant:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}