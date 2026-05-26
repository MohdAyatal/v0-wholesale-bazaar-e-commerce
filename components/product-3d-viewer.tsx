'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box } from '@react-three/drei'
import { Suspense } from 'react'

interface Product3DViewerProps {
  modelUrl: string
}

function Model() {
  return (
    <group>
      <Box args={[1, 1, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" />
      </Box>
    </group>
  )
}

export default function Product3DViewer({ modelUrl }: Product3DViewerProps) {
  return (
    <Canvas camera={{ position: [0, 0, 2.5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls 
        autoRotate 
        autoRotateSpeed={2}
        enableZoom={true}
        enablePan={true}
      />
    </Canvas>
  )
}
