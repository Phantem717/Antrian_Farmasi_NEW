import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  PoweroffOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const router = useRouter();
  const pathname = usePathname(); // Ambil path URL saat ini

  // Mapping URL ke key Menu
  const menuKeyMapping = {
    "/login/gmcb/admin-verif-g": "1",
    "/login/gmcb/admin-proses-g": "2",
    "/login/gmcb/admin-obat-g": "3",
    "/manajemen-akun": "4",
    "/kinerja-pelayanan": "5",
    "/login/gmcb/edit-marquee-g": "6",
    "/login/logs": "7"

  };

  // Tentukan menu yang aktif berdasarkan pathname
  const currentSelectedKey = menuKeyMapping[pathname] || "1"; // Default ke Admin Verifikasi jika tidak cocok

  const handleLogout = () => {
    alert("Anda telah logout!");
    router.push("/login"); // Arahkan ke halaman login
  };

  // Definisikan items menu dalam array
  const menuItems = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Admin Verifikasi",
      onClick: () => router.push("/login/gmcb/admin-verif-g"),
    },
    {
      key: "2",
      icon: <VideoCameraOutlined />,
      label: "Admin Proses Obat",
      onClick: () => router.push("/login/gmcb/admin-proses-g"),
    },
    {
      key: "3",
      icon: <SettingOutlined />,
      label: "Admin Obat",
      onClick: () => router.push("/login/gmcb/admin-obat-g"),
    },
    {
      key: "4",
      icon: <SettingOutlined />,
      label: "Manajemen Akun",
      onClick: () => router.push("/login/manajemen-akun"),
    },
    {
      key: "6",
      icon: <EditOutlined />,
      label: "Edit Marquee",
      onClick: () => router.push("/login/gmcb/edit-marquee-g"),
    },
    {
      key: "6",
      icon: <EditOutlined />,
      label: "View Logs",
      onClick: () => router.push("/login/logs"),
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={300}
      style={{
        background: "#001529",
        height: "100vh",
        position: "fixed",
        left: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Judul Sidebar */}
      <div
        className="logo"
        style={{
          color: "white",
          textAlign: "center",
          padding: "20px 10px",
          fontSize: collapsed ? "18px" : "22px",
          fontWeight: "bold",
          transition: "0.3s",
        }}
      >
        {collapsed ? "Admin" : "Admin Panel"}
      </div>

      {/* Menu Sidebar */}
      <Menu
        theme="dark"
        selectedKeys={[currentSelectedKey]}
        mode="inline"
        style={{ fontSize: "20px", fontWeight: "bold", flex: 2 }}
        items={menuItems} // Gunakan properti `items`
      />

      {/* Logout di Paling Bawah */}
      <Menu
        theme="dark"
        mode="inline"
        style={{ marginTop: "auto", background: "#001529", borderTop: "1px solid rgba(255, 255, 255, 0.2)" }}
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
