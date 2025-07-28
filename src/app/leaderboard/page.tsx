import Leaderboard from '@/providers/leaderboard'

export default async function LeaderboardPage() {
    try {
        return (
            <div>
                <Leaderboard />
            </div>
        )
    } catch (error) {
        console.error(`Failed to fetch data : ${error}`)
        return <div>Error</div>
    }
}
