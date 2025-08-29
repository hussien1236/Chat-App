<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function store(Request $request){
       $data = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255|unique:users,email',
        'is_admin' => 'sometimes|boolean',
       ]);
    //    $rawPassword = Str::random(8);
       $rawPassword = '12345678';
       $data['password'] = bcrypt($rawPassword);
       $data['email_verified_at'] = now();
       User::create($data);
       return redirect()->back();
    }
    public function changeRole(User $user){
        $user->update([
            'is_admin' => !$user->is_admin
        ]);
        $message = $user->is_admin ? 'User promoted to admin successfully.' : 'User demoted to regular user successfully.';
        return response()->json(['message' => $message]);
    }
    public function blockUnblock(User $user){
        if($user->blocked_at){
              $user->blocked_at = null;
                $user->save();
            $message = 'User unblocked successfully.';
        }else{
           $user->blocked_at = now();
           $user->save();            
            $message = 'User blocked successfully.';
        }
        return response()->json(['message' => $message]);
    }
}
