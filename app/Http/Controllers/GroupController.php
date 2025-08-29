<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Jobs\DeleteGroupJob;
use Illuminate\Support\Facades\Auth;

class GroupController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGroupRequest $request)
    {
        $data = $request->validated();
        $userIds = $data['user_ids'] ?? [];
        $group = Group::create($data);
        $group->users()->attach(array_unique([$request->user()->id, ...$userIds]));
        return redirect()->back();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGroupRequest $request, Group $group)
    {
        $data = $request->validated();
        $userIds = $data['user_ids'] ?? [];
        $group->update($data);
        $group->users()->sync(array_unique([$group->owner_id, ...$userIds]));
        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Group $group)
    {
        if(Auth::id() !== $group->owner_id){
            abort(403, 'Unauthorized action.');
        }
        DeleteGroupJob::dispatch($group)->delay(now()->addSeconds(10));
        return response()->json([
            'message' => 'Group delete was scheduled and will be processed shortly.',
        ]);
    }
}
