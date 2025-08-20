'use client'
import { Button } from '@mui/material'
import Link from 'next/link'

export default function Home() {
    return (
        <div className="flex flex-col gap-3">
            <div>
                <Button variant="contained">
                    <Link href={'/cache'}> Basic Cache</Link>
                </Button>
            </div>
            <div>
                <Button variant="contained">
                    <Link href={'/leaderboard'}>Leaderboard</Link>
                </Button>
            </div>
            <div>
                <Button variant="contained">
                    <Link href={'/chat'}>Chatroom</Link>
                </Button>
            </div>
            <div>
                <Button variant="contained">
                    <Link href={'/message-queue'}> Message Queue</Link>
                </Button>
            </div>
        </div>
    )
}
