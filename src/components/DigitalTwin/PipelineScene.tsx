import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import Pipeline from './Pipeline';

/**
 * Main 3D scene containing the pipeline digital twin
 * Features orbital camera controls and industrial grid background
 */
export default function PipelineScene() {
    return (
        <div className="w-full h-full bg-industrial-900">
            <Canvas>
                {/* Camera setup */}
                <PerspectiveCamera makeDefault position={[15, 8, 15]} fov={50} />

                {/* Orbital controls with damping for smooth movement */}
                <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    minDistance={5}
                    maxDistance={50}
                    maxPolarAngle={Math.PI / 2}
                />

                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
                <directionalLight position={[-10, 5, -5]} intensity={0.3} />

                {/* Grid floor for spatial reference */}
                <Grid
                    args={[50, 50]}
                    position={[0, -2, 0]}
                    cellColor="#334155"
                    sectionColor="#475569"
                    fadeDistance={30}
                    fadeStrength={1}
                />

                {/* Pipeline */}
                <Pipeline />

                {/* Fog for depth perception */}
                <fog attach="fog" args={['#0f172a', 20, 50]} />
            </Canvas>
        </div>
    );
}
