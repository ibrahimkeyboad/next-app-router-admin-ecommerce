'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import {
  HiBuildingStorefront,
  HiHome,
  HiCog6Tooth,
  HiQueueList,
  HiArchiveBox,
  HiListBullet,
} from 'react-icons/hi2';

function Nav() {
  const pathname = usePathname();

  const inActiveLink = 'flex gap-1 p-1 items-center';
  const activeLink = `${inActiveLink} bg-white text-blue-900 rounded-l-md `;
  return (
    <aside className='p-4 pr-0 text-white'>
      <Link href='/' className='flex gap-1 items-center pr-3'>
        <HiBuildingStorefront size={25} /> <span>EcommerceAdmin</span>
      </Link>

      <nav className='flex flex-col gap-2 mt-4'>
        <Link href='/' className={pathname === '/' ? activeLink : inActiveLink}>
          <HiHome size={24} />
          Dashboard
        </Link>
        <Link
          href='/products'
          className={pathname === '/products' ? activeLink : inActiveLink}>
          <HiArchiveBox size={24} />
          Products
        </Link>
        <Link
          href='/categories'
          className={pathname === '/categories' ? activeLink : inActiveLink}>
          <HiListBullet size={24} />
          Categories
        </Link>
        <Link
          href='/orders'
          className={pathname === '/orders' ? activeLink : inActiveLink}>
          <HiQueueList size={24} />
          Orders
        </Link>
        <Link
          href='/settings'
          className={pathname === '/settings' ? activeLink : inActiveLink}>
          <HiCog6Tooth size={24} />
          Settings
        </Link>
      </nav>
    </aside>
  );
}

export default Nav;
