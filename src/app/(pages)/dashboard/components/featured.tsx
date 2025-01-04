import Image from 'next/image'
import React from 'react'
type Props = {
    image: string,
    title: string,
    raised: string,
    description: string,
    category: string
}


export default function Featured({image, title, raised, description, category}: Props) {
  return (
    <div className='flex flex-col gap-5 w-[50%] h-full '>
        <Image
            src = {image}
            width = {500}
            height = {500}
            alt = "featured-image"
            className = "w-full h-96  object-cover rounded-xl"
        />
        <p className='text-3xl'>{title}</p>
        <div className='shadow-md p-4 flex justify-center items-center w-fit'>
            {category}
        </div>
        <div>
            <p>{description}</p>
        </div>
        <div>
            RS. {raised} raised
        </div>
    </div>
  )
}
