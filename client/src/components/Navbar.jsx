import React from 'react'


function Navbar() {
  return (
    <div className='w-full h-15 bg-lightGrey flex justify-between  items-center m-0'>
      <div className='text-white text-2xl font-bold font-[cursive] px-4'>IHaveToDo</div>
      <div className='text-white px-3 py-1.5 rounded-4xl mx-4 flex hover:bg-gray-800'><img src="public/userimg.jpg" width="40px" className='rounded-full' alt=""/><img src="public/downArraw.svg" alt="" /></div>
    </div>
  )
}

export default Navbar
