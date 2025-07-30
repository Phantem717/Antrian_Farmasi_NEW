import React from "react";
import { Layout, Menu,Button  } from "antd";
import Swal from "sweetalert2";
import {
  UserOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  PoweroffOutlined,
  EditOutlined,
  AreaChartOutlined 
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { LeftCircleOutlined } from "@ant-design/icons";
const { Sider } = Layout;
import { Switch } from 'antd';

const Sidebar = ({lokasi, collapsed, setCollapsed, isLocation }) => {
  const router = useRouter();
  const pathname = usePathname(); // Ambil path URL saat ini
  const [isWhatsAppEnabled, setIsWhatsAppEnabled] = React.useState(() => {
    if (typeof window !== 'undefined') { // Check for SSR
      const savedState = localStorage.getItem('waToggleState');
      return savedState ? savedState === 'true' : true; // Default true if no saved state
    }
    return true; // Fallback for SSR
  });
 const onChange = (checked) => {
    setIsWhatsAppEnabled(checked);
    localStorage.setItem('waToggleState', checked.toString());
    // Add your WhatsApp API call here if needed
  };

  // Mapping URL ke key Menu
 
  const menuKeyMapping = {
    [`/login/${lokasi}/admin-verif-b`]: "1",
    [`/login/${lokasi}/admin-proses-b`]: "2",
    [`/login/${lokasi}/admin-obat-b`]: "3",
    "/manajemen-akun": "4",
    "/kinerja-pelayanan": "5",
    "/login/bpjs/edit-marquee-b": "6",
    [`/login/${lokasi}/logs`]: "8"
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
      onClick: () => router.push(`/login/${lokasi}/admin-verif-b`),
    },
    {
      key: "2",
      icon: <VideoCameraOutlined />,
      label: "Admin Proses Obat",
      onClick: () => router.push(`/login/${lokasi}/admin-proses-b`),
    },
    {
      key: "3",
      icon: <SettingOutlined />,
      label: "Admin Obat",
      onClick: () =>{
        console.log("URL",`${lokasi}`,`/login/${lokasi}/admin-obat-b`);
        router.push(`/login/${lokasi}/admin-obat-b`)
      } ,
    },
  
    {
      key: "8",
      icon: <AreaChartOutlined />,
      label: "View Logs",
      onClick: () => router.push(`/login/${lokasi}/logs`),
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      collapsedWidth={80}
    
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
        style={{
          height: 64, // Standard Ant Design header height
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          padding: collapsed ? 0 : "0 16px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        {!collapsed && !isLocation && (
          <LeftCircleOutlined 
            onClick={() => router.push('/login/location')}
            style={{ color: "white", fontSize: 20 }}
          />
        )}
        
        {!collapsed && (
          <span style={{ color: "white", fontWeight: "bold", fontSize:"20px"}}>Admin Panel</span>
        )}

     

        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            color: "white",
            fontSize: "16px",
            width: collapsed ? "100%" : "auto",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        />
      </div>
     
   {!isLocation && (
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
        )}
      {/* Menu Sidebar */}
     

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
         {
  key: "9",
  label: (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
      height: '100%',
      
    }}>
      <span style={{ 
        fontSize: '18px',
        color: 'rgba(255, 255, 255, 0.65)'
      }}>
        WA Ke Pasien
      </span>
      <Switch 
        checked={isWhatsAppEnabled}
        onChange={onChange}
         style={{
    backgroundColor: isWhatsAppEnabled ? "#0033ff" : "#ccc"  // Customize "on" and "off" colors
  }}
      />
    </div>
  ),
  style: { 
    height: '60px', 
    lineHeight: '60px',
    margin: 0,
    padding: 0
  }
}
          
        ]}

        
      />

      <div>
        </div>
    </Sider>
  );
};

export default Sidebar;
