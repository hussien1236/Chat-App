import { Link, usePage } from '@inertiajs/react'
import React from 'react'
import UserOptionsDropdown from './UserOptionsDropdown';
import UserAvatar from './UserAvatar';
import GroupAvatar from './GroupAvatar';
import {formatMessageDateShort} from '@/helpers'
const ConversationItem = ({
    conversation,
    selectedConversation = null,
    online = null
}) => {
    const page = usePage();
    const currentUser = page.props.auth.user;
    let classes = "border-transparent"
    if(selectedConversation){
        if(!selectedConversation.is_group && !conversation.is_group 
            && conversation.id === selectedConversation.id) {
           classes = "border-blue-500 bg-black/20"
        }else if(selectedConversation.is_group && conversation.is_group 
            && conversation.id === selectedConversation.id) {
           classes = "border-blue-500 bg-black/20"
    }}
    if(!conversation.is_group && conversation.blocked_at){
        classes += ' opacity-50';
    }
  return (
    <>
     <Link 
        href={
            conversation.is_group 
            ? route('chat.group', conversation)
            : route('chat.user', conversation)
        }
        preserveState
        className={"conversation-item flex items-center gap-2 p-2 text-gray-300 hover:bg-black/30 transition-all cursor-pointer duration-200" + classes}
     >
        {conversation.is_group ? <GroupAvatar /> :
            <UserAvatar user={conversation} online={online} />
        }
                  <div
                className={`flex-1 text-sm max-w-full overflow-hidden`+ (conversation.is_user && conversation.blocked_at ? ' opacity-50' : '')}>
                 <div className='flex gap-1 items-center justify-between'>
                    <h3 className='text-sm font-semibold overflow-hidden text-ellipsis text-nowrap'>
                    {conversation.name}
                    </h3>   
                    {conversation.last_message_date && (
                        <span className='text-xs text-gray-400 whitespace-nowrap'>
                            {formatMessageDateShort(conversation.last_message_date)}
                        </span>
                    )}
                 </div> 
                {conversation.last_message && (
                    <p className='text-xs text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap'>
                        {conversation.last_message} 
                    </p>
                )}
            </div>
            {!!currentUser.is_admin && !conversation.is_group && (
              <UserOptionsDropdown conversation={conversation} />
      )}
     </Link>
     </>
  )
}

export default ConversationItem