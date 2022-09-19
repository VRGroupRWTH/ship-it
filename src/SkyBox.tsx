import { useThree } from '@react-three/fiber'
import { CubeTextureLoader } from 'three'

export interface SkyBoxProps {
  baseURL: string;
}

function SkyBox(props: SkyBoxProps) {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();
  // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
  const texture = loader.load([
    `${props.baseURL}/east.jpeg`,
    `${props.baseURL}/west.jpeg`,
    `${props.baseURL}/up.jpeg`,
    `${props.baseURL}/down.jpeg`,
    `${props.baseURL}/north.jpeg`,
    `${props.baseURL}/south.jpeg`,
  ]);

  console.log(`${props.baseURL}/east.jpeg`);

  // Set the scene background property to the resulting texture.
  scene.background = texture;
  return null;
}

export default SkyBox;
