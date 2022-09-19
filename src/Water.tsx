import { useThree } from '@react-three/fiber'
import { useEffect } from 'react';
import { TextureLoader, PlaneGeometry, RepeatWrapping, Vector3 } from 'three'
import { Water as ThreeJSWater } from "three/examples/jsm/objects/Water";

export interface WaterProps {
  waterNormalsTexture?: string;
  width?: number;
  height?: number;
}

function Water(props: WaterProps) {
  const { scene } = useThree();

  let water: ThreeJSWater;

  useEffect(() => {
    const updateInterval = setInterval(() => {
      water.material.uniforms[ 'time' ].value += 1.0 / 60.0 / 10;
    }, 1/60*1000);

    const waterGeometry = new PlaneGeometry(props.width || 100, props.height || 100, 1, 1);
    waterGeometry.computeVertexNormals();

    water = new ThreeJSWater(
      waterGeometry ,
      {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: props.waterNormalsTexture ? new TextureLoader().load(props.waterNormalsTexture, texture => {
          texture.wrapS = texture.wrapT = RepeatWrapping;
        }) : undefined,
        sunDirection: new Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined,
        alpha: 0.1,
      }
    );
    scene.add(water);
    water.rotation.x = -Math.PI * 0.5;
    water.position.setY(-1);

    return () => {
      clearInterval(updateInterval);
      scene.remove(water);
    }
  }, [props.width, props.height, props.waterNormalsTexture]);

  return null;
}

export default Water;
