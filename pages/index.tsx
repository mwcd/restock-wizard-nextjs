import Head from 'next/head'
import Header from '../components/header'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Restock Wizard</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.grid}>
            <a href="/gpus" className={styles.card}>
              <h3>Graphics Cards &rarr;</h3>
            </a>

            <a href="https://nextjs.org/learn" className={styles.card}>
              <h3>Processors &rarr;</h3>
            </a>

            <a
              href="https://github.com/vercel/next.js/tree/master/examples"
              className={styles.card}
            >
              <h3>Playstation 5 &rarr;</h3>
            </a>

            <a
              href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              className={styles.card}
            >
              <h3>Xbox Series X &rarr;</h3>
            </a>
          </div>
        </main>
      </div>
    </Layout>
  )
}
