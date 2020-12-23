export interface GpuInfo {
  name: string
  address: string
  price: number
  inStock: boolean
}

export interface GpuStock {
  Nvidia3060Ti: GpuInfo[],
  Nvidia3070: GpuInfo[],
  Nvidia3080: GpuInfo[],
  Nvidia3090: GpuInfo[],
  NvidiaTitanRtx: GpuInfo[],
  AmdRx6800: GpuInfo[],
  AmdRx6800Xt: GpuInfo[],
  AmdRx6900Xt: GpuInfo[],
}

export interface AvailableGpus {
  available3060Ti: boolean
  available3070: boolean
  available3080: boolean
  available3090: boolean
  availableTitanRtx: boolean
  availableRx6800: boolean
  availableRx6800Xt: boolean
  availableRx6900Xt: boolean
}