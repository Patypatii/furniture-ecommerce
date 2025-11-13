'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface Product3DViewerProps {
  glbUrl: string;
  usdzUrl?: string;
  alt: string;
  className?: string;
}

export default function Product3DViewer({
  glbUrl,
  usdzUrl,
  alt,
  className = '',
}: Product3DViewerProps) {
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    // Load model-viewer polyfill
    if (typeof window !== 'undefined' && !customElements.get('model-viewer')) {
      import('@google/model-viewer');
    }
  }, []);

  const handleReset = () => {
    if (viewerRef.current) {
      viewerRef.current.resetTurntableRotation();
      viewerRef.current.cameraOrbit = '0deg 75deg 105%';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <model-viewer
        ref={viewerRef}
        src={glbUrl}
        ios-src={usdzUrl}
        alt={alt}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
        rotation-per-second="30deg"
        shadow-intensity="1"
        environment-image="neutral"
        exposure="1"
        style={{
          width: '100%',
          height: '100%',
          minHeight: '500px',
        }}
        className="bg-gradient-to-b from-secondary/50 to-background rounded-lg"
      >
        {/* AR Button */}
        <button
          slot="ar-button"
          className="absolute bottom-4 left-4 px-4 py-2 bg-primary-500 text-white rounded-full shadow-lg hover:bg-primary-600 transition flex items-center gap-2"
        >
          <Maximize2 className="w-4 h-4" />
          View in Your Room
        </button>

        {/* Loading */}
        <div slot="poster" className="flex items-center justify-center h-full">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full"
          />
        </div>
      </model-viewer>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleReset}
          className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg hover:bg-white dark:hover:bg-gray-800 transition"
          title="Reset View"
        >
          <RotateCw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 px-3 py-2 bg-black/70 text-white text-xs rounded-lg">
        <p>🖱️ Click & drag to rotate</p>
        <p>📱 Tap AR button for real view</p>
      </div>
    </div>
  );
}

