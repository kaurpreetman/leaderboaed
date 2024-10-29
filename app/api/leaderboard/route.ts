import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import redis from '@/lib/redis';
import Participant from '@/lib/models/Participant';

export async function GET() {
  try {
    // Try to get cached leaderboard
    const cachedLeaderboard = await redis.get('leaderboard');
    if (cachedLeaderboard) {
      return NextResponse.json(JSON.parse(cachedLeaderboard));
    }

    // If no cache, query MongoDB
    await connectDB();
    
    const leaderboard = await Participant.aggregate([
      {
        $sort: {
          totalPoints: -1,
          totalTime: 1,
        },
      },
      {
        $project: {
          name: 1,
          totalPoints: 1,
          totalTime: 1,
          _id: 0,
        },
      },
    ]);

    // Cache the result
    await redis.set('leaderboard', JSON.stringify(leaderboard), 'EX', 60);

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}