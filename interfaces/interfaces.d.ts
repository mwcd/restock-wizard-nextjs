export interface GpuInfo {
  name: string
  address: string
  price: string
  inStock: boolean
}

export interface GpuStock {
  nvidia3060Ti: GpuInfo[],
  nvidia3070: GpuInfo[],
  nvidia3080: GpuInfo[],
  nvidia3090: GpuInfo[],
  nvidiaTitanRtx: GpuInfo[],
  amdRx6800: GpuInfo[],
  amdRx6800Xt: GpuInfo[],
  amdRx6900Xt: GpuInfo[],
}