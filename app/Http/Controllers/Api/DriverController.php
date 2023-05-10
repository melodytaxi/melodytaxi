<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDriverRequest;
use App\Http\Requests\UpdateDriverRequest;
use App\Http\Resources\DriverResource;
use App\Models\Driver;

class DriverController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        return DriverResource::collection(Driver::query()->orderBy('id', 'desc')->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreDriverRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreDriverRequest $request)
    {
        $data = $request->validated();
        $data['password'] = bcrypt($data['password']);
        $driver = Driver::create($data);

        return response(new DriverResource($driver) , 201);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Driver $driver
     * @return \Illuminate\Http\Response
     */
    public function show(Driver $driver)
    {
        return new DriverResource($driver);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdateDriverRequest $request
     * @param \App\Models\Driver                     $driver
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateDriverRequest $request, Driver $driver)
    {
        $data = $request->validated();
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }
        $driver->update($data);

        return new DriverResource($driver);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Driver $driver
     * @return \Illuminate\Http\Response
     */
    public function destroy(Driver $driver)
    {
        $driver->delete();

        return response("", 204);
    }
}
