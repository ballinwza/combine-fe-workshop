'use client'
import { Button, TextField } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
    const [user, setUser] = useState<string>('')
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
            <div className="flex gap-4">
                <TextField
                    type="text"
                    label="กรุณากรอกชื่อ User เพื่อเข้าใช้งาน Queue"
                    variant="outlined"
                    style={{ width: '50%' }}
                    value={user}
                    onChange={(e) => {
                        setUser(e.target.value)
                    }}
                />
                {user === '' ? (
                    <Button variant="contained" disabled={user === ''}>
                        Message Queue
                    </Button>
                ) : (
                    <Button variant="contained" disabled={user === ''}>
                        <Link href={`/message-queue/${user}`}>
                            Message Queue
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    )
}
