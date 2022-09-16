import { AppBar as MUIAppBar, IconButton, Switch } from '@mui/material';
import { DarkMode, LightMode, SmartToy as RobotIcon } from '@mui/icons-material';
import Grid2 from '@mui/material/Unstable_Grid2';
import ConnectionsMenu from './ConnectonsMenu';

export interface AppBarProps {
  darkMode: boolean,
  setDarkMode: (darkMode: boolean) => void;
}

function AppBar(props: AppBarProps) {
  return (
    <MUIAppBar position="sticky">
      <Grid2 container>
        <Grid2>
          <ConnectionsMenu />
          <IconButton aria-label="manage robots">
            <RobotIcon />
          </IconButton>
        </Grid2>
        <Grid2 xs>
        </Grid2>
        <Grid2>
          <Grid2 container alignItems="center">
            <Grid2>
              <LightMode />
            </Grid2>
            <Grid2>
              <Switch
                checked={props.darkMode}
                onChange={() => props.setDarkMode(!props.darkMode)}
              />
            </Grid2>
            <Grid2>
              <DarkMode />
            </Grid2>
          </Grid2>
        </Grid2>
      </Grid2>
    </MUIAppBar>
  );
}

export default AppBar;
