import MassageQueue from '@/providers/massageQueue.provider'

export default async function MassagePage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    try {
        const { slug } = await params
        return <MassageQueue slug={slug} />
    } catch (error) {
        console.error(`Failed to fetch data : ${error}`)
        return <div>Error</div>
    }
}
