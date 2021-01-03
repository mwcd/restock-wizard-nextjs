import Header from '../components/header'
import Head from 'next/head'

export default function Layout({ children }) {
    return (
        <div>
            <Head>
                <title>Restock Wizard</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header></Header>
            {children}
        </div>
    )
}