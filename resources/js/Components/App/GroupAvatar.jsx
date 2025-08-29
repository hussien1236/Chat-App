import React from 'react'
import {UserIcon} from '@heroicons/react/24/solid';
const GroupAvatar = () => {
  return (
    <div className={`avatar placeholder`}>
        <div className={`rounded-full bg-gray-400 text-gray-800 w-8`}>
            <UserIcon className='text-xl font-semibold'/>
        </div>
    </div>
  )
}

export default GroupAvatar