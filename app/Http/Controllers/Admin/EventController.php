<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EventRequest;
use App\Models\Event;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index()
    {
        $events = Event::withCount('products')
            ->orderBy('id')
            ->get()
            ->map(fn (Event $event) => [
                'id' => $event->id,
                'name' => $event->name,
                'slug' => $event->slug,
                'description' => $event->description,
                'productsCount' => $event->products_count,
            ]);

        return Inertia::render('admin/events/index', [
            'events' => $events,
        ]);
    }

    public function store(EventRequest $request)
    {
        Event::create($request->validated());

        return back()->with('success', 'Acara ditambahkan.');
    }

    public function update(EventRequest $request, Event $event)
    {
        $event->update([
            'name' => $request->validated('name'),
            'description' => $request->validated('description'),
        ]);

        return back()->with('success', 'Acara diperbarui.');
    }

    public function destroy(Event $event)
    {
        $event->products()->detach();
        $event->delete();

        return back()->with('success', 'Acara dihapus.');
    }
}
