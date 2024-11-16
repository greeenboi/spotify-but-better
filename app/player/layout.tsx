"use client";
import React from "react";
import { useSidebarStore } from "@/lib/store/sidebar-store";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import {
  IconArrowLeft,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link";
import { motion } from "framer-motion";


export default function Layout ({ children } : { children : React.ReactNode}) {
  const { open, setOpen } = useSidebarStore();
  const links = [
        // {
        //   label: "Dashboard",
        //   href: "#",
        //   icon: (
        //     <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        //   ),
        // },
        // {
        //   label: "Profile",
        //   href: "#",
        //   icon: (
        //     <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        //   ),
        // },
        // {
        //   label: "Settings",
        //   href: "#",
        //   icon: (
        //     <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        //   ),
        // },
        {
          label: "Logout",
          href: "/",
          icon: (
            <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
        },
      ];
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "Suvan GS",
                href: "#",
                icon: (
                  <Avatar>
                    <AvatarImage src="https://avatars.githubusercontent.com/u/118198968?v=4" className="h-8 w-auto flex-shrink-0 rounded-full" alt="Suvan GS" />
                    <AvatarFallback>SGS</AvatarFallback>
                  </Avatar>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
};


export const Logo = () => {
    return (
      <Link
        href="/"
        className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      >
        <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-medium font-geist text-black dark:text-white whitespace-pre"
        >
          Sonder
        </motion.span>
      </Link>
    );
  };

export const LogoIcon = () => {
    return (
        <Link
        href="/"
        className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
        <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
        </Link>
    );
};