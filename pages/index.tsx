import Head from 'next/head'
import Layout from '../components/layout'
import styles from '../styles/Home.module.css'
import React from 'react'
import { useTable } from 'react-table'
import { GetStaticPropsResult, InferGetStaticPropsType } from 'next'
import { getHomepageGpus } from '../lib/scrapeGpus'
import { GpuStockReturn } from '../interfaces/interfaces'

export async function getStaticProps(): Promise<GetStaticPropsResult<GpuStockReturn>> {
  const homepageGpus = await getHomepageGpus()
  const lastUpdated = new Date()
  const dateOpts = { timeZone: 'America/New_York', timeZoneName: 'short' }

  return {
    props: {
      gpus: homepageGpus,
      lastUpdated: lastUpdated.toLocaleTimeString('en-US', dateOpts)
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 300 second
    revalidate: 30,
  }
}

export default function Home({ gpus: gpus, lastUpdated: lastUpdated }: InferGetStaticPropsType<typeof getStaticProps>) {

  const data = React.useMemo(
    () => [
      {
        prodName: 'RTX 3060 Ti',
        avail: gpus.nvidia3060Ti[0].inStock ? 'Available' : 'Not Available',
        price: gpus.nvidia3060Ti[0].price,
        link: gpus.nvidia3060Ti[0].address
      },
      {
        prodName: 'RTX 3070',
        avail: gpus.nvidia3070[0].inStock ? 'Available' : 'Not Available',
        price: gpus.nvidia3070[0].price,
        link: gpus.nvidia3070[0].address
      },
      {
        prodName: 'RTX 3080',
        avail: gpus.nvidia3080[0].inStock ? 'Available' : 'Not Available',
        price: gpus.nvidia3080[0].price,
        link: gpus.nvidia3080[0].address
      },
      {
        prodName: 'RTX 3090',
        avail: gpus.nvidia3090[0].inStock ? 'Available' : 'Not Available',
        price: gpus.nvidia3090[0].price,
        link: gpus.nvidia3090[0].address
      },
      {
        prodName: 'TITAN RTX',
        avail: gpus.nvidiaTitanRtx[0].inStock ? 'Available' : 'Not Available',
        price: gpus.nvidiaTitanRtx[0].price,
        link: gpus.nvidiaTitanRtx[0].address
      },
      {
        prodName: 'RX 6800',
        avail: gpus.amdRx6800[0].inStock ? 'Available' : 'Not Available',
        price: gpus.amdRx6800[0].price,
        link: gpus.amdRx6800[0].address
      },
      {
        prodName: 'RX 6800 XT',
        avail: gpus.amdRx6800Xt[0].inStock ? 'Available' : 'Not Available',
        price: gpus.amdRx6800Xt[0].price,
        link: gpus.amdRx6800Xt[0].address
      },
      {
        prodName: 'RX 6900 XT',
        avail: gpus.amdRx6900Xt[0].inStock ? 'Available' : 'Not Available',
        price: gpus.amdRx6900Xt[0].price,
        link: gpus.amdRx6900Xt[0].address
      },
    ],
    []
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Product Name',
        accessor: 'prodName',
      },
      {
        Header: 'Availability',
        accessor: 'avail',
      },
      {
        Header: 'Price',
        accessor: 'price',
      },
      {
        Header: 'Link',
        accessor: 'link',
        Cell: url => <a target="_blank" rel="noopener noreferrer" className={styles.button} href={url.value}>
          View &rarr;</a>
      },
    ],
    []
  )
  // @ts-ignore
  const tableInstance = useTable({ columns, data })

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Restock Wizard</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.main}>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h3>Graphics Cards</h3>

              <table {...getTableProps()}>
                <thead>
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map(column => (
                        <th
                          {...column.getHeaderProps()}
                        >
                          {column.render('Header')}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {rows.map(row => {
                    prepareRow(row)
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                          return (
                            <td
                              {...cell.getCellProps()}
                            >
                              {cell.render('Cell')}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              <p className={styles.cardFooter}>Last updated: {lastUpdated}</p>
            </div>

            <a className={styles.card}>
              <h3>Processors &rarr;</h3>
              <p>Coming soon</p>
            </a>

            <a className={styles.card}>
              <h3>Playstation 5 &rarr;</h3>
              <p>Coming soon</p>
            </a>

            <a className={styles.card}>
              <h3>Xbox Series X &rarr;</h3>
              <p>Coming soon</p>
            </a>
          </div>
        </main>
      </div>
    </Layout>
  )
}
