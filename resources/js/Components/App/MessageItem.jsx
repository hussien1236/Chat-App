import React from 'react'
import UserAvatar from './UserAvatar';
import { usePage } from '@inertiajs/react';
import { formatMessageDateLong, formatMessageDateShort } from '@/helpers';
import MessageAttachments from './MessageAttachments';
import MessageOptionsDropdown from './MessageOptionsDropdown';

const MessageItem = ({message, attachmentClick}) => {
    const page = usePage();
    const currentUser = page.props.auth.user;
  return (
<div className={"chat "+ (message.sender_id === currentUser.id ? 'chat-end' : 'chat-start')}>
  <div className="chat-image avatar">
    <div className="w-10 rounded-full">
       <UserAvatar user={message.sender} />
    </div>
  </div>
  <div className="chat-header text-slate-200">
        {
             message.sender_id !== currentUser.id && (
             message.sender.name)    
         }    <time className="text-xs opacity-50">{formatMessageDateLong(message.created_at)}</time>
  </div>
  <div className={"chat-bubble"+ (message.sender_id === currentUser.id ? ' chat-bubble-primary' : ' chat-bubble-neutral')}>
    {message.sender_id == currentUser.id && (
      <MessageOptionsDropdown message={message}/>
    ) }
    <span> {message.message}</span>
  <MessageAttachments 
        attachments={message.attachments}
        attachmentClick={attachmentClick}
  />      
    </div>

</div>)

  
}

export default MessageItem