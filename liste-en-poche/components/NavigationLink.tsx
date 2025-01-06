'use client';
import Link from 'next/link';
import {useSelectedLayoutSegment, useSelectedLayoutSegments} from 'next/navigation';
import {ComponentProps} from 'react';

 
export default function NavigationLink({
  href,
  ...rest
}: ComponentProps<typeof Link>) {
  const selectedLayoutSegment = useSelectedLayoutSegments();
  const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment.toString().replace(",","/")}` : '/';
  const isActive = pathname === href;
  // const generalLinkstyle = "p-4 hover:bg-[#4F4141]"
  // const selectedLinkstyle = "p-4 hover:bg-[#4F4141] bg-gray-300 text-gray-700 hover:text-gray-500 font-semibold border-b-4 border-[#E7A100]"

  return (
    <Link
      aria-current={isActive ? 'page' : undefined}
      href={href}
      // className={isActive ? selectedLinkstyle : generalLinkstyle}
    //   style={{fontWeight: isActive ? 'bold' : 'normal'}}
      {...rest}
    />
  );
}