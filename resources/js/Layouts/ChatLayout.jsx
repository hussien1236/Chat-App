import ConversationItem from '@/Components/App/ConversationItem';
import GroupModal from '@/Components/App/GroupModal';
import TextInput from '@/Components/TextInput';
import { useEventBus } from '@/EventBus';
import { PencilSquareIcon } from '@heroicons/react/24/solid';
import { router, usePage } from '@inertiajs/react'
import React, { useState, useEffect } from 'react'

const ChatLayout = ({children}) => {
    const page = usePage();
    const {on, emit} = useEventBus();
    const conversations = page.props.conversations;
    const selectedConversation = page.props.selectedConversation;
    const [localConversations, setLocalConversations] = useState([]);
    const [sortedConversations, setSortedConversations] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState({});
    const [showGroupModal, setShowGroupModal] = useState(false);
    const isUserOnline = (userId) => {
        return onlineUsers[userId] ? true : false;
    }
    const onSearch = (e) => {
        setLocalConversations(
            conversations.filter(conversation => {
                const searchTerm = e.target.value.toLowerCase();
                return conversation.name.toLowerCase().includes(searchTerm)
            }
        ))
     }
    const messageCreated = (message)=>{
       setLocalConversations((prevConversations)=>{
         return prevConversations.map((c)=>{
            if(message.receiver_id &&
                !c.is_group &&
                (c.id == message.sender_id || c.id == message.receiver_id)
            ){
                c.last_message = message.message;
                c.last_message_date = message.created_at;
                return c;
            }
            if(message.group_id &&
                c.is_group &&
                c.id == message.group_id
            ){
                c.last_message = message.message;
                c.last_message_date = message.created_at;
                return c;
            }
            return c;
         })

       });
    };
    const messageDeleted = ({prevMessage})=>{
        if(!prevMessage) return;
        setLocalConversations((prevConversations)=>{
         return prevConversations.map((c)=>{
            if(prevMessage.receiver_id &&
                !c.is_group &&
                (c.id == prevMessage.sender_id || c.id == prevMessage.receiver_id)
            ){
                     c.last_message = prevMessage.message;
                     c.last_message_date = prevMessage.created_at;
                    return c;
            }
            else if(prevMessage.group_id &&
                c.is_group &&
                c.group_id == prevMessage.group_id
            ){
                c.last_message = prevMessage.message;
                c.last_message_date = prevMessage.created_at;
                return c;
            }
            return c;
         })

       });
    };
    useEffect(()=>{
      const offCreated = on("message.created", messageCreated);
      const offDeleted = on("message.deleted", messageDeleted);
      const offGroupModal = on("GroupModal.show", (group)=>{
        setShowGroupModal(true);
        });
      const offGroupDelete = on("group.deleted", ({id, name})=>{
        setLocalConversations((prevConversations)=>{
            return prevConversations.filter(c=> !(c.is_group && c.id === id));
        });
        emit("toast.show", `Group "${name}" has been deleted.`);
        if(!selectedConversation || (selectedConversation.is_group && selectedConversation.id === id)){
            router.visit(route('dashboard'));
        }
        });
      return ()=>{
        offCreated();
        offDeleted();
        offGroupModal();
        offGroupDelete();
      }
    },[on]);
       useEffect(()=>{
        setLocalConversations(conversations);   
    },[conversations])
     useEffect(() => {
        setSortedConversations(
            localConversations.sort((a,b)=>{
                if(a.blocked_at && b.blocked_at) {
                    return a.blocked_at > b.blocked_at ? 1 : -1;
                } else if(a.blocked_at) {
                    return 1;
                } else if(b.blocked_at) {
                    return -1;
                }   
                if(a.last_message_date && b.last_message_date) {
                    return b.last_message_date.localeCompare(a.last_message_date);
                }
                else if(a.last_message_date) {
                    return -1;
                }
                else if(b.last_message_date) {
                    return 1;
                }
                else{
                    return 0;
                }
            })
        );
    }, [localConversations]);
    useEffect(() => {
        window.Echo.join("online")
        .here((users) => {
            const onlineUsers = Object.fromEntries(
                users.map(user => [user.id, user]));
            setOnlineUsers((prevUsers) => ({
                ...prevUsers,
                ...onlineUsers
            })
            )
        })
        .joining((user) => {
            setOnlineUsers((prevUsers) => {           
                const updatedUsers = {...prevUsers};
                updatedUsers[user.id] = user;
                return updatedUsers;       
        });
        })
        .leaving((user) => {
            setOnlineUsers((prevUsers) => {
                const updatedUsers = {...prevUsers};
                delete updatedUsers[user.id];
                return updatedUsers;
            });
        })
        .error((error) => {
            console.error('Error joining channel:', error);
        });
        return () => {
            window.Echo.leave("online");
        }
    }, []);
  return (
    <>
      <div className='flex-1 w-full flex overflow-hidden'>
      <div className={`transition-all w-full sm:w-[220px] md:w-[300px] bg-slate-800 flex flex-col
        overflow-hidden ${selectedConversation ? '-ml-[100%] sm:ml-0' : ''}`}> 
        <div className='flex items-center justify-between py-2 px-3 text-xl text-gray-200 font-medium'>
            My Conversations
            <div
            className='tooltip toolip-left'
            data-tip="Create New "
            >
              <button
                onClick={(ev)=> setShowGroupModal(true)}
                className='text-gray-400 hover:text-gray-200'>
                <PencilSquareIcon className='w-6 h-6 inline-block ml-2' />
            </button>
            </div>
        </div>
        <div className='p-3'>
            <TextInput
                onKeyUp={onSearch}
                placeholder='Search Conversations'
                className='w-full'
                />
        </div>
        <div className='flex-1 scrollable_div'>
        {sortedConversations && sortedConversations.map((conversation) => (
        <ConversationItem
        key={`${conversation.is_group ? 'group_' : 'user_'}${conversation.id}`}
        conversation={conversation}
        online={!!isUserOnline(conversation.id)}
        selectedConversation={selectedConversation}
        />    
        ))
    }
        </div>
      </div>
      <div className='flex-1 flex flex-col min-h-0'>
         {children}
      </div>
      </div>
      <GroupModal show={showGroupModal} onClose={()=> setShowGroupModal(false)} />
    </>
  )
}

export default ChatLayout