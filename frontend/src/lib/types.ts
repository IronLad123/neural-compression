export type ApiResult = {
  id: string
  filename?: string
  original_size: number
  compressed_size: number
  ratio: number
  level: number
  created_at: string
  width: number
  height: number
  bpp: number
  psnr: number | null
  ssim: number | null
  original_available?: boolean
}

export type HistoryResponse = ApiResult[] | Record<string, ApiResult>
