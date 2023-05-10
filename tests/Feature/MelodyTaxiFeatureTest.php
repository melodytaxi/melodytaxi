<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class MelodyTaxiFeatureTest extends TestCase
{
    public function getMeIdOfADriverByEmail($email)
    {
        return DB::table('drivers')->where('email', $email)->value('id');
    }

    /** @test */
    public function a_driver_can_be_created()
    {
        $this->withoutExceptionHandling();

        $driverData = ['name' => 'Hamza Gunduz', 'email' => 'hamzagunduz@protonmail.com', 'password' => 'Sifre123!', 'password_confirmation' => 'Sifre123!'];

        $response = $this->postJson('/api/signup', $driverData);

        $response->assertStatus(200);

        $this->assertDatabaseHas('drivers', ['name' => 'Hamza Gunduz', 'email' => 'hamzagunduz@protonmail.com']);
    }

    /** @test */
    public function a_driver_can_login()
    {
        $this->withoutExceptionHandling();

        $response = $this->post('/api/login', ['email' => 'hamzagunduz@protonmail.com', 'password' => 'Sifre123!',], ['Accept' => 'application/json']);

        $response->assertStatus(200);
    }


    /** @test */
    public function a_driver_can_be_deleted()
    {
        $this->withoutExceptionHandling();

        $response_to_login = $this->post('/api/login', ['email' => 'hamzagunduz@protonmail.com', 'password' => 'Sifre123!',], ['Accept' => 'application/json']);

        $response_to_login->assertStatus(200);

        $response = $this->delete("/api/drivers/" . $this->getMeIdOfADriverByEmail("hamzagunduz@protonmail.com"));

        $response->assertNoContent();

        $this->assertDatabaseMissing('drivers', ['id' => $this->getMeIdOfADriverByEmail("hamzagunduz@protonmail.com")]);
    }

}

