import { ArrowLeftIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/solid'
import { Link, usePage } from '@inertiajs/react'
import React from 'react'
import GroupAvatar from './GroupAvatar'
import UserAvatar from './UserAvatar'
import axios from 'axios'
import GroupUsersPopover from './GroupUsersPopover'
import GroupDescriptionPopover from './GroupDescriptionPopover'
import { useEventBus } from '@/EventBus'

const ConversationHeader = ({selectedConversation}) => {
    const {emit} = useEventBus();
    const auth = usePage().props.auth;
    const onDeleteGroup = () => {
        if(!window.confirm("Are you sure you want to delete this group?")){
            return;
        }
        axios.delete(route('group.destroy', selectedConversation.id))
        .then((res)=>{
           emit("toast.show", res.data.message);
        })
        .catch((err)=>{
            console.log(err);
            alert("Failed to delete group");
        });
    }
  return (
    <>
    {selectedConversation && (
        <div className="flex items-center justify-between p-4 bg-slate-700 text-white">
           <div className='flex items-center gap-3 w-full'>
            <Link
               href={route('dashboard')}
               className='inline-block sm:hidden'
            >
                <ArrowLeftIcon className='w-6'/>
            </Link> 
            {selectedConversation.is_group ? (
               <GroupAvatar />
            ) : (
                <UserAvatar user={selectedConversation}/>
            )}
            <div className='flex items-center justify-between w-full'>
            <div>
                <h3 className='text-lg font-semibold'>
                    {selectedConversation.name}
                </h3>
                {selectedConversation.is_group && (
                    <p className='text-sm text-gray-400'>
                        {selectedConversation.users.length} members
                    </p>
                )}
            </div>
            {selectedConversation.is_group && (
            <div className='flex gap-3'>
                <GroupDescriptionPopover
                description={selectedConversation.description} />
                <GroupUsersPopover
                users={selectedConversation.users} />
                {selectedConversation.owner_id === auth.user.id && (
                    <>
                      <div className='tooltip tooltip-left'
                      data-tip="Edit Group">
                        <button
                            onClick={(ev)=>{
                                emit("GroupModal.show",
                                    selectedConversation
                                );
                            }} className='text-gray-400 hover:text-gray-200'>
                                <PencilSquareIcon className='w-5'/>
                            </button>
                      </div>
                      <div className='tooltip tooltip-left'
                      data-tip="Delete Group">
                        <button 
                        onClick={onDeleteGroup}
                        className='text-gray-400 hover:text-gray-200'>
                            <TrashIcon className='w-5'/>
                        </button>
                      </div>
                    </>
                    )}
            </div>
            )}
            </div>
           </div>
        </div>
    )}
    </>
  )
}

export default ConversationHeader