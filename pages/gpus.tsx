import Layout from '../components/layout'
import React from 'react'
import { useTable } from 'react-table'
import { GetStaticPropsResult, InferGetStaticPropsType } from 'next'
import { getGpusInStock } from '../lib/scrapeGpus'
import { AvailableGpus } from '../interfaces/interfaces'

export async function getStaticProps(): Promise<GetStaticPropsResult<AvailableGpus>> {
  const availableGpus = await getGpusInStock()

  return {
    props: {
      available3060Ti: availableGpus.Nvidia3060Ti.length > 0,
      available3070: availableGpus.Nvidia3070.length > 0,
      available3080: availableGpus.Nvidia3080.length > 0,
      available3090: availableGpus.Nvidia3090.length > 0,
      availableTitanRtx: availableGpus.NvidiaTitanRtx.length > 0,
      availableRx6800: availableGpus.AmdRx6800.length > 0,
      availableRx6800Xt: availableGpus.AmdRx6800Xt.length > 0,
      availableRx6900Xt: availableGpus.AmdRx6900Xt.length > 0
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 300 second
    revalidate: 300,
  }
}

export default function Gpus({ available3060Ti, available3070, available3080, available3090, availableTitanRtx, availableRx6800, availableRx6800Xt, availableRx6900Xt }: InferGetStaticPropsType<typeof getStaticProps>) {

  const data = React.useMemo(
    () => [
      {
        col1: 'RTX 3060 Ti',
        col2: available3060Ti ? 'Available' : 'Not Available',
      },
      {
        col1: 'RTX 3070',
        col2: available3070 ? 'Available' : 'Not Available',
      },
      {
        col1: 'RTX 3080',
        col2: available3080 ? 'Available' : 'Not Available',
      },
      {
        col1: 'RTX 3090',
        col2: available3090 ? 'Available' : 'Not Available',
      },
      {
        col1: 'TITAN RTX',
        col2: availableTitanRtx ? 'Available' : 'Not Available',
      },
      {
        col1: 'RX 6800',
        col2: availableRx6800 ? 'Available' : 'Not Available',
      },
      {
        col1: 'RX 6800 XT',
        col2: availableRx6800Xt ? 'Available' : 'Not Available',
      },
      {
        col1: 'RX 6900 XT',
        col2: availableRx6900Xt ? 'Available' : 'Not Available',
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
        Header: 'In Stock?',
        accessor: 'col2',
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