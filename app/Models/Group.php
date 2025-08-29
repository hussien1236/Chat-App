<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'owner_id',
        'last_message_id'
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'group_users');
    }
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
    public function lastMessage(){
        return $this->belongsTo(Message::class,'last_message_id');
    }
    public function owner()
    {
        return $this->belongsTo(User::class);
    }
    public static function getGroupsForUser(User $user)
    {
       $user_id = $user->id;
       $query = Group::select(['groups.*', 'messages.message as last_message', 'messages.created_at as last_message_date'])
         ->join('group_users', 'group_users.group_id', '=', 'groups.id')
            ->leftJoin('messages', 'messages.id', '=', 'groups.last_message_id')
            ->where('group_users.user_id', '=', $user_id)
            ->orderBy('messages.created_at', 'desc')
            ->orderBy('groups.name');
        return $query->get();
    }
    public function toConversationArray()
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'is_group' => true,
            'owner_id' => $this->owner_id,
            'users' => $this->users,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'last_message' => $this->messages->last()->message ?? null,
            'last_message_date' => $this->messages->last()->created_at ?? null,
        ];
    }
    public static function updateGroupWithMessage($groupId, $messageId)
    {
        return self::updateOrCreate(
            ['id' => $groupId],
            ['last_message_id' => $messageId]
        );
    }
}
