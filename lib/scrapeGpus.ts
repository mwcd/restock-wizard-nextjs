import axios from 'axios'
import cheerio from 'cheerio'
import { GpuInfo, GpuStock } from '../interfaces/interfaces'

let gpuStock: GpuStock = {
    nvidia3060Ti: [],
    nvidia3070: [],
    nvidia3080: [],
    nvidia3090: [],
    nvidiaTitanRtx: [],
    amdRx6800: [],
    amdRx6800Xt: [],
    amdRx6900Xt: []
}

export function getHomepageGpus(): GpuStock {
    const sortedGpus = sortGpus(gpuStock)
    const availableGpus = getGpusInStock(sortedGpus)

    const homepageGpus: GpuStock = {
        nvidia3060Ti: availableGpus.nvidia3060Ti.length > 0 ?
            [availableGpus.nvidia3060Ti[0]] :
            [sortedGpus.nvidia3060Ti[0]],
        nvidia3070: availableGpus.nvidia3070.length > 0 ?
            [availableGpus.nvidia3070[0]] :
            [sortedGpus.nvidia3070[0]],
        nvidia3080: availableGpus.nvidia3080.length > 0 ?
            [availableGpus.nvidia3080[0]] :
            [sortedGpus.nvidia3080[0]],
        nvidia3090: availableGpus.nvidia3090.length > 0 ?
            [availableGpus.nvidia3090[0]] :
            [sortedGpus.nvidia3090[0]],
        nvidiaTitanRtx: availableGpus.nvidiaTitanRtx.length > 0 ?
            [availableGpus.nvidiaTitanRtx[0]] :
            [sortedGpus.nvidiaTitanRtx[0]],
        amdRx6800: availableGpus.amdRx6800.length > 0 ?
            [availableGpus.amdRx6800[0]] :
            [sortedGpus.amdRx6800[0]],
        amdRx6800Xt: availableGpus.amdRx6800Xt.length > 0 ?
            [availableGpus.amdRx6800Xt[0]] :
            [sortedGpus.amdRx6800Xt[0]],
        amdRx6900Xt: availableGpus.amdRx6900Xt.length > 0 ?
            [availableGpus.amdRx6900Xt[0]] :
            [sortedGpus.amdRx6900Xt[0]],
    }

    return homepageGpus
}

/**
 * Filter a set of Gpus and return only those currently in stock, maintaining sort order
 * @param gpus set of Gpus to filter
 */
export function getGpusInStock(gpus: GpuStock): GpuStock {
    let gpusInStock: GpuStock = {
        nvidia3060Ti: gpus.nvidia3060Ti.filter(gpuInfo => gpuInfo.inStock),
        nvidia3070: gpus.nvidia3070.filter(gpuInfo => gpuInfo.inStock),
        nvidia3080: gpus.nvidia3080.filter(gpuInfo => gpuInfo.inStock),
        nvidia3090: gpus.nvidia3090.filter(gpuInfo => gpuInfo.inStock),
        nvidiaTitanRtx: gpus.nvidiaTitanRtx.filter(gpuInfo => gpuInfo.inStock),
        amdRx6800: gpus.amdRx6800.filter(gpuInfo => gpuInfo.inStock),
        amdRx6800Xt: gpus.amdRx6800Xt.filter(gpuInfo => gpuInfo.inStock),
        amdRx6900Xt: gpus.amdRx6900Xt.filter(gpuInfo => gpuInfo.inStock)
    }

    return gpusInStock
}

/**
 * Updates the list of gpus sold by vendors
 */
export async function updateGpus(): Promise<GpuStock> {
    let gpus = await getBestBuyGpus()
    append(gpus, await getBhPhotoGpus())
    append(gpus, await getSamsClubGpus())
    append(gpus, await getNeweggGpus())

    gpuStock = gpus
    return gpuStock
}

/**
 * Gets the list of gpus sold by vendors
 */
export function getGpus(): GpuStock {
    return gpuStock
}

/**
 * Gets the list of a specific gpu type sold by vendors
 * @param gpuType The specific type of Gpus to return
 */
export function getGpusOfType(gpuType: string): GpuInfo[] {
    return gpuStock[gpuType]
}

/**
 * Sorts a set of gpus by ascending price
 * @param gpus The set of gpus to sort. This variable is not modified by sortGpus()
 * @returns the set of gpus, sorted by ascending price
 */
export function sortGpus(gpus: GpuStock): GpuStock {

    const gpusSorted: GpuStock = {
        nvidia3060Ti: gpus.nvidia3060Ti.sort(compareGpuPrices),
        nvidia3070: gpus.nvidia3070.sort(compareGpuPrices),
        nvidia3080: gpus.nvidia3080.sort(compareGpuPrices),
        nvidia3090: gpus.nvidia3090.sort(compareGpuPrices),
        nvidiaTitanRtx: gpus.nvidiaTitanRtx.sort(compareGpuPrices),
        amdRx6800: gpus.amdRx6800.sort(compareGpuPrices),
        amdRx6800Xt: gpus.amdRx6800Xt.sort(compareGpuPrices),
        amdRx6900Xt: gpus.amdRx6900Xt.sort(compareGpuPrices)
    }

    return gpusSorted
}

/**
 * Compares the prices of 2 gpus, as needed by functions like sort(). Any GpuInfo with a 
 * negative price will be put as the greater of the two values, as this typically indicates
 * that no pricing information was available
 * @param a GpuInfo to be compared
 * @param b GpuInfo to be compared
 */
function compareGpuPrices(a: GpuInfo, b: GpuInfo): number {
    const priceA = Number(a.price.substring(1))
    const priceB = Number(b.price.substring(1))
    if (priceA < 0) {
        return 1
    } else if (priceB < 0) {
        return -1
    } else {
        return priceA - priceB
    }
}

/**
 * Appends one set of GpuStocks to another
 * @param gpus The set of GpuStocks to append to. This variable is modified to include the values stores in addtlGpus
 * @param addtlGpus The set of GpuStocks being appended
 * @returns The union of gpus and addtleGpus, as stored in gpus
 */
function append(gpus: GpuStock, addtlGpus: GpuStock): GpuStock {
    gpus.nvidia3060Ti.push(...addtlGpus.nvidia3060Ti)
    gpus.nvidia3070.push(...addtlGpus.nvidia3070)
    gpus.nvidia3080.push(...addtlGpus.nvidia3080)
    gpus.nvidia3090.push(...addtlGpus.nvidia3090)
    gpus.nvidiaTitanRtx.push(...addtlGpus.nvidiaTitanRtx)
    gpus.amdRx6800.push(...addtlGpus.amdRx6800)
    gpus.amdRx6800Xt.push(...addtlGpus.amdRx6800Xt)
    gpus.amdRx6900Xt.push(...addtlGpus.amdRx6900Xt)

    return gpus
}



async function getBestBuyGpus(): Promise<GpuStock> {
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
        nvidia3060Ti: nvidia3060Tis,
        nvidia3070: nvidia3070s,
        nvidia3080: nvidia3080s,
        nvidia3090: nvidia3090s,
        nvidiaTitanRtx: NvidiaTitanRtxs,
        amdRx6800: amdRx6800s,
        amdRx6800Xt: amdRx6800Xts,
        amdRx6900Xt: amdRx6900Xts
    }

    return gpuStock
}

async function getBhPhotoGpus(): Promise<GpuStock> {
    const bhPhoto3060Ti = 'https://www.bhphotovideo.com/c/products/Graphic-Cards/ci/6567/N/3668461602?filters=fct_nvidia-geforce-series_5011%3Ageforce-rtx-3060-ti'
    const bhPhoto3070 = 'https://www.bhphotovideo.com/c/products/Graphic-Cards/ci/6567/N/3668461602?filters=fct_nvidia-geforce-series_5011%3Ageforce-rtx-3070'
    const bhPhoto3080 = 'https://www.bhphotovideo.com/c/products/Graphic-Cards/ci/6567/N/3668461602?filters=fct_nvidia-geforce-series_5011%3Ageforce-rtx-3080'
    const bhPhoto3090 = 'https://www.bhphotovideo.com/c/products/Graphic-Cards/ci/6567/N/3668461602?filters=fct_nvidia-geforce-series_5011%3Ageforce-rtx-3090'
    // This is a search as there's no category
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
        nvidia3060Ti: nvidia3060Tis,
        nvidia3070: nvidia3070s,
        nvidia3080: nvidia3080s,
        nvidia3090: nvidia3090s,
        nvidiaTitanRtx: NvidiaTitanRtxs,
        amdRx6800: amdRx6800s,
        amdRx6800Xt: amdRx6800Xts,
        amdRx6900Xt: []
    }

    return gpuStock
}

async function getSamsClubGpus(): Promise<GpuStock> {

    const samsClubGpus = 'https://www.samsclub.com/b/hard-drives-storage/6890123?clubId=6352&offset=0&rootDimension=pcs_availability%253AOnlinepipsymbProduct%2520Type%253AGraphic%2520Cards&searchCategoryId=6890123&selectedFilter=all&sortKey=relevance&sortOrder=1'

    const nvidia3070s = await getSamsClubGpu(samsClubGpus, "3070")
    const nvidia3080s = await getSamsClubGpu(samsClubGpus, "3080")
    const nvidia3090s = await getSamsClubGpu(samsClubGpus, "3090")

    const gpuStock: GpuStock = {
        nvidia3060Ti: [],
        nvidia3070: nvidia3070s,
        nvidia3080: nvidia3080s,
        nvidia3090: nvidia3090s,
        nvidiaTitanRtx: [],
        amdRx6800: [],
        amdRx6800Xt: [],
        amdRx6900Xt: []
    }

    return gpuStock
}

async function getNeweggGpus(): Promise<GpuStock> {
    const newegg3060Ti = 'https://www.newegg.com/p/pl?N=100007709%20601359415&PageSize=96'
    const newegg3070 = 'https://www.newegg.com/p/pl?N=100007709%20601357250&PageSize=96'
    const newegg3080 = 'https://www.newegg.com/p/pl?N=100007709%20601357247&PageSize=96'
    const newegg3090 = 'https://www.newegg.com/p/pl?N=100007709%20601357248&PageSize=96'
    const neweggTitanRtx = 'https://www.newegg.com/p/pl?d=titan+rtx&N=100006662%2050001441%201065715366&PageSize=96'
    const neweggRx6800 = 'https://www.newegg.com/p/pl?N=100007709%20601359427&PageSize=96'
    const neweggRx6800Xt = 'https://www.newegg.com/p/pl?N=100007709%20601359422&PageSize=96'
    const neweggRx6900Xt = 'https://www.newegg.com/p/pl?N=100007709%20601359957&PageSize=96'

    const nvidia3060Tis = await getNeweggGpu(newegg3060Ti)
    const nvidia3070s = await getNeweggGpu(newegg3070)
    const nvidia3080s = await getNeweggGpu(newegg3080)
    const nvidia3090s = await getNeweggGpu(newegg3090)
    const NvidiaTitanRtxs = await getNeweggGpu(neweggTitanRtx)
    const amdRx6800s = await getNeweggGpu(neweggRx6800)
    const amdRx6800Xts = await getNeweggGpu(neweggRx6800Xt)

    const gpuStock: GpuStock = {
        nvidia3060Ti: nvidia3060Tis,
        nvidia3070: nvidia3070s,
        nvidia3080: nvidia3080s,
        nvidia3090: nvidia3090s,
        nvidiaTitanRtx: NvidiaTitanRtxs,
        amdRx6800: amdRx6800s,
        amdRx6800Xt: amdRx6800Xts,
        amdRx6900Xt: []
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

        const itemStatus = priceBlock.find('.add-to-cart-button').text()
        const priceScript = priceBlock.find('.sku-list-item-price .None script').last().toString()
        const priceStringIndex = priceScript.search('currentPrice')
        let priceString = priceScript.substring(priceStringIndex)
        priceString = priceString.substring(15, priceString.indexOf(','))

        const gpu: GpuInfo = {
            name: name,
            address: address,
            price: createPrice(priceString),
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
            .children('span').text() // first char is $
        const priceCents = priceBlock.find('.sup_16V7uLfWDd9kJVKs5bfwSx').text()
        priceBlock.filter('.notifyBtn_3xVC8mda-LbSgYs4mjp5NS buttonTheme_1mBX7Kocn_Oq_wzW6ri7s5 tertiary_3fLAKfyXQQMUL4ZSxgfZGx')
        const itemStatusButton = priceBlock.find('.container_2SrtUKcYWGHRxMYB3ks_0q')
            .find('button')
        const inStock = (itemStatusButton.text() === 'Add to Cart')

        const gpu: GpuInfo = {
            name: name,
            address: address,
            price: createPrice(priceDollars, priceCents),
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
        const itemStatusButton = priceBlock.find('.sc-btn.sc-btn-primary.sc-btn-block.sc-pc-action-button.sc-pc-add-to-cart')
        const itemStatus = itemStatusButton.attr('disabled')
        // instock if disabled attr doesn't exist (either undefined or false)
        const inStock = (typeof itemStatus === typeof undefined || itemStatus === 'false')

        const gpu: GpuInfo = {
            name: name,
            address: address,
            price: createPrice(priceDollars, priceCents),
            inStock: inStock
        }

        gpus.push(gpu)
    })
    return gpus
}

async function getNeweggGpu(url: string): Promise<GpuInfo[]> {
    const res = await axios.get(url)
    const data = res.data
    const $ = cheerio.load(data)
    let gpus: GpuInfo[] = new Array()
    $('.item-container').each(function (index, element) {
        const infoBlock = $(this).children('.item-info')
        const priceBlock = $(this).children('.item-action')

        const name = infoBlock.children('a').text()
        const address = infoBlock.children('a').attr('href')
        const inStockText = priceBlock.find('.btn.btn-primary.btn-mini').text()
        const inStock = (inStockText === 'Add to cart ')
        let priceDollars: string
        let priceCents: string
        if (inStock) {
            // TODO: All pricing stuff should be internationalized
            priceDollars = priceBlock.find('.price-current').children('strong').text()
            priceCents = priceBlock.find('.price-current').children('sup').text()
        } else {
            priceDollars = '-1'
            priceCents = '0'
        }
        const gpu: GpuInfo = {
            name: name,
            address: address,
            price: createPrice(priceDollars, priceCents),
            inStock: inStock
        }

        gpus.push(gpu)
    })

    return gpus
}

/**
 * Convert a set of dollars and cents into a single price string
 * @param dollars Number of dollars in price. Can optionally include cents
 * @param cents Number of cents in price. Must be < 100
 */
function createPrice(dollars: number | string, cents?: number | string): string {
    // TODO: Eventually this should be replaced with some actually decent localization
    // For now, remove commas and dollar signs
    const dollarsStringSanitized = dollars.toString().replace('$', '').replace(',', '')
    const dollarsNum = Number(dollarsStringSanitized)
    cents = cents || 0
    const priceNum = dollarsNum + (Number(cents) / 100)

    const price = '$' + Number(priceNum).toFixed(2)
    return price
}