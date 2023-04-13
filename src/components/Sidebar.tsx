import React, { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import useAuth from "@/hooks/useAuth";

import { TABLE_BREAK_POINT } from "../constants";
import { useWindowSize } from "../hooks/useWindowSize";
import {
  RobotLogo,
  HomeIcon,
  SideBarToggleIcon,
  ReportIcon,
  AnalyticsIcon,
  LogOutIcon,
} from "./icons";

const menuItems = [
  { id: 1, label: "Home", icon: HomeIcon, link: "/" },
  { id: 2, label: "View Trades", icon: ReportIcon, link: "/trades" },
  {
    id: 3,
    label: "Analytics",
    icon: AnalyticsIcon,
    link: "/analytics",
  },
];
const Sidebar = () => {
  const [toggleCollapse, setToggleCollapse] = useState(true);
  const [isCollapsible, setIsCollapsible] = useState(false);
  const router = useRouter();
  const windowSize = useWindowSize();
  const { signOut } = useAuth();

  useEffect(() => {
    if (windowSize.width <= TABLE_BREAK_POINT) {
      setToggleCollapse(true);
    }
  }, [toggleCollapse, windowSize.width]);

  const onMouseOver = (showIcon: boolean) => {
    setIsCollapsible(showIcon);
  };

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };

  const activeMenu = useMemo(() => {
    return menuItems.find((menu) => menu.link === router.pathname) ?? { id: 0 };
  }, [router.pathname]);

  return (
    <div
      className={`h-screen px-4  pt-12 pb-4 flex justify-between flex-col  bg-neutral-focus ${
        toggleCollapse ? "w-24" : "w-72"
      } `}
      onMouseEnter={() => onMouseOver(true)}
      onMouseLeave={() => onMouseOver(false)}
      style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between relative">
          <div className="flex items-center pl-1 gap-4">
            <div
              className={`${
                isCollapsible && toggleCollapse ? "opacity-0" : "opacity-100"
              }`}
            >
              <RobotLogo />
            </div>

            <span
              className="mt-2 text-lg font-bold text-white"
              hidden={toggleCollapse}
            >
              Options Co-Pilot
            </span>
          </div>
          {isCollapsible && (
            <button
              className={`p-4   rounded bg-light-lighter absolute right-0 hover:bg-gray-700 ${
                toggleCollapse ? "rotate-180 mt-4 mr-3" : "mt-3"
              }`}
              onClick={handleSidebarToggle}
            >
              <SideBarToggleIcon />
            </button>
          )}
        </div>
        <div className="flex flex-col items-start mt-24 space-y-5  ">
          {menuItems.map(({ icon: Icon, ...menu }) => {
            return (
              <div
                key={menu.id}
                className="flex items-center cursor-pointer rounded w-full overflow-hidden whitespace-nowrap"
              >
                <Link href={menu.link}>
                  <a className="flex py-4 px-3 space-x-3 items-center w-full h-full hover:bg-gray-700 ">
                    <div style={{ width: "2.5rem" }}>
                      <Icon
                        fill={`${
                          activeMenu.id === menu.id ? "#77acf1" : " #FFF"
                        }`}
                      />
                    </div>
                    {!toggleCollapse && (
                      <span
                        className={`text-md  font-bold ${
                          activeMenu.id === menu.id
                            ? "text-blue-300"
                            : " text-white"
                        } `}
                      >
                        {menu.label}
                      </span>
                    )}
                  </a>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {!toggleCollapse ? (
        <button className="btn btn-outline btn-info" onClick={() => signOut()}>
          LogOut
        </button>
      ) : (
        <button className="w-10 h-10" onClick={() => signOut()}>
          <LogOutIcon />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
