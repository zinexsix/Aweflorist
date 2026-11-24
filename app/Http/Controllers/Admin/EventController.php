<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EventRequest;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(): Response
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

    public function store(EventRequest $request): RedirectResponse
    {
        Event::create($request->validated());

        return back()->with('success', 'Acara ditambahkan.');
    }

    public function update(
        EventRequest $request,
        Event $event
    ): RedirectResponse {
        $event->update([
            'name' => $request->validated('name'),
            'description' => $request->validated('description'),
        ]);

        return back()->with('success', 'Acara diperbarui.');
    }

    public function destroy(Event $event): RedirectResponse
    {
        $event->products()->detach();
        $event->delete();

        return back()->with('success', 'Acara dihapus.');
    }
}
