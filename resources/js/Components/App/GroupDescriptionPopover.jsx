import { Popover, Transition } from '@headlessui/react'
import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import React from 'react'

const GroupDescriptionPopover = ({description}) => {
  return (
    <Popover className="relative">
        {({open})=>
        <>
        <Popover.Button className={`${open ? 'text-gray-200' : 'text-gray-400'} hover:text-gray-200` }>
            <ExclamationCircleIcon className='h-5 w-5'/>
        </Popover.Button>    
         <Transition
         as={React.Fragment}
                 leave="transition ease-in duration-100"
                 leaveFrom="opacity-100"
                 leaveTo="opacity-0"
                 afterLeave={() => setQuery('')}
         >
            <Popover.Panel className="absolute right-0 z-10 w-[300px] px-4 mt-3 sm:px-0">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                   <div className="bg-gray-800 p-4">
                      <h2 className='text-lg mb-3'>
                        Description
                      </h2>
                      {description ? 
                      <p className='text-gray-400 text-xs'>{description}</p> : 
                      <p className='text-gray-500 text-center py-4 text-sm'>No description is defined</p>}
                   </div>
                </div>
            </Popover.Panel>
         </Transition>
          </>  }
    </Popover>
  )
}

export default GroupDescriptionPopover 