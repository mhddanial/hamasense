<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create-admin 
                            {name : The name of the user}
                            {email : The email address of the user}
                            {password : The password for the user}
                            {--role=admin : The role of the user (default: admin)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new user account with admin role';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $name = $this->argument('name');
        $email = $this->argument('email');
        $password = $this->argument('password');
        $role = $this->option('role');

        // Check if user already exists
        if (User::where('email', $email)->exists()) {
            $this->error("User with email '{$email}' already exists!");
            return 1;
        }

        // Create the user
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => $password, // Will be auto-hashed by the model's casts
            'role' => $role,
            'email_verified_at' => now(),
        ]);

        $this->info("✅ User created successfully!");
        $this->table(
            ['ID', 'Name', 'Email', 'Role'],
            [[$user->id, $user->name, $user->email, $user->role]]
        );

        return 0;
    }
}
