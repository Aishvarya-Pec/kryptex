export function resolveAsset(assetUrl: string, assetMap: Map<string, string>): string {
  if (assetUrl.startsWith('asset://')) {
    const assetId = assetUrl.replace('asset://', '');
    // Check if the uploaded assets map has this ID
    if (assetMap.has(assetId)) {
      return assetMap.get(assetId)!;
    }
    // Fallback for demonstration if no specific asset is uploaded
    if (assetUrl.endsWith('.glb') || assetUrl.includes('model')) {
      return 'https://modelviewer.dev/shared-assets/models/Astronaut.glb';
    }
    // Return a special identifier for missing assets
    return 'MISSING_ASSET';
  }
  return assetUrl;
}