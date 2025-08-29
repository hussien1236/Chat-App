import React, { useCallback, useEffect, useRef, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';
import ConversationHeader from '@/Components/App/ConversationHeader';
import MessageItem from '@/Components/App/MessageItem';
import MessageInput from '@/Components/App/MessageInput';
import { useEventBus } from '@/EventBus';
import axios from 'axios';
import PreviewAttachmentModal from '@/Components/App/PreviewAttachmentModal';

function Home({ selectedConversation, messages }) {
    const [localMessages, setLocalMessages] = useState([]);
    const messagesCtrRef = useRef(null);
    const loadMoreIntersect = useRef(null);
    const [noMoreMessages,setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(null);
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setPreviewAttachment] = useState({});
    const loadMoreMessages = useCallback(()=>{
        if(noMoreMessages){
            return;
        }
         const firstMessage = localMessages[0];
         axios.get(route("message.loadOlder", firstMessage.id))
         .then(({data})=>{
            if(data.data.length === 0){
                setNoMoreMessages(true);
                return;
            }
            const scrollHeight = messagesCtrRef.current.scrollHeight;
            const scrollTop = messagesCtrRef.current.scrollTop;
            const clientHeight = messagesCtrRef.current.clientHeight;
            const tmpScrollFromBottom = scrollHeight - scrollTop - clientHeight;
            setScrollFromBottom(tmpScrollFromBottom);
            setLocalMessages((prevMessages)=>{
                return [...data.data.reverse(),...prevMessages];
            })
         })
    }, [localMessages, noMoreMessages]);
    const onAttachmentClick = (attachments, ind) =>{
        setPreviewAttachment({
            attachments,
            ind
        });
        setShowAttachmentPreview(true);
    }
    const {on} = useEventBus();
    const messageCreated = (message) => {
        if(selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ){
            setLocalMessages((prev)=>[...prev, message]);
        }
        if(selectedConversation &&
            !selectedConversation.is_group &&
            (selectedConversation.id == message.sender_id || selectedConversation.id == message.receiver_id)
        ){
            setLocalMessages((prev)=>[...prev, message]);
        }
    }
    const messageDeleted = ({message})=>{
          if(selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ){
            setLocalMessages((prev)=> prev.filter((m)=>m.id !== message.id));
        }
       if(selectedConversation &&
            !selectedConversation.is_group &&
            (selectedConversation.id == message.sender_id || selectedConversation.id == message.receiver_id)
        ){
            setLocalMessages((prev)=> prev.filter((m)=>m.id !== message.id));
        }
    }
    useEffect(()=>{
       setTimeout(()=>{
        if(messagesCtrRef.current){
         messagesCtrRef.current.scrollTop =
            messagesCtrRef.current.scrollHeight;
        }
       },10);   
       setNoMoreMessages(false);
       setScrollFromBottom(null);
       const offCreated = on('message.created', messageCreated);
       const offDeleted = on('message.deleted', messageDeleted);
       return () =>{
        offCreated();
        offDeleted();
       }
    },[selectedConversation]);
    useEffect(() => {
        setLocalMessages(messages? messages.data.reverse(): []);
    }, [messages]);
    useEffect(() =>{
      if(messagesCtrRef.current && scrollFromBottom !== null && scrollFromBottom){
        messagesCtrRef.current.scrollTop = 
        messagesCtrRef.current.scrollHeight - messagesCtrRef.current.offsetHeight - scrollFromBottom;
      }
      if(noMoreMessages){
        return;
      }
      const observer = new IntersectionObserver(
        (entries)=> entries.forEach(
            (entry)=> entry.isIntersecting && loadMoreMessages()
        ),
        {
            rootMargin: "0px 0px 250px 0px",
        }
      );
      if(loadMoreIntersect.current){
        setTimeout(()=>{
            observer.observe(loadMoreIntersect.current);
        },100);
      }
      return ()=>{
        observer.disconnect();
      };
    },[localMessages]);
    return (
        <>
        {!messages?(
            <div className="flex flex-col gap-8 items-center justify-center opacity-45">
                <p className="text-2xl md:text-4xl p-16 text-slate-200">select a conversation</p>
                <ChatBubbleLeftRightIcon className="size-32 inline-block text-slate-200" />
            </div>
        ):(
            <>
            <ConversationHeader 
            selectedConversation={selectedConversation}
            />
            <div ref={messagesCtrRef} className="flex-1 overflow-y-auto min-h-0 h-full">
              {localMessages.length === 0 ? (
                <div className="flex flex-col gap-8 items-center justify-center h-full opacity-45">
                    <p className="text-2xl md:text-4xl p-16 text-slate-200">No messages yet</p>
                    <ChatBubbleLeftRightIcon className="size-32 text-slate-200 inline-block" />
                </div>
              ) : 
               (
                 <div className="flex-1 space-y-3 scrollable_div">
                    <div ref={loadMoreIntersect}></div>
                    {localMessages.map((message) => (
                       <MessageItem key={message.id} message={message} attachmentClick={onAttachmentClick}/>
                    ))}
                 </div>
                
              )}
            </div>
            <MessageInput
                conversation={selectedConversation}
                messagesCtrRef={messagesCtrRef}
            />
            </>
        )}
        {previewAttachment.attachments &&(
            <PreviewAttachmentModal
              attachments={previewAttachment.attachments}
              index={previewAttachment.ind}
              show={showAttachmentPreview}
              onClose={()=>setShowAttachmentPreview(false)}
            />
        )}
        </> 
    );
}
Home.layout = (page) => (
    <AuthenticatedLayout
    >
      <ChatLayout>{page}</ChatLayout>  
    </AuthenticatedLayout>
);
export default Home;