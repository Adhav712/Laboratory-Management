import React, { useState } from "react";
import { Menu, Dropdown, Button, Drawer } from "antd";
import { DownOutlined, MenuOutlined } from "@ant-design/icons";

const Navbar: React.FC = () => {
    const [drawerVisible, setDrawerVisible] = useState(false);

    const menuItems = [
        {
            label: "About Viswa",
            items: ["Company", "Team", "Careers"],
        },
        {
            label: "Industries & Services",
            items: ["Shipping", "Energy", "Testing"],
        },
        {
            label: "Viswa Academy",
            items: ["Courses", "Events", "Resources"],
        },
        {
            label: "My Viswa",
            items: ["Dashboard", "Settings", "Logout"],
        },
    ];

    const renderDropdown = (items: string[]) => (
        <Menu>
            {items.map((item, index) => (
                <Menu.Item key={index}>{item}</Menu.Item>
            ))}
        </Menu>
    );

    const renderDrawerMenu = () => (
        <div className="flex flex-col space-y-6">
            {menuItems.map((menu, index) => (
                <div key={index}>
                    <p className="font-semibold text-lg">{menu.label}</p>
                    {menu.items.map((item, subIndex) => (
                        <p key={subIndex} className="pl-4 text-gray-700">{item}</p>
                    ))}
                </div>
            ))}
            <div className="flex flex-col space-y-4 mt-6">
                <Button type="primary" className="bg-green-500 text-white border-none rounded-md">
                    ESG
                </Button>
                <Button type="default" className="bg-blue-900 text-white rounded-md">
                    COMPLIANCE
                </Button>
                <Button type="default" className="bg-orange-500 text-white rounded-md">
                    CONTACT US
                </Button>
            </div>
        </div>
    );

    return (
        <nav className="flex justify-between items-center px-6 py-4 shadow-md">
            <div className="text-xl font-bold">
                <span className="text-blue-600">VISWA</span>{" "}
                <span className="text-orange-600">GROUP</span>
            </div>
            <div className="hidden md:flex space-x-6 items-center">
                {menuItems.map((menu, index) => (
                    <Dropdown key={index} overlay={renderDropdown(menu.items)} trigger={["hover"]}>
                        <Button type="text" className="text-gray-800 hover:text-blue-600">
                            {menu.label} <DownOutlined />
                        </Button>
                    </Dropdown>
                ))}
            </div>
            <div className="hidden md:flex space-x-4">
                <Button type="primary" className="bg-green-500 text-white border-none">
                    ESG
                </Button>
                <Button type="default" className="bg-blue-900 text-white">
                    COMPLIANCE
                </Button>
                <Button type="default" className="bg-orange-500 text-white">
                    CONTACT US
                </Button>
            </div>
            <div className="md:hidden">
                <Button type="text" icon={<MenuOutlined />} onClick={() => setDrawerVisible(true)} />
            </div>
            <Drawer
                title="Menu"
                placement="right"
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                className="md:hidden"
            >
                {renderDrawerMenu()}
            </Drawer>
        </nav>
    );
};

export default Navbar;