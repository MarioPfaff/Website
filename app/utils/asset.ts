export function createAssetUrl(assetPath: string) {
  return `${useRuntimeConfig().app.baseURL}${assetPath.replace(/^\//, '')}`
}
