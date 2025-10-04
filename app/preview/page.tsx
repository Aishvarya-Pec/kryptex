import ScenePlayer from '@/src/components/ScenePlayer';

const scene = {
  camera: { type: 'orbit', position: { x: 0, y: 1.2, z: 6 }, fov: 50 },
  objects: [
    {
      id: 'obj_heroText_01',
      type: 'text',
      transform: { position: { x: 0, y: 1.2, z: 0 }, scale: { x: 1.3, y: 1.3, z: 1 } },
      material: { color: '#ffffff' },
      props: { text: 'KRPtex Preview' },
    },
    { id: 'obj_cube_01', type: 'mesh', transform: { position: { x: -1.5, y: -0.2, z: 0 } }, material: { color: '#9f5cff' } },
    { id: 'obj_cube_02', type: 'mesh', transform: { position: { x: 1.5, y: -0.2, z: 0 } }, material: { color: '#ff4db8' } },
  ],
};

export default function PreviewPage() {
  return (
    <main className="p-4">
      <div className="h-[75vh] rounded overflow-hidden border border-white/10">
        <ScenePlayer scene={scene} />
      </div>
    </main>
  );
}