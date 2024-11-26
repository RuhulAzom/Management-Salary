import { useLocation } from "react-router-dom";
import { useState } from "react";
import type { ReactNode } from "react";
import Header from "./header";
import Sidebar from "./sidebar";

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  return (
    <>
      {pathname.includes("login") || pathname.includes("register") ? (
        <>{children}</>
      ) : (
        <div className="md:ml-[300px] mt-[80px]">
          <div
            id="header"
            className="fixed z-[99] h-[80px] top-0 left-0 w-full border-b border-main-gray-border bg-white md:pl-[300px]"
          >
            <Header setShowSidebar={setShowSidebar} />
          </div>
          <div
            id="sidebar"
            className={`fixed top-0 md:left-0 h-full ${
              !showSidebar ? "left-[-350px]" : "left-0"
            } w-[300px] bg-white p-[1rem] md:p-[2rem] border-r border-main-gray-border z-[100] overflow-hidden duration-300`}
          >
            <Sidebar setShowSidebar={setShowSidebar} />
          </div>
          {showSidebar && (
            <div
              className="fixed z-[99] bg-black/60 w-full h-full top-0 left-0"
              onClick={() => setShowSidebar(false)}
            />
          )}
          {children}
        </div>
      )}
    </>
  );
}
