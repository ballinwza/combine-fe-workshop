import ChatRoom from '@/providers/chat'

export default async function ChatPage() {
    try {
        return (
            <div>
                <ChatRoom />
            </div>
        )
    } catch (error) {
        console.error(`Failed to fetch data : ${error}`)
        return <div>Error</div>
    }
}
