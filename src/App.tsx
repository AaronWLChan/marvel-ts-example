import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CharacterParameters, Image } from 'marvel-ts/dist/types';
import api from './api';
import Picture from './components/Picture';
import LoadingLayout from './components/LoadingLayout';

function App() {

  const [pictures, setPictures] = useState<Image[]>([])
  const [error, setError] = useState(false)

  const [remaining, setRemaining] = useState<number>()
  const offset = useRef<number>(0)
  const lastElement = useRef<HTMLDivElement>(null)
  const isInit = useRef(true)

  /**
   * Get Pictures
   */
  const getPictures = useCallback(async () => {

    //console.log("remaining: " + remaining.current)
    //console.log("Init? " + isInit.current)

    if ( (remaining && remaining > 0) || isInit.current === true) {
  
      let params: CharacterParameters = {
        limit: 20,
        offset: offset.current
      }
  
      return api.getCharacters(params)
        .then(({ data }) => {
  
          //Set total results
          offset.current = offset.current + 20
          setRemaining(remaining ? remaining - 20 : data?.total! - 20)
          isInit.current = false
  
          let images = data?.results!.map((c) => c.thumbnail!)
                          .filter((t) => t.path !== "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available")
  
          setPictures([...pictures, ...images!])
        })
        .catch((e) => setError(true))


    }



  }, [pictures, remaining])

  const loader = useRef(getPictures)

  const onIntersect: IntersectionObserverCallback = (entries) => {
    
    if (entries[0].isIntersecting){
      loader.current()
    }

  }

  /**
   * Handles load more.
   */
      useEffect(() => {
      
      const refValue = lastElement.current
      const observer = new IntersectionObserver(onIntersect, { threshold: 1 })

      if (refValue){
        observer.observe(refValue)
      }

      return () => {
        if (refValue) {
          observer.unobserve(refValue)
        }
      }

    }, [])

    /**
     * Whenever getPicture() is recreated replace with new function
     */
    useEffect(() => {
      loader.current = getPictures
    }, [getPictures])
    

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-5xl font-bold mb-8 text-center'>Something went wrong...</h1>
        <p>I missed the part where that's my problem.</p>

        <button onClick={() => window.location.reload()} className='mt-8 bg-red-500 text-white p-2 px-8 rounded-lg font-bold tracking-widest uppercase text-sm hover:opacity-70 duration-100'>
          <span>Reload</span>
        </button>

      </div>
    )
  }

  return (
    <div className="container mx-auto py-16 px-8 flex flex-col">

        <a href='https://github.com/AaronWLChan/marvel-ts-example' className="self-end sm:mb-0 mb-4">

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill='#000' width={40} height={40}>
            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"/>
          </svg>              

        </a>

      <h1 className='text-6xl font-bold mb-4'>Marvel Superheros</h1>

      <span className='text-gray-500'>Data provided by Marvel. © 2014 Marvel.</span>

      <div className='mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-x-4 gap-x-8 gap-y-8'>

        { pictures.map((p, i) => {
          return (
            <Picture key={i} image={p}/>
          )

        }) }

      </div>

      {/* Element which triggers loading */}
      <div ref={lastElement} className="mt-8">

        { (remaining && remaining > 0) && 
          <LoadingLayout/>
        }
      </div>

      

    </div>
  );
}

export default App;
