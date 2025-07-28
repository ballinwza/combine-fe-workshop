'use client'
import CancelIcon from '@mui/icons-material/Cancel'
import LooksOneIcon from '@mui/icons-material/LooksOne'
import {
    Avatar,
    Button,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
} from '@mui/material'
import { clsx } from 'clsx'
import { FC, useEffect, useRef, useState } from 'react'

type PlayerScore = {
    username: string
    score: number
}

const Leaderboard: FC = () => {
    const buttonEle = useRef(null)
    const socketRef = useRef<WebSocket | null>(null)
    const [players, setPlayers] = useState<PlayerScore[] | null>(null)
    const [name, setName] = useState<string>('Hello world')

    const IncScore = async () => {
        await fetch(`http://localhost:3001/leaderboard/save?username=${name}`)
    }

    const handleSubmit = () => {
        IncScore()
    }

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001/ws/leaderboard')

        ws.onopen = () => {
            console.log('Connected')
            socketRef.current = ws
        }

        ws.onmessage = (event) => {
            const convertJson = JSON.parse(event.data)
            setPlayers(convertJson)
        }

        ws.onclose = () => {
            console.log('Closed')
            socketRef.current?.close()
        }

        ws.onerror = (error) => {
            console.error(error)
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.close()
            }
        }
    }, [])

    return (
        <div className="p-2">
            <h1 className="text-4xl mb-4">Leaderboard</h1>

            <div className="border flex flex-col min-w-1/2 w-fit gap-4 p-4">
                <div>
                    Current Name :{' '}
                    <span className="text-blue-600 font-bold">{name}</span>
                </div>
                <div>
                    <TextField
                        type="text"
                        label="กรอกชื่อตรงนี้"
                        variant="outlined"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit()
                            }
                        }}
                    />
                </div>
                <Button
                    variant="contained"
                    ref={buttonEle}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </div>

            <List dense={true}>
                {players?.map((player, index) => (
                    <ListItem
                        key={index}
                        divider
                        className={clsx`${index === 0 ? 'bg-green-300' : 'bg-red-300'}`}
                    >
                        <ListItemAvatar>
                            <Avatar>
                                {index === 0 ? (
                                    <LooksOneIcon color="success" />
                                ) : (
                                    <CancelIcon color="error" />
                                )}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={player.username}
                            secondary={`Score : ${player.score}`}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    )
}

export default Leaderboard
