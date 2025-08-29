<?php

namespace App\Http\Controllers;

use App\Events\SocketMessage;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\User;
use Exception;
use Illuminate\Container\Attributes\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log as FacadesLog;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

use function Illuminate\Log\log;

class MessageController extends Controller
{
    public function byUser(User $user)
    {
       $messages = Message::where('sender_id', Auth::id())
            ->where('receiver_id', $user->id)
            ->orWhere('sender_id', $user->id)
            ->where('receiver_id', Auth::id())
            ->latest()
            ->paginate(10);

        return inertia('Home', [
            'selectedConversation' => $user->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }
    public function byGroup(Group $group)
    {
        $messages = Message::where('group_id', $group->id)
            ->latest()
            ->paginate(10);

        return inertia('Home', [
            'selectedConversation' => $group->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }
    public function loadOlder(Message $message)
    {
        if($message->group_id){
            $messages = Message::where('created_at', '<', $message->created_at)
                ->where('group_id', $message->group_id)
                ->latest()
                ->paginate(10);
        } else{
            $messages = Message::where('created_at', '<', $message->created_at)
                ->where(function ($query) use ($message) {
                    $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id)
                        ->orWhere('sender_id', $message->receiver_id)
                        ->where('receiver_id', $message->sender_id);
                })
                ->latest()
                ->paginate(10);
        }
        return MessageResource::collection($messages);
    }
    public function store(StoreMessageRequest $request)
    {  
        FacadesLog::info('Store method reached');
        FacadesLog::info($request);
        FacadesLog::info($request->validated());
         try{
        $data = $request->validated();
        $data['sender_id'] = Auth::id();
        $receiverId = $data['receiver_id'] ?? null;
        $groupId = $data['group_id'] ?? null;
        $files = $data['attachments'] ?? [];
        $message = Message::create($data) ?? FacadesLog::info('error occured when creating message');
        $attachments = [];
                    FacadesLog::info($files);
        if($files){
            FacadesLog::info("entered the file condition with ", $files);
            foreach ($files as $file) {
                $directory = 'attachments/' . Str::random(32);
                Storage::makeDirectory($directory);
                $model = [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory, 'public'),
                ];
                FacadesLog::info("model:",$model);
                $attachment = MessageAttachment::create($model);
                $attachments[] = $attachment;
            }
            $message->attachments = $attachments;
        }
                            FacadesLog::info('Store method before checking reciever id');
        if($receiverId){
            Conversation::updateConversationWithMessage($receiverId, Auth::id(), $message->id) ;
        }
                            FacadesLog::info('Store method before checking group id');
        if($groupId){
            Group::updateGroupWithMessage($groupId, $message->id);
        }
                            FacadesLog::info('Store method before dispatch');
        SocketMessage::dispatch($message);
                    FacadesLog::info('Store method ended');
        return new MessageResource($message);   
            }
            catch(Exception $ex){
            FacadesLog::info('Store method gives error');
    }
    }
    public function destroy(Message $message)
    {
        if($message->sender_id !== Auth::id()){
            return response()->json(['error' => 'Forbidden'], 403);
        }
        $group = null;
        $conversation = null;
        if($message->group_id){
            $group = Group::where('last_message_id',$message->id)->first();
        }else{
            $conversation = Conversation::where('last_message_id',$message->id)->first();
        }
        $message->delete();
        $lastMessage = null;
        if($group){
            //repopulate group
            $group = Group::find($group->id);
            $lastMessage = $group->lastMessage;
        }
        else if($conversation){
            $conversation = Conversation::find($conversation->id);
            $lastMessage = $conversation->lastMessage;
        }
        return response()->json(['message' => $lastMessage? new MessageResource($lastMessage): null]);
    }

}
