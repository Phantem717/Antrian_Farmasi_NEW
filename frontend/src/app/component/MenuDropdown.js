import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Menu, MenuItem } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Swal from 'sweetalert2';

const MenuDropdown = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    router.push('/login/loket/admin'); // Navigate to Manajemen Akun
    handleMenuClose();
  };

  const handleKinerjaClick = () => {
    router.push('/login/loket/admin/kinerja'); // Navigate to Kinerja Pelayanan
    handleMenuClose();
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout Successful',
      text: 'You have been logged out.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
    }).then(() => {
      // Clear localStorage (optional)
      localStorage.clear();

      // Redirect to login page
      router.push('/login');
    });
  };

  return (
    <>
      <Button
        id="menu-button"
        aria-controls={open ? 'menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleMenuClick}
        startIcon={<AccountCircleIcon />}
        style={{
          position: 'absolute',
          top: '50px',
          right: '60px',
          fontSize: '1rem',
          backgroundColor: '#6A30B5',
          color: '#fff',
          borderRadius: '30px',
          padding: '10px 40px',
        }}
      >
        Menu
      </Button>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'menu-button',
        }}
      >
        <MenuItem onClick={handleProfileClick}>Manajemen Akun</MenuItem>
        <MenuItem onClick={handleKinerjaClick}>Kinerja Pelayanan</MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon style={{ marginRight: '8px' }} />
          Keluar
        </MenuItem>
      </Menu>
    </>
  );
};

export default MenuDropdown;
