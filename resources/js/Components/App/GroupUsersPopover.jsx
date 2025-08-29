import { UsersIcon } from '@heroicons/react/24/solid'
import { Link } from '@inertiajs/react'
import React from 'react'
import UserAvatar from './UserAvatar'
import { Popover, Transition } from '@headlessui/react'

const GroupUsersPopover = ({users = []}) => {
  return (
      <Popover className="relative">
              {({open})=>
              <>
              <Popover.Button className={`${open ? 'text-gray-200' : 'text-gray-400'} hover:text-gray-200` }>
                  <UsersIcon className='h-5 w-5'/>                
              </Popover.Button>
              <Transition
              as={React.Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
              >
                  <Popover.Panel className="absolute right-0 z-10 w-[200px] px-4 mt-3 sm:px-0">
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                        <div className="bg-gray-800 p-2">
                            {users.map((user) => (
                              <Link key={user.id} href={route('chat.user', user.id)} className="flex items-center gap-2 p-2 hover:bg-black/30 rounded-md">
                                  <UserAvatar user={user} className="h-6 w-6"/>
                                  <p className='text-xs text-gray-300'>{user.name}</p>
                              </Link>
                            ))}
                          </div>
                      </div>
                  </Popover.Panel>
              </Transition>
                </>  }
          </Popover>  )
}

export default GroupUsersPopover