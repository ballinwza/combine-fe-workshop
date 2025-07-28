'use client'
import { Button, TextField } from '@mui/material'
import { clsx } from 'clsx'
import { FC, useEffect, useState } from 'react'

type Message = {
    name: string
    text: string
}

const ChatRoom: FC = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState<string>('')
    const [name, setName] = useState<string>('')
    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001/ws/chat/')

        ws.onopen = () => {
            console.log('Connected')
            setMessages((prev) => [...prev])
            setSocket(ws)
        }

        ws.onmessage = (event) => {
            const messageData: Message[] = JSON.parse(event.data)

            setMessages(messageData.reverse())
        }

        ws.onclose = () => {
            console.log('closed')
            setMessages((prev) => [...prev])
            setSocket(null)
        }

        ws.onerror = (error) => {
            console.error(error)
            setMessages((prev) => [...prev])
        }

        return () => {
            if (ws.readyState === 1) {
                ws.close()
            }
        }
    }, [])

    const handleSendMsg = () => {
        if (input.trim() && socket) {
            const messageToSend: Message = {
                name: name,
                text: input,
            }
            socket.send(JSON.stringify(messageToSend))
            setInput('')
        }
    }
    return (
        <div className="p-2">
            <h1 className="text-4xl mb-4">Chatroom</h1>

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
                                handleSendMsg()
                            }
                        }}
                    />
                </div>
                <div>
                    <TextField
                        type="text"
                        label="กรอกข้อความแชท"
                        variant="outlined"
                        fullWidth
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMsg()
                            }
                        }}
                    />
                </div>
                <Button variant="contained" onClick={handleSendMsg}>
                    Submit
                </Button>
            </div>

            <p className="mt-4 font-bold text-xl">History</p>
            <div className="border overflow-scroll h-[500px] p-2">
                {messages.map((msg, index) => (
                    <p
                        key={index}
                        className={clsx`${index % 2 === 0 ? 'text-green-700' : 'text-orange-700'}`}
                    >
                        <span className="font-bold text-base">{msg.name}</span>{' '}
                        : <span className="text-sm">{msg.text}</span>
                    </p>
                ))}
            </div>
        </div>
    )
}

export default ChatRoom
