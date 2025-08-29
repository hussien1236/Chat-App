import { useEventBus } from '@/EventBus'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
  ArchiveBoxXMarkIcon,
  ChevronDownIcon,
  PencilIcon,
  Square2StackIcon,
  TrashIcon,
} from '@heroicons/react/16/solid'
import { EllipsisVerticalIcon, LockClosedIcon, LockOpenIcon, ShieldCheckIcon } from '@heroicons/react/24/solid'
import axios from 'axios'

const MessageOptionsDropdown = ({message}) => {
  const {emit} = useEventBus();
   const onMessageDelete = ()=>{
    axios.delete(route("message.destroy", message.id))
         .then((res)=>{
          emit("message.deleted", {message, prevMessage: res.data.message});
         })
         .catch((error)=> {
            console.log(error);
         });
   }
  return (
    <div className='absolute right-full text-gray-100 top-1/2 -translate-y-1/2'>
      <Menu as="div" className="relative inline-block text-left"> 
        <div>
        <MenuButton className="flex items-center justify-center gap-2 w-8 h-8 outline-none">
          <EllipsisVerticalIcon className="size-5" />
        </MenuButton>
         </div>
        <MenuItems
          // transition
          anchor="bottom end"
          className="w-52 origin-top-right flex flex-col bg-gray-800 rounded-xl border border-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
        >
          <MenuItem>
            {({ active }) => (
            <button onClick={onMessageDelete}
             className={(active? 'bg-black/30 text-white':'text-gray-100')+'group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10' }
             >
             <TrashIcon className='w-4 h-4 mr-2'/>
             <span>Delete</span>
            </button>
        )}
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  )
}

export default MessageOptionsDropdown