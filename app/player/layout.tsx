"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator"
import { invoke } from '@tauri-apps/api/core';

import {
  IconArrowLeft,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

const openInBrowser = async (url: string) => {
  try {
    console.log('Opening URL:', url);
    const result = invoke('open_link_on_click', { url:url});
    console.log('Result:', result);
  } catch (error) {
    console.error('Failed to open URL:', error);
  }
};

export default function Layout ({ children } : { children : React.ReactNode}) {
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
      const [open, setOpen] = useState(false);
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
          <div onClick = {() => openInBrowser("https://github.com/greeenboi")}>
            <Separator className="bg-muted-foreground/40 my-1" />
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
                iconRight: <Image src="/sonder-github.svg" alt="My Github" width={24} height={24} className="w-5 h-auto flex-shrink-0 "  priority />
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
        href="/welcome"
        className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      >
        <Image src="/sonder-menu.svg" alt="Sonder" width={24} height={24} className="w-6 h-auto flex-shrink-0 "  priority/>
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
        <Image src="/sonder-menu.svg" alt="Sonder" width={24} height={24} className="w-6 h-auto flex-shrink-0 rotate-90"  priority/>
        </Link>
    );
};