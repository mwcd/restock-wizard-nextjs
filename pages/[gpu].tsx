import React, { useMemo } from 'react'
import { getGpus, getGpusOfType } from "../lib/scrapeGpus"
import styles from '../styles/Home.module.css'
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
        params: {gpu: gpuType},
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
      },
      {
        Header: 'Price',
        accessor: 'price',
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

  // const data = React.useMemo(
  //   () => 
  //   gpus.forEach((gpuInfo) => { 
  //     prodName: gpuInfo.name, 
  //     avail: gpuInfo.inStock, 
  //     price: gpuInfo.price, 
  //     link: gpuInfo.address } ),
  //   []
  // )
      
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
    )
  }