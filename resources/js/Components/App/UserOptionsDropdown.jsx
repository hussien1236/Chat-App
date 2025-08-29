import { useEventBus } from '@/EventBus';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon, LockClosedIcon, LockOpenIcon, ShieldCheckIcon, UserIcon } from '@heroicons/react/24/solid'
import axios from 'axios'

const UserOptionsDropdown = ({conversation}) => {
  const {emit} = useEventBus();
    const changeUserRole = () => {
    console.log('Change user role clicked');
    if(!!conversation.is_group) return;
    console.log('Change user role clicked2');
    axios.post(route('user.changeRole', conversation.id))
    .then(response => {
        emit("toast.show", response.data.message);
        console.log('User role changed successfully:', response.data);
    }).catch(error => {
        console.error('Error changing user role:', error);
    });
  }
    const onBlockUser = () => {
    console.log('Block user clicked');
    if(!!conversation.is_group) return;
   
    axios.post(route('user.blockUnblock', conversation.id))
    .then((res) => { 
        emit("toast.show", res.data.message);
        console.log('User blocked successfully:', res.data);
    }).catch(error => {
        console.error('Error blocking user:', error);
    });
  } 
  return (
    <div>
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
            <button onClick={onBlockUser}
             className={(active? 'bg-black/30 text-white':'text-gray-100')+'group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10' }
             >
             {conversation.blocked_at ? (
               <div className="flex items-center gap-2">
               <LockOpenIcon className="size-4 mr-2" />
               Unblock User               
               </div>
              ) : (
                <div className="flex items-center gap-2">
                <LockClosedIcon className="size-4 mr-2" />
                Block User
                </div>
              )}       
            </button>
        )}
          </MenuItem>
               <MenuItem>
            {({ active }) => (
            <button onClick={changeUserRole}
              className={(active? 'bg-black/50 text-white':'text-gray-100') + 'group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10' }
             >
             {conversation.is_admin ? (
               <div className="flex items-center gap-2">
               <UserIcon className="size-4 mr-2" />
               Make Regular User               
               </div>
              ) : (
                <div className="flex items-center gap-2">
                <ShieldCheckIcon className="size-4 mr-2" />
                Make Admin
                </div>
              )}       
            </button>
        )}
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  )
}

export default UserOptionsDropdown