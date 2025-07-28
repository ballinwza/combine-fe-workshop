'use client'

import { FC, useEffect } from 'react'

const MassageQueue: FC = () => {
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3001/ws/test')

        ws.onopen = () => {
            console.log('Connected')
            ws.send('Hellow websocket')
        }

        ws.onmessage = (event) => {
            console.log('message from server : ', event.data)
        }

        ws.onclose = () => {
            console.log('closed')
        }

        ws.onerror = (error) => {
            console.error('Websocket error : ', error)
        }

        return () => {
            ws.close()
        }
    }, [])

    return (
        <div>
            <h2>Go-Fiber + Next.js WebSocket Chat</h2>
        </div>
    )
}

export default MassageQueue
