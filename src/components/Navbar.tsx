import React from "react";
import { Menu, Dropdown, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";

const Navbar: React.FC = () => {
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

    return (
        <nav className="flex justify-between items-center px-6 py-4 shadow-md">
            {/* Logo */}
            <div className="text-xl font-bold">
                <span className="text-blue-600">VISWA</span>{" "}
                <span className="text-orange-600">GROUP</span>
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-6 items-center">
                {menuItems.map((menu, index) => (
                    <Dropdown key={index} overlay={renderDropdown(menu.items)} trigger={["hover"]}>
                        <Button type="text" className="text-gray-800 hover:text-blue-600">
                            {menu.label} <DownOutlined />
                        </Button>
                    </Dropdown>
                ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
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
        </nav>
    );
};

export default Navbar;