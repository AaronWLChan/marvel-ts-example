import { Image } from 'marvel-ts/dist/types'

interface PictureProps {
    image: Image,
}

export default function Picture({ image }: PictureProps) {

  return (
    <div className='h-40 w-40 sm:h-48 sm:w-48 transform hover:scale-105 duration-200 shadow-xl'>
        <img className='object-cover h-full w-full rounded-lg' src={`${image.path}.${image.extension}`} alt="Hero or villain?" />
    </div>  
  )
}
