'use client'
import {
    Button,
    Card,
    CardContent,
    FormControl,
    TextField,
    Typography,
} from '@mui/material'
import { FC, useState } from 'react'

interface UserDetail {
    name: string
    age: number
    expireTime: number
}
const Cache: FC = () => {
    const [form, setForm] = useState({
        name: '',
        age: 0,
        expireTime: 0,
    })

    const [dataFromRedis, setDataFromRedis] = useState<UserDetail>()

    const handleSave = async () => {
        try {
            const response = await fetch(
                `http://${process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL}/basic/set/cache`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form),
                },
            )

            const result = await response.json()

            if (result) {
                handleGetData()
            }
        } catch (error) {
            console.error(`Failed to save data : ${error}`)
        }
    }

    const handleGetData = async () => {
        try {
            const getResponse = await fetch(
                `http://localhost:8080/basic/get/cache?name=${form.name}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            )
            const getData = await getResponse.json()
            setDataFromRedis(getData)
        } catch (error) {
            console.error(`Failed to fetch data : ${error}`)
        }
    }

    return (
        <div className="flex flex-col gap-10 m-10">
            <FormControl className="flex flex-col gap-6">
                <TextField
                    type="text"
                    label="กรอกชื่อตรงนี้"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                        setForm({ ...form, name: e.target.value })
                    }}
                />
                <TextField
                    type="number"
                    label="กรอกอายุ"
                    defaultValue={0}
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                        setForm({ ...form, age: Number(e.target.value) })
                    }}
                />
                <TextField
                    type="number"
                    label="กรอกเวลาที่ต้องการเก็บ"
                    defaultValue={0}
                    variant="outlined"
                    fullWidth
                    onChange={(e) => {
                        setForm({ ...form, expireTime: Number(e.target.value) })
                    }}
                />
                <Button type="submit" variant="contained" onClick={handleSave}>
                    Submit
                </Button>
            </FormControl>

            <div className="flex flex-col w-1/2">
                <Card>
                    <CardContent>
                        <Typography
                            gutterBottom
                            textTransform="uppercase"
                            sx={{ color: 'text.secondary', fontSize: 14 }}
                        >
                            Detail
                        </Typography>
                        <Typography variant="h5" component="div">
                            {dataFromRedis?.name ?? 'ไม่พบค่าดังกล่าว'}
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>
                            {dataFromRedis?.age ?? 'ไม่พบค่าดังกล่าว'}
                        </Typography>
                        <Typography variant="body2">
                            well meaning and kindly.
                            <br />
                            {'"a benevolent smile"'}
                        </Typography>
                    </CardContent>
                </Card>

                <Button
                    type="submit"
                    variant="contained"
                    onClick={handleGetData}
                >
                    Get Data
                </Button>
            </div>
        </div>
    )
}

export default Cache
