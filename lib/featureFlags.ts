export function isQrCheckinEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_QR_CHECKIN === 'true'
}
