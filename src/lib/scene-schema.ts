export type Vec3 = { x: number; y: number; z: number };

export type Camera = {
  type: 'orbit' | 'follow' | 'static';
  position: Vec3;
  fov: number;
  controls?: { enableZoom?: boolean; minDistance?: number; maxDistance?: number; enablePan?: boolean };
};

export type SceneObjectType = 'mesh' | 'text' | 'model' | 'light' | 'particle' | 'group';

export type SceneObject = {
  id: string;
  type: SceneObjectType;
  transform?: { position?: Vec3; rotation?: Vec3; scale?: Vec3 };
  material?: { preset?: string; color?: string; roughness?: number; metalness?: number };
  animation?: { preset?: string; params?: Record<string, any> };
  interaction?: { onClick?: { action: string; payload?: Record<string, any> } };
  responsive?: { mobileScale?: number };
  children?: SceneObject[];
};

export type Scene = {
  metadata: { version: string; author: string };
  camera: Camera;
  objects: SceneObject[];
};

export const exampleFloatingText: Scene = {
  metadata: { version: '1.0.0', author: 'example' },
  camera: { type: 'orbit', position: { x: 0, y: 1.4, z: 6 }, fov: 50, controls: { enableZoom: true } },
  objects: [
    {
      id: 'obj_heroText_01',
      type: 'text',
      transform: { position: { x: 0, y: 1.2, z: 0 }, scale: { x: 1.5, y: 1.5, z: 1 } },
      material: { preset: 'neonGlow', color: '#9f5cff' },
      animation: { preset: 'float', params: { amplitude: 0.12 } },
    },
  ],
};

export const exampleRotatingCube: Scene = {
  metadata: { version: '1.0.0', author: 'example' },
  camera: { type: 'orbit', position: { x: 0, y: 1.4, z: 6 }, fov: 50 },
  objects: [
    {
      id: 'obj_cube_01',
      type: 'mesh',
      transform: { position: { x: 0, y: 0, z: 0 } },
      material: { preset: 'matte', color: '#ff4db8' },
      animation: { preset: 'rotate', params: { axis: 'y', speed: 0.5 } },
    },
  ],
};

export const exampleProductModel: Scene = {
  metadata: { version: '1.0.0', author: 'example' },
  camera: { type: 'orbit', position: { x: 0, y: 1.2, z: 7 }, fov: 48, controls: { enableZoom: true } },
  objects: [
    {
      id: 'obj_product_01',
      type: 'model',
      transform: { position: { x: 0, y: 0.4, z: 0 } },
      material: { preset: 'gloss', color: '#ffffff' },
      interaction: { onClick: { action: 'openModal', payload: { modalId: 'specs' } } },
    },
  ],
};