import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import redis from '@/lib/redis';
import Participant from '@/lib/models/Participant';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { participantId, level, points, timeTaken } = body;

    if (!participantId || !level || !points || !timeTaken) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Update participant's score
    const participant = await Participant.findByIdAndUpdate(
      participantId,
      {
        $push: {
          levels: {
            level,
            points,
            timeTaken,
            completedAt: new Date(),
          },
        },
        $inc: {
          totalPoints: points,
          totalTime: timeTaken,
        },
      },
      { new: true }
    );

    if (!participant) {
      return NextResponse.json(
        { error: 'Participant not found' },
        { status: 404 }
      );
    }

    // Clear leaderboard cache
    await redis.del('leaderboard');

    return NextResponse.json(participant);
  } catch (error) {
    console.error('Error updating score:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}