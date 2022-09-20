import { useThree } from '@react-three/fiber'
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useEffect } from 'react'

const OrbitControls = () => {
   const { camera, gl } = useThree();
   useEffect(() => {
       const controls = new ThreeOrbitControls(camera, gl.domElement);
       controls.minDistance = 3;
       controls.maxDistance = 100;
       return () => {
         controls.dispose();
       };
    }, [camera, gl]);
   return null;
};

export default OrbitControls;
