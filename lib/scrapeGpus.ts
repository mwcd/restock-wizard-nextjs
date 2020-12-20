import axios from 'axios'
import cheerio from 'cheerio'
import { AvailableGpus, GpuInfo, StoreGpuStock } from '../interfaces/interfaces'

export async function getGpusInStock(): Promise<StoreGpuStock> {
    const bestBuyGpus = await getBestBuyGpus()

    let gpusInStock: StoreGpuStock = {
        Nvidia3060Ti: bestBuyGpus.Nvidia3060Ti.filter(gpuInfo => gpuInfo.inStock),
        Nvidia3070: bestBuyGpus.Nvidia3070.filter(gpuInfo => gpuInfo.inStock),
        Nvidia3080: bestBuyGpus.Nvidia3080.filter(gpuInfo => gpuInfo.inStock),
        Nvidia3090: bestBuyGpus.Nvidia3090.filter(gpuInfo => gpuInfo.inStock),
        NvidiaTitanRtx: bestBuyGpus.NvidiaTitanRtx.filter(gpuInfo => gpuInfo.inStock),
        AmdRx6800: bestBuyGpus.AmdRx6800.filter(gpuInfo => gpuInfo.inStock),
        AmdRx6800Xt: bestBuyGpus.AmdRx6800Xt.filter(gpuInfo => gpuInfo.inStock),
        AmdRx6900Xt: bestBuyGpus.AmdRx6900Xt.filter(gpuInfo => gpuInfo.inStock)
    }

    return gpusInStock
}

export async function getBestBuyGpus(): Promise<StoreGpuStock> {
    const url3060Ti = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~NVIDIA%20GeForce%20RTX%203060%20Ti'
    const url3070 = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~NVIDIA%20GeForce%20RTX%203070'
    const url3080 = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~NVIDIA%20GeForce%20RTX%203080'
    const url3090 = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~NVIDIA%20GeForce%20RTX%203090'
    const urlTitanRtx = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~NVIDIA%20Titan%20RTX'
    const urlRx6800 = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~AMD%20Radeon%20RX%206800'
    const urlRx6800Xt = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~AMD%20Radeon%20RX%206800%20XT'
    const urlRx6900Xt = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~AMD%20Radeon%20RX%206900%20XT'

    const nvidia3060Tis = await getBestBuyGpu(url3060Ti)
    const nvidia3070s = await getBestBuyGpu(url3070)
    const nvidia3080s = await getBestBuyGpu(url3080)
    const nvidia3090s = await getBestBuyGpu(url3090)
    const NvidiaTitanRtxs = await getBestBuyGpu(urlTitanRtx)
    const amdRx6800s = await getBestBuyGpu(urlRx6800)
    const amdRx6800Xts = await getBestBuyGpu(urlRx6800Xt)
    const amdRx6900Xts = await getBestBuyGpu(urlRx6900Xt)

    const gpuStock: StoreGpuStock = {
        Nvidia3060Ti: nvidia3060Tis,
        Nvidia3070: nvidia3070s,
        Nvidia3080: nvidia3080s,
        Nvidia3090: nvidia3090s,
        NvidiaTitanRtx: NvidiaTitanRtxs,
        AmdRx6800: amdRx6800s,
        AmdRx6800Xt: amdRx6800Xts,
        AmdRx6900Xt: amdRx6900Xts
    }

    return gpuStock
}

async function getBestBuyGpu(url: string): Promise<GpuInfo[]> {
    const res = await axios.get(url)
    const data = res.data
    const $ = cheerio.load(data)
    let gpus: GpuInfo[] = new Array()
    $('.list-item.lv').each(function (index, element) {
        const information = $(this).children('.right-column').children('.information')
        const priceBlock = $(this).children('.right-column').children('.price-block')
        const link = information.find('.sku-header').children('a')

        const name = link.text()
        const address = link.attr('href')
        const price = priceBlock.find('.priceView-hero-price.priceView-customer-price').children('span').text()
        const itemStatus = priceBlock.find('.add-to-cart-button').text()

        let gpu: GpuInfo = {
            name: name,
            address: address,
            price: parseInt(price),
            inStock: itemStatus === 'Add to Cart' || itemStatus === 'Check Stores'
        }
        gpus.push(gpu)
    })

    return gpus
}