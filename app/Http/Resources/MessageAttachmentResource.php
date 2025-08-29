<?php

namespace App\Http\Resources;

use Illuminate\Container\Attributes\Storage;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage as FacadesStorage;

class MessageAttachmentResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'message_id' => $this->message_id,
            'name' => $this->name,
            'mime' => $this->mime,
            'size' => $this->size,
            'url' => FacadesStorage::url($this->path),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
