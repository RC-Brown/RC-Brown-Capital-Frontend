import Image from "next/image";
import React from "react";

export default function ProjectMiniCards({
//   id,
  image,
  title,
  address,
  type,
  status,
}: {
  id: string;
  image: string;
  title: string;
  address: string;
  type: string;
  status: string;
}) {
  return (
    <div className='relative w-[335px] flex-shrink-0 rounded-[10px] bg-white p-2'>
      <span className='absolute right-3 top-3 rounded-[5px] bg-white px-2 py-1 text-xs text-text-muted'>{status}</span>
      <Image
        src={image}
        alt={title}
        width={335}
        height={217}
        className='mb-2 h-[217px] w-full rounded-md object-cover'
      />
      <div className='px-1 py-3'>
        <div className='flex items-start justify-between'>
          <span className='text-sm font-normal uppercase leading-[100%] tracking-[0%] text-text-muted/70'>
            {address}
          </span>
          <span className='rounded-[5px] bg-primary px-2 py-1 text-xs lowercase text-white'>{type}</span>
        </div>
        <div className='text-xl font-medium leading-[100%] tracking-[0%] text-black'>{title}</div>
      </div>
    </div>
  );
}
