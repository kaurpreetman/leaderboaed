"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import useSWR from 'swr';
import { Trophy, Clock, Medal, Users } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours}h ${minutes}m ${remainingSeconds}s`;
}

export default function Home() {
  const { data: leaderboard, error, mutate } = useSWR('/api/leaderboard', fetcher, {
    refreshInterval: 60000,
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  if (error) return <div>Failed to load leaderboard</div>;
  if (!Array.isArray(leaderboard)) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Trophy className="h-10 w-10 text-yellow-400" />
            <h1 className="text-4xl font-bold">Scavenger Hunt Leaderboard</h1>
          </div>
          <Link href="/participants">
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Manage Participants
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {leaderboard.slice(0, 3).map((participant: any, index: number) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className={`h-6 w-6 ${
                    index === 0 ? 'text-yellow-400' :
                    index === 1 ? 'text-gray-400' :
                    'text-amber-700'
                  }`} />
                  {participant.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{participant.totalPoints} points</p>
                  <p className="text-gray-400 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {formatTime(participant.totalTime)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-400">Rank</TableHead>
                  <TableHead className="text-gray-400">Participant</TableHead>
                  <TableHead className="text-gray-400 text-right">Points</TableHead>
                  <TableHead className="text-gray-400 text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((participant: any, index: number) => (
                  <TableRow key={index} className="border-gray-700">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell className="text-right">{participant.totalPoints}</TableCell>
                    <TableCell className="text-right">{formatTime(participant.totalTime)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}