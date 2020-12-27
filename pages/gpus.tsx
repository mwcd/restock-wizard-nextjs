import Layout from '../components/layout'
import React from 'react'
import { useTable } from 'react-table'
import { GetStaticPropsResult, InferGetStaticPropsType } from 'next'
import { getGpus, getGpusInStock, sortGpus } from '../lib/scrapeGpus'
import { GpuStockReturn } from '../interfaces/interfaces'

export async function getStaticProps(): Promise<GetStaticPropsResult<GpuStockReturn>> {
  const allGpus = await getGpus()
  sortGpus(allGpus)
  let availableGpus = getGpusInStock(allGpus)

  return {
    props: {
      availableGpuStock: availableGpus,
      totalGpuStock: allGpus
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 300 second
    revalidate: 300,
  }
}

export default function Gpus({ availableGpuStock: availableGpuStock, totalGpuStock: totalGpuStock }: InferGetStaticPropsType<typeof getStaticProps>) {

  const data = React.useMemo(
    () => [
      {
        col1: 'RTX 3060 Ti',
        col2: availableGpuStock.nvidia3060Ti.length > 0 ? 'Available' : 'Not Available',
        col3: availableGpuStock.nvidia3060Ti.length > 0 ? availableGpuStock.nvidia3060Ti[0].price : totalGpuStock.nvidia3060Ti[0].price,
        col4: availableGpuStock.nvidia3060Ti.length > 0 ? availableGpuStock.nvidia3060Ti[0].address : totalGpuStock.nvidia3060Ti[0].address,
      },
      {
        col1: 'RTX 3070',
        col2: availableGpuStock.nvidia3070.length > 0 ? 'Available' : 'Not Available',
        col3: availableGpuStock.nvidia3070.length > 0 ? availableGpuStock.nvidia3070[0].price : totalGpuStock.nvidia3070[0].price,
        col4: availableGpuStock.nvidia3070.length > 0 ? availableGpuStock.nvidia3070[0].address : totalGpuStock.nvidia3070[0].address,
      },
      {
        col1: 'RTX 3080',
        col2: availableGpuStock.nvidia3080.length > 0 ? 'Available' : 'Not Available',
        col3: availableGpuStock.nvidia3080.length > 0 ? availableGpuStock.nvidia3080[0].price : totalGpuStock.nvidia3080[0].price,
        col4: availableGpuStock.nvidia3080.length > 0 ? availableGpuStock.nvidia3080[0].address : totalGpuStock.nvidia3080[0].address,
      },
      {
        col1: 'RTX 3090',
        col2: availableGpuStock.nvidia3090.length > 0 ? 'Available' : 'Not Available',
        col3: availableGpuStock.nvidia3090.length > 0 ? availableGpuStock.nvidia3090[0].price : totalGpuStock.nvidia3090[0].price,
        col4: availableGpuStock.nvidia3090.length > 0 ? availableGpuStock.nvidia3090[0].address : totalGpuStock.nvidia3090[0].address,
      },
      {
        col1: 'TITAN RTX',
        col2: availableGpuStock.nvidiaTitanRtx.length > 0 ? 'Available' : 'Not Available',
        col3: availableGpuStock.nvidiaTitanRtx.length > 0 ? availableGpuStock.nvidiaTitanRtx[0].price : totalGpuStock.nvidiaTitanRtx[0].price,
        col4: availableGpuStock.nvidiaTitanRtx.length > 0 ? availableGpuStock.nvidiaTitanRtx[0].address : totalGpuStock.nvidiaTitanRtx[0].address,
      },
      {
        col1: 'RX 6800',
        col2: availableGpuStock.amdRx6800.length > 0 ? 'Available' : 'Not Available',
        col3: availableGpuStock.amdRx6800.length > 0 ? availableGpuStock.amdRx6800[0].price : totalGpuStock.amdRx6800[0].price,
        col4: availableGpuStock.amdRx6800.length > 0 ? availableGpuStock.amdRx6800[0].address : totalGpuStock.amdRx6800[0].address,
      },
      {
        col1: 'RX 6800 XT',
        col2: availableGpuStock.amdRx6800Xt.length > 0 ? 'Available' : 'Not Available',
        col3: availableGpuStock.amdRx6800Xt.length > 0 ? availableGpuStock.amdRx6800Xt[0].price : totalGpuStock.amdRx6800Xt[0].price,
        col4: availableGpuStock.amdRx6800Xt.length > 0 ? availableGpuStock.amdRx6800Xt[0].address : totalGpuStock.amdRx6800Xt[0].address,
      },
      {
        col1: 'RX 6900 XT',
        col2: availableGpuStock.amdRx6900Xt.length > 0 ? 'Available' : 'Not Available',
        col3: availableGpuStock.amdRx6900Xt.length > 0 ? availableGpuStock.amdRx6900Xt[0].price : totalGpuStock.amdRx6900Xt[0].price,
        col4: availableGpuStock.amdRx6900Xt.length > 0 ? availableGpuStock.amdRx6900Xt[0].address : totalGpuStock.amdRx6900Xt[0].address,
      },
    ],
    []
  )

  const columns = React.useMemo(
    () => [
      {
        Header: 'Product Name',
        accessor: 'col1', // accessor is the "key" in the data
      },
      {
        Header: 'Availability',
        accessor: 'col2',
      },
      {
        Header: 'Price',
        accessor: 'col3',
      },
      {
        Header: 'Link',
        accessor: 'col4',
        Cell: url =><a href={url.value}> link </a>
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
    </Layout>
  )
}