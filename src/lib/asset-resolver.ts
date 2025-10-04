const assetMap = new Map<string, string>();

// Placeholder: In a real app, you would populate this map from an asset database
// For now, we'll just use a generic placeholder for any GLB model.
assetMap.set('placeholder_glb', 'https://modelviewer.dev/shared-assets/models/Astronaut.glb');

export function resolveAsset(assetUrl: string): string {
  if (assetUrl.startsWith('asset://')) {
    // Simple logic for now: if it's a glb, return the placeholder
    if (assetUrl.endsWith('.glb') || assetUrl.includes('model')) {
      return assetMap.get('placeholder_glb')!;
    }
    // In the future, you would look up the asset ID in the map
    return assetUrl; // Fallback
  }
  return assetUrl;
}