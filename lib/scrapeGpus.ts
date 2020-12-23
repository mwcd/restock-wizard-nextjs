import axios from 'axios'
import cheerio from 'cheerio'
import { GpuInfo, GpuStock } from '../interfaces/interfaces'

/**
 * Returns a list of all GPUs currently in stock
 */
export async function getGpusInStock(): Promise<GpuStock> {
    let gpus = await getBestBuyGpus()
    append(gpus, await getBhPhotoGpus())
    append(gpus, await getSamsClubGpus())

    let gpusInStock: GpuStock = {
        Nvidia3060Ti: gpus.Nvidia3060Ti.filter(gpuInfo => gpuInfo.inStock),
        Nvidia3070: gpus.Nvidia3070.filter(gpuInfo => gpuInfo.inStock),
        Nvidia3080: gpus.Nvidia3080.filter(gpuInfo => gpuInfo.inStock),
        Nvidia3090: gpus.Nvidia3090.filter(gpuInfo => gpuInfo.inStock),
        NvidiaTitanRtx: gpus.NvidiaTitanRtx.filter(gpuInfo => gpuInfo.inStock),
        AmdRx6800: gpus.AmdRx6800.filter(gpuInfo => gpuInfo.inStock),
        AmdRx6800Xt: gpus.AmdRx6800Xt.filter(gpuInfo => gpuInfo.inStock),
        AmdRx6900Xt: gpus.AmdRx6900Xt.filter(gpuInfo => gpuInfo.inStock)
    }

    return gpusInStock
}

/**
 * Appends one set of GpuStocks to another
 * @param gpus The set of GpuStocks to append to. This variable is modified to include the values stores in addtlGpus
 * @param addtlGpus The set of GpuStocks being appended
 * @returns The union of gpus and addtleGpus, as stored in gpus
 */
export function append(gpus: GpuStock, addtlGpus: GpuStock): GpuStock {
    gpus.Nvidia3060Ti.push(...addtlGpus.Nvidia3060Ti)
    gpus.Nvidia3070.push(...addtlGpus.Nvidia3070)
    gpus.Nvidia3080.push(...addtlGpus.Nvidia3080)
    gpus.Nvidia3090.push(...addtlGpus.Nvidia3090)
    gpus.AmdRx6800.push(...addtlGpus.AmdRx6800)
    gpus.AmdRx6800Xt.push(...addtlGpus.AmdRx6800Xt)
    gpus.AmdRx6900Xt.push(...addtlGpus.AmdRx6900Xt)
    
    return gpus
}

export async function getBestBuyGpus(): Promise<GpuStock> {
    const bestBuy3060Ti = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~NVIDIA%20GeForce%20RTX%203060%20Ti'
    const bestBuy3070 = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~NVIDIA%20GeForce%20RTX%203070'
    const bestBuy3080 = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~NVIDIA%20GeForce%20RTX%203080'
    const bestBuy3090 = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~NVIDIA%20GeForce%20RTX%203090'
    const bestBuyTitanRtx = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~NVIDIA%20Titan%20RTX'
    const bestBuyRx6800 = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~AMD%20Radeon%20RX%206800'
    const bestBuyRx6800Xt = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~AMD%20Radeon%20RX%206800%20XT'
    const bestBuyRx6900Xt = 'https://www.bestbuy.com/site/computer-cards-components/video-graphics-cards/abcat0507002.c?id=abcat0507002&qp=gpusv_facet%3DGraphics%20Processing%20Unit%20(GPU)~AMD%20Radeon%20RX%206900%20XT'

    const nvidia3060Tis = await getBestBuyGpu(bestBuy3060Ti)
    const nvidia3070s = await getBestBuyGpu(bestBuy3070)
    const nvidia3080s = await getBestBuyGpu(bestBuy3080)
    const nvidia3090s = await getBestBuyGpu(bestBuy3090)
    const NvidiaTitanRtxs = await getBestBuyGpu(bestBuyTitanRtx)
    const amdRx6800s = await getBestBuyGpu(bestBuyRx6800)
    const amdRx6800Xts = await getBestBuyGpu(bestBuyRx6800Xt)
    const amdRx6900Xts = await getBestBuyGpu(bestBuyRx6900Xt)

    const gpuStock: GpuStock = {
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

export async function getBhPhotoGpus(): Promise<GpuStock> {
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

    const nvidia3060Tis = await getBhPhotoGpu(bhPhoto3060Ti)
    const nvidia3070s = await getBhPhotoGpu(bhPhoto3070)
    const nvidia3080s = await getBhPhotoGpu(bhPhoto3080)
    const nvidia3090s = await getBhPhotoGpu(bhPhoto3090)
    const NvidiaTitanRtxs = await getBhPhotoGpu(bhPhotoTitanRtx)
    const amdRx6800s = await getBhPhotoGpu(bhPhotoRx6800)
    const amdRx6800Xts = await getBhPhotoGpu(bhPhotoRx6800Xt)

    const gpuStock: GpuStock = {
        Nvidia3060Ti: nvidia3060Tis,
        Nvidia3070: nvidia3070s,
        Nvidia3080: nvidia3080s,
        Nvidia3090: nvidia3090s,
        NvidiaTitanRtx: NvidiaTitanRtxs,
        AmdRx6800: amdRx6800s,
        AmdRx6800Xt: amdRx6800Xts,
        AmdRx6900Xt: []
    }

    return gpuStock
}

export async function getSamsClubGpus(): Promise<GpuStock> {

    const samsClubGpus = 'https://www.samsclub.com/b/hard-drives-storage/6890123?clubId=6352&offset=0&rootDimension=pcs_availability%253AOnlinepipsymbProduct%2520Type%253AGraphic%2520Cards&searchCategoryId=6890123&selectedFilter=all&sortKey=relevance&sortOrder=1'
    
    const nvidia3070s = await getSamsClubGpu(samsClubGpus, "3070")
    const nvidia3080s = await getSamsClubGpu(samsClubGpus, "3080")
    const nvidia3090s = await getSamsClubGpu(samsClubGpus, "3090")

    const gpuStock: GpuStock = {
        Nvidia3060Ti: [],
        Nvidia3070: nvidia3070s,
        Nvidia3080: nvidia3080s,
        Nvidia3090: nvidia3090s,
        NvidiaTitanRtx: [],
        AmdRx6800: [],
        AmdRx6800Xt: [],
        AmdRx6900Xt: []
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
        const price = Number(priceDollars + '.' + priceCents)
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

async function getSamsClubGpu(url: string, keyword: string): Promise<GpuInfo[]> {
    const res = await axios.get(url)
    const data = res.data
    const $ = cheerio.load(data)
    let gpus: GpuInfo[] = new Array()
    $('.sc-pc-medium-desktop-card.sc-plp-cards-card').each(function (index, element) {
        const infoBlock = $(this).children('a')
        const priceBlock = $(this).children('.sc-pc-medium-desktop-moneybox')

        const name = infoBlock.children('.sc-pc-title-medium').children('h3').text()
        // return early if Gpu is wrong type
        if (!name.includes(keyword)) {
            return
        }
        const addressPrefix = 'https://www.samsclub.com'
        const address = addressPrefix + infoBlock.attr('href')

        const priceDollars = priceBlock.find('.Price-characteristic').text()
        const priceCents = priceBlock.find('.Price-mantissa').text()
        const price = Number(priceDollars + '.' + priceCents)
        const itemStatusButton = priceBlock.find('.sc-btn.sc-btn-primary.sc-btn-block.sc-pc-action-button.sc-pc-add-to-cart')
        const itemStatus = itemStatusButton.attr('disabled')
        // instock if disabled attr doesn't exist (either undefined or false)
        const inStock = (typeof itemStatus === typeof undefined || itemStatus === 'false')

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