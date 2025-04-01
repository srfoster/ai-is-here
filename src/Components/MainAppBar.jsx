import * as React from 'react';

import { AppBar, Typography } from '@mui/material';
import {Link} from 'react-router-dom';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


export function MainAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <div style={{ flexGrow: 1 }}></div>
      <MainHamburgerMenu style={{}} />
    </Box>
  );
}


export function MainHamburgerMenu({ style }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={ style }>
      <IconButton
        id="basic-button"
        edge="start"
        color="inherit"
        aria-label="open drawer"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          <MenuItem onClick={handleClose}>
            <Typography variant="p">
            Home
            </Typography>
          </MenuItem>
        </Link>
        <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
          <MenuItem onClick={handleClose}>
            <Typography variant="p">
              Apps
            </Typography>
          </MenuItem>
        </Link>
      </Menu>
    </div>
  );
}
