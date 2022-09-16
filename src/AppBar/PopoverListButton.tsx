import IconButton from '@mui/material/IconButton';
import { Fragment, PropsWithChildren, useState } from 'react';
import List from '@mui/material/List';
import Popover from '@mui/material/Popover';

export interface PopoverListButtonProps extends PropsWithChildren {
  title: string;
  // renderIcon?: () => JSXEL;
  icon: any;
}

const PopoverListButton = (props: PopoverListButtonProps) => {
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(buttonElement);
  const id = open ? `${props.title}-popover` : undefined;

  return (
    <Fragment>
      <IconButton
        color="inherit"
        onClick={event => setButtonElement(event.currentTarget)}
        title={props.title}
      >
        {
          <props.icon />
        }
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={buttonElement}
        onClose={() => setButtonElement(null) }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <List>
        {
          props.children
        }
        </List>
      </Popover>
    </Fragment>
  );
}

export default PopoverListButton;
