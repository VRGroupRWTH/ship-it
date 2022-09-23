import { useThree } from '@react-three/fiber'
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FirstPersonControls as ThreeFirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
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
}
;
const FirstPersonControls = () => {
   const { camera, gl } = useThree();
   useEffect(() => {
       const controls = new ThreeFirstPersonControls(camera, gl.domElement);
       // const s = setInterval(() => controls.update(10/1000.0), 10);
       return () => {
         controls.dispose();
         // clearInterval(s);
       };
    }, [camera, gl]);
   return null;
};

export { OrbitControls, FirstPersonControls };
