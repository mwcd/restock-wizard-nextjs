import { getGpus, getGpusOfType } from "../lib/scrapeGpus"
import { InferGetStaticPropsType } from 'next'

export async function getStaticProps({ params }) {
    const gpus = getGpusOfType(params.gpu)
    return {
        props: {
            gpus
        },
        // Next.js will attempt to re-generate the page:
        // - When a request comes in
        // - At most once every 30 seconds
        revalidate: 30,
    }
}

export async function getStaticPaths() {
    const gpuTypes = Object.keys(getGpus())
    const paths = gpuTypes.map(gpuType => ({
        params: {gpu: gpuType},
    }))
    
    return {
        paths,
        fallback: false
    }
}

export default function Gpu({ gpus }: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <div>
            {/* {id} */}
            <br />
            {gpus.length}
        </div>
    )
}

