'use client'

import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Modal,
    Typography,
} from '@mui/material'
import { FC, useEffect, useState } from 'react'

enum BookingStatus {
    pending = 'booking_pending',
    successed = 'booking_successed',
    failed = 'booking_failed',
    remaining = 'ticket_remaining',
    notification = 'ticket_notification',
}

interface BookingTicket {
    Id: string
    UserId: string
    IsSuccess: boolean
    IsPending: boolean
    Message: string
    Type: BookingStatus
}

interface RemainingTicket {
    RemainingTicket: number
    Type: string
}

interface NotificationTicket {
    IsSuccess: boolean
    Message: string
    Type: BookingStatus
}

interface Props {
    slug: string
}
const MassageQueue: FC<Props> = ({ slug }: Props) => {
    const [bookingStatus, setBookingStatus] = useState<BookingTicket[]>([])
    const [remaingingTicket, setRemaingingTicket] = useState<RemainingTicket>()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isOnPending, setIsOnPending] = useState<boolean>(false)
    const [notification, setNotification] = useState<NotificationTicket>()

    useEffect(() => {
        const ws = new WebSocket(
            `ws://${process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL}/ws/sub/queue/${slug}`,
        )

        ws.onopen = () => {
            console.log('Connected')
            ws.send('Hellow websocket')
        }

        ws.onmessage = (event) => {
            const result = JSON.parse(event.data)

            if (result?.Type === BookingStatus.remaining) {
                setRemaingingTicket(result)
            }

            if (result?.Type == BookingStatus.notification) {
                setNotification(result)
                setIsModalOpen(true)
            }

            if (result?.length > 0) {
                setBookingStatus((prev) => {
                    if (prev.length != result.length) {
                        setIsOnPending(false)
                    }
                    return result
                })
            } else {
                if (result?.IsPending == true) {
                    setIsOnPending(true)
                    setBookingStatus((prev) => {
                        return [...prev, result]
                    })
                }

                if (result?.IsPending == false) {
                    setBookingStatus((prev) => {
                        const lastIndex = prev.pop()
                        const replaceResult =
                            prev.find((item) => item.Id === lastIndex?.Id) ??
                            result

                        return [...prev, replaceResult]
                    })
                    setIsOnPending(false)
                }
            }
        }

        ws.onclose = (err) => {
            console.log('closed : ', err)
        }

        ws.onerror = (error) => {
            console.error('Websocket error : ', error)
        }

        return () => {
            ws.close()
        }
    }, [])

    const bookingHandler = async () => {
        try {
            fetch(`http://localhost:8080/queue/sender/${slug}`)
        } catch (error) {
            console.error('Error booking : ', error)
        }
    }
    return (
        <div>
            <h2>Booking Ticket</h2>
            <div>UserId : {slug ?? 'ไม่มีค่า'}</div>

            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '1px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                    >
                        {notification?.IsSuccess}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {notification?.Message}
                    </Typography>
                </Box>
            </Modal>

            <Button
                onClick={bookingHandler}
                variant="contained"
                loading={isOnPending}
            >
                Booking
            </Button>

            <Card>
                <CardContent>
                    <Typography
                        gutterBottom
                        textTransform="uppercase"
                        sx={{ color: 'text.secondary', fontSize: 14 }}
                    >
                        Remaining
                    </Typography>
                    <Typography variant="h5" component="div">
                        VIP Ticket
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                        {remaingingTicket?.RemainingTicket}
                    </Typography>
                    <Typography variant="body2">
                        เหลือเพียง {remaingingTicket?.RemainingTicket} ที่นั่ง
                        เท่านั้น!!!
                    </Typography>
                </CardContent>
            </Card>

            <h1 className="mt-10 mb-4 text-2xl font-bold">ตั๋วที่จองไว้</h1>
            <div className="grid grid-cols-4 gap-10 ">
                {bookingStatus?.length > 0 &&
                    bookingStatus.map((item, index) => (
                        <Card key={index}>
                            <CardContent>
                                <Typography
                                    gutterBottom
                                    textTransform="uppercase"
                                    sx={{
                                        color: 'text.secondary',
                                        fontSize: 14,
                                    }}
                                >
                                    Ticket : {item.Id}
                                </Typography>
                                <Typography variant="h5" component="div">
                                    {item.UserId}
                                </Typography>
                                <Typography
                                    sx={{ color: 'text.secondary', mb: 1.5 }}
                                >
                                    Status :{' '}
                                    {item.IsPending ? (
                                        <CircularProgress />
                                    ) : (
                                        'successed'
                                    )}
                                </Typography>
                                <Typography variant="body2">
                                    {item.Message}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    )
}

export default MassageQueue
