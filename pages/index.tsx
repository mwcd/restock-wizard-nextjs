import styles from '../styles/Home.module.css'
import React from 'react'
import { useTable } from 'react-table'
import { InferGetStaticPropsType } from 'next'
import { getHomepageGpus, updateGpus } from '../lib/scrapeGpus'

export async function getStaticProps() {
  // This is the only updater of Gpus. Every other place will just access it
  await updateGpus()
  const homepageGpus = getHomepageGpus()
  const lastUpdated = new Date()
  const dateOpts = { timeZone: 'America/New_York', timeZoneName: 'short' }

  return {
    props: {
      gpus: homepageGpus,
      gpuTypes: Object.keys(homepageGpus),
      lastUpdated: lastUpdated.toLocaleTimeString('en-US', dateOpts)
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 30 second
    revalidate: 30,
  }
}

export default function Home({ gpus: gpus, gpuTypes: gpuTypes, lastUpdated: lastUpdated }: InferGetStaticPropsType<typeof getStaticProps>) {
  const data = React.useMemo(
    () => [
      {
        prodName: { name: 'RTX 3060 Ti', url: gpuTypes[0] },
        avail: gpus.nvidia3060Ti[0].inStock ? 'Available' : 'Not Available',
        price: gpus.nvidia3060Ti[0].price,
        link: gpus.nvidia3060Ti[0].address
      },
      {
        prodName: { name: 'RTX 3070', url: gpuTypes[1] },
        avail: gpus.nvidia3070[0].inStock ? 'Available' : 'Not Available',
        price: gpus.nvidia3070[0].price,
        link: gpus.nvidia3070[0].address
      },
      {
        prodName: { name: 'RTX 3080', url: gpuTypes[2] },
        avail: gpus.nvidia3080[0].inStock ? 'Available' : 'Not Available',
        price: gpus.nvidia3080[0].price,
        link: gpus.nvidia3080[0].address
      },
      {
        prodName: { name: 'RTX 3090', url: gpuTypes[3] },
        avail: gpus.nvidia3090[0].inStock ? 'Available' : 'Not Available',
        price: gpus.nvidia3090[0].price,
        link: gpus.nvidia3090[0].address
      },
      {
        prodName: { name: 'TITAN RTX', url: gpuTypes[4] },
        avail: gpus.nvidiaTitanRtx[0].inStock ? 'Available' : 'Not Available',
        price: gpus.nvidiaTitanRtx[0].price,
        link: gpus.nvidiaTitanRtx[0].address
      },
      {
        prodName: { name: 'RX 6800', url: gpuTypes[5] },
        avail: gpus.amdRx6800[0].inStock ? 'Available' : 'Not Available',
        price: gpus.amdRx6800[0].price,
        link: gpus.amdRx6800[0].address
      },
      {
        prodName: { name: 'RX 6800 XT', url: gpuTypes[6] },
        avail: gpus.amdRx6800Xt[0].inStock ? 'Available' : 'Not Available',
        price: gpus.amdRx6800Xt[0].price,
        link: gpus.amdRx6800Xt[0].address
      },
      {
        prodName: { name: 'RX 6900', url: gpuTypes[7] },
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
        Cell: cellInfo => <a target="_blank" rel="noopener noreferrer"
          href={cellInfo.value.url}>
          {cellInfo.value.name}</a>
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
    <div className={styles.container}>
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
  )
}
