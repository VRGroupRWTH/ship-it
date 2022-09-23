import PopoverListButton from "./PopoverListButton";
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Check, RadioButtonChecked, RadioButtonUnchecked, Videocam } from '@mui/icons-material';
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { controlsChanged } from "../features/camera/camera-slice";
import Show from "../Show";


const CameraMenu = () => {
  const cameraControls = useAppSelector(state => state.camera.controls);
  const dispatch = useAppDispatch();

  return (
    <>
      <PopoverListButton
        icon={ Videocam }
        title="Connections"
      >
        <List>
          <ListItem>
            <ListItemText>
              Controls
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemButton
              onClick={() => dispatch(controlsChanged('orbit'))}
            >
              <Show when={cameraControls === 'orbit'} fallback={<RadioButtonUnchecked />}>
                <RadioButtonChecked />
              </Show>
              <ListItemText sx={{ marginLeft: '1em' }}>
                Orbit
              </ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              onClick={() => dispatch(controlsChanged('first-person'))}
            >
              <Show when={cameraControls === 'first-person'} fallback={<RadioButtonUnchecked />}>
                <RadioButtonChecked />
              </Show>
              <ListItemText sx={{ marginLeft: '1em' }}>
                First-Person
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </PopoverListButton>
    </>
  );
};

export default CameraMenu;
