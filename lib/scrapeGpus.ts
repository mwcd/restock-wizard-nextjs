import axios from 'axios'
import cheerio from 'cheerio'
import { formatWithValidation } from 'next/dist/next-server/lib/utils'
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
    const bestBuy3060Ti = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~NVIDIA%20GeForce%20RTX%203060%20Ti'
    const bestBuy3070 = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~NVIDIA%20GeForce%20RTX%203070'
    const bestBuy3080 = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~NVIDIA%20GeForce%20RTX%203080'
    const bestBuy3090 = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~NVIDIA%20GeForce%20RTX%203090'
    const bestBuyTitanRtx = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~NVIDIA%20Titan%20RTX'
    const bestBuyRx6800 = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~AMD%20Radeon%20RX%206800'
    const bestBuyRx6800Xt = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~AMD%20Radeon%20RX%206800%20XT'
    const bestBuyRx6900Xt = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~AMD%20Radeon%20RX%206900%20XT'

    let nvidia3060Tis = await getBestBuyGpu(bestBuy3060Ti)
    let nvidia3070s = await getBestBuyGpu(bestBuy3070)
    let nvidia3080s = await getBestBuyGpu(bestBuy3080)
    let nvidia3090s = await getBestBuyGpu(bestBuy3090)
    let NvidiaTitanRtxs = await getBestBuyGpu(bestBuyTitanRtx)
    let amdRx6800s = await getBestBuyGpu(bestBuyRx6800)
    let amdRx6800Xts = await getBestBuyGpu(bestBuyRx6800Xt)
    let amdRx6900Xts = await getBestBuyGpu(bestBuyRx6900Xt)

    const bhPhoto3060Ti = 'https://www.bhphotovideo.com/c/products/Graphic-Cards/ci/6567/N/3668461602?filters=fct_nvidia-geforce-series_5011%3Ageforce-rtx-3060-ti'
    const bhPhoto3070 = 'https://www.bhphotovideo.com/c/products/Graphic-Cards/ci/6567/N/3668461602?filters=fct_nvidia-geforce-series_5011%3Ageforce-rtx-3070'
    const bhPhoto3080 = 'https://www.bhphotovideo.com/c/products/Graphic-Cards/ci/6567/N/3668461602?filters=fct_nvidia-geforce-series_5011%3Ageforce-rtx-3080'
    const bhPhoto3090 = 'https://www.bhphotovideo.com/c/products/Graphic-Cards/ci/6567/N/3668461602?filters=fct_nvidia-geforce-series_5011%3Ageforce-rtx-3090'
    // This is a search as there's no category
    // TODO: Make sure search results are formatted the same as category results
    const bhPhotoTitanRtx = 'https://www.bhphotovideo.com/c/search?Ntt=titanrtx&N=0&InitialSearch=yes&sts=ma'
    const bhPhotoRx6800 = 'https://www.bhphotovideo.com/c/products/Graphic-Cards/ci/6567/N/3668461602?filters=fct_amd-radeon-series_5012%3Aradeon-rx-6800'
    const bhPhotoRx6800Xt = 'https://www.bhphotovideo.com/c/products/Graphic-Cards/ci/6567/N/3668461602?filters=fct_amd-radeon-series_5012%3Aradeon-rx-6800-xt'
    // TODO: No 6900 XT - update once one exists

    nvidia3060Tis.push(...(await getBhPhotoGpu(bhPhoto3060Ti)))
    nvidia3070s.push(...(await getBhPhotoGpu(bhPhoto3070)))
    nvidia3080s.push(...(await getBhPhotoGpu(bhPhoto3080)))
    nvidia3090s.push(...(await getBhPhotoGpu(bhPhoto3090)))
    NvidiaTitanRtxs.push(...(await getBhPhotoGpu(bhPhotoTitanRtx)))
    amdRx6800s.push(...(await getBhPhotoGpu(bhPhotoRx6800)))
    amdRx6800Xts.push(...(await getBhPhotoGpu(bhPhotoRx6800Xt)))

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
        const infoBlock = $(this).children('.right-column').children('.information')
        const priceBlock = $(this).children('.right-column').children('.price-block')

        const link = infoBlock.find('.sku-header').children('a')
        const name = link.text()
        const addressPrefix = 'https://www.bestbuy.com'
        const address = addressPrefix + link.attr('href')

        const price = priceBlock.find('.priceView-hero-price.priceView-customer-price')
            .children('span').text()
        const itemStatus = priceBlock.find('.add-to-cart-button').text()

        const gpu: GpuInfo = {
            name: name,
            address: address,
            price: parseInt(price),
            inStock: itemStatus === 'Add to Cart' || itemStatus === 'Check Stores'
        }
        gpus.push(gpu)
    })
    return gpus
}

async function getBhPhotoGpu(url: string): Promise<GpuInfo[]> {
    const res = await axios.get(url)
    const data = res.data
    const $ = cheerio.load(data)
    let gpus: GpuInfo[] = new Array()
    $('.productInner_Rsut3wY9onGrX0CFpijlz').each(function (index, element) {
        const infoBlock = $(this).children('.desc_1Tzf71-71iRGoSImRMVVzQ')
        const priceBlock = $(this).children('.conversion_33niyTQpJvjf05ZdIol0Zn')

        const link = infoBlock.find('.title_ip0F69brFR7q991bIVYh1')
        const name = link.text()
        const addressPrefix = 'https://www.bhphotovideo.com'
        const address = addressPrefix + link.attr('href')

        const priceDollars = priceBlock.find('.container_14EdEmSSsYmuetz3imKuAI')
            .children('span').text().substring(1) // first char is $
        const priceCents = priceBlock.find('.sup_16V7uLfWDd9kJVKs5bfwSx').text()
        const price = Number(priceDollars + "." + priceCents)
        priceBlock.filter('.notifyBtn_3xVC8mda-LbSgYs4mjp5NS buttonTheme_1mBX7Kocn_Oq_wzW6ri7s5 tertiary_3fLAKfyXQQMUL4ZSxgfZGx')
        const itemStatusButton = priceBlock.find('.container_2SrtUKcYWGHRxMYB3ks_0q')
            .find('button')
        const inStock = (itemStatusButton.text() === 'Add to Cart')

        const gpu: GpuInfo = {
            name: name,
            address: address,
            price: price,
            inStock: inStock
        }
        gpus.push(gpu)
    })
    return gpus
}