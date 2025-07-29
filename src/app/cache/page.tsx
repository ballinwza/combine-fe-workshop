import Cache from '@/providers/cache'

export default async function ChachePage() {
    try {
        return (
            <div>
                <Cache />
            </div>
        )
    } catch (error) {
        console.error(`Failed to fetch data : ${error}`)
        return <div>Error</div>
    }
}
