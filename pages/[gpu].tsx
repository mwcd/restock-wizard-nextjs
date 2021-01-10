import React, { useMemo } from 'react'
import { getGpus, getGpusInStock, getGpusOfType } from "../lib/scrapeGpus"
import styles from '../styles/Item.module.css'
import { InferGetStaticPropsType } from 'next'
import { useTable } from 'react-table'

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
    params: { gpu: gpuType },
  }))

  return {
    paths,
    fallback: false
  }
}

export default function Gpu({ gpus }: InferGetStaticPropsType<typeof getStaticProps>) {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Product Name',
        accessor: 'name',
      },
      {
        Header: 'Availability',
        accessor: 'inStock',
        Cell: data => data.value ? "Available" : "Unavailable"
      },
      {
        Header: 'Price',
        accessor: 'price',
        Cell: data => data.value == '$-1.00' ? "" : data.value
      },
      {
        Header: 'Link',
        accessor: 'address',
        Cell: url => <a target="_blank" rel="noopener noreferrer" className={styles.button} href={url.value}>
          View &rarr;</a>
      },
    ],
    []
  )

  const data = useMemo(() => JSON.parse(JSON.stringify(gpus)), [])

  return (
    <Table columns={columns} data={data} />
  )
}

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <div className={styles.gpuTable}>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}