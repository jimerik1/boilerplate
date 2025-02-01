// src/app/_components/layout/dashboard-layout.tsx
"use client";

import { Menu, Popover, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { type Session } from "next-auth";
import { useTheme } from "~/app/_components/theme/theme-provider";

interface Navigation {
  name: string;
  href: string;
  current: boolean;
}

const navigation: Navigation[] = [
  { name: "Home", href: "/dashboard", current: true },
  { name: "Profile", href: "/dashboard/profile", current: false },
  { name: "Resources", href: "/dashboard/resources", current: false },
];

const userNavigation = [
  { name: "Your Profile", href: "/dashboard/profile" },
  { name: "Settings", href: "/dashboard/settings" },
  { name: "Sign out", href: "/api/auth/signout" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  session: Session;
}

export function DashboardLayout({ children, session }: DashboardLayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const user = {
    name: session.user.name ?? "User",
    email: session.user.email ?? "",
    imageUrl: session.user.image ?? "",
  };

  return (
    <div className="min-h-full bg-gray-100 dark:bg-gray-900">
      <Popover as="header" className="bg-gray-800 dark:bg-gray-950 pb-24">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
              <div className="relative flex items-center justify-between py-5">
                {/* Logo and Navigation */}
                <div className="flex items-center space-x-8">
                  <Link href="/dashboard" className="shrink-0">
                    <span className="sr-only">Your Company</span>
                    <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700" />
                  </Link>

                  {/* Desktop Navigation */}
                  <nav className="hidden lg:flex lg:space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "text-white"
                            : "text-gray-300 dark:text-gray-400",
                          "rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-700 hover:text-white"
                        )}
                        aria-current={item.current ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Search */}
                <div className="min-w-0 flex-1 px-12">
                  <div className="mx-auto w-full max-w-md">
                    <label htmlFor="desktop-search" className="sr-only">
                      Search
                    </label>
                    <div className="relative text-white focus-within:text-gray-600">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </div>
                      <input
                        id="desktop-search"
                        className="block w-full rounded-md bg-gray-700/20 dark:bg-gray-600/20 py-1.5 pl-10 pr-3 text-white placeholder:text-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:text-gray-900 dark:focus:text-white focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Search"
                        type="search"
                        name="search"
                      />
                    </div>
                  </div>
                </div>

                {/* Right section on desktop */}
                <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5 space-x-2">
                  <button
                    type="button"
                    className="relative shrink-0 rounded-full p-1 text-gray-300 dark:text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={toggleTheme}
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Toggle theme</span>
                    {theme === 'dark' ? (
                      <SunIcon className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MoonIcon className="h-6 w-6" aria-hidden="true" />
                    )}
                  </button>

                  <button
                    type="button"
                    className="relative shrink-0 rounded-full p-1 text-gray-300 dark:text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-4 shrink-0">
                    <Menu.Button className="relative flex rounded-full bg-white dark:bg-gray-700 text-sm ring-2 ring-white dark:ring-gray-600 ring-opacity-20 focus:outline-none focus:ring-opacity-100">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      {user.imageUrl ? (
                        <Image
                          className="h-8 w-8 rounded-full"
                          src={user.imageUrl}
                          alt=""
                          width={32}
                          height={32}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-600" />
                      )}
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {userNavigation.map((item) => (
                          <Menu.Item key={item.name}>
                            {({ active }) => (
                              <Link
                                href={item.href}
                                className={classNames(
                                  active ? "bg-gray-100 dark:bg-gray-700" : "",
                                  "block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                                )}
                              >
                                {item.name}
                              </Link>
                            )}
                          </Menu.Item>
                        ))}
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>

                {/* Menu button */}
                <div className="lg:hidden">
                  <Popover.Button className="relative inline-flex items-center justify-center rounded-md bg-transparent p-2 text-gray-300 dark:text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Popover.Button>
                </div>
              </div>
            </div>

            <Transition.Root as={Fragment} show={open}>
              <div className="lg:hidden">
                <Transition.Child
                  as={Fragment}
                  enter="duration-150 ease-out"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="duration-150 ease-in"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Popover.Overlay className="fixed inset-0 z-20 bg-black bg-opacity-25" />
                </Transition.Child>

                <Transition.Child
                  as={Fragment}
                  enter="duration-150 ease-out"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="duration-150 ease-in"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Popover.Panel
                    focus
                    className="absolute inset-x-0 top-0 z-30 mx-auto w-full max-w-3xl origin-top transform p-2 transition"
                  >
                    <div className="divide-y divide-gray-200 dark:divide-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="pb-2 pt-3">
                        <div className="flex items-center justify-between px-4">
                          <div>
                            <div className="h-8 w-8 bg-gray-800 dark:bg-gray-700" />
                          </div>
                          <div className="-mr-2">
                            <Popover.Button className="relative inline-flex items-center justify-center rounded-md bg-white dark:bg-gray-800 p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500">
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Close menu</span>
                              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                            </Popover.Button>
                          </div>
                        </div>
                        <div className="mt-3 space-y-1 px-2">
                          {navigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="pb-2 pt-4">
                        <div className="flex items-center px-5">
                          <div className="shrink-0">
                            {user.imageUrl ? (
                              <Image
                                className="h-10 w-10 rounded-full"
                                src={user.imageUrl}
                                alt=""
                                width={40}
                                height={40}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-600" />
                            )}
                          </div>
                          <div className="ml-3 min-w-0 flex-1">
                            <div className="truncate text-base font-medium text-gray-800 dark:text-gray-200">{user.name}</div>
                            <div className="truncate text-sm font-medium text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                          <button
                            type="button"
                            className="relative ml-auto shrink-0 rounded-full bg-white dark:bg-gray-800 p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">View notifications</span>
                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                        <div className="mt-3 space-y-1 px-2">
                          {userNavigation.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition.Child>
              </div>
            </Transition.Root>
          </>
        )}
      </Popover>

      <main className="-mt-24 pb-8">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          {/* Main 3 column grid */}
          <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
            {/* Left column */}
            <div className="grid grid-cols-1 gap-4 lg:col-span-2">
              <section aria-labelledby="section-1-title">
                <h2 id="section-1-title" className="sr-only">
                  Main Content
                </h2>
                <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
                  <div className="p-6">{children}</div>
                </div>
              </section>
            </div>

            {/* Right column */}
            <div className="grid grid-cols-1 gap-4">
              <section aria-labelledby="section-2-title">
                <h2 id="section-2-title" className="sr-only">
                  Chat
                </h2>
                <div className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow">
                  <div className="p-6">
                    {/* Chat component will go here */}
                    <div className="h-[600px] w-full">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                        Chat
                      </h3>
                      {/* Add your chat component here */}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}