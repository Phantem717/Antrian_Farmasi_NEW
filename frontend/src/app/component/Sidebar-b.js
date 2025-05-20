import React from "react";
import { Layout, Menu,Button  } from "antd";
import Swal from "sweetalert2";
import {
  UserOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  PoweroffOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const router = useRouter();
  const pathname = usePathname(); // Ambil path URL saat ini

  // Mapping URL ke key Menu
  const menuKeyMapping = {
    "/login/bpjs/admin-verif-b": "1",
    "/login/bpjs/admin-proses-b": "2",
    "/login/bpjs/admin-obat-b": "3",
    "/manajemen-akun": "4",
    "/kinerja-pelayanan": "5",
    "/login/bpjs/edit-marquee-b": "6",
    "/login/logs": "8"
  };

  // Tentukan menu yang aktif berdasarkan pathname
  const currentSelectedKey = menuKeyMapping[pathname] || "1"; // Default ke Admin Verifikasi jika tidak cocok

  const handleLogout = () => {
 Swal.fire({
          icon: "success",
          title: "Logout Berhasil",
          showConfirmButton: true,
          // timer: 3000,
          timerProgressBar: true,
        }).then((result) => {
          if(result.isConfirmed){
            localStorage.clear();
            router.push("/login");             // localStorage.setItem()
          }
        }
      )    // Arahkan ke halaman login
  };

  // Definisikan items menu dalam array
  const menuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Admin Verifikasi",
      onClick: () => router.push("/login/bpjs/admin-verif-b"),
    },
    {
      key: "2",
      icon: <VideoCameraOutlined />,
      label: "Admin Proses Obat",
      onClick: () => router.push("/login/bpjs/admin-proses-b"),
    },
    {
      key: "3",
      icon: <SettingOutlined />,
      label: "Admin Obat",
      onClick: () => router.push("/login/bpjs/admin-obat-b"),
    },
    // {
    //   key: "4",
    //   icon: <SettingOutlined />,
    //   label: "Manajemen Akun",
    //   onClick: () => router.push("/login/manajemen-akun"),
    // },
    // {
    //   key: "6",
    //   icon: <EditOutlined />,
    //   label: "Edit Marquee",
    //   onClick: () => router.push("/login/bpjs/edit-marquee-b"),
    // },
    {
      key: "8",
      icon: <SettingOutlined />,
      label: "View Logs",
      onClick: () => router.push("/login/logs"),
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      collapsedWidth={80}
      // trigger={
      //   <div style={{ 
      //     color: "white", 
      //     padding: "10px", 
      //     textAlign: "center" ,
      //     zIndex: 100,
      //     top: 0
      //   }}>
      //     {collapsed ? ">" : "<"}
      //   </div>
      // }
      width={300}
      style={{
        background: "#001529",
        height: "100vh",
        position: "fixed",
        left: 0,
        // display: "flex",
        // flexDirection: "column",
      }}
    >
      {/* Judul Sidebar */}
      <div
        className="logo"
        style={{
          color: "white",
          textAlign: "center",
          padding: collapsed ? "16px 0" : "20px 10px", // Less padding when collapsed
          fontSize: collapsed ? "16px" : "22px",
          fontWeight: "bold",
          transition: "0.3s",
          display: "flex",
          margin: 5,
          justifyContent: "center"

        }}
      >
        {collapsed ? "" : "Admin Panel"}

        <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          color: "white",
          fontSize: "16px",
          position: "absolute",
       top: collapsed ? "16px" : "21px",
        right: collapsed ? "21px" : "15px",
          zIndex: 1,
         
        }}
      />
      </div>
     
     

      {/* Menu Sidebar */}
      <Menu
        theme="dark"
        selectedKeys={[currentSelectedKey]}
        mode="inline"
        style={{ fontSize: "20px", fontWeight: "bold", flex: 1,  ...(collapsed ? {
          padding: "8px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px" // Space between collapsed menu items
        } : {}) }}
        items={menuItems} // Gunakan properti `items`
      />

      {/* Logout di Paling Bawah */}
      <Menu
        theme="dark"
        mode="inline"
        style={{ marginTop: "auto", background: "#001529", borderTop: "1px solid rgba(255, 255, 255, 0.2)",  ...(collapsed ? {
          padding: "8px 0",
          display: "flex",
          justifyContent: "center"
        } : {})
      }}
      
        items={[
          {
            key: "7",
            icon: <PoweroffOutlined />,
            label: "Logout",
            onClick: handleLogout,
            style: { fontSize: "18px", fontWeight: "bold", color: "#ff4d4f", height: "60px", lineHeight: "60px" },
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
