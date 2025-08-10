# .editorconfig

```
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 4
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_size = 2

[docker-compose.yml]
indent_size = 4

```

# .gitattributes

```
* text=auto eol=lf

*.blade.php diff=html
*.css diff=css
*.html diff=html
*.md diff=markdown
*.php diff=php

/.github export-ignore
CHANGELOG.md export-ignore
.styleci.yml export-ignore

```

# .gitignore

```
*.log
.DS_Store
.env
.env.backup
.env.production
.phpactor.json
.phpunit.result.cache
/.fleet
/.idea
/.nova
/.phpunit.cache
/.vscode
/.zed
/auth.json
/node_modules
/public/build
/public/hot
/public/storage
/storage/*.key
/storage/pail
/vendor
Homestead.json
Homestead.yaml
npm-debug.log
Thumbs.db
yarn-error.log

```

# app\Actions\Fortify\CreateNewUser.php

```php
<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
        ]);
    }
}

```

# app\Actions\Fortify\PasswordValidationRules.php

```php
<?php

namespace App\Actions\Fortify;

use Illuminate\Validation\Rules\Password;

trait PasswordValidationRules
{
    /**
     * Get the validation rules used to validate passwords.
     *
     * @return array<int, \Illuminate\Contracts\Validation\Rule|array<mixed>|string>
     */
    protected function passwordRules(): array
    {
        return ['required', 'string', Password::default(), 'confirmed'];
    }
}

```

# app\Actions\Fortify\ResetUserPassword.php

```php
<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\ResetsUserPasswords;

class ResetUserPassword implements ResetsUserPasswords
{
    use PasswordValidationRules;

    /**
     * Validate and reset the user's forgotten password.
     *
     * @param  array<string, string>  $input
     */
    public function reset(User $user, array $input): void
    {
        Validator::make($input, [
            'password' => $this->passwordRules(),
        ])->validate();

        $user->forceFill([
            'password' => Hash::make($input['password']),
        ])->save();
    }
}

```

# app\Actions\Fortify\UpdateUserPassword.php

```php
<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\UpdatesUserPasswords;

class UpdateUserPassword implements UpdatesUserPasswords
{
    use PasswordValidationRules;

    /**
     * Validate and update the user's password.
     *
     * @param  array<string, string>  $input
     */
    public function update(User $user, array $input): void
    {
        Validator::make($input, [
            'current_password' => ['required', 'string', 'current_password:web'],
            'password' => $this->passwordRules(),
        ], [
            'current_password.current_password' => __('The provided password does not match your current password.'),
        ])->validateWithBag('updatePassword');

        $user->forceFill([
            'password' => Hash::make($input['password']),
        ])->save();
    }
}

```

# app\Actions\Fortify\UpdateUserProfileInformation.php

```php
<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;

class UpdateUserProfileInformation implements UpdatesUserProfileInformation
{
    /**
     * Validate and update the given user's profile information.
     *
     * @param  array<string, string>  $input
     */
    public function update(User $user, array $input): void
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ])->validateWithBag('updateProfileInformation');

        if ($input['email'] !== $user->email &&
            $user instanceof MustVerifyEmail) {
            $this->updateVerifiedUser($user, $input);
        } else {
            $user->forceFill([
                'name' => $input['name'],
                'email' => $input['email'],
            ])->save();
        }
    }

  
    protected function updateVerifiedUser(User $user, array $input): void
    {
        $user->forceFill([
            'name' => $input['name'],
            'email' => $input['email'],
            'email_verified_at' => null,
        ])->save();

        $user->sendEmailVerificationNotification();
    }
}

```

# app\Http\Controllers\Auth\AuthenticatedSessionController.php

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Sponsor\BusinessInformation;
use App\Models\Sponsor\CompanyRepresentative;
use App\Models\Sponsor\ProjectUpload;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    // public function store(LoginRequest $request): Response
    // {
    //     $request->authenticate();

    //     $request->session()->regenerate();

    //     return response()->noContent();
    // }

    // public function store(LoginRequest $request): JsonResponse
    // {
    //     $request->authenticate();
        
    //     $user = Auth::user();
    //     $token = $user->createToken('auth_token')->plainTextToken;
        
    //     return response()->json([
    //         'message' => 'Login successful',
    //         'user' => $user,
    //         'token' => $token,
    //         'redirect_to' => $user->role === 'Investor' 
    //             ? env('FRONTEND_URL') . '/dashboard/investor'
    //             : env('FRONTEND_URL') . '/dashboard/sponsor'
    //     ]);
    // }

    public function store(LoginRequest $request): JsonResponse
    {
        try {
            $request->authenticate();

            $user = Auth::user();
            $token = $user->createToken('auth_token')->plainTextToken;

            $onboarding_stage = null;
            $current_step = null;
            $dashboard_path = null;
            if ($user->role === 'Sponsor') {
                $businessInfo = BusinessInformation::where('user_id', $user->id)->first();
                if (!$businessInfo || !$businessInfo->is_completed) {
                    $onboarding_stage = 'business_info';
                    $current_step = $businessInfo->current_step ?? 1;
                    $dashboard_path = '/dashboard/sponsor';
                } else {
                    $companyRep = CompanyRepresentative::where('user_id', $user->id)->first();
                    if (!$companyRep || !$companyRep->is_completed) {
                        $onboarding_stage = 'company_representative';
                        $current_step = $companyRep->current_step ?? 1;
                        $dashboard_path = '/dashboard/sponsor';
                    } else {
                        $projectUpload = ProjectUpload::where('user_id', $user->id)->first();
                        if (!$projectUpload) {
                            // No project exists yet, start at step 1
                            $onboarding_stage = 'project_upload';
                            $current_step = 1;
                            $dashboard_path = '/dashboard/sponsor';
                        } else if ($projectUpload->status === 'draft') {
                            // Project exists but not submitted (still in draft)
                            $onboarding_stage = 'project_upload';
                            $current_step = $projectUpload->current_step ?? 1;
                            $dashboard_path = '/dashboard/sponsor';
                        } else {
                            // Project is submitted (status is 'pending' or 'approved')
                            $onboarding_stage = 'completed';
                            $current_step = null;
                            $dashboard_path = '/dashboard/sponsor';
                        }
                    }
                }
            } else if ($user->role === 'Investor') {
                // Investors don't have onboarding, go directly to dashboard
                $onboarding_stage = null;
                $current_step = null;
                $dashboard_path = '/dashboard/investor';
            } else {
                // Any other role goes to home page
                $onboarding_stage = null;
                $current_step = null;
                $dashboard_path = '/';
            }

            return response()->json([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token,
                'onboarding_stage' => $onboarding_stage,
                'current_step' => $current_step,
                'dashboard_path' => $dashboard_path,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Login failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An unexpected error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    
    public function getOnboardingStatus(): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $onboarding_stage = null;
        $current_step = null;
        $dashboard_path = null;
        $form_data = []; // Add this to return existing form data

        if ($user->role === 'Sponsor') {
            $businessInfo = BusinessInformation::where('user_id', $user->id)->first();
            if (!$businessInfo || !$businessInfo->is_completed) {
                $onboarding_stage = 'business_info';
                $current_step = $businessInfo->current_step ?? 1;
                $dashboard_path = '/dashboard/sponsor';
                $form_data = $businessInfo ? $businessInfo->toArray() : [];
            } else {
                $companyRep = CompanyRepresentative::where('user_id', $user->id)->first();
                if (!$companyRep || !$companyRep->is_completed) {
                    $onboarding_stage = 'company_representative';
                    $current_step = $companyRep->current_step ?? 1;
                    $dashboard_path = '/dashboard/sponsor';
                    $form_data = $companyRep ? $companyRep->toArray() : [];
                } else {
                    $projectUpload = ProjectUpload::where('user_id', $user->id)->first();
                    if (!$projectUpload) {
                        // No project exists yet, start at step 1
                        $onboarding_stage = 'project_upload';
                        $current_step = 1;
                        $dashboard_path = '/dashboard/sponsor';
                        $form_data = [];
                    } else if ($projectUpload->status === 'draft') {
                        // Project exists but not submitted (still in draft)
                        $onboarding_stage = 'project_upload';
                        $current_step = $projectUpload->current_step ?? 1;
                        $dashboard_path = '/dashboard/sponsor';
                        $form_data = $projectUpload ? $projectUpload->toArray() : [];
                    } else {
                        // Project is submitted (status is 'pending' or 'approved')
                        $onboarding_stage = 'completed';
                        $current_step = null;
                        $dashboard_path = '/dashboard/sponsor';
                    }
                }
            }
        } else if ($user->role === 'Investor') {
            // Investors don't have onboarding
            $onboarding_stage = null;
            $current_step = null;
            $dashboard_path = '/dashboard/investor';
        } else {
            // Any other role
            $onboarding_stage = null;
            $current_step = null;
            $dashboard_path = '/';
        }

        return response()->json([
            'onboarding_stage' => $onboarding_stage,
            'current_step' => $current_step,
            'dashboard_path' => $dashboard_path,
            'form_data' => $form_data, // Include existing form data
        ]);
    }


    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}

```

# app\Http\Controllers\Auth\EmailVerificationNotificationController.php

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended('/dashboard');
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json(['status' => 'verification-link-sent']);
    }
}

```

# app\Http\Controllers\Auth\GoogleController.php

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleController extends Controller
{
    public function redirectToGoogle(Request $request)
    {
        $role = $request->query('role');

        if (!in_array($role, ['Investor', 'Sponsor'])) {
            return response()->json(['error' => 'Invalid role provided'], 400);
        }

        Session::put('google_role', $role); 

        return Socialite::driver('google')->stateless()->redirect();
    }
    public function handleGoogleCallback()
{
    try {
        $googleUser = Socialite::driver('google')->stateless()->user();

        $email = $googleUser->getEmail();
        $role = session()->pull('google_role'); 

        if (!in_array($role, ['Investor', 'Sponsor'])) {
            return redirect()->away('https://rc-brown-capital-frontend.vercel.app/error?reason=invalid-role');
        }

        $user = User::firstOrNew(['email' => $email]);

        if (!$user->exists) {
            // Register new user
            $user->firstname = $googleUser->user['given_name'] ?? 'First';
            $user->lastname = $googleUser->user['family_name'] ?? 'Last';
            $user->email = $email;
            $user->email_verified_at = now();
            $user->google_id = $googleUser->getId();
            $user->profile_image = $googleUser->getAvatar();
            $user->password = Hash::make(Str::random(16));
            $user->country = 'Unknown';
            $user->company_name = $role === 'Sponsor' ? 'Not provided' : null;
            $user->website = $role === 'Sponsor' ? 'https://' : null;
            $user->business_address = $role === 'Sponsor' ? 'Not provided' : null;
            $user->phone = null;
            $user->role = $role;
            $user->stage_completed = 1;

            $user->save();
        } else {
            $user->google_id = $googleUser->getId();
            $user->profile_image = $user->profile_image ?? $googleUser->getAvatar();
            $user->save();
        }

        // Generate Sanctum token
        $token = $user->createToken('google-token')->plainTextToken;

        // Prepare redirect URL based on role
        $dashboardUrl = $role === 'Sponsor'
            ? 'https://rc-brown-capital-frontend.vercel.app/sponsor/dashboard'
            : 'https://rc-brown-capital-frontend.vercel.app/investor/dashboard';

        // Append token and user ID/email for client-side auth handling
        $redirectWithParams = $dashboardUrl . '?' . http_build_query([
            'token' => $token,
            'user_id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
        ]);

        return redirect()->away($redirectWithParams);
    } catch (\Exception $e) {
        return redirect()->away('https://rc-brown-capital-frontend.vercel.app/error?reason=' . urlencode($e->getMessage()));
    }
    }

    // public function handleGoogleCallback()
    // {
    //     try {
    //         $googleUser = Socialite::driver('google')->stateless()->user();

    //         $email = $googleUser->getEmail();
    //         $role = Session::pull('google_role'); // get and remove from session

    //         if (!in_array($role, ['Investor', 'Sponsor'])) {
    //             return response()->json(['error' => 'Invalid or missing role'], 400);
    //         }

    //         $user = User::firstOrNew(['email' => $email]);

    //         if (!$user->exists) {
    //             // Register new user
    //             $user->firstname = $googleUser->user['given_name'] ?? 'First';
    //             $user->lastname = $googleUser->user['family_name'] ?? 'Last';
    //             $user->email = $email;
    //             $user->email_verified_at = now();
    //             $user->google_id = $googleUser->getId();
    //             $user->profile_image = $googleUser->getAvatar();
    //             $user->password = Hash::make(Str::random(16));
    //             $user->country = 'Unknown';
    //             $user->city = null;
    //             $user->postal_code = null;
    //             $user->company_name = $role === 'Sponsor' ? 'Not provided' : null;
    //             $user->website = $role === 'Sponsor' ? 'https://' : null;
    //             $user->business_address = $role === 'Sponsor' ? 'Not provided' : null;
    //             $user->phone = null;
    //             $user->role = $role;
    //             $user->stage_completed = 1;

    //             $user->save();
    //         } else {
    //             // Existing user login/update
    //             $user->google_id = $googleUser->getId();
    //             if (!$user->profile_image) {
    //                 $user->profile_image = $googleUser->getAvatar();
    //             }
    //             $user->save();
    //         }

    //         $token = $user->createToken('google-token')->plainTextToken;

    //         return response()->json([
    //             'message' => 'Login/Register successful via Google',
    //             'user' => $user,
    //             'token' => $token
    //         ]);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'error' => 'Google login failed',
    //             'details' => $e->getMessage()
    //         ], 500);
    //     }
    // }

    // IF THE FRONTEND DASHBOARD IS READY, USE THE ONE BELOW

    

}

```

# app\Http\Controllers\Auth\NewPasswordController.php

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;

class NewPasswordController extends Controller
{
    public function store(Request $request): JsonResponse
        {
            // Validate input
            $validated = $request->validate([
                'token' => ['required'],
                'email' => ['required', 'email'],
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ]);

            // Attempt to reset password
            $status = Password::reset(
                $validated,
                function ($user) use ($validated) {
                    $user->forceFill([
                        'password' => Hash::make($validated['password']),
                        'remember_token' => Str::random(60),
                    ])->save();

                    event(new PasswordReset($user));
                }
            );

            // Handle failure
            if ($status !== Password::PASSWORD_RESET) {
                return response()->json([
                    'message' => 'Password reset failed',
                    'errors' => [
                        'email' => [trans($status)]
                    ]
                ], 422);
            }

            // Success response
            return response()->json([
                'message' => 'Password reset successful',
                'status' => trans($status),
            ], 200);
        }
}

```

# app\Http\Controllers\Auth\PasswordResetLinkController.php

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class PasswordResetLinkController extends Controller
{
       public function store(Request $request): JsonResponse
    {
        // Validate email format
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Attempt to send reset link
        $status = Password::sendResetLink(
            ['email' => $validated['email']]
        );

        // Handle failure
        if ($status !== Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Failed to send reset link',
                'errors' => [
                    'email' => [trans($status)]
                ]
            ], 422);
        }

        // Handle success
        return response()->json([
            'message' => 'Password reset link sent successfully',
            'status' => trans($status),
        ], 200);
    }
}

```

# app\Http\Controllers\Auth\RegisteredUserController.php

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rules\Password;

class RegisteredUserController extends Controller
{
    // public function store(Request $request): Response
    // {
    //     $request->validate([
    //         'name' => ['required', 'string', 'max:255'],
    //         'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
    //         'password' => ['required', 'confirmed', Rules\Password::defaults()],
    //     ]);

    //     $user = User::create([
    //         'name' => $request->name,
    //         'email' => $request->email,
    //         'password' => Hash::make($request->string('password')),
    //     ]);

    //     event(new Registered($user));

    //     Auth::login($user);

    //     return response()->noContent();
    // }

    public function registerInvestor(Request $request)
    {
        try {
            $validated = $request->validate([
                'firstname' => 'required|string|max:255',
                'lastname' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'country' => 'required|string|max:100',
                'phone' => 'required|string|max:20',
                'password' => ['required', 'confirmed', Password::defaults()],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        $user = User::create([
            'firstname' => $validated['firstname'],
            'lastname' => $validated['lastname'],
            'email' => $validated['email'],
            'country' => $validated['country'],
            'phone' => $validated['phone'],
            'role' => 'Investor',
            'password' => Hash::make($validated['password']),
            'accepted_terms_at' => now(),
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Investor registered successfully',
            'user' => [
                'id' => $user->id,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'email' => $user->email,
                'country' => $user->country,
                'phone' => $user->phone,
                'role' => $user->role,
            ],
            'token' => $token,
            'redirect_to' => env('FRONTEND_URL') . '/dashboard/investor'
        ], 201);
    }

    public function registerSponsor(Request $request)
    {
        try {
            $validated = $request->validate([
                'firstname' => 'required|string|max:255',
                'lastname' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'company_name' => 'required|string|max:255',
                // 'website' => 'required|url|max:255',
                   'website' => [
    'nullable',
    'regex:/^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/',
    'max:255'
],
                'country' => 'required|string|max:100',
                'phone' => 'required|string|max:20',
                'password' => ['required', 'confirmed', Password::defaults()],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }

        $user = User::create([
            'firstname' => $validated['firstname'],
            'lastname' => $validated['lastname'],
            'email' => $validated['email'],
            'company_name' => $validated['company_name'],
            'website' => $validated['website'],
            'country' => $validated['country'],
            'phone' => $validated['phone'],
            'role' => 'Sponsor',
            'password' => Hash::make($validated['password']),
            'stage_completed' => 1,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Sponsor registered successfully',
            'user' => [
                'id' => $user->id,
                'firstname' => $user->firstname,
                'lastname' => $user->lastname,
                'email' => $user->email,
                'company_name' => $user->company_name,
                'website' => $user->website,
                'country' => $user->country,
                'phone' => $user->phone,
                'role' => $user->role,
            ],
            'token' => $token,
            'redirect_to' => env('FRONTEND_URL') . '/dashboard/sponsor'
        ], 201);
    }

}

```

# app\Http\Controllers\Auth\TwoFactorAuthenticationController.php

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Actions\DisableTwoFactorAuthentication;
use Laravel\Fortify\Actions\EnableTwoFactorAuthentication;
use Laravel\Fortify\Actions\GenerateNewRecoveryCodes;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\Actions\VerifyTwoFactorCode;

class TwoFactorAuthenticationController extends Controller
{
    public function store(Request $request, EnableTwoFactorAuthentication $enable): JsonResponse
    {
        // Check if 2FA is enabled in Fortify config
        if (! Features::canManageTwoFactorAuthentication()) {
            abort(403, 'Two factor authentication is not enabled.');
        }

        $user = $request->user();

        // Enable 2FA
        $enable($user);

        return response()->json([
            'success' => true,
            'message' => 'Two factor authentication has been enabled.',
            'data' => [
                'qr_code_svg' => $user->twoFactorQrCodeSvg(),
                'recovery_codes' => $user->recoveryCodes(),
            ]
        ]);
    }

    public function destroy(Request $request, DisableTwoFactorAuthentication $disable): JsonResponse
    {
        // Check if 2FA is enabled in Fortify config
        if (! Features::canManageTwoFactorAuthentication()) {
            abort(403, 'Two factor authentication is not enabled.');
        }

        $disable($request->user());

        return response()->json([
            'success' => true,
            'message' => 'Two factor authentication has been disabled.'
        ]);
    }

    
    public function show(Request $request): JsonResponse
    {
        // Check if 2FA is enabled in Fortify config
        if (! Features::canManageTwoFactorAuthentication()) {
            abort(403, 'Two factor authentication is not enabled.');
        }

        $user = $request->user();

        if (is_null($user->two_factor_secret)) {
            abort(403, 'Two factor authentication is not enabled for this user.');
        }

        return response()->json([
            'success' => true,
            'data' => [
                'qr_code_svg' => $user->twoFactorQrCodeSvg(),
                'recovery_codes' => $user->recoveryCodes(),
            ]
        ]);
    }

    /**
     * Generate new recovery codes for the user.
     */
    public function update(Request $request, GenerateNewRecoveryCodes $generate): JsonResponse
    {
        // Check if 2FA is enabled in Fortify config
        if (! Features::canManageTwoFactorAuthentication()) {
            abort(403, 'Two factor authentication is not enabled.');
        }

        $generate($request->user());

        return response()->json([
            'success' => true,
            'message' => 'Recovery codes generated successfully.',
            'data' => [
                'recovery_codes' => $request->user()->recoveryCodes()
            ]
        ]);
    }

   
    // public function verify(Request $request): JsonResponse
    // {
    //     $request->validate([
    //         'code' => 'required|string',
    //     ]);

    //     $user = $request->user();

    //     if (is_null($user->two_factor_secret)) {
    //         abort(403, 'Two factor authentication is not enabled for this user.');
    //     }

    //     if (Fortify::verifyTwoFactorCode($user, $request->code)) {
    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Two factor authentication code verified.'
    //         ]);
    //     }

    //     return response()->json([
    //         'success' => false,
    //         'message' => 'Invalid two factor authentication code.'
    //     ], 422);
    // }

    /**
 * Verify the two factor authentication code.
 */
    public function verify(Request $request): JsonResponse
    {
        $request->validate([
            'code' => 'required|string',
        ]);

        $user = $request->user();

        if (is_null($user->two_factor_secret)) {
            return response()->json([
                'success' => false,
                'message' => 'Two factor authentication is not enabled for this user.'
            ], 403);
        }

        // Use Fortify's built-in verification
        $valid = VerifyTwoFactorCode::class(
            $user,
            $request->code
        );

        if ($valid) {
            // Mark 2FA as confirmed if not already
            if (is_null($user->two_factor_confirmed_at)) {
                $user->forceFill([
                    'two_factor_confirmed_at' => now(),
                ])->save();
            }

            return response()->json([
                'success' => true,
                'message' => 'Two factor authentication code verified.'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid two factor authentication code.'
        ], 422);
    }
}

```

# app\Http\Controllers\Auth\UserProfileController.php

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

   
    public function updateBasicInfo(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'firstname' => 'sometimes|string|max:255',
            'lastname' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,'.$user->id,
            'phone' => 'sometimes|nullable|string|max:20',
            'country' => 'sometimes|string|max:255',
            'city' => 'sometimes|nullable|string|max:255',
            'postal_code' => 'sometimes|nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'data' => $user
        ]);
    }

  
    public function updateProfileImage(Request $request)
    {
        $request->validate([
            'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $user = Auth::user();

        // Delete old image if exists
        if ($user->profile_image) {
            Storage::delete('public/profile_images/'.$user->profile_image);
        }

        // Store new image
        $imageName = time().'.'.$request->profile_image->extension();
        $request->profile_image->storeAs('public/profile_images', $imageName);

        $user->profile_image = $imageName;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Profile image updated successfully',
            'data' => [
                'profile_image_url' => asset('storage/profile_images/'.$imageName)
            ]
        ]);
    }


    public function deleteProfileImage()
    {
        $user = Auth::user();

        if ($user->profile_image) {
            Storage::delete('public/profile_images/'.$user->profile_image);
            $user->profile_image = null;
            $user->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Profile image removed successfully'
        ]);
    }
}

```

# app\Http\Controllers\Auth\VerifyEmailController.php

```php
<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(
                config('app.frontend_url').'/dashboard?verified=1'
            );
        }

        if ($request->user()->markEmailAsVerified()) {
            event(new Verified($request->user()));
        }

        return redirect()->intended(
            config('app.frontend_url').'/dashboard?verified=1'
        );
    }
}

```

# app\Http\Controllers\Controller.php

```php
<?php

namespace App\Http\Controllers;

abstract class Controller
{
    //
}

```

# app\Http\Controllers\Sponsor\BusinessInformationController.php

```php
<?php

namespace App\Http\Controllers\Sponsor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sponsor\BusinessInformation;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;


class BusinessInformationController extends Controller
{

    public function store(Request $request): JsonResponse
    {
        // Normalize terms_accepted for boolean validation
        if ($request->has('terms_accepted')) {
            $val = $request->input('terms_accepted');
            if ($val === 'true' || $val === true || $val === 1 || $val === '1') {
                $request->merge(['terms_accepted' => 1]);
            } elseif ($val === 'false' || $val === false || $val === 0 || $val === '0') {
                $request->merge(['terms_accepted' => 0]);
            }
        }
        try {
            $validated = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,id',
                'preferred_currency' => 'nullable|string',
                'business_type' => 'nullable|string',
                'years_in_business' => 'nullable|string',

                'company_history' => 'nullable|json',
                'company_history_text' => 'nullable|string',
                'company_history_file' => 'nullable|file|mimes:png,jpg,jpeg,pdf,doc,docx|max:2048',

                'primary_focus' => 'nullable|array',

                'project_details' => 'nullable|array',
                'project_details.*.project_name' => 'required_with:project_details|string',
                'project_details.*.project_type' => 'nullable|string',
                'project_details.*.address' => 'nullable|string',
                'project_details.*.project_size' => 'nullable|string',
                'project_details.*.total_cost' => 'nullable|string',
                'project_details.*.start_date' => 'nullable|date',
                'project_details.*.end_date' => 'nullable|date',
                'project_details.*.attachments' => 'nullable|array',

                'average_roi' => 'nullable|string',
                'projected_completion_time' => 'nullable|json',
                'actual_completion_time' => 'nullable|string',

                'funding_structure' => [
                    'nullable',
                    function ($attribute, $value, $fail) {
                        if (!is_string($value) && !is_array($value)) {
                            $fail('The '.$attribute.' must be a string or an object.');
                        }
                        if (is_string($value)) {
                            $decoded = json_decode($value, true);
                            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                                return;
                            }
                        }
                    }
                ],
                'exit_strategy' => [
                    'nullable',
                    function ($attribute, $value, $fail) {
                        if (!is_string($value) && !is_array($value)) {
                            $fail('The '.$attribute.' must be a string or an object.');
                        }
                        if (is_string($value)) {
                            $decoded = json_decode($value, true);
                            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                                return;
                            }
                        }
                    }
                ],
                'investment_currency' => 'nullable|string',
                'investment_size_range' => 'nullable|string',
                'raised_capital_before' => 'nullable|boolean',
                'investor_relationship' => [
                    'nullable',
                    function ($attribute, $value, $fail) {
                        if (!is_string($value) && !is_array($value)) {
                            $fail('The '.$attribute.' must be a string or an object.');
                        }
                        if (is_string($value)) {
                            $decoded = json_decode($value, true);
                            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                                return;
                            }
                        }
                    }
                ],
                'issues_with_payments' => 'nullable|boolean',
                'payment_issues_details' => 'nullable|string',

                'over_budget_projects' => 'nullable|boolean',
                'over_budget_handling' => 'nullable|string',
                'capital_percentage' => 'nullable|string',
                'interested_investment_types' => [
                    'nullable',
                    function ($attribute, $value, $fail) {
                        if (!is_string($value) && !is_array($value)) {
                            $fail('The '.$attribute.' must be a string or an object.');
                        }
                        if (is_string($value)) {
                            $decoded = json_decode($value, true);
                            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                                return;
                            }
                        }
                    }
                ],
                'legal_issues' => 'nullable|boolean',
                'legal_issues_details' => 'nullable|string',
                'compliance_details' => 'nullable|string',

                'update_frequency' => 'nullable|string',
                'social_links' => 'nullable|json',
                'supporting_documents' => 'nullable|array',
                'supporting_documents.*' => 'array', 
                'supporting_documents.*.*' => 'file|mimes:pdf,jpeg,png,jpg,doc,docx|max:5120',

                'references' => 'nullable|array|min:2',
                'references.*.name' => 'required|string',
                'references.*.relationship' => 'required|string',
                'references.*.contact_info' => 'required|string',
                'references.*.testimonial.type' => 'required|in:link,file',
                'references.*.testimonial.value' => 'required',

                'terms_accepted' => 'required|boolean',
                'is_draft' => 'boolean',
            ])->validate();

            // Handle "Other" validation for funding_structure
            if (
                isset($validated['funding_structure']['type']) &&
                $validated['funding_structure']['type'] === 'Other' &&
                empty($validated['funding_structure']['custom'])
            ) {
                return response()->json([
                    'status' => false,
                    'message' => 'Please specify the custom funding structure.'
                ], 422);
            }

            // Handle "Other" validation for exit_strategy
            if (
                isset($validated['exit_strategy']['type']) &&
                $validated['exit_strategy']['type'] === 'Other' &&
                empty($validated['exit_strategy']['custom'])
            ) {
                return response()->json([
                    'status' => false,
                    'message' => 'Please specify the custom exit strategy.'
                ], 422);
            }

            // Handle "Other" validation for interested_investment_types
             if (
                isset($validated['interested_investment_types']['options']) &&
                in_array('Other', $validated['interested_investment_types']['options']) &&
                empty($validated['interested_investment_types']['custom'])
            ) {
                return response()->json([
                    'status' => false,
                    'message' => 'Please specify the custom investment type when selecting "Other".'
                ], 422);
            }

            // Normalize funding_structure, exit_strategy, investor_relationship
            foreach (["funding_structure", "exit_strategy", "investor_relationship"] as $field) {
                if (isset($validated[$field])) {
                    if (is_string($validated[$field])) {
                        $decoded = json_decode($validated[$field], true);
                        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                            $validated[$field] = $decoded;
                        }
                    }
                }
            }

            // Normalize interested_investment_types in store
            if (isset($validated['interested_investment_types'])) {
                if (is_string($validated['interested_investment_types'])) {
                    $decoded = json_decode($validated['interested_investment_types'], true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        $validated['interested_investment_types'] = $decoded;
                    }
                }
            }

            // Save uploaded file if exists
            if ($request->hasFile('company_history_file')) {
                $path = $request->file('company_history_file')->store('uploads/company_history', 'public');
                $validated['company_history_file_path'] = $path;
            }

            // 📁 Handle file uploads for references testimonial (type = file)
            if (!empty($validated['references'])) {
                foreach ($validated['references'] as $index => &$reference) {
                    if ($reference['testimonial']['type'] === 'file' && $request->hasFile("references.$index.testimonial.value")) {
                        $filePath = $request->file("references.$index.testimonial.value")->store("uploads/references", "public");
                        $reference['testimonial']['value'] = $filePath;
                    }
                }
            }

            // 📁 Handle supporting_documents file uploads
            $uploadedDocuments = [];
            if ($request->has('supporting_documents')) {
                foreach ($request->file('supporting_documents', []) as $docType => $files) {
                    $uploadedDocuments[$docType] = [];
                    foreach ($files as $file) {
                        $uploadedDocuments[$docType][] = $file->store("uploads/supporting_documents/$docType", 'public');
                    }
                }
            }

            $validated['references'] ??= null;
            $validated['supporting_documents'] = $uploadedDocuments ?: null;

            $info = BusinessInformation::updateOrCreate(
                ['user_id' => $request->user_id],
                $validated
            );

            return response()->json([
                'status' => true,
                'message' => $validated['is_draft'] ?? false ? 'Draft saved successfully.' : 'Form submitted successfully.',
                'data' => $info
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function saveStep(Request $request, $step): JsonResponse
    {
        // Normalize terms_accepted for boolean validation
        if ($request->has('terms_accepted')) {
            $val = $request->input('terms_accepted');
            if ($val === 'true' || $val === true || $val === 1 || $val === '1') {
                $request->merge(['terms_accepted' => 1]);
            } elseif ($val === 'false' || $val === false || $val === 0 || $val === '0') {
                $request->merge(['terms_accepted' => 0]);
            }
        }
        $user = $request->user();
        $step = (int) $step;
        $rules = [];
        if ($step === 1) {
            $rules = [
                'preferred_currency' => 'required|string',
                'business_type' => 'required|string',
                'years_in_business' => 'required|string',
                'company_history_text' => 'nullable|string',
                'company_history_file' => 'nullable|file|mimes:png,jpg,jpeg,pdf,doc,docx|max:2048',
                'primary_focus' => 'nullable|array',
            ];
        } elseif ($step === 2) {
            $rules = [
                'project_details' => 'required|array',
                'average_roi' => 'nullable|string',
                'projected_completion_time' => 'nullable|string',
                'actual_completion_time' => 'nullable|string',
            ];
        } elseif ($step === 3) {
            $rules = [
                'funding_structure' => [
                    'nullable',
                    function ($attribute, $value, $fail) {
                        if (!is_string($value) && !is_array($value)) {
                            $fail('The '.$attribute.' must be a string or an object.');
                        }
                        if (is_string($value)) {
                            $decoded = json_decode($value, true);
                            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                                return;
                            }
                        }
                    }
                ],
                'exit_strategy' => [
                    'nullable',
                    function ($attribute, $value, $fail) {
                        if (!is_string($value) && !is_array($value)) {
                            $fail('The '.$attribute.' must be a string or an object.');
                        }
                        if (is_string($value)) {
                            $decoded = json_decode($value, true);
                            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                                return;
                            }
                        }
                    }
                ],
                'investment_currency' => 'nullable|string',
                'investment_size_range' => 'nullable|string',
                'raised_capital_before' => 'nullable|boolean',
                'investor_relationship' => [
                    'nullable',
                    function ($attribute, $value, $fail) {
                        if (!is_string($value) && !is_array($value)) {
                            $fail('The '.$attribute.' must be a string or an object.');
                        }
                        if (is_string($value)) {
                            $decoded = json_decode($value, true);
                            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                                return;
                            }
                        }
                    }
                ],
                'issues_with_payments' => 'nullable|boolean',
                'payment_issues_details' => 'nullable|string',
            ];
        } elseif ($step === 4) {
            $rules = [
                'over_budget_projects' => 'nullable|boolean',
                'over_budget_handling' => 'nullable|string',
                'capital_percentage' => 'nullable|string',
                'interested_investment_types' => [
                    'nullable',
                    function ($attribute, $value, $fail) {
                        if (!is_string($value) && !is_array($value)) {
                            $fail('The '.$attribute.' must be a string or an object.');
                        }
                        if (is_string($value)) {
                            $decoded = json_decode($value, true);
                            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                                return;
                            }
                        }
                    }
                ],
                'legal_issues' => 'nullable|boolean',
                'legal_issues_details' => 'nullable|string',
                'compliance_details' => 'nullable|string',
            ];
        } elseif ($step === 5) {
            $rules = [
                'update_frequency' => 'nullable|string',
                'social_links' => 'nullable|json',
                'supporting_documents' => 'nullable|array',
                'references' => 'nullable|array',
                'terms_accepted' => 'required|boolean',
            ];
        }
        $validated = Validator::make($request->all(), $rules)->validate();
        $validated['user_id'] = $user->id;
        // Normalize funding_structure, exit_strategy, investor_relationship in saveStep
        foreach (["funding_structure", "exit_strategy", "investor_relationship"] as $field) {
            if (isset($validated[$field])) {
                if (is_string($validated[$field])) {
                    $decoded = json_decode($validated[$field], true);
                    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                        $validated[$field] = $decoded;
                    }
                }
            }
        }
        // Normalize interested_investment_types in saveStep
        if (isset($validated['interested_investment_types'])) {
            if (is_string($validated['interested_investment_types'])) {
                $decoded = json_decode($validated['interested_investment_types'], true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $validated['interested_investment_types'] = $decoded;
                }
            }
        }
        $info = BusinessInformation::updateOrCreate(
            ['user_id' => $user->id],
            array_merge($validated, [
                'current_step' => $step,
                'is_draft' => true,
            ])
        );
        // Update completed_steps
        $completed = $info->completed_steps ?? [];
        if (!in_array($step, $completed)) {
            $completed[] = $step;
        }
        // Remove steps greater than the current step (if user goes back and edits)
        $completed = array_filter($completed, function($s) use ($step) { return $s <= $step; });
        sort($completed);
        $info->completed_steps = array_values($completed);
        $info->save();
        return response()->json([
            'status' => true,
            'message' => "Step $step saved successfully.",
            'current_step' => $info->current_step,
            'completed_steps' => $info->completed_steps,
            'is_draft' => $info->is_draft,
            'data' => $info
        ]);
    }

}

```

# app\Http\Controllers\Sponsor\CompanyRepresentativeController.php

```php
<?php

namespace App\Http\Controllers\Sponsor;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sponsor\CompanyRepresentative;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;


class CompanyRepresentativeController extends Controller
{
  public function store(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $country = $user->country ?? 'N/A';

            // Normalize terms_accepted for boolean validation
            if ($request->has('terms_accepted')) {
                $val = $request->input('terms_accepted');
                if ($val === 'true' || $val === true || $val === 1 || $val === '1') {
                    $request->merge(['terms_accepted' => 1]);
                } elseif ($val === 'false' || $val === false || $val === 0 || $val === '0') {
                    $request->merge(['terms_accepted' => 0]);
                }
            }

            $rules = [
                'relationship' => 'required|string',
                'first_name' => 'required|string',
                'last_name' => 'required|string',
                'identification_type' => 'required|string',

                'bvn' => $country === 'Nigeria' ? 'required|string' : 'nullable|string',
                'nin' => $country === 'Nigeria' ? 'required|string' : 'nullable|string',
                'social_security_number' => $country === 'USA' ? 'required|string' : 'nullable|string',

                'address' => 'required|string',

                'utility_bill' => 'nullable|file|mimes:png,jpeg,jpg,pdf|max:2048',
                'facial_capture' => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov,webm|max:5120',
                'facial_capture_status' => 'nullable|in:pass,fail,not_attempted',

                'bank_name' => 'nullable|string',
                'bank_branch' => 'nullable|string',
                'account_name' => 'nullable|string',
                'account_number' => 'nullable|string',
                'swift_code' => 'nullable|string',
                'sort_code' => 'nullable|string',
                'iban' => 'nullable|string',
                'routing_number' => 'nullable|string',
                'account_currency' => 'nullable|string',

                'terms_accepted' => 'required|boolean',
                'is_draft' => 'boolean',
            ];

            $validated = Validator::make($request->all(), $rules)->validate();

            if ($request->hasFile('utility_bill')) {
                $validated['utility_bill'] = $request->file('utility_bill')->store('uploads/utility_bills', 'public');
            }

            if ($request->hasFile('facial_capture')) {
                $validated['facial_capture'] = $request->file('facial_capture')->store('uploads/facial_captures', 'public');
            }

            $validated['facial_capture_status'] = $request->input('facial_capture_status', 'not_attempted');
            $validated['user_id'] = $user->id;
            $validated['is_completed'] = !$request->boolean('is_draft');

            $representative = CompanyRepresentative::updateOrCreate(
                ['user_id' => $user->id],
                $validated
            );

            return response()->json([
                'status' => true,
                'message' => $request->boolean('is_draft') ? 'Draft saved successfully.' : 'Company representative details submitted successfully.',
                'data' => $representative
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => false,
                'message' => 'An error occurred.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function saveStep(Request $request, $step): JsonResponse
    {
        $user = $request->user();
        $step = (int) $step;
        $rules = [];
        if ($step === 1) {
            $rules = [
                'relationship' => 'required|string',
                'first_name' => 'required|string',
                'last_name' => 'required|string',
                'identification_type' => 'required|string',
                'bvn' => 'nullable|string',
                'nin' => 'nullable|string',
                'social_security_number' => 'nullable|string',
                'address' => 'required|string',
                'utility_bill' => 'nullable|file|mimes:png,jpeg,jpg,pdf|max:2048',
                'facial_capture' => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov,webm|max:5120',
                'facial_capture_status' => 'nullable|in:pass,fail,not_attempted',
            ];
        } elseif ($step === 2) {
            $rules = [
                'bank_name' => 'required|string',
                'bank_branch' => 'nullable|string',
                // 'account_name' => 'required|string',
                'account_number' => 'required|string',
                'swift_code' => 'required|string',
                'sort_code' => 'required|string',
                'iban' => 'required|string',
                'routing_number' => 'required|string',
                'account_currency' => 'required|string',
                'terms_accepted' => 'required|boolean',
            ];
        }
        $validated = Validator::make($request->all(), $rules)->validate();
        $validated['user_id'] = $user->id;
        
        // Normalize terms_accepted for boolean validation
        if ($request->has('terms_accepted')) {
            $val = $request->input('terms_accepted');
            if ($val === 'true' || $val === true || $val === 1 || $val === '1') {
                $request->merge(['terms_accepted' => 1]);
            } elseif ($val === 'false' || $val === false || $val === 0 || $val === '0') {
                $request->merge(['terms_accepted' => 0]);
            }
        }

        // Handle file uploads
        if ($request->hasFile('utility_bill')) {
            $validated['utility_bill'] = $request->file('utility_bill')->store('uploads/utility_bills', 'public');
        }
        if ($request->hasFile('facial_capture')) {
            $validated['facial_capture'] = $request->file('facial_capture')->store('uploads/facial_captures', 'public');
        }
        
        $rep = CompanyRepresentative::updateOrCreate(
            ['user_id' => $user->id],
            array_merge($validated, [
                'current_step' => $step,
                'is_completed' => false,
            ])
        );
        // Update completed_steps
        $completed = $rep->completed_steps ?? [];
        if (!in_array($step, $completed)) {
            $completed[] = $step;
        }
        // Remove steps greater than the current step (if user goes back and edits)
        $completed = array_filter($completed, function($s) use ($step) { return $s <= $step; });
        sort($completed);
        $rep->completed_steps = array_values($completed);
        $rep->save();
        return response()->json([
            'status' => true,
            'message' => "Step $step saved successfully.",
            'current_step' => $rep->current_step,
            'completed_steps' => $rep->completed_steps,
            'is_completed' => $rep->is_completed,
            'data' => $rep
        ]);
    }
}

```

# app\Http\Controllers\Sponsor\ProjectUploadController.php

```php
<?php

namespace App\Http\Controllers\Sponsor;

use App\Http\Controllers\Controller;
use App\Models\Sponsor\ProjectUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Validator;


class ProjectUploadController extends Controller
{
   // Get all projects for the authenticated sponsor
    public function index()
    {
        $projects = ProjectUpload::where('sponsor_id', Auth::id())
            ->with([
                'businessPlanRatings',
                'dealSnapshots',
                'riskConsiderations',
                'physicalDescriptions',
                'documents'
            ])
            ->get();
            
        return response()->json($projects);
    }

    // Create a new project (just initialize with step 1)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'currency' => 'required|string',
            'sponsor_name' => 'required|string|max:255',
            'sponsor_logo' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $project = new ProjectUpload();
        $project->sponsor_id = Auth::id();
        $project->currency = $request->currency;
        $project->sponsor_name = $request->sponsor_name;
        $project->status = 'draft';
        $project->current_step = 1;
        $project->completed_steps = json_encode([]);

        if ($request->hasFile('sponsor_logo')) {
            $path = $request->file('sponsor_logo')->store('sponsor_logos', 'public');
            $project->sponsor_logo_path = $path;
        }

        // Pre-fill RC Brown Capital offerings count
        $project->rc_brown_capital_offerings = ProjectUpload::where('sponsor_id', Auth::id())->count();

        $project->save();

        return response()->json([
            'message' => 'Project created successfully',
            'project' => $project
        ], 201);
    }

    // Save data for a specific step
    public function saveStep(Request $request, ProjectUpload $project, $step)
    {
        // Verify project belongs to user
        if ($project->sponsor_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Don't allow saving if project is already submitted
        if ($project->status !== 'draft') {
            return response()->json(['message' => 'Project already submitted'], 400);
        }

        $step = (int) $step;
        try {
            DB::beginTransaction();

            switch ($step) {
                case 1: $this->saveStep1($request, $project); break;
                case 2: $this->saveStep2($request, $project); break;
                case 3: $this->saveStep3($request, $project); break;
                case 4: $this->saveStep4($request, $project); break;
                case 5: $this->saveStep5($request, $project); break;
                case 6: $this->saveStep6($request, $project); break;
                case 7: $this->saveStep7($request, $project); break;
                case 8: $this->saveStep8($request, $project); break;
                case 9: $this->saveStep9($request, $project); break;
                case 10: $this->saveStep10($request, $project); break;
                default:
                    return response()->json(['message' => 'Invalid step'], 400);
            }

            // Update completed steps
            $completedSteps = json_decode($project->completed_steps, true) ?: [];
            if (!in_array($step, $completedSteps)) {
                $completedSteps[] = $step;
            }
            // Do NOT remove steps greater than the current step; let frontend handle navigation
            sort($completedSteps);
            $project->completed_steps = json_encode(array_values($completedSteps));

            // Set current_step to the step just saved
            $project->current_step = $step;
            $project->save();

            DB::commit();

            return response()->json([
                'message' => 'Step ' . $step . ' saved successfully',
                'current_step' => $project->current_step,
                'completed_steps' => $completedSteps,
                'status' => $project->status,
                'project' => $project
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error saving step: ' . $e->getMessage()], 500);
        }
    }

    public function saveStep1(Request $request, ProjectUpload $project)
    {
        $validator = Validator::make($request->all(), [
            'currency' => 'required|in:NGN,USD',
            'sponsor_name' => 'required|string|max:255',
            'sponsor_logo' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }

        $project->currency = $request->currency;
        $project->sponsor_name = $request->sponsor_name;

        if ($request->hasFile('sponsor_logo')) {
            $path = $request->file('sponsor_logo')->store('sponsor_logos', 'public');
            $project->sponsor_logo_path = $path;
        }

        $project->save();
    }

    public function saveStep2(Request $request, ProjectUpload $project)
    {
    try {
        $validator = Validator::make($request->all(), [
            'project_name' => 'required|string|max:255',
            'project_subtitle' => 'nullable|string|max:255',
            'project_summary' => 'required|string',
            'years_of_active_operation' => 'required|string',
            'historical_portfolio_activity' => 'required|string',
            'assets_under_management' => 'required|string',
            'realized_projects' => 'required|integer|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        $project->update([
            'project_name' => $request->project_name,
            'project_subtitle' => $request->project_subtitle,
            'project_summary' => $request->project_summary,
            'years_of_active_operation' => $request->years_of_active_operation,
            'historical_portfolio_activity' => $request->historical_portfolio_activity,
            'assets_under_management' => $request->assets_under_management,
            'realized_projects' => $request->realized_projects,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Step 2 details saved successfully.',
            'project' => $project
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'An error occurred while saving step 2.',
            'error' => $e->getMessage()
        ], 500);
    }
}

    // Step 3 Save Method
    public function saveStep3(Request $request, ProjectUpload $project)
    {
    try {
        $validator = Validator::make($request->all(), [
            'business_plan_ratings' => 'required|array|size:4',
            'business_plan_ratings.*.category' => 'required|in:leverage,occupancy,capex_hard_cost,target_noi_growth',
            'business_plan_ratings.*.rating' => 'required|in:low,medium,high',

            'deal_snapshots' => 'required|array|min:1',
            'deal_snapshots.*.header' => 'required|string|max:255',
            'deal_snapshots.*.description' => 'required|string',

            'risk_considerations' => 'required|array|min:1',
            'risk_considerations.*.potential_risk' => 'required|string|max:255',
            'risk_considerations.*.assessment_mitigation' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $validator->errors()
            ], 422);
        }

        // ✅ Clear existing records
        $project->businessPlanRatings()->delete();
        $project->dealSnapshots()->delete();
        $project->riskConsiderations()->delete();

        // ✅ Create new entries
        foreach ($request->business_plan_ratings as $rating) {
            $project->businessPlanRatings()->create([
                'category' => $rating['category'],
                'input_rating' => $rating['rating']
            ]);
        }

        foreach ($request->deal_snapshots as $snapshot) {
            $project->dealSnapshots()->create([
                'header' => $snapshot['header'],
                'description' => $snapshot['description']
            ]);
        }

        foreach ($request->risk_considerations as $risk) {
            $project->riskConsiderations()->create([
                'potential_risk' => $risk['potential_risk'],
                'assessment_mitigation' => $risk['assessment_mitigation']
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Step 3 data saved successfully.',
            'project_id' => $project->id
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'An unexpected error occurred while saving step 3.',
            'error' => $e->getMessage()
        ], 500);
    }
}


    public function saveStep4(Request $request, ProjectUpload $project)
    {
    try {
        $validator = Validator::make($request->all(), [
            // Financial fields
            'projected_valuation' => 'required|string',
            'timeline_of_completion_months' => 'required|string',
            'total_capital_required' => 'required|string',
            'total_debt_allocation_percent' => 'required|string',
            'debt_investment_tenure' => 'required|string',
            'debt_yield_percent' => 'required|string',
            'debt_periodic_payment' => 'required|string',
            'equity_investment_tenure' => 'required|string',
            'projected_returns_equity_percent' => 'required|string',
            'equity_periodic_payment' => 'required|string',
            'total_equity_allocation' => 'required|string',

            // Property fields
            'property_address' => 'required|string',
            'location_description' => 'required|string',
            'occupancy' => 'required|in:vacant,partially_occupied,fully_occupied',
            'about_property' => 'required|string',
            'detailed_project_description' => 'required|string',
            'has_anchor_tenant' => 'required|boolean',
            'anchor_tenant_details' => 'required_if:has_anchor_tenant,true|string',
            'has_anchor_buyer' => 'required|boolean',
            'anchor_buyer_details' => 'nullable|required_if:has_anchor_buyer,true|string',
            'percent_leased' => 'nullable|string',
            'sq_ft_leased' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422); // Unprocessable Entity
        }

        $project->update([
            // Financial fields
            'projected_valuation' => $request->projected_valuation,
            'timeline_of_completion_months' => $request->timeline_of_completion_months,
            'total_capital_required' => $request->total_capital_required,
            'total_debt_allocation_percent' => $request->total_debt_allocation_percent,
            'debt_investment_tenure' => $request->debt_investment_tenure,
            'debt_yield_percent' => $request->debt_yield_percent,
            'debt_periodic_payment' => $request->debt_periodic_payment,
            'equity_investment_tenure' => $request->equity_investment_tenure,
            'projected_returns_equity_percent' => $request->projected_returns_equity_percent,
            'equity_periodic_payment' => $request->equity_periodic_payment,
            'total_equity_allocation' => $request->total_equity_allocation,

            // Property fields
            'property_address' => $request->property_address,
            'location_description' => $request->location_description,
            'occupancy' => $request->occupancy,
            'about_property' => $request->about_property,
            'detailed_project_description' => $request->detailed_project_description,
            'has_anchor_tenant' => $request->has_anchor_tenant,
            'anchor_tenant_details' => $request->has_anchor_tenant ? $request->anchor_tenant_details : null,
            'has_anchor_buyer' => $request->has_anchor_buyer,
            'anchor_buyer_details' => $request->has_anchor_buyer ? $request->anchor_buyer_details : null,
            'percent_leased' => $request->percent_leased,
            'sq_ft_leased' => $request->sq_ft_leased
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Step 4 saved successfully.',
            'data' => $project
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'An error occurred: ' . $e->getMessage()
        ], 500);
    }
}

    
    public function saveStep5(Request $request, ProjectUpload $project)
    {
    try {
        $validator = Validator::make($request->all(), [
            'investment_hold_period' => 'required|integer|min:1',
            'acquisition_date' => 'required|date',
            'closing_date' => 'required|date',
            'target_exit_date_debt' => 'required|date',
            'target_exit_date_equity' => 'required|date',
            'offer_live_date' => 'required|date',
            'offer_closing_date' => 'required|date',
            'funds_due_date' => 'required|date',
            'target_escrow_closing_date' => 'required|date',
            'targeted_distribution_start_date_debt' => 'required|date',
            'targeted_distribution_start_date_equity' => 'required|date',
            'distributions_anticipated_begin_date' => 'required|date',
            'frequency_of_distributions' => 'required|in:monthly,quarterly,annually,at_maturity',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }

        $project->update([
            'investment_hold_period' => $request->investment_hold_period, // fixed to match validation key
            'acquisition_date' => $request->acquisition_date,
            'closing_date' => $request->closing_date,
            'target_exit_date_debt' => $request->target_exit_date_debt,
            'target_exit_date_equity' => $request->target_exit_date_equity,
            'offer_live_date' => $request->offer_live_date,
            'offer_closing_date' => $request->offer_closing_date,
            'funds_due_date' => $request->funds_due_date,
            'target_escrow_closing_date' => $request->target_escrow_closing_date,
            'targeted_distribution_start_date_debt' => $request->targeted_distribution_start_date_debt,
            'targeted_distribution_start_date_equity' => $request->targeted_distribution_start_date_equity,
            'distributions_anticipated_begin_date' => $request->distributions_anticipated_begin_date,
            'frequency_of_distributions' => $request->frequency_of_distributions,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Step 5 saved successfully.',
            'data' => $project
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'An error occurred: ' . $e->getMessage()
        ], 500);
    }
}


    public function saveStep6(Request $request, ProjectUpload $project)
    {
    try {
        $validator = Validator::make($request->all(), [
            'sponsor_background' => 'required|string',
            'years_in_operation' => 'required|integer|min:0',
            'historical_portfolio_activity_amount' => 'required|string',
            'project_under_management_amount' => 'required|string',
            'total_square_feet_managed' => 'required|string',
            'deals_funded_by_rc_brown' => 'required|integer|min:0',
            'number_of_properties_under_management' => 'required|integer|min:0',
            'total_number_of_realized_projects' => 'required|integer|min:0',
            'number_of_properties_developed' => 'required|integer|min:0',
            'number_of_properties_built_sold' => 'required|integer|min:0',
            'highest_budget_for_project' => 'required|string',
            'average_length_of_completion_months' => 'required|integer|min:0',
            'track_record_documents' => 'required|array|min:1',
            'track_record_documents.*' => 'file|mimes:jpeg,png,jpg,gif,svg,pdf,doc,docx,xls,xlsx,csv|max:5120',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }

        // Process uploads
        $uploadedFiles = [];
        foreach ($request->file('track_record_documents') as $file) {
            $path = $file->store('step6_track_records', 'public');
            $uploadedFiles[] = [
                'path' => $path,
                'name' => $file->getClientOriginalName(),
            ];
        }

        $project->update([
            'sponsor_background' => $request->sponsor_background,
            'years_in_operation' => $request->years_in_operation,
            'historical_portfolio_activity_amount' => $request->historical_portfolio_activity_amount,
            'asset_under_management_amount' => $request->project_under_management_amount,
            'total_square_feet_managed' => $request->total_square_feet_managed,
            'deals_funded_by_rc_brown' => $request->deals_funded_by_rc_brown,
            'number_of_properties_under_management' => $request->number_of_properties_under_management,
            'total_number_of_realized_projects' => $request->total_number_of_realized_projects,
            'number_of_properties_developed' => $request->number_of_properties_developed,
            'number_of_properties_built_sold' => $request->number_of_properties_built_sold,
            'highest_budget_for_project' => $request->highest_budget_for_project,
            'average_length_of_completion_months' => $request->average_length_of_completion_months,
            'full_track_record' => $uploadedFiles,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Step 6 saved successfully.',
            'data' => $project
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'An error occurred: ' . $e->getMessage(),
        ], 500);
    }
}

    public function saveStep7(Request $request, ProjectUpload $project)
    {
    try {
        $validator = Validator::make($request->all(), [
            'physical_descriptions' => 'required|array|min:1',
            'physical_descriptions.*.description_title' => 'required|string|max:255',
            'physical_descriptions.*.description' => 'required|string',
            // Site Documents
            'site_documents' => 'required|array',
            'site_documents.floor_plan' => 'nullable|array',
            'site_documents.floor_plan.*' => 'file|mimes:jpeg,png,jpg,gif,svg,pdf,doc,docx,xls,xlsx,csv|max:10240',
            'site_documents.survey_plan' => 'nullable|array',
            'site_documents.survey_plan.*' => 'file|mimes:jpeg,png,jpg,gif,svg,pdf,doc,docx,xls,xlsx,csv|max:10240',
            'site_documents.site_plan' => 'nullable|array',
            'site_documents.site_plan.*' => 'file|mimes:jpeg,png,jpg,gif,svg,pdf,doc,docx,xls,xlsx,csv|max:10240',
            'site_documents.stacking_plan' => 'nullable|array',
            'site_documents.stacking_plan.*' => 'file|mimes:jpeg,png,jpg,gif,svg,pdf,doc,docx,xls,xlsx,csv|max:10240',
            'site_documents.others' => 'nullable|array',
            'site_documents.others.*' => 'file|mimes:jpeg,png,jpg,gif,svg,pdf,doc,docx,xls,xlsx,csv|max:10240',
            // Closing Documents
            'closing_documents' => 'nullable|array',
            'closing_documents.*.document_name' => 'required|string|in:' . implode(',', \App\Models\Sponsor\ProjectDocument::getClosingDocumentOptions()),
            'closing_documents.*.files' => 'required|array|min:1',
            'closing_documents.*.files.*' => 'file|mimes:jpeg,png,jpg,gif,svg,pdf,doc,docx,xls,xlsx,csv|max:10240',
            // Offering Information
            'offering_information' => 'nullable|array',
            'offering_information.*.document_name' => 'required|string|in:' . implode(',', \App\Models\Sponsor\ProjectDocument::getOfferingInformationOptions()),
            'offering_information.*.files' => 'required|array|min:1',
            'offering_information.*.files.*' => 'file|mimes:jpeg,png,jpg,gif,svg,pdf,doc,docx,xls,xlsx,csv|max:10240',
            // Sponsor Information
            'sponsor_information' => 'nullable|array',
            'sponsor_information.*.document_name' => 'required|string|max:255',
            'sponsor_information.*.files' => 'required|array|min:1',
            'sponsor_information.*.files.*' => 'file|mimes:jpeg,png,jpg,gif,svg,pdf,doc,docx,xls,xlsx,csv|max:10240',
            // Additional Documents
            'additional_documents' => 'nullable|array',
            'additional_documents.*.document_name' => 'required|string|max:255',
            'additional_documents.*.files' => 'required|array|min:1',
            'additional_documents.*.files.*' => 'file|mimes:jpeg,png,jpg,gif,svg,pdf,doc,docx,xls,xlsx,csv|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first(),
            ], 422);
        }

        // Save physical descriptions
        $project->physicalDescriptions()->delete();
        foreach ($request->physical_descriptions as $description) {
            $project->physicalDescriptions()->create($description);
        }

        // Delete existing documents for this step
        $project->documents()->whereIn('category', [
            \App\Models\Sponsor\ProjectDocument::CATEGORY_SITE_DOCUMENTS,
            \App\Models\Sponsor\ProjectDocument::CATEGORY_CLOSING_DOCUMENTS,
            \App\Models\Sponsor\ProjectDocument::CATEGORY_OFFERING_INFORMATION,
            \App\Models\Sponsor\ProjectDocument::CATEGORY_SPONSOR_INFORMATION,
            \App\Models\Sponsor\ProjectDocument::CATEGORY_ADDITIONAL
        ])->delete();

        // Store document files for each group
        $this->storeDocuments($request, $project, 'site_documents', \App\Models\Sponsor\ProjectDocument::CATEGORY_SITE_DOCUMENTS);
        $this->storeDocuments($request, $project, 'closing_documents', \App\Models\Sponsor\ProjectDocument::CATEGORY_CLOSING_DOCUMENTS);
        $this->storeDocuments($request, $project, 'offering_information', \App\Models\Sponsor\ProjectDocument::CATEGORY_OFFERING_INFORMATION);
        $this->storeDocuments($request, $project, 'sponsor_information', \App\Models\Sponsor\ProjectDocument::CATEGORY_SPONSOR_INFORMATION);
        $this->storeDocuments($request, $project, 'additional_documents', \App\Models\Sponsor\ProjectDocument::CATEGORY_ADDITIONAL);

        return response()->json([
            'status' => 'success',
            'message' => 'Step 7 saved successfully',
            'data' => $project
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Error saving step 7: ' . $e->getMessage()
        ], 500);
    }
}

    private function storeDocuments(Request $request, ProjectUpload $project, string $key, string $category)
    {
    $documents = $request->input($key, []);

    foreach ($documents as $index => $documentData) {
        $files = $request->file("{$key}.{$index}.files");

        if (!is_array($files)) {
            continue;
        }

        foreach ($files as $file) {
            if ($file && $file instanceof \Illuminate\Http\UploadedFile) {
                $path = $file->store('project_documents', 'public'); // store in public disk
                $fileType = $file->getClientOriginalExtension(); // e.g., pdf, jpg
                $originalFilename = $file->getClientOriginalName(); // e.g., document.pdf

                $project->documents()->create([
                    'document_name' => $documentData['document_name'],
                    'file_path' => $path,
                    'category' => $category,
                    'file_type' => $fileType,
                    'original_filename' => $originalFilename, // 💥 required column
                ]);
            }
        }
    }
}


    public function saveStep8(Request $request, ProjectUpload $project)
    {
    try {
        $validator = Validator::make($request->all(), [
            'offerings' => 'nullable|in:equity,debt,both',
            'total_capitalization' => 'required|string',
            'sponsor_co_invest_range' => 'required|in:5.0% - 10.0%,<= 5.0%,>=30.0%',
            'debt_allocation' => 'required|string|max:255',
            'equity_allocation' => 'required|string|max:255',
            'offer_deadline' => 'required|date',
            'location' => 'required|string|max:255',
            'asset_type' => 'required|in:residential,commercial,industrial,hospitality,mixed_use,retail',
            'strategy' => 'required|in:core,core_plus,value_added,opportunistic',
            'objective' => 'required|in:growth,cash_flow,equity_appreciation',
            'debt_details' => 'required|array',
            'debt_details.allocation_percent' => 'required|string',
            'debt_details.distribution_period' => 'required|string',
            'debt_details.target_distribution_start_date' => 'required|date',
            'debt_details.minimum_investment_amount' => 'required|string',
            'debt_details.maximum_investment_amount' => 'required|string',
            'debt_details.return_on_investment' => 'nullable|string',
            'debt_details.expected_min_annual_return' => 'required|string',
            'debt_details.expected_max_annual_return' => 'required|string',
            'debt_details.target_hold_period_years' => 'required|string',
            'debt_details.exit_date' => 'required|date',
            'equity_details' => 'required|array',
            'equity_details.allocation_percent' => 'required|string',
            'equity_details.distribution_period' => 'required|in:monthly,quarterly,annually,semi_annually',
            'equity_details.target_distribution_start_date' => 'required|date',
            'equity_details.minimum_investment' => 'required|string',
            'equity_details.maximum_investment' => 'required|string',
            'equity_details.return_on_investment' => 'nullable|string',
            'equity_details.expected_min_return' => 'required|string',
            'equity_details.expected_max_return' => 'required|string',
            'equity_details.target_hold_period_years' => 'required|string',
            'equity_details.exit_date' => 'required|date',
            'expenses_taxes' => 'nullable|string',
            'expenses_insurance' => 'nullable|string',
            'expenses_management' => 'nullable|string',
            'expenses_repairs' => 'nullable|string',
            'expenses_utilities' => 'nullable|string',
            'expenses_interest' => 'nullable|string',
            'expenses_total' => 'nullable|string',
            'expenses_total_rental_income' => 'nullable|string',
            'expenses_additional' => 'nullable|array',
            'expenses_additional.*.title' => 'required_with:expenses_additional|string',
            'expenses_additional.*.amount' => 'required_with:expenses_additional|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 422);
        }

        $project->update([
        // General Info
        'offerings' => $request->offerings,
        'total_capitalization' => $request->total_capitalization,
        'sponsor_co_invest_range' => $request->sponsor_co_invest_range,
        'debt_allocation' => $request->debt_allocation,
        'equity_allocation' => $request->equity_allocation,
        'offer_deadline' => $request->offer_deadline,
        'location' => $request->location,
        'asset_type' => $request->asset_type,
        'strategy' => $request->strategy,
        'objective' => $request->objective,

        // Debt Details
        'debt_allocation_percent' => $request->input('debt_details.allocation_percent'),
        'debt_distribution_period' => $request->input('debt_details.distribution_period'),
        'debt_target_distribution_start_date' => $request->input('debt_details.target_distribution_start_date'),
        'debt_minimum_investment_amount' => $request->input('debt_details.minimum_investment_amount'),
        'debt_maximum_investment_amount' => $request->input('debt_details.maximum_investment_amount'),
        'debt_return_on_investment' => $request->input('debt_details.return_on_investment'),
        'debt_expected_minimum_annual_return' => $request->input('debt_details.expected_min_annual_return'),
        'debt_expected_maximum_annual_return' => $request->input('debt_details.expected_max_annual_return'),
        'debt_target_hold_period_years' => $request->input('debt_details.target_hold_period_years'),
        'debt_exit_date' => $request->input('debt_details.exit_date'),

        // Equity Details
        'equity_allocation_percent' => $request->input('equity_details.allocation_percent'),
        'equity_distribution_frequency' => $request->input('equity_details.distribution_period'),
        'equity_target_distribution_start_date' => $request->input('equity_details.target_distribution_start_date'),
        'equity_minimum_investment' => $request->input('equity_details.minimum_investment'),
        'equity_maximum_investment' => $request->input('equity_details.maximum_investment'),
        'equity_return_on_investment' => $request->input('equity_details.return_on_investment'),
        'equity_expected_minimum_return' => $request->input('equity_details.expected_min_return'),
        'equity_expected_maximum_return' => $request->input('equity_details.expected_max_return'),
        'equity_target_hold_period_years' => $request->input('equity_details.target_hold_period_years'),
        'equity_exit_date' => $request->input('equity_details.exit_date'),

        // Expenses
        'expenses_taxes' => $request->expenses_taxes,
        'expenses_insurance' => $request->expenses_insurance,
        'expenses_management' => $request->expenses_management,
        'expenses_repairs' => $request->expenses_repairs,
        'expenses_utilities' => $request->expenses_utilities,
        'expenses_interest' => $request->expenses_interest,
        'expenses_total' => $request->expenses_total,
        'expenses_total_rental_income' => $request->expenses_total_rental_income,
        'expenses_additional' => json_encode($request->expenses_additional),
    ]);

        return response()->json(['status' => 'success', 'message' => 'Step 8 saved successfully', 'data' => $project], 200);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => 'Error saving step 8: ' . $e->getMessage()], 500);
    }
}

    public function saveStep9(Request $request, ProjectUpload $project)
    {
    try {
        $validator = Validator::make($request->all(), [
            'budget_sheet_property_address' => 'required|string',
            'city' => 'required|string',
            'state' => 'required|string',
            'zip_code' => 'required|string',
            'in_depth_description_of_work' => 'required|string',
            'project_timeline_months' => 'required|integer|min:1',
            'adding_square_footage' => 'required|boolean',
            'square_footage_expansion_plan' => 'required_if:adding_square_footage,true',
            'budget_items' => 'required|array|min:1',
            'budget_items.*.line_item' => 'required|string|max:255',
            'budget_items.*.description' => 'nullable|string',
            'budget_items.*.scope_of_work' => 'nullable|string',
            'budget_items.*.budget_amount' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 422);
        }

        $project->update([
            'budget_sheet_property_address' => $request->budget_sheet_property_address,
            'city' => $request->city,
            'state' => $request->state,
            'zip_code' => $request->zip_code,
            'in_depth_description_of_work' => $request->in_depth_description_of_work,
            'project_timeline_months' => $request->project_timeline_months,
            'adding_square_footage' => $request->adding_square_footage,
            'square_footage_expansion_plan' => $request->square_footage_expansion_plan,
            'total_construction_cost' => collect($request->budget_items)->sum('budget_amount'),
        ]);
        $project->budgetItems()->delete();
        foreach ($request->budget_items as $item) {
            $project->budgetItems()->create($item);
        }

        return response()->json(['status' => 'success', 'message' => 'Step 9 saved successfully', 'data' => $project], 200);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => 'Error saving step 9: ' . $e->getMessage()], 500);
    }
}


    public function saveStep10(Request $request, ProjectUpload $project)
    {
    try {
        $validator = Validator::make($request->all(), [
            'picture_uploads' => 'nullable|array',
            'picture_uploads.*' => 'file|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'slides_uploads' => 'nullable|array',
            'slides_uploads.*' => 'file|mimes:jpeg,png,jpg,gif,svg,pdf,ppt,pptx|max:10240',
            'video_uploads' => 'nullable|array',
            'video_uploads.*' => 'file|mimes:mp4,mov,avi,webm|max:51200',
            'fund_wallet_amount' => 'nullable|numeric|min:0',
            'signed_acknowledgement_form' => 'nullable|file|mimes:pdf|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 'error', 'message' => $validator->errors()->first()], 422);
        }

        $updateData = [
            'fund_wallet_amount' => $request->fund_wallet_amount,
        ];

        foreach (['picture_uploads' => 'pictures', 'slides_uploads' => 'slides', 'video_uploads' => 'videos'] as $field => $folder) {
            if ($request->hasFile($field)) {
                $updateData[$field] = array_map(function ($file) use ($folder) {
                    return [
                        'path' => $file->store("project_media/{$folder}", 'public'),
                        'name' => $file->getClientOriginalName(),
                        'type' => $file->getClientMimeType(),
                        'size' => $file->getSize()
                    ];
                }, $request->file($field));
            }
        }

        $project->update($updateData);

        if ($request->hasFile('signed_acknowledgement_form')) {
            $path = $request->file('signed_acknowledgement_form')->store('signed_documents/acknowledgement_forms', 'public');
            $project->signAcknowledgementForm($path);
        }

        return response()->json(['status' => 'success', 'message' => 'Step 10 saved successfully', 'data' => $project], 200);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => 'Error saving step 10: ' . $e->getMessage()], 500);
    }
}


    // Generate and download acknowledgement form PDF using barryvdh/laravel-dompdf
    public function downloadAcknowledgementForm(ProjectUpload $project)
    {
        if ($project->sponsor_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        // Generate PDF if not exists or force regenerate
        if (!$project->acknowledgement_form_pdf_path) {
            $pdf = PDF::loadView('projects.acknowledgement_form', ['project' => $project]);
            $filename = "acknowledgement_form_{$project->id}_" . time() . '.pdf';
            $path = "acknowledgement_forms/{$filename}";
            
            Storage::disk('public')->put($path, $pdf->output());
            $project->update(['acknowledgement_form_pdf_path' => $path]);
        }
    
        $pdfPath = storage_path('app/public/' . $project->acknowledgement_form_pdf_path);
        
        if (!file_exists($pdfPath)) {
            return response()->json(['message' => 'PDF not found'], 404);
        }
    
        return response()->download(
            $pdfPath, 
            "acknowledgement_form_{$project->project_name}.pdf",
            ['Content-Type' => 'application/pdf']
        );
    }
    
    // Submit signed acknowledgement form with improved validation
    public function submitSignedAcknowledgementForm(Request $request, ProjectUpload $project)
    {
        if ($project->sponsor_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        $validator = Validator::make($request->all(), [
            'signed_acknowledgement_form' => [
                'required',
                'file',
                'mimes:pdf',
                'max:10240',
                function ($attribute, $value, $fail) {
                    // Basic PDF validation (you might want to add more thorough checks)
                    if (strtolower($value->getClientOriginalExtension()) !== 'pdf') {
                        $fail('The file must be a valid PDF document.');
                    }
                },
            ],
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
    
        DB::beginTransaction();
        try {
            $file = $request->file('signed_acknowledgement_form');
            $filename = "signed_acknowledgement_{$project->id}_" . time() . '.pdf';
            $path = $file->storeAs('signed_documents/acknowledgement_forms', $filename, 'public');
            
            $project->signAcknowledgementForm($path);
            
            DB::commit();
            
            return response()->json([
                'message' => 'Signed acknowledgement form submitted successfully',
                'acknowledgement_form_signed' => true,
                'signed_form_url' => Storage::disk('public')->url($path),
                'fully_signed' => $project->isFullySigned()
            ]);
    
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error submitting signed form',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    // Get signing status with additional checks
    public function getSigningStatus(ProjectUpload $project)
    {
        if ($project->sponsor_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        $response = [
            'acknowledgement_form_signed' => $project->acknowledgement_form_signed,
            'fully_signed' => $project->isFullySigned(),
            'acknowledgement_form_signed_at' => $project->acknowledgement_form_signed_at,
        ];
    
        if ($project->acknowledgement_form_pdf_path) {
            $response['acknowledgement_form_pdf_url'] = Storage::disk('public')->url($project->acknowledgement_form_pdf_path);
        }
    
        if ($project->signed_acknowledgement_form_path) {
            $response['signed_acknowledgement_form_url'] = Storage::disk('public')->url($project->signed_acknowledgement_form_path);
        }
    
        return response()->json($response);
    }
    
    // Submit project for admin approval with signature verification
    public function submitForApproval(Request $request, ProjectUpload $project)
    {
        if ($project->sponsor_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        $completedSteps = json_decode($project->completed_steps, true) ?? [];
        if (count($completedSteps) < 10 || $project->current_step != 11) {
            $missingSteps = array_diff(range(1, 10), $completedSteps);
            return response()->json([
                'message' => 'Please complete all steps before submitting',
                'missing_steps' => array_values($missingSteps)
            ], 400);
        }
    
        if (!$project->acknowledgement_form_signed) {
            return response()->json([
                'message' => 'Please sign and submit the acknowledgement form before submitting for approval'
            ], 400);
        }
    
        $project->update([
            'status' => 'pending',
            'submitted_at' => now(),
        ]);
    
    
        return response()->json(['message' => 'Project submitted for approval']);
    }

    // Show project details
    public function show(ProjectUpload $project)
    {
        // Verify project belongs to user or user is admin/inspector
        if ($project->sponsor_id !== Auth::id() && !Auth::user()->role === 'admin' && !$project->inspectors->contains('id', Auth::id())) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $project->load([
            'businessPlanRatings',
            'dealSnapshots',
            'riskConsiderations',
            'physicalDescriptions',
            'documents'
        ]);

        return response()->json($project);
    }

    // Update project (basic info)
    public function update(Request $request, ProjectUpload $project)
    {
        // Verify project belongs to user and is draft
        if ($project->sponsor_id !== Auth::id() || $project->status !== 'draft') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'currency' => 'sometimes|in:NGN,USD',
            'sponsor_name' => 'sometimes|string|max:255',
            'sponsor_logo' => 'nullable|file|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $project->fill($request->only(['currency', 'sponsor_name']));

        if ($request->hasFile('sponsor_logo')) {
            // Delete old logo if exists
            if ($project->sponsor_logo_path) {
                Storage::disk('public')->delete($project->sponsor_logo_path);
            }
            
            $path = $request->file('sponsor_logo')->store('sponsor_logos', 'public');
            $project->sponsor_logo_path = $path;
        }

        $project->save();

        return response()->json([
            'message' => 'Project updated successfully',
            'project' => $project
        ]);
    }

    // Delete project
    public function destroy(ProjectUpload $project)
    {
        // Verify project belongs to user and is draft
        if ($project->sponsor_id !== Auth::id() || $project->status !== 'draft') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Delete associated files and records
        DB::transaction(function () use ($project) {
            // Delete logo if exists
            if ($project->sponsor_logo_path) {
                Storage::disk('public')->delete($project->sponsor_logo_path);
            }
            
            // Delete all documents
            foreach ($project->documents as $document) {
                Storage::disk('public')->delete($document->file_path);
                $document->delete();
            }
            
            $project->delete();
        });

        return response()->json(['message' => 'Project deleted successfully']);
    }

    // Get document options for Step 7
    public function getDocumentOptions()
    {
        return response()->json([
            'site_document_subcategories' => \App\Models\Sponsor\ProjectDocument::getSiteDocumentSubcategories(),
            'closing_document_options' => \App\Models\Sponsor\ProjectDocument::getClosingDocumentOptions(),
            'offering_information_options' => \App\Models\Sponsor\ProjectDocument::getOfferingInformationOptions(),
        ]);
    }

    // Get documents for a specific project and category
    public function getProjectDocuments(ProjectUpload $project, $category = null)
    {
        if ($project->sponsor_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = $project->documents();
        
        if ($category) {
            $query->where('category', $category);
        }

        $documents = $query->get()->groupBy('category');

        return response()->json([
            'documents' => $documents,
            'categories' => [
                'site_documents' => $documents->get('site_documents', collect())->groupBy('subcategory'),
                'closing_documents' => $documents->get('closing_documents', collect())->groupBy('document_name'),
                'offering_information' => $documents->get('offering_information', collect())->groupBy('document_name'),
                'sponsor_information' => $documents->get('sponsor_information', collect())->groupBy('document_name'),
                'additional' => $documents->get('additional', collect())->groupBy('document_name'),
            ]
        ]);
    }

    // Initialize project - get existing draft or create new one
    public function initialize()
    {
        $existingDraft = ProjectUpload::where('sponsor_id', Auth::id())
            ->where('status', 'draft')
            ->latest()
            ->first();

        if ($existingDraft) {
            return response()->json([
                'message' => 'Existing draft project found',
                'project' => $existingDraft,
                'current_step' => $existingDraft->current_step,
                'completed_steps' => $existingDraft->completed_steps
            ]);
        }

        return response()->json([
            'message' => 'No existing draft project found',
            'project' => null,
            'current_step' => 1,
            'completed_steps' => []
        ]);
    }

    // Generic file upload handler
    public function uploadFile(Request $request, ProjectUpload $project)
    {
        if ($project->sponsor_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,svg,pdf,doc,docx,xls,xlsx,csv,mp4,mov,avi|max:10240',
            'category' => 'required|string',
            'subcategory' => 'nullable|string',
            'document_name' => 'nullable|string',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        try {
            $file = $request->file('file');
            $category = $request->category;
            
            // Determine storage path based on category
            $storagePath = match($category) {
                'site_documents' => 'project_documents/site_documents',
                'closing_documents' => 'project_documents/closing_documents',
                'offering_information' => 'project_documents/offering_information',
                'sponsor_information' => 'project_documents/sponsor_information',
                'additional' => 'project_documents/additional',
                'media_assets' => 'project_media',
                'track_record' => 'project_documents/track_record',
                default => 'project_documents/misc'
            };

            $path = $file->store($storagePath, 'public');

            $document = $project->documents()->create([
                'category' => $category,
                'subcategory' => $request->subcategory,
                'document_name' => $request->document_name,
                'file_path' => $path,
                'file_type' => $file->getClientMimeType(),
                'original_filename' => $file->getClientOriginalName(),
                'notes' => $request->notes
            ]);

            return response()->json([
                'message' => 'File uploaded successfully',
                'document' => $document,
                'file_url' => $document->file_url
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Error uploading file: ' . $e->getMessage()], 500);
        }
    }
}


```

# app\Http\Controllers\Sponsor\SponsorDashboardController.php

```php
<?php

namespace App\Http\Controllers\Sponsor;

use App\Http\Controllers\Controller;
use App\Models\Sponsor\ProjectUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SponsorDashboardController extends Controller
{
    public function metrics(Request $request)
    {
        $user = $request->user();

        // Total projects for this sponsor
        $totalProjects = ProjectUpload::where('sponsor_id', $user->id)->count();

        // Active projects (status = 'approved')
        $activeProjects = ProjectUpload::where('sponsor_id', $user->id)
            ->where('status', 'approved')
            ->count();

        // Pending approval projects (status = 'pending')
        $pendingProjects = ProjectUpload::where('sponsor_id', $user->id)
            ->where('status', 'pending')
            ->count();

        // Total investors (unique users who invested in this sponsor's projects)
        $totalInvestors = DB::table('investments')
            ->join('project_uploads', 'investments.project_id', '=', 'project_uploads.id')
            ->where('project_uploads.sponsor_id', $user->id)
            ->distinct('investments.user_id')
            ->count('investments.user_id');

        // Funds raised (sum of all investments for this sponsor's projects)
        $fundsRaised = DB::table('investments')
            ->join('project_uploads', 'investments.project_id', '=', 'project_uploads.id')
            ->where('project_uploads.sponsor_id', $user->id)
            ->sum('investments.amount');

        // Upcoming payouts (next scheduled payouts for sponsor's projects)
        $upcomingPayouts = DB::table('payouts')
            ->join('project_uploads', 'payouts.project_id', '=', 'project_uploads.id')
            ->where('project_uploads.sponsor_id', $user->id)
            ->where('payouts.scheduled_date', '>=', now())
            ->orderBy('payouts.scheduled_date')
            ->get();

        return response()->json([
            'total_projects' => $totalProjects,
            'active_projects' => $activeProjects,
            'pending_projects' => $pendingProjects,
            'total_investors' => $totalInvestors,
            'funds_raised' => $fundsRaised,
            'upcoming_payouts' => $upcomingPayouts,
        ]);
    }
} 
```

# app\Http\Middleware\EnsureEmailIsVerified.php

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailIsVerified
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() ||
            ($request->user() instanceof MustVerifyEmail &&
            ! $request->user()->hasVerifiedEmail())) {
            return response()->json(['message' => 'Your email address is not verified.'], 409);
        }

        return $next($request);
    }
}

```

# app\Http\Requests\Auth\LoginRequest.php

```php
<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    // public function authenticate(): void
    // {
    //     $this->ensureIsNotRateLimited();

    //     if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
    //         RateLimiter::hit($this->throttleKey());

    //         throw ValidationException::withMessages([
    //             'email' => __('auth.failed'),
    //         ]);
    //     }

    //     RateLimiter::clear($this->throttleKey());
    // }

    public function authenticate(): void
{
    $this->ensureIsNotRateLimited();

    $user = \App\Models\User::where('email', $this->email)->first();

    if (! $user) {
        throw ValidationException::withMessages([
            'email' => 'No account found with this email address.',
        ]);
    }

    if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
        RateLimiter::hit($this->throttleKey());

        throw ValidationException::withMessages([
            'password' => 'Invalid credentials. Please check your password.',
        ]);
    }

    RateLimiter::clear($this->throttleKey());
}


    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->input('email')).'|'.$this->ip());
    }
}

```

# app\Models\Investment.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investment extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'user_id',
        'amount',
        'status',
        'invested_at',
    ];

    protected $casts = [
        'invested_at' => 'datetime',
    ];
} 
```

# app\Models\Payout.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'amount',
        'scheduled_date',
        'status',
        'paid_at',
    ];

    protected $casts = [
        'scheduled_date' => 'datetime',
        'paid_at' => 'datetime',
    ];
} 
```

# app\Models\Sponsor\BusinessInformation.php

```php
<?php

namespace App\Models\Sponsor;

use Illuminate\Database\Eloquent\Model;

class BusinessInformation extends Model
{
    protected $guarded = ['id'];
    protected $casts = [
        'company_history' => 'array',
        'primary_focus' => 'array',
        'project_details' => 'array', 
        'projected_completion_time' => 'array',
        'interested_investment_types' => 'array',
        'social_links' => 'array',
        'supporting_documents' => 'array', 
        'references' => 'array', 
        'terms_accepted' => 'boolean',
        'raised_capital_before' => 'boolean',
        'issues_with_payments' => 'boolean',
        'over_budget_projects' => 'boolean',
        'legal_issues' => 'boolean',
        'is_draft' => 'boolean',
        'current_step' => 'integer',
        'completed_steps' => 'array',
    ];
}

```

# app\Models\Sponsor\CompanyRepresentative.php

```php
<?php

namespace App\Models\Sponsor;

use Illuminate\Database\Eloquent\Model;

class CompanyRepresentative extends Model
{
    protected $guarded = ['id'];
    protected $casts = [
        'terms_accepted' => 'boolean',
        'is_completed' => 'boolean',
        'current_step' => 'integer',
        'completed_steps' => 'array',
    ];
    
}

```

# app\Models\Sponsor\ProjectAdditionalExpense.php

```php
<?php

namespace App\Models\Sponsor;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectAdditionalExpense extends Model
{
    protected $fillable = [
        'project_id',
        'expense_name',
        'expense_amount',
        'description'
    ];

    protected $casts = [
        'expense_amount' => 'decimal:2'
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(ProjectUpload::class, 'project_id');
    }

    public function getFormattedExpenseAmountAttribute(): string
    {
        return '$' . number_format($this->expense_amount, 2);
    }
} 
```

# app\Models\Sponsor\ProjectBudgetItem.php

```php
<?php

namespace App\Models\Sponsor;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectBudgetItem extends Model
{
    protected $fillable = [
        'project_id',
        'line_item',
        'description',
        'scope_of_work',
        'budget_amount'
    ];

    protected $casts = [
        'budget_amount' => 'decimal:2'
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(ProjectUpload::class, 'project_id');
    }

    public function getFormattedBudgetAmountAttribute(): string
    {
        return '$' . number_format($this->budget_amount, 2);
    }
} 
```

# app\Models\Sponsor\ProjectBusinessPlanRating.php

```php
<?php

namespace App\Models\Sponsor;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectBusinessPlanRating extends Model
{
    protected $fillable = [
        'project_id',
        'category',
        'input_rating'
    ];

    protected $casts = [
        'category' => 'string',
        'input_rating' => 'string'
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(ProjectUpload::class, 'project_id');
    }
} 
```

# app\Models\Sponsor\ProjectDealSnapshot.php

```php
<?php

namespace App\Models\Sponsor;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectDealSnapshot extends Model
{
    protected $fillable = [
        'project_id',
        'header',
        'description'
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(ProjectUpload::class, 'project_id');
    }
} 
```

# app\Models\Sponsor\ProjectDocument.php

```php
<?php

namespace App\Models\Sponsor;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectDocument extends Model
{
    protected $fillable = [
        'project_id',
        'category',
        'subcategory',
        'document_name',
        'file_path',
        'file_type',
        'original_filename',
        'notes'
    ];

    protected $casts = [
        'category' => 'string'
    ];

    // Constants for categories
    const CATEGORY_SITE_DOCUMENTS = 'site_documents';
    const CATEGORY_CLOSING_DOCUMENTS = 'closing_documents';
    const CATEGORY_OFFERING_INFORMATION = 'offering_information';
    const CATEGORY_SPONSOR_INFORMATION = 'sponsor_information';
    const CATEGORY_ADDITIONAL = 'additional';

    // Constants for site document subcategories
    const SUBCATEGORY_FLOOR_PLAN = 'floor_plan';
    const SUBCATEGORY_SURVEY_PLAN = 'survey_plan';
    const SUBCATEGORY_SITE_PLAN = 'site_plan';
    const SUBCATEGORY_STACKING_PLAN = 'stacking_plan';
    const SUBCATEGORY_OTHERS = 'others';

    // Available closing document options
    public static function getClosingDocumentOptions(): array
    {
        return [
            'private_placement_memorandum',
            'operating_agreement',
            'subscription_agreement',
            'llc_company_agreement',
            'tenants_in_common_agreement'
        ];
    }

    // Available offering information options
    public static function getOfferingInformationOptions(): array
    {
        return [
            'offering_memorandum',
            'rcb_capital_due_diligence',
            'progress_update',
            'quarterly_investors_report',
            'renovation_update',
            'webinar_trsanscript',
            'offering_update',
        ];
    }

    // Available site document subcategories
    public static function getSiteDocumentSubcategories(): array
    {
        return [
            self::SUBCATEGORY_FLOOR_PLAN => 'Floor Plan',
            self::SUBCATEGORY_SURVEY_PLAN => 'Survey Plan',
            self::SUBCATEGORY_SITE_PLAN => 'Site Plan',
            self::SUBCATEGORY_STACKING_PLAN => 'Stacking Plan',
            self::SUBCATEGORY_OTHERS => 'Others'
        ];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(ProjectUpload::class, 'project_id');
    }

    public function getFileUrlAttribute(): string
    {
        return asset('storage/' . $this->file_path);
    }

    public function getFileSizeAttribute(): string
    {
        if (!file_exists(storage_path('app/public/' . $this->file_path))) {
            return '0 KB';
        }
        
        $size = filesize(storage_path('app/public/' . $this->file_path));
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = 0;
        
        while ($size >= 1024 && $i < count($units) - 1) {
            $size /= 1024;
            $i++;
        }
        
        return round($size, 2) . ' ' . $units[$i];
    }

    public function getCategoryDisplayNameAttribute(): string
    {
        $categories = [
            self::CATEGORY_SITE_DOCUMENTS => 'Site Documents',
            self::CATEGORY_CLOSING_DOCUMENTS => 'Closing Documents',
            self::CATEGORY_OFFERING_INFORMATION => 'Offering Information',
            self::CATEGORY_SPONSOR_INFORMATION => 'Sponsor Information',
            self::CATEGORY_ADDITIONAL => 'Additional Documents'
        ];

        return $categories[$this->category] ?? $this->category;
    }

    public function getSubcategoryDisplayNameAttribute(): string
    {
        if ($this->category === self::CATEGORY_SITE_DOCUMENTS) {
            $subcategories = self::getSiteDocumentSubcategories();
            return $subcategories[$this->subcategory] ?? $this->subcategory;
        }

        return $this->subcategory ?? '';
    }

    public function getDocumentNameDisplayAttribute(): string
    {
        if ($this->category === self::CATEGORY_CLOSING_DOCUMENTS) {
            $options = [
                'purchase_agreement' => 'Purchase Agreement',
                'title_deed' => 'Title Deed',
                'survey_report' => 'Survey Report',
                'environmental_assessment' => 'Environmental Assessment',
                'zoning_documentation' => 'Zoning Documentation',
                'permits_and_licenses' => 'Permits and Licenses',
                'insurance_documents' => 'Insurance Documents',
                'tax_assessment' => 'Tax Assessment',
                'utility_documents' => 'Utility Documents',
                'other_closing_docs' => 'Other Closing Documents'
            ];
            return $options[$this->document_name] ?? $this->document_name;
        }

        if ($this->category === self::CATEGORY_OFFERING_INFORMATION) {
            $options = [
                'private_placement_memorandum' => 'Private Placement Memorandum',
                'offering_circular' => 'Offering Circular',
                'subscription_agreement' => 'Subscription Agreement',
                'operating_agreement' => 'Operating Agreement',
                'financial_statements' => 'Financial Statements',
                'proforma_statements' => 'Proforma Statements',
                'market_analysis' => 'Market Analysis',
                'investment_summary' => 'Investment Summary',
                'risk_disclosure' => 'Risk Disclosure',
                'other_offering_docs' => 'Other Offering Documents'
            ];
            return $options[$this->document_name] ?? $this->document_name;
        }

        return $this->document_name ?? '';
    }

    // Scopes for filtering
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeBySubcategory($query, $subcategory)
    {
        return $query->where('subcategory', $subcategory);
    }

    public function scopeByDocumentName($query, $documentName)
    {
        return $query->where('document_name', $documentName);
    }
} 
```

# app\Models\Sponsor\ProjectPhysicalDescription.php

```php
<?php

namespace App\Models\Sponsor;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectPhysicalDescription extends Model
{
    protected $fillable = [
        'project_id',
        'description_title',
        'description'
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(ProjectUpload::class, 'project_id');
    }
} 
```

# app\Models\Sponsor\ProjectRiskConsideration.php

```php
<?php

namespace App\Models\Sponsor;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectRiskConsideration extends Model
{
    protected $fillable = [
        'project_id',
        'potential_risk',
        'assessment_mitigation'
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(ProjectUpload::class, 'project_id');
    }
} 
```

# app\Models\Sponsor\ProjectUpload.php

```php
<?php

namespace App\Models\Sponsor;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class ProjectUpload extends Model
{
    use SoftDeletes;

    
    protected $guarded = ['id'];

    protected $casts = [
    'historical_portfolio_activity' => 'string',
    'assets_under_management' => 'string',
    'projected_valuation' => 'string',
    'total_capital_required' => 'string',
    'total_debt_allocation_percent' => 'string',
    'projected_returns_equity_percent' => 'string',
    'total_equity_allocation' => 'string',
    'percent_leased' => 'string',
    'sq_ft_leased' => 'string',
    'historical_portfolio_activity_amount' => 'string',
    'projects_under_management_amount' => 'string',
    'highest_budget_for_project' => 'string',
    'total_capitalization' => 'string',
    'debt_allocation' => 'string',
    'equity_allocation' => 'string',
    'debt_allocation_percent' => 'string',
    'debt_minimum_investment_amount' => 'string',
    'debt_maximum_investment_amount' => 'string',
    'debt_expected_minimum_annual_return' => 'string',
    'debt_expected_maximum_annual_return' => 'string',
    'equity_allocation_percent' => 'string',
    'equity_minimum_investment' => 'string',
    'equity_maximum_investment' => 'string',
    'equity_expected_minimum_return' => 'string',
    'equity_expected_maximum_return' => 'string',
    'total_construction_cost' => 'decimal:2',
    'expenses_taxes' => 'string',
    'expenses_insurance' => 'string',
    'expenses_management' => 'string',
    'expenses_repairs' => 'string',
    'expenses_utilities' => 'string',
    'expenses_interest' => 'string',
    'expenses_total' => 'string',
    'expenses_total_rental_income' => 'string',

    'has_anchor_tenant' => 'boolean',
    'has_anchor_buyer' => 'boolean',
    'adding_square_footage' => 'boolean',
    'completed_steps' => 'array',
    'acknowledgement_form_signed' => 'boolean',

    'acknowledgement_form_signed_at' => 'datetime',
    'submitted_at' => 'datetime',

    'picture_uploads' => 'array',
    'slides_uploads' => 'array',
    'video_uploads' => 'array',

    'acquisition_date' => 'date',
    'closing_date' => 'date',
    'target_exit_date_debt' => 'date',
    'target_exit_date_equity' => 'date',
    'offer_live_date' => 'date',
    'offer_closing_date' => 'date',
    'funds_due_date' => 'date',
    'target_escrow_closing_date' => 'date',
    'targeted_distribution_start_date_debt' => 'date',
    'targeted_distribution_start_date_equity' => 'date',
    'distributions_anticipated_begin_date' => 'date',
    'offer_deadline' => 'date',
    'debt_target_distribution_start_date' => 'date',
    'debt_exit_date' => 'date',
    'equity_target_distribution_start_date' => 'date',
    'equity_exit_date' => 'date',
];


    // Relationships
    public function sponsor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sponsor_id');
    }

    public function businessPlanRatings(): HasMany
    {
        return $this->hasMany(ProjectBusinessPlanRating::class, 'project_id');
    }

    public function dealSnapshots(): HasMany
    {
        return $this->hasMany(ProjectDealSnapshot::class, 'project_id');
    }

    public function riskConsiderations(): HasMany
    {
        return $this->hasMany(ProjectRiskConsideration::class, 'project_id');
    }

    public function physicalDescriptions(): HasMany
    {
        return $this->hasMany(ProjectPhysicalDescription::class, 'project_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(ProjectDocument::class, 'project_id');
    }

    public function budgetItems(): HasMany
    {
        return $this->hasMany(ProjectBudgetItem::class, 'project_id');
    }

    public function additionalExpenses(): HasMany
    {
        return $this->hasMany(ProjectAdditionalExpense::class, 'project_id');
    }

    public function investments()
    {
        return $this->hasMany(\App\Models\Investment::class, 'project_id');
    }

    public function payouts()
    {
        return $this->hasMany(\App\Models\Payout::class, 'project_id');
    }

    // Scopes
    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    // Methods
    public function isCompleted(): bool
    {
        return $this->status !== 'draft';
    }

    public function canEdit(): bool
    {
        return $this->status === 'draft';
    }

    public function getFormattedCurrencyAttribute(): string
    {
        return $this->currency === 'USD' ? '$' : '₦';
    }

    // public function getFormattedHistoricalPortfolioActivityAttribute(): string
    // {
    //     if (!$this->historical_portfolio_activity) return '';
    //     return $this->formatted_currency . number_format($this->historical_portfolio_activity, 2);
    // }
    
    public function getFormattedHistoricalPortfolioActivityAttribute(): string
    {
        if (!$this->historical_portfolio_activity || !is_numeric($this->historical_portfolio_activity)) return '';
        
        return $this->formatted_currency . number_format((float)$this->historical_portfolio_activity, 2);
    }



    public function getFormattedAssetsUnderManagementAttribute(): string
    {
        if (!$this->assets_under_management) return '';
        return $this->formatted_currency . number_format($this->assets_under_management, 2);
    }

    public function getFormattedProjectedValuationAttribute(): string
    {
        if (!$this->projected_valuation) return '';
        return $this->formatted_currency . number_format($this->projected_valuation, 2);
    }

    public function getFormattedTotalCapitalRequiredAttribute(): string
    {
        if (!$this->total_capital_required) return '';
        return $this->formatted_currency . number_format($this->total_capital_required, 2);
    }

    public function getFormattedTotalCapitalizationAttribute(): string
    {
        if (!$this->total_capitalization) return '';
        return $this->formatted_currency . number_format($this->total_capitalization, 2);
    }

    public function getFormattedTotalConstructionCostAttribute(): string
    {
        if (!$this->total_construction_cost) return '';
        return $this->formatted_currency . number_format($this->total_construction_cost, 2);
    }

    public function getFormattedTotalExpenseAttribute(): string
    {
        if (!$this->total_expense) return '';
        return $this->formatted_currency . number_format($this->total_expense, 2);
    }

    public function getFormattedTotalRentalIncomeAttribute(): string
    {
        if (!$this->total_rental_income) return '';
        return $this->formatted_currency . number_format($this->total_rental_income, 2);
    }

    public function getFormattedTotalEquityAppreciationAttribute(): string
    {
        if (!$this->total_equity_appreciation) return '';
        return $this->formatted_currency . number_format($this->total_equity_appreciation, 2);
    }

    public function getSponsorLogoUrlAttribute(): ?string
    {
        if (!$this->sponsor_logo_path) return null;
        return asset('storage/' . $this->sponsor_logo_path);
    }

    public function getProgressPercentageAttribute(): int
    {
        if (empty($this->completed_steps)) return 0;
        return (count($this->completed_steps) / 10) * 100;
    }

    public function isStepCompleted(int $step): bool
    {
        return in_array($step, $this->completed_steps ?? []);
    }

    public function markStepAsCompleted(int $step): void
    {
        $completedSteps = $this->completed_steps ?? [];
        if (!in_array($step, $completedSteps)) {
            $completedSteps[] = $step;
            $this->completed_steps = $completedSteps;
            $this->save();
        }
    }

    public function submitForApproval(): void
    {
        $this->status = 'pending';
        $this->submitted_at = now();
        $this->save();
    }

    // PDF Generation and Signing Methods

    public function generateAcknowledgementFormPdf(): string
    {
        $filename = "acknowledgement_form_{$this->id}_" . now()->format('Ymd_His') . '.pdf';
        $path = "acknowledgement_forms/{$filename}";
        
        // Generate PDF using DomPDF
        $pdf = Pdf::loadView('projects.acknowledgement_form', [
            'project' => $this,
            'date' => now()->format('F j, Y')
        ]);
        
        // Save to storage
        Storage::disk('public')->put($path, $pdf->output());
        
        $this->update(['acknowledgement_form_pdf_path' => $path]);
        
        return $path;
    }

    /**
     * Mark the acknowledgement form as signed and store the signed PDF path
     */
    public function signAcknowledgementForm(string $signedPdfPath): void
    {
        $this->update([
            'signed_acknowledgement_form_path' => $signedPdfPath,
            'acknowledgement_form_signed' => true,
            'acknowledgement_form_signed_at' => now()
        ]);
    }

    /**
     * Check if all required signatures are complete
     */
    public function isFullySigned(): bool
    {
        return $this->acknowledgement_form_signed 
            && !empty($this->signed_acknowledgement_form_path);
    }

    /**
     * Get public URL for the unsigned acknowledgement form
     */
    public function getAcknowledgementFormPdfUrl(): ?string
    {
        return $this->acknowledgement_form_pdf_path 
            ? Storage::disk('public')->url($this->acknowledgement_form_pdf_path)
            : null;
    }

    /**
     * Get public URL for the signed acknowledgement form
     */
    public function getSignedAcknowledgementFormUrl(): ?string
    {
        return $this->signed_acknowledgement_form_path 
            ? Storage::disk('public')->url($this->signed_acknowledgement_form_path)
            : null;
    }
    
    // public function generateAcknowledgementFormPdf(): string
    // {
    //     // Generate acknowledgement form PDF with project details
    //     $pdfContent = $this->buildAcknowledgementFormContent();
    //     $filename = "acknowledgement_form_{$this->id}_" . now()->format('Y-m-d_H-i-s') . ".pdf";
    //     $path = "project_documents/acknowledgement_forms/{$filename}";
        
    //     // Use a PDF library like DomPDF or TCPDF to generate the PDF
    //     // For now, we'll create a placeholder
    //     Storage::disk('public')->put($path, $pdfContent);
        
    //     $this->update(['acknowledgement_form_pdf_path' => $path]);
        
    //     return $path;
    // }

    // public function signAcknowledgementForm(string $signedPdfPath): void
    // {
    //     $this->update([
    //         'signed_acknowledgement_form_path' => $signedPdfPath,
    //         'acknowledgement_form_signed' => true,
    //         'acknowledgement_form_signed_at' => now()
    //     ]);
    // }

    // public function isFullySigned(): bool
    // {
    //     return $this->acknowledgement_form_signed;
    // }

    // public function getAcknowledgementFormPdfUrl(): ?string
    // {
    //     if (!$this->acknowledgement_form_pdf_path) {
    //         return null;
    //     }
    //     return asset('storage/' . $this->acknowledgement_form_pdf_path);
    // }

    // public function getSignedAcknowledgementFormUrl(): ?string
    // {
    //     if (!$this->signed_acknowledgement_form_path) {
    //         return null;
    //     }
    //     return asset('storage/' . $this->signed_acknowledgement_form_path);
    // }

    private function buildAcknowledgementFormContent(): string
    {
        // Build acknowledgement form content with project details
        $content = "ACKNOWLEDGEMENT AND DISCLAIMER FORM\n\n";
        $content .= "Project: {$this->project_name}\n";
        $content .= "Sponsor: {$this->sponsor_name}\n";
        $content .= "Date: " . now()->format('Y-m-d') . "\n\n";
        $content .= "ACKNOWLEDGEMENT\n";
        $content .= "I acknowledge that I have reviewed all project details and agree to the terms and conditions outlined in this document.\n\n";
        $content .= "DISCLAIMER\n";
        $content .= "This disclaimer outlines the risks and terms associated with this investment opportunity. By signing this form, I acknowledge that I understand the risks involved.\n\n";
        $content .= "SIGNATURE: _________________________\n";
        $content .= "DATE: _________________________\n";
        // Add more content as needed
        
        return $content;
    }

    // Media Upload Helper Methods
    public function getPictureUploadsUrls(): array
    {
        if (empty($this->picture_uploads)) {
            return [];
        }

        return array_map(function ($upload) {
            return [
                'url' => asset('storage/' . $upload['path']),
                'name' => $upload['name'],
                'type' => $upload['type'],
                'size' => $upload['size']
            ];
        }, $this->picture_uploads);
    }

    public function getSlidesUploadsUrls(): array
    {
        if (empty($this->slides_uploads)) {
            return [];
        }

        return array_map(function ($upload) {
            return [
                'url' => asset('storage/' . $upload['path']),
                'name' => $upload['name'],
                'type' => $upload['type'],
                'size' => $upload['size']
            ];
        }, $this->slides_uploads);
    }

    public function getVideoUploadsUrls(): array
    {
        if (empty($this->video_uploads)) {
            return [];
        }

        return array_map(function ($upload) {
            return [
                'url' => asset('storage/' . $upload['path']),
                'name' => $upload['name'],
                'type' => $upload['type'],
                'size' => $upload['size']
            ];
        }, $this->video_uploads);
    }

    public function getFormattedFundWalletAmountAttribute(): string
    {
        if (!$this->fund_wallet_amount) return '';
        return $this->formatted_currency . number_format($this->fund_wallet_amount, 2);
    }

    public function hasMediaUploads(): bool
    {
        return !empty($this->picture_uploads) || !empty($this->slides_uploads) || !empty($this->video_uploads);
    }

    public function getTotalMediaFilesCount(): int
    {
        $pictureCount = is_array($this->picture_uploads) ? count($this->picture_uploads) : 0;
        $slidesCount = is_array($this->slides_uploads) ? count($this->slides_uploads) : 0;
        $videoCount = is_array($this->video_uploads) ? count($this->video_uploads) : 0;
        
        return $pictureCount + $slidesCount + $videoCount;
    }
}


```

# app\Models\User.php

```php
<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */

    use HasFactory, Notifiable, HasApiTokens, TwoFactorAuthenticatable;

    protected $guarded = ['id'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

   
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}

```

# app\Providers\AppServiceProvider.php

```php
<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });
    }
}

```

# app\Providers\FortifyServiceProvider.php

```php
<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Fortify;

class FortifyServiceProvider extends ServiceProvider
{
    
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });
    }
}

```

# artisan

```
#!/usr/bin/env php
<?php

use Illuminate\Foundation\Application;
use Symfony\Component\Console\Input\ArgvInput;

define('LARAVEL_START', microtime(true));

// Register the Composer autoloader...
require __DIR__.'/vendor/autoload.php';

// Bootstrap Laravel and handle the command...
/** @var Application $app */
$app = require_once __DIR__.'/bootstrap/app.php';

$status = $app->handleCommand(new ArgvInput);

exit($status);

```

# bootstrap\app.php

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->appendToGroup('api', \Illuminate\Http\Middleware\HandleCors::class);
        // $middleware->api(prepend: [
        //     \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        // ]);

        $middleware->alias([
            'verified' => \App\Http\Middleware\EnsureEmailIsVerified::class,
        ]);

        //
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();

```

# bootstrap\cache\.gitignore

```
*
!.gitignore

```

# bootstrap\cache\packages.php

```php
<?php return array (
  'barryvdh/laravel-dompdf' => 
  array (
    'aliases' => 
    array (
      'PDF' => 'Barryvdh\\DomPDF\\Facade\\Pdf',
      'Pdf' => 'Barryvdh\\DomPDF\\Facade\\Pdf',
    ),
    'providers' => 
    array (
      0 => 'Barryvdh\\DomPDF\\ServiceProvider',
    ),
  ),
  'laravel/breeze' => 
  array (
    'providers' => 
    array (
      0 => 'Laravel\\Breeze\\BreezeServiceProvider',
    ),
  ),
  'laravel/fortify' => 
  array (
    'providers' => 
    array (
      0 => 'Laravel\\Fortify\\FortifyServiceProvider',
    ),
  ),
  'laravel/pail' => 
  array (
    'providers' => 
    array (
      0 => 'Laravel\\Pail\\PailServiceProvider',
    ),
  ),
  'laravel/sail' => 
  array (
    'providers' => 
    array (
      0 => 'Laravel\\Sail\\SailServiceProvider',
    ),
  ),
  'laravel/sanctum' => 
  array (
    'providers' => 
    array (
      0 => 'Laravel\\Sanctum\\SanctumServiceProvider',
    ),
  ),
  'laravel/socialite' => 
  array (
    'aliases' => 
    array (
      'Socialite' => 'Laravel\\Socialite\\Facades\\Socialite',
    ),
    'providers' => 
    array (
      0 => 'Laravel\\Socialite\\SocialiteServiceProvider',
    ),
  ),
  'laravel/tinker' => 
  array (
    'providers' => 
    array (
      0 => 'Laravel\\Tinker\\TinkerServiceProvider',
    ),
  ),
  'nesbot/carbon' => 
  array (
    'providers' => 
    array (
      0 => 'Carbon\\Laravel\\ServiceProvider',
    ),
  ),
  'nunomaduro/collision' => 
  array (
    'providers' => 
    array (
      0 => 'NunoMaduro\\Collision\\Adapters\\Laravel\\CollisionServiceProvider',
    ),
  ),
  'nunomaduro/termwind' => 
  array (
    'providers' => 
    array (
      0 => 'Termwind\\Laravel\\TermwindServiceProvider',
    ),
  ),
);
```

# bootstrap\cache\services.php

```php
<?php return array (
  'providers' => 
  array (
    0 => 'Illuminate\\Auth\\AuthServiceProvider',
    1 => 'Illuminate\\Broadcasting\\BroadcastServiceProvider',
    2 => 'Illuminate\\Bus\\BusServiceProvider',
    3 => 'Illuminate\\Cache\\CacheServiceProvider',
    4 => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    5 => 'Illuminate\\Concurrency\\ConcurrencyServiceProvider',
    6 => 'Illuminate\\Cookie\\CookieServiceProvider',
    7 => 'Illuminate\\Database\\DatabaseServiceProvider',
    8 => 'Illuminate\\Encryption\\EncryptionServiceProvider',
    9 => 'Illuminate\\Filesystem\\FilesystemServiceProvider',
    10 => 'Illuminate\\Foundation\\Providers\\FoundationServiceProvider',
    11 => 'Illuminate\\Hashing\\HashServiceProvider',
    12 => 'Illuminate\\Mail\\MailServiceProvider',
    13 => 'Illuminate\\Notifications\\NotificationServiceProvider',
    14 => 'Illuminate\\Pagination\\PaginationServiceProvider',
    15 => 'Illuminate\\Auth\\Passwords\\PasswordResetServiceProvider',
    16 => 'Illuminate\\Pipeline\\PipelineServiceProvider',
    17 => 'Illuminate\\Queue\\QueueServiceProvider',
    18 => 'Illuminate\\Redis\\RedisServiceProvider',
    19 => 'Illuminate\\Session\\SessionServiceProvider',
    20 => 'Illuminate\\Translation\\TranslationServiceProvider',
    21 => 'Illuminate\\Validation\\ValidationServiceProvider',
    22 => 'Illuminate\\View\\ViewServiceProvider',
    23 => 'Barryvdh\\DomPDF\\ServiceProvider',
    24 => 'Laravel\\Breeze\\BreezeServiceProvider',
    25 => 'Laravel\\Fortify\\FortifyServiceProvider',
    26 => 'Laravel\\Pail\\PailServiceProvider',
    27 => 'Laravel\\Sail\\SailServiceProvider',
    28 => 'Laravel\\Sanctum\\SanctumServiceProvider',
    29 => 'Laravel\\Socialite\\SocialiteServiceProvider',
    30 => 'Laravel\\Tinker\\TinkerServiceProvider',
    31 => 'Carbon\\Laravel\\ServiceProvider',
    32 => 'NunoMaduro\\Collision\\Adapters\\Laravel\\CollisionServiceProvider',
    33 => 'Termwind\\Laravel\\TermwindServiceProvider',
    34 => 'App\\Providers\\AppServiceProvider',
  ),
  'eager' => 
  array (
    0 => 'Illuminate\\Auth\\AuthServiceProvider',
    1 => 'Illuminate\\Cookie\\CookieServiceProvider',
    2 => 'Illuminate\\Database\\DatabaseServiceProvider',
    3 => 'Illuminate\\Encryption\\EncryptionServiceProvider',
    4 => 'Illuminate\\Filesystem\\FilesystemServiceProvider',
    5 => 'Illuminate\\Foundation\\Providers\\FoundationServiceProvider',
    6 => 'Illuminate\\Notifications\\NotificationServiceProvider',
    7 => 'Illuminate\\Pagination\\PaginationServiceProvider',
    8 => 'Illuminate\\Session\\SessionServiceProvider',
    9 => 'Illuminate\\View\\ViewServiceProvider',
    10 => 'Barryvdh\\DomPDF\\ServiceProvider',
    11 => 'Laravel\\Fortify\\FortifyServiceProvider',
    12 => 'Laravel\\Pail\\PailServiceProvider',
    13 => 'Laravel\\Sanctum\\SanctumServiceProvider',
    14 => 'Carbon\\Laravel\\ServiceProvider',
    15 => 'NunoMaduro\\Collision\\Adapters\\Laravel\\CollisionServiceProvider',
    16 => 'Termwind\\Laravel\\TermwindServiceProvider',
    17 => 'App\\Providers\\AppServiceProvider',
  ),
  'deferred' => 
  array (
    'Illuminate\\Broadcasting\\BroadcastManager' => 'Illuminate\\Broadcasting\\BroadcastServiceProvider',
    'Illuminate\\Contracts\\Broadcasting\\Factory' => 'Illuminate\\Broadcasting\\BroadcastServiceProvider',
    'Illuminate\\Contracts\\Broadcasting\\Broadcaster' => 'Illuminate\\Broadcasting\\BroadcastServiceProvider',
    'Illuminate\\Bus\\Dispatcher' => 'Illuminate\\Bus\\BusServiceProvider',
    'Illuminate\\Contracts\\Bus\\Dispatcher' => 'Illuminate\\Bus\\BusServiceProvider',
    'Illuminate\\Contracts\\Bus\\QueueingDispatcher' => 'Illuminate\\Bus\\BusServiceProvider',
    'Illuminate\\Bus\\BatchRepository' => 'Illuminate\\Bus\\BusServiceProvider',
    'Illuminate\\Bus\\DatabaseBatchRepository' => 'Illuminate\\Bus\\BusServiceProvider',
    'cache' => 'Illuminate\\Cache\\CacheServiceProvider',
    'cache.store' => 'Illuminate\\Cache\\CacheServiceProvider',
    'cache.psr6' => 'Illuminate\\Cache\\CacheServiceProvider',
    'memcached.connector' => 'Illuminate\\Cache\\CacheServiceProvider',
    'Illuminate\\Cache\\RateLimiter' => 'Illuminate\\Cache\\CacheServiceProvider',
    'Illuminate\\Foundation\\Console\\AboutCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Cache\\Console\\ClearCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Cache\\Console\\ForgetCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ClearCompiledCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Auth\\Console\\ClearResetsCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ConfigCacheCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ConfigClearCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ConfigShowCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\DbCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\MonitorCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\PruneCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\ShowCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\TableCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\WipeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\DownCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\EnvironmentCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\EnvironmentDecryptCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\EnvironmentEncryptCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\EventCacheCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\EventClearCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\EventListCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Concurrency\\Console\\InvokeSerializedClosureCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\KeyGenerateCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\OptimizeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\OptimizeClearCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\PackageDiscoverCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Cache\\Console\\PruneStaleTagsCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Queue\\Console\\ClearCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Queue\\Console\\ListFailedCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Queue\\Console\\FlushFailedCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Queue\\Console\\ForgetFailedCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Queue\\Console\\ListenCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Queue\\Console\\MonitorCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Queue\\Console\\PruneBatchesCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Queue\\Console\\PruneFailedJobsCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Queue\\Console\\RestartCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Queue\\Console\\RetryCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Queue\\Console\\RetryBatchCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Queue\\Console\\WorkCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\RouteCacheCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\RouteClearCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\RouteListCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\DumpCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\Seeds\\SeedCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Console\\Scheduling\\ScheduleFinishCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Console\\Scheduling\\ScheduleListCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Console\\Scheduling\\ScheduleRunCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Console\\Scheduling\\ScheduleClearCacheCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Console\\Scheduling\\ScheduleTestCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Console\\Scheduling\\ScheduleWorkCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Console\\Scheduling\\ScheduleInterruptCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\ShowModelCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\StorageLinkCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\StorageUnlinkCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\UpCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ViewCacheCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ViewClearCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ApiInstallCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\BroadcastingInstallCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Cache\\Console\\CacheTableCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\CastMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ChannelListCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ChannelMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ClassMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ComponentMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ConfigPublishCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ConsoleMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Routing\\Console\\ControllerMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\DocsCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\EnumMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\EventGenerateCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\EventMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ExceptionMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\Factories\\FactoryMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\InterfaceMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\JobMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\JobMiddlewareMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\LangPublishCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ListenerMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\MailMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Routing\\Console\\MiddlewareMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ModelMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\NotificationMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Notifications\\Console\\NotificationTableCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ObserverMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\PolicyMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ProviderMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Queue\\Console\\FailedTableCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Queue\\Console\\TableCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Queue\\Console\\BatchesTableCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\RequestMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ResourceMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\RuleMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ScopeMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\Seeds\\SeederMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Session\\Console\\SessionTableCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ServeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\StubPublishCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\TestMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\TraitMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\VendorPublishCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Foundation\\Console\\ViewMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'migrator' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'migration.repository' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'migration.creator' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Migrations\\Migrator' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\Migrations\\MigrateCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\Migrations\\FreshCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\Migrations\\InstallCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\Migrations\\RefreshCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\Migrations\\ResetCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\Migrations\\RollbackCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\Migrations\\StatusCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Database\\Console\\Migrations\\MigrateMakeCommand' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'composer' => 'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider',
    'Illuminate\\Concurrency\\ConcurrencyManager' => 'Illuminate\\Concurrency\\ConcurrencyServiceProvider',
    'hash' => 'Illuminate\\Hashing\\HashServiceProvider',
    'hash.driver' => 'Illuminate\\Hashing\\HashServiceProvider',
    'mail.manager' => 'Illuminate\\Mail\\MailServiceProvider',
    'mailer' => 'Illuminate\\Mail\\MailServiceProvider',
    'Illuminate\\Mail\\Markdown' => 'Illuminate\\Mail\\MailServiceProvider',
    'auth.password' => 'Illuminate\\Auth\\Passwords\\PasswordResetServiceProvider',
    'auth.password.broker' => 'Illuminate\\Auth\\Passwords\\PasswordResetServiceProvider',
    'Illuminate\\Contracts\\Pipeline\\Hub' => 'Illuminate\\Pipeline\\PipelineServiceProvider',
    'pipeline' => 'Illuminate\\Pipeline\\PipelineServiceProvider',
    'queue' => 'Illuminate\\Queue\\QueueServiceProvider',
    'queue.connection' => 'Illuminate\\Queue\\QueueServiceProvider',
    'queue.failer' => 'Illuminate\\Queue\\QueueServiceProvider',
    'queue.listener' => 'Illuminate\\Queue\\QueueServiceProvider',
    'queue.worker' => 'Illuminate\\Queue\\QueueServiceProvider',
    'redis' => 'Illuminate\\Redis\\RedisServiceProvider',
    'redis.connection' => 'Illuminate\\Redis\\RedisServiceProvider',
    'translator' => 'Illuminate\\Translation\\TranslationServiceProvider',
    'translation.loader' => 'Illuminate\\Translation\\TranslationServiceProvider',
    'validator' => 'Illuminate\\Validation\\ValidationServiceProvider',
    'validation.presence' => 'Illuminate\\Validation\\ValidationServiceProvider',
    'Illuminate\\Contracts\\Validation\\UncompromisedVerifier' => 'Illuminate\\Validation\\ValidationServiceProvider',
    'Laravel\\Breeze\\Console\\InstallCommand' => 'Laravel\\Breeze\\BreezeServiceProvider',
    'Laravel\\Sail\\Console\\InstallCommand' => 'Laravel\\Sail\\SailServiceProvider',
    'Laravel\\Sail\\Console\\PublishCommand' => 'Laravel\\Sail\\SailServiceProvider',
    'Laravel\\Socialite\\Contracts\\Factory' => 'Laravel\\Socialite\\SocialiteServiceProvider',
    'command.tinker' => 'Laravel\\Tinker\\TinkerServiceProvider',
  ),
  'when' => 
  array (
    'Illuminate\\Broadcasting\\BroadcastServiceProvider' => 
    array (
    ),
    'Illuminate\\Bus\\BusServiceProvider' => 
    array (
    ),
    'Illuminate\\Cache\\CacheServiceProvider' => 
    array (
    ),
    'Illuminate\\Foundation\\Providers\\ConsoleSupportServiceProvider' => 
    array (
    ),
    'Illuminate\\Concurrency\\ConcurrencyServiceProvider' => 
    array (
    ),
    'Illuminate\\Hashing\\HashServiceProvider' => 
    array (
    ),
    'Illuminate\\Mail\\MailServiceProvider' => 
    array (
    ),
    'Illuminate\\Auth\\Passwords\\PasswordResetServiceProvider' => 
    array (
    ),
    'Illuminate\\Pipeline\\PipelineServiceProvider' => 
    array (
    ),
    'Illuminate\\Queue\\QueueServiceProvider' => 
    array (
    ),
    'Illuminate\\Redis\\RedisServiceProvider' => 
    array (
    ),
    'Illuminate\\Translation\\TranslationServiceProvider' => 
    array (
    ),
    'Illuminate\\Validation\\ValidationServiceProvider' => 
    array (
    ),
    'Laravel\\Breeze\\BreezeServiceProvider' => 
    array (
    ),
    'Laravel\\Sail\\SailServiceProvider' => 
    array (
    ),
    'Laravel\\Socialite\\SocialiteServiceProvider' => 
    array (
    ),
    'Laravel\\Tinker\\TinkerServiceProvider' => 
    array (
    ),
  ),
);
```

# bootstrap\providers.php

```php
<?php

return [
    App\Providers\AppServiceProvider::class,
];

```

# composer.json

```json
{
    "$schema": "https://getcomposer.org/schema.json",
    "name": "laravel/laravel",
    "type": "project",
    "description": "The skeleton application for the Laravel framework.",
    "keywords": ["laravel", "framework"],
    "license": "MIT",
    "require": {
        "php": "^8.2",
        "barryvdh/laravel-dompdf": "^3.1",
        "laravel/fortify": "^1.25",
        "laravel/framework": "^12.0",
        "laravel/sanctum": "^4.1",
        "laravel/socialite": "^5.21",
        "laravel/tinker": "^2.10.1"
    },
    "require-dev": {
        "fakerphp/faker": "^1.23",
        "laravel/breeze": "^2.3",
        "laravel/pail": "^1.2.2",
        "laravel/pint": "^1.13",
        "laravel/sail": "^1.41",
        "mockery/mockery": "^1.6",
        "nunomaduro/collision": "^8.6",
        "phpunit/phpunit": "^11.5.3"
    },
    "autoload": {
        "psr-4": {
            "App\\": "app/",
            "Database\\Factories\\": "database/factories/",
            "Database\\Seeders\\": "database/seeders/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Tests\\": "tests/"
        }
    },
    "scripts": {
        "post-autoload-dump": [
            "Illuminate\\Foundation\\ComposerScripts::postAutoloadDump",
            "@php artisan package:discover --ansi"
        ],
        "post-update-cmd": [
            "@php artisan vendor:publish --tag=laravel-assets --ansi --force"
        ],
        "post-root-package-install": [
            "@php -r \"file_exists('.env') || copy('.env.example', '.env');\""
        ],
        "post-create-project-cmd": [
            "@php artisan key:generate --ansi",
            "@php -r \"file_exists('database/database.sqlite') || touch('database/database.sqlite');\"",
            "@php artisan migrate --graceful --ansi"
        ],
        "dev": [
            "Composer\\Config::disableProcessTimeout",
            "npx concurrently -c \"#93c5fd,#c4b5fd,#fb7185,#fdba74\" \"php artisan serve\" \"php artisan queue:listen --tries=1\" \"php artisan pail --timeout=0\" \"npm run dev\" --names=server,queue,logs,vite"
        ],
        "test": [
            "@php artisan config:clear --ansi",
            "@php artisan test"
        ]
    },
    "extra": {
        "laravel": {
            "dont-discover": []
        }
    },
    "config": {
        "optimize-autoloader": true,
        "preferred-install": "dist",
        "sort-packages": true,
        "allow-plugins": {
            "pestphp/pest-plugin": true,
            "php-http/discovery": true
        }
    },
    "minimum-stability": "stable",
    "prefer-stable": true
}

```

# config\app.php

```php
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Application Name
    |--------------------------------------------------------------------------
    |
    | This value is the name of your application, which will be used when the
    | framework needs to place the application's name in a notification or
    | other UI elements where an application name needs to be displayed.
    |
    */

    'name' => env('APP_NAME', 'Laravel'),

    /*
    |--------------------------------------------------------------------------
    | Application Environment
    |--------------------------------------------------------------------------
    |
    | This value determines the "environment" your application is currently
    | running in. This may determine how you prefer to configure various
    | services the application utilizes. Set this in your ".env" file.
    |
    */

    'env' => env('APP_ENV', 'production'),

    /*
    |--------------------------------------------------------------------------
    | Application Debug Mode
    |--------------------------------------------------------------------------
    |
    | When your application is in debug mode, detailed error messages with
    | stack traces will be shown on every error that occurs within your
    | application. If disabled, a simple generic error page is shown.
    |
    */

    'debug' => (bool) env('APP_DEBUG', false),

    /*
    |--------------------------------------------------------------------------
    | Application URL
    |--------------------------------------------------------------------------
    |
    | This URL is used by the console to properly generate URLs when using
    | the Artisan command line tool. You should set this to the root of
    | the application so that it's available within Artisan commands.
    |
    */

    'url' => env('APP_URL', 'http://localhost'),

    /*
    |--------------------------------------------------------------------------
    | Application Timezone
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default timezone for your application, which
    | will be used by the PHP date and date-time functions. The timezone
    | is set to "UTC" by default as it is suitable for most use cases.
    |
    */

    'timezone' => 'UTC',

    /*
    |--------------------------------------------------------------------------
    | Application Locale Configuration
    |--------------------------------------------------------------------------
    |
    | The application locale determines the default locale that will be used
    | by Laravel's translation / localization methods. This option can be
    | set to any locale for which you plan to have translation strings.
    |
    */

    'locale' => env('APP_LOCALE', 'en'),

    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),

    'faker_locale' => env('APP_FAKER_LOCALE', 'en_US'),

    /*
    |--------------------------------------------------------------------------
    | Encryption Key
    |--------------------------------------------------------------------------
    |
    | This key is utilized by Laravel's encryption services and should be set
    | to a random, 32 character string to ensure that all encrypted values
    | are secure. You should do this prior to deploying the application.
    |
    */

    'cipher' => 'AES-256-CBC',

    'key' => env('APP_KEY'),

    'previous_keys' => [
        ...array_filter(
            explode(',', env('APP_PREVIOUS_KEYS', ''))
        ),
    ],

    /*
    |--------------------------------------------------------------------------
    | Maintenance Mode Driver
    |--------------------------------------------------------------------------
    |
    | These configuration options determine the driver used to determine and
    | manage Laravel's "maintenance mode" status. The "cache" driver will
    | allow maintenance mode to be controlled across multiple machines.
    |
    | Supported drivers: "file", "cache"
    |
    */

    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'database'),
    ],

];

```

# config\auth.php

```php
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Authentication Defaults
    |--------------------------------------------------------------------------
    |
    | This option defines the default authentication "guard" and password
    | reset "broker" for your application. You may change these values
    | as required, but they're a perfect start for most applications.
    |
    */

    'defaults' => [
        'guard' => env('AUTH_GUARD', 'web'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Guards
    |--------------------------------------------------------------------------
    |
    | Next, you may define every authentication guard for your application.
    | Of course, a great default configuration has been defined for you
    | which utilizes session storage plus the Eloquent user provider.
    |
    | All authentication guards have a user provider, which defines how the
    | users are actually retrieved out of your database or other storage
    | system used by the application. Typically, Eloquent is utilized.
    |
    | Supported: "session"
    |
    */

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | User Providers
    |--------------------------------------------------------------------------
    |
    | All authentication guards have a user provider, which defines how the
    | users are actually retrieved out of your database or other storage
    | system used by the application. Typically, Eloquent is utilized.
    |
    | If you have multiple user tables or models you may configure multiple
    | providers to represent the model / table. These providers may then
    | be assigned to any extra authentication guards you have defined.
    |
    | Supported: "database", "eloquent"
    |
    */

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => env('AUTH_MODEL', App\Models\User::class),
        ],

        // 'users' => [
        //     'driver' => 'database',
        //     'table' => 'users',
        // ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Resetting Passwords
    |--------------------------------------------------------------------------
    |
    | These configuration options specify the behavior of Laravel's password
    | reset functionality, including the table utilized for token storage
    | and the user provider that is invoked to actually retrieve users.
    |
    | The expiry time is the number of minutes that each reset token will be
    | considered valid. This security feature keeps tokens short-lived so
    | they have less time to be guessed. You may change this as needed.
    |
    | The throttle setting is the number of seconds a user must wait before
    | generating more password reset tokens. This prevents the user from
    | quickly generating a very large amount of password reset tokens.
    |
    */

    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Confirmation Timeout
    |--------------------------------------------------------------------------
    |
    | Here you may define the number of seconds before a password confirmation
    | window expires and users are asked to re-enter their password via the
    | confirmation screen. By default, the timeout lasts for three hours.
    |
    */

    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800),

];

```

# config\cache.php

```php
<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Cache Store
    |--------------------------------------------------------------------------
    |
    | This option controls the default cache store that will be used by the
    | framework. This connection is utilized if another isn't explicitly
    | specified when running a cache operation inside the application.
    |
    */

    'default' => env('CACHE_STORE', 'database'),

    /*
    |--------------------------------------------------------------------------
    | Cache Stores
    |--------------------------------------------------------------------------
    |
    | Here you may define all of the cache "stores" for your application as
    | well as their drivers. You may even define multiple stores for the
    | same cache driver to group types of items stored in your caches.
    |
    | Supported drivers: "array", "database", "file", "memcached",
    |                    "redis", "dynamodb", "octane", "null"
    |
    */

    'stores' => [

        'array' => [
            'driver' => 'array',
            'serialize' => false,
        ],

        'database' => [
            'driver' => 'database',
            'connection' => env('DB_CACHE_CONNECTION'),
            'table' => env('DB_CACHE_TABLE', 'cache'),
            'lock_connection' => env('DB_CACHE_LOCK_CONNECTION'),
            'lock_table' => env('DB_CACHE_LOCK_TABLE'),
        ],

        'file' => [
            'driver' => 'file',
            'path' => storage_path('framework/cache/data'),
            'lock_path' => storage_path('framework/cache/data'),
        ],

        'memcached' => [
            'driver' => 'memcached',
            'persistent_id' => env('MEMCACHED_PERSISTENT_ID'),
            'sasl' => [
                env('MEMCACHED_USERNAME'),
                env('MEMCACHED_PASSWORD'),
            ],
            'options' => [
                // Memcached::OPT_CONNECT_TIMEOUT => 2000,
            ],
            'servers' => [
                [
                    'host' => env('MEMCACHED_HOST', '127.0.0.1'),
                    'port' => env('MEMCACHED_PORT', 11211),
                    'weight' => 100,
                ],
            ],
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => env('REDIS_CACHE_CONNECTION', 'cache'),
            'lock_connection' => env('REDIS_CACHE_LOCK_CONNECTION', 'default'),
        ],

        'dynamodb' => [
            'driver' => 'dynamodb',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
            'table' => env('DYNAMODB_CACHE_TABLE', 'cache'),
            'endpoint' => env('DYNAMODB_ENDPOINT'),
        ],

        'octane' => [
            'driver' => 'octane',
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Key Prefix
    |--------------------------------------------------------------------------
    |
    | When utilizing the APC, database, memcached, Redis, and DynamoDB cache
    | stores, there might be other applications using the same cache. For
    | that reason, you may prefix every cache key to avoid collisions.
    |
    */

    'prefix' => env('CACHE_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_cache_'),

];

```

# config\cors.php

```php
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // 'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],

    'allowed_origins' => [
    env('FRONTEND_URL', 'http://localhost:3000'),
    'http://localhost:3000',
    'https://rc-brown-capital-frontend.vercel.app',
    'https://rc-brown-capital-frontend-git-main-raymond-browns-projects.vercel.app',
    'https://rc-brown-capital-frontend-git-dev-raymond-browns-projects.vercel.app',
],


    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 3600,

    'supports_credentials' => true,

];

```

# config\database.php

```php
<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Database Connection Name
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the database connections below you wish
    | to use as your default connection for database operations. This is
    | the connection which will be utilized unless another connection
    | is explicitly specified when you execute a query / statement.
    |
    */

    'default' => env('DB_CONNECTION', 'sqlite'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
    |--------------------------------------------------------------------------
    |
    | Below are all of the database connections defined for your application.
    | An example configuration is provided for each database system which
    | is supported by Laravel. You're free to add / remove connections.
    |
    */

    'connections' => [

        'sqlite' => [
            'driver' => 'sqlite',
            'url' => env('DB_URL'),
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            'prefix' => '',
            'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
            'busy_timeout' => null,
            'journal_mode' => null,
            'synchronous' => null,
        ],

        'mysql' => [
            'driver' => 'mysql',
            'url' => env('DB_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'laravel'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => env('DB_CHARSET', 'utf8mb4'),
            'collation' => env('DB_COLLATION', 'utf8mb4_unicode_ci'),
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
            'options' => extension_loaded('pdo_mysql') ? array_filter([
                PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
            ]) : [],
        ],

        'mariadb' => [
            'driver' => 'mariadb',
            'url' => env('DB_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'laravel'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => env('DB_CHARSET', 'utf8mb4'),
            'collation' => env('DB_COLLATION', 'utf8mb4_unicode_ci'),
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
            'options' => extension_loaded('pdo_mysql') ? array_filter([
                PDO::MYSQL_ATTR_SSL_CA => env('MYSQL_ATTR_SSL_CA'),
            ]) : [],
        ],

        'pgsql' => [
            'driver' => 'pgsql',
            'url' => env('DB_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '5432'),
            'database' => env('DB_DATABASE', 'laravel'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => env('DB_CHARSET', 'utf8'),
            'prefix' => '',
            'prefix_indexes' => true,
            'search_path' => 'public',
            'sslmode' => 'prefer',
        ],

        'sqlsrv' => [
            'driver' => 'sqlsrv',
            'url' => env('DB_URL'),
            'host' => env('DB_HOST', 'localhost'),
            'port' => env('DB_PORT', '1433'),
            'database' => env('DB_DATABASE', 'laravel'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => env('DB_CHARSET', 'utf8'),
            'prefix' => '',
            'prefix_indexes' => true,
            // 'encrypt' => env('DB_ENCRYPT', 'yes'),
            // 'trust_server_certificate' => env('DB_TRUST_SERVER_CERTIFICATE', 'false'),
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    |
    | This table keeps track of all the migrations that have already run for
    | your application. Using this information, we can determine which of
    | the migrations on disk haven't actually been run on the database.
    |
    */

    'migrations' => [
        'table' => 'migrations',
        'update_date_on_publish' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Redis Databases
    |--------------------------------------------------------------------------
    |
    | Redis is an open source, fast, and advanced key-value store that also
    | provides a richer body of commands than a typical key-value system
    | such as Memcached. You may define your connection settings here.
    |
    */

    'redis' => [

        'client' => env('REDIS_CLIENT', 'phpredis'),

        'options' => [
            'cluster' => env('REDIS_CLUSTER', 'redis'),
            'prefix' => env('REDIS_PREFIX', Str::slug(env('APP_NAME', 'laravel'), '_').'_database_'),
            'persistent' => env('REDIS_PERSISTENT', false),
        ],

        'default' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'username' => env('REDIS_USERNAME'),
            'password' => env('REDIS_PASSWORD'),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_DB', '0'),
        ],

        'cache' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'username' => env('REDIS_USERNAME'),
            'password' => env('REDIS_PASSWORD'),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_CACHE_DB', '1'),
        ],

    ],

];

```

# config\filesystems.php

```php
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. The "local" disk, as well as a variety of cloud
    | based disks are available to your application for file storage.
    |
    */

    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Below you may configure as many filesystem disks as necessary, and you
    | may even configure multiple disks for the same driver. Examples for
    | most supported storage drivers are configured here for reference.
    |
    | Supported drivers: "local", "ftp", "sftp", "s3"
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'report' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Symbolic Links
    |--------------------------------------------------------------------------
    |
    | Here you may configure the symbolic links that will be created when the
    | `storage:link` Artisan command is executed. The array keys should be
    | the locations of the links and the values should be their targets.
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];

```

# config\fortify.php

```php
<?php

use Laravel\Fortify\Features;

return [

    /*
    |--------------------------------------------------------------------------
    | Fortify Guard
    |--------------------------------------------------------------------------
    |
    | Here you may specify which authentication guard Fortify will use while
    | authenticating users. This value should correspond with one of your
    | guards that is already present in your "auth" configuration file.
    |
    */

    'guard' => 'web',

    /*
    |--------------------------------------------------------------------------
    | Fortify Password Broker
    |--------------------------------------------------------------------------
    |
    | Here you may specify which password broker Fortify can use when a user
    | is resetting their password. This configured value should match one
    | of your password brokers setup in your "auth" configuration file.
    |
    */

    'passwords' => 'users',

    /*
    |--------------------------------------------------------------------------
    | Username / Email
    |--------------------------------------------------------------------------
    |
    | This value defines which model attribute should be considered as your
    | application's "username" field. Typically, this might be the email
    | address of the users but you are free to change this value here.
    |
    | Out of the box, Fortify expects forgot password and reset password
    | requests to have a field named 'email'. If the application uses
    | another name for the field you may define it below as needed.
    |
    */

    'username' => 'email',

    'email' => 'email',

    /*
    |--------------------------------------------------------------------------
    | Lowercase Usernames
    |--------------------------------------------------------------------------
    |
    | This value defines whether usernames should be lowercased before saving
    | them in the database, as some database system string fields are case
    | sensitive. You may disable this for your application if necessary.
    |
    */

    'lowercase_usernames' => true,

    /*
    |--------------------------------------------------------------------------
    | Home Path
    |--------------------------------------------------------------------------
    |
    | Here you may configure the path where users will get redirected during
    | authentication or password reset when the operations are successful
    | and the user is authenticated. You are free to change this value.
    |
    */

    'home' => '/home',

    /*
    |--------------------------------------------------------------------------
    | Fortify Routes Prefix / Subdomain
    |--------------------------------------------------------------------------
    |
    | Here you may specify which prefix Fortify will assign to all the routes
    | that it registers with the application. If necessary, you may change
    | subdomain under which all of the Fortify routes will be available.
    |
    */

    'prefix' => '',

    'domain' => null,

    /*
    |--------------------------------------------------------------------------
    | Fortify Routes Middleware
    |--------------------------------------------------------------------------
    |
    | Here you may specify which middleware Fortify will assign to the routes
    | that it registers with the application. If necessary, you may change
    | these middleware but typically this provided default is preferred.
    |
    */

    'middleware' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    |
    | By default, Fortify will throttle logins to five requests per minute for
    | every email and IP address combination. However, if you would like to
    | specify a custom rate limiter to call then you may specify it here.
    |
    */

    'limiters' => [
        'login' => 'login',
        'two-factor' => 'two-factor',
    ],

    /*
    |--------------------------------------------------------------------------
    | Register View Routes
    |--------------------------------------------------------------------------
    |
    | Here you may specify if the routes returning views should be disabled as
    | you may not need them when building your own application. This may be
    | especially true if you're writing a custom single-page application.
    |
    */

    'views' => true,

    /*
    |--------------------------------------------------------------------------
    | Features
    |--------------------------------------------------------------------------
    |
    | Some of the Fortify features are optional. You may disable the features
    | by removing them from this array. You're free to only remove some of
    | these features or you can even remove all of these if you need to.
    |
    */

    'features' => [
        Features::registration(),
        Features::resetPasswords(),
        // Features::emailVerification(),
        Features::updateProfileInformation(),
        Features::updatePasswords(),
        Features::twoFactorAuthentication([
            'confirm' => true,
            'confirmPassword' => true,
            // 'window' => 0,
        ]),
    ],

];

```

# config\logging.php

```php
<?php

use Monolog\Handler\NullHandler;
use Monolog\Handler\StreamHandler;
use Monolog\Handler\SyslogUdpHandler;
use Monolog\Processor\PsrLogMessageProcessor;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Log Channel
    |--------------------------------------------------------------------------
    |
    | This option defines the default log channel that is utilized to write
    | messages to your logs. The value provided here should match one of
    | the channels present in the list of "channels" configured below.
    |
    */

    'default' => env('LOG_CHANNEL', 'stack'),

    /*
    |--------------------------------------------------------------------------
    | Deprecations Log Channel
    |--------------------------------------------------------------------------
    |
    | This option controls the log channel that should be used to log warnings
    | regarding deprecated PHP and library features. This allows you to get
    | your application ready for upcoming major versions of dependencies.
    |
    */

    'deprecations' => [
        'channel' => env('LOG_DEPRECATIONS_CHANNEL', 'null'),
        'trace' => env('LOG_DEPRECATIONS_TRACE', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | Log Channels
    |--------------------------------------------------------------------------
    |
    | Here you may configure the log channels for your application. Laravel
    | utilizes the Monolog PHP logging library, which includes a variety
    | of powerful log handlers and formatters that you're free to use.
    |
    | Available drivers: "single", "daily", "slack", "syslog",
    |                    "errorlog", "monolog", "custom", "stack"
    |
    */

    'channels' => [

        'stack' => [
            'driver' => 'stack',
            'channels' => explode(',', env('LOG_STACK', 'single')),
            'ignore_exceptions' => false,
        ],

        'single' => [
            'driver' => 'single',
            'path' => storage_path('logs/laravel.log'),
            'level' => env('LOG_LEVEL', 'debug'),
            'replace_placeholders' => true,
        ],

        'daily' => [
            'driver' => 'daily',
            'path' => storage_path('logs/laravel.log'),
            'level' => env('LOG_LEVEL', 'debug'),
            'days' => env('LOG_DAILY_DAYS', 14),
            'replace_placeholders' => true,
        ],

        'slack' => [
            'driver' => 'slack',
            'url' => env('LOG_SLACK_WEBHOOK_URL'),
            'username' => env('LOG_SLACK_USERNAME', 'Laravel Log'),
            'emoji' => env('LOG_SLACK_EMOJI', ':boom:'),
            'level' => env('LOG_LEVEL', 'critical'),
            'replace_placeholders' => true,
        ],

        'papertrail' => [
            'driver' => 'monolog',
            'level' => env('LOG_LEVEL', 'debug'),
            'handler' => env('LOG_PAPERTRAIL_HANDLER', SyslogUdpHandler::class),
            'handler_with' => [
                'host' => env('PAPERTRAIL_URL'),
                'port' => env('PAPERTRAIL_PORT'),
                'connectionString' => 'tls://'.env('PAPERTRAIL_URL').':'.env('PAPERTRAIL_PORT'),
            ],
            'processors' => [PsrLogMessageProcessor::class],
        ],

        'stderr' => [
            'driver' => 'monolog',
            'level' => env('LOG_LEVEL', 'debug'),
            'handler' => StreamHandler::class,
            'handler_with' => [
                'stream' => 'php://stderr',
            ],
            'formatter' => env('LOG_STDERR_FORMATTER'),
            'processors' => [PsrLogMessageProcessor::class],
        ],

        'syslog' => [
            'driver' => 'syslog',
            'level' => env('LOG_LEVEL', 'debug'),
            'facility' => env('LOG_SYSLOG_FACILITY', LOG_USER),
            'replace_placeholders' => true,
        ],

        'errorlog' => [
            'driver' => 'errorlog',
            'level' => env('LOG_LEVEL', 'debug'),
            'replace_placeholders' => true,
        ],

        'null' => [
            'driver' => 'monolog',
            'handler' => NullHandler::class,
        ],

        'emergency' => [
            'path' => storage_path('logs/laravel.log'),
        ],

    ],

];

```

# config\mail.php

```php
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Mailer
    |--------------------------------------------------------------------------
    |
    | This option controls the default mailer that is used to send all email
    | messages unless another mailer is explicitly specified when sending
    | the message. All additional mailers can be configured within the
    | "mailers" array. Examples of each type of mailer are provided.
    |
    */

    'default' => env('MAIL_MAILER', 'log'),

    /*
    |--------------------------------------------------------------------------
    | Mailer Configurations
    |--------------------------------------------------------------------------
    |
    | Here you may configure all of the mailers used by your application plus
    | their respective settings. Several examples have been configured for
    | you and you are free to add your own as your application requires.
    |
    | Laravel supports a variety of mail "transport" drivers that can be used
    | when delivering an email. You may specify which one you're using for
    | your mailers below. You may also add additional mailers if needed.
    |
    | Supported: "smtp", "sendmail", "mailgun", "ses", "ses-v2",
    |            "postmark", "resend", "log", "array",
    |            "failover", "roundrobin"
    |
    */

    'mailers' => [

        'smtp' => [
            'transport' => 'smtp',
            'scheme' => env('MAIL_SCHEME'),
            'url' => env('MAIL_URL'),
            'host' => env('MAIL_HOST', '127.0.0.1'),
            'port' => env('MAIL_PORT', 2525),
            'username' => env('MAIL_USERNAME'),
            'password' => env('MAIL_PASSWORD'),
            'timeout' => null,
            'local_domain' => env('MAIL_EHLO_DOMAIN', parse_url(env('APP_URL', 'http://localhost'), PHP_URL_HOST)),
        ],

        'ses' => [
            'transport' => 'ses',
        ],

        'postmark' => [
            'transport' => 'postmark',
            // 'message_stream_id' => env('POSTMARK_MESSAGE_STREAM_ID'),
            // 'client' => [
            //     'timeout' => 5,
            // ],
        ],

        'resend' => [
            'transport' => 'resend',
        ],

        'sendmail' => [
            'transport' => 'sendmail',
            'path' => env('MAIL_SENDMAIL_PATH', '/usr/sbin/sendmail -bs -i'),
        ],

        'log' => [
            'transport' => 'log',
            'channel' => env('MAIL_LOG_CHANNEL'),
        ],

        'array' => [
            'transport' => 'array',
        ],

        'failover' => [
            'transport' => 'failover',
            'mailers' => [
                'smtp',
                'log',
            ],
            'retry_after' => 60,
        ],

        'roundrobin' => [
            'transport' => 'roundrobin',
            'mailers' => [
                'ses',
                'postmark',
            ],
            'retry_after' => 60,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Global "From" Address
    |--------------------------------------------------------------------------
    |
    | You may wish for all emails sent by your application to be sent from
    | the same address. Here you may specify a name and address that is
    | used globally for all emails that are sent by your application.
    |
    */

    'from' => [
        'address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
        'name' => env('MAIL_FROM_NAME', 'Example'),
    ],

];

```

# config\queue.php

```php
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Queue Connection Name
    |--------------------------------------------------------------------------
    |
    | Laravel's queue supports a variety of backends via a single, unified
    | API, giving you convenient access to each backend using identical
    | syntax for each. The default queue connection is defined below.
    |
    */

    'default' => env('QUEUE_CONNECTION', 'database'),

    /*
    |--------------------------------------------------------------------------
    | Queue Connections
    |--------------------------------------------------------------------------
    |
    | Here you may configure the connection options for every queue backend
    | used by your application. An example configuration is provided for
    | each backend supported by Laravel. You're also free to add more.
    |
    | Drivers: "sync", "database", "beanstalkd", "sqs", "redis", "null"
    |
    */

    'connections' => [

        'sync' => [
            'driver' => 'sync',
        ],

        'database' => [
            'driver' => 'database',
            'connection' => env('DB_QUEUE_CONNECTION'),
            'table' => env('DB_QUEUE_TABLE', 'jobs'),
            'queue' => env('DB_QUEUE', 'default'),
            'retry_after' => (int) env('DB_QUEUE_RETRY_AFTER', 90),
            'after_commit' => false,
        ],

        'beanstalkd' => [
            'driver' => 'beanstalkd',
            'host' => env('BEANSTALKD_QUEUE_HOST', 'localhost'),
            'queue' => env('BEANSTALKD_QUEUE', 'default'),
            'retry_after' => (int) env('BEANSTALKD_QUEUE_RETRY_AFTER', 90),
            'block_for' => 0,
            'after_commit' => false,
        ],

        'sqs' => [
            'driver' => 'sqs',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'prefix' => env('SQS_PREFIX', 'https://sqs.us-east-1.amazonaws.com/your-account-id'),
            'queue' => env('SQS_QUEUE', 'default'),
            'suffix' => env('SQS_SUFFIX'),
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
            'after_commit' => false,
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => env('REDIS_QUEUE_CONNECTION', 'default'),
            'queue' => env('REDIS_QUEUE', 'default'),
            'retry_after' => (int) env('REDIS_QUEUE_RETRY_AFTER', 90),
            'block_for' => null,
            'after_commit' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Job Batching
    |--------------------------------------------------------------------------
    |
    | The following options configure the database and table that store job
    | batching information. These options can be updated to any database
    | connection and table which has been defined by your application.
    |
    */

    'batching' => [
        'database' => env('DB_CONNECTION', 'sqlite'),
        'table' => 'job_batches',
    ],

    /*
    |--------------------------------------------------------------------------
    | Failed Queue Jobs
    |--------------------------------------------------------------------------
    |
    | These options configure the behavior of failed queue job logging so you
    | can control how and where failed jobs are stored. Laravel ships with
    | support for storing failed jobs in a simple file or in a database.
    |
    | Supported drivers: "database-uuids", "dynamodb", "file", "null"
    |
    */

    'failed' => [
        'driver' => env('QUEUE_FAILED_DRIVER', 'database-uuids'),
        'database' => env('DB_CONNECTION', 'sqlite'),
        'table' => 'failed_jobs',
    ],

];

```

# config\sanctum.php

```php
<?php

use Laravel\Sanctum\Sanctum;

return [

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:3000,127.0.0.1:8000,::1',
        Sanctum::currentApplicationUrlWithPort(),
        env('FRONTEND_URL') ? ','.parse_url(env('FRONTEND_URL'), PHP_URL_HOST) : ''
    ))),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Guards
    |--------------------------------------------------------------------------
    |
    | This array contains the authentication guards that will be checked when
    | Sanctum is trying to authenticate a request. If none of these guards
    | are able to authenticate the request, Sanctum will use the bearer
    | token that's present on an incoming request for authentication.
    |
    */

    'guard' => ['api'],

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    |
    | This value controls the number of minutes until an issued token will be
    | considered expired. This will override any values set in the token's
    | "expires_at" attribute, but first-party sessions are not affected.
    |
    */

    'expiration' => null,

    /*
    |--------------------------------------------------------------------------
    | Token Prefix
    |--------------------------------------------------------------------------
    |
    | Sanctum can prefix new tokens in order to take advantage of numerous
    | security scanning initiatives maintained by open source platforms
    | that notify developers if they commit tokens into repositories.
    |
    | See: https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning
    |
    */

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Middleware
    |--------------------------------------------------------------------------
    |
    | When authenticating your first-party SPA with Sanctum you may need to
    | customize some of the middleware Sanctum uses while processing the
    | request. You may change the middleware listed below as required.
    |
    */

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => Illuminate\Cookie\Middleware\EncryptCookies::class,
        'validate_csrf_token' => Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class,
    ],

];

```

# config\services.php

```php
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect' => env('GOOGLE_CLIENT_REDIRECT','http://localhost:8000/auth/google/callback'),
    ],

];

```

# config\session.php

```php
<?php

use Illuminate\Support\Str;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Session Driver
    |--------------------------------------------------------------------------
    |
    | This option determines the default session driver that is utilized for
    | incoming requests. Laravel supports a variety of storage options to
    | persist session data. Database storage is a great default choice.
    |
    | Supported: "file", "cookie", "database", "memcached",
    |            "redis", "dynamodb", "array"
    |
    */

    'driver' => env('SESSION_DRIVER', 'database'),

    /*
    |--------------------------------------------------------------------------
    | Session Lifetime
    |--------------------------------------------------------------------------
    |
    | Here you may specify the number of minutes that you wish the session
    | to be allowed to remain idle before it expires. If you want them
    | to expire immediately when the browser is closed then you may
    | indicate that via the expire_on_close configuration option.
    |
    */

    'lifetime' => (int) env('SESSION_LIFETIME', 120),

    'expire_on_close' => env('SESSION_EXPIRE_ON_CLOSE', false),

    /*
    |--------------------------------------------------------------------------
    | Session Encryption
    |--------------------------------------------------------------------------
    |
    | This option allows you to easily specify that all of your session data
    | should be encrypted before it's stored. All encryption is performed
    | automatically by Laravel and you may use the session like normal.
    |
    */

    'encrypt' => env('SESSION_ENCRYPT', false),

    /*
    |--------------------------------------------------------------------------
    | Session File Location
    |--------------------------------------------------------------------------
    |
    | When utilizing the "file" session driver, the session files are placed
    | on disk. The default storage location is defined here; however, you
    | are free to provide another location where they should be stored.
    |
    */

    'files' => storage_path('framework/sessions'),

    /*
    |--------------------------------------------------------------------------
    | Session Database Connection
    |--------------------------------------------------------------------------
    |
    | When using the "database" or "redis" session drivers, you may specify a
    | connection that should be used to manage these sessions. This should
    | correspond to a connection in your database configuration options.
    |
    */

    'connection' => env('SESSION_CONNECTION'),

    /*
    |--------------------------------------------------------------------------
    | Session Database Table
    |--------------------------------------------------------------------------
    |
    | When using the "database" session driver, you may specify the table to
    | be used to store sessions. Of course, a sensible default is defined
    | for you; however, you're welcome to change this to another table.
    |
    */

    'table' => env('SESSION_TABLE', 'sessions'),

    /*
    |--------------------------------------------------------------------------
    | Session Cache Store
    |--------------------------------------------------------------------------
    |
    | When using one of the framework's cache driven session backends, you may
    | define the cache store which should be used to store the session data
    | between requests. This must match one of your defined cache stores.
    |
    | Affects: "dynamodb", "memcached", "redis"
    |
    */

    'store' => env('SESSION_STORE'),

    /*
    |--------------------------------------------------------------------------
    | Session Sweeping Lottery
    |--------------------------------------------------------------------------
    |
    | Some session drivers must manually sweep their storage location to get
    | rid of old sessions from storage. Here are the chances that it will
    | happen on a given request. By default, the odds are 2 out of 100.
    |
    */

    'lottery' => [2, 100],

    /*
    |--------------------------------------------------------------------------
    | Session Cookie Name
    |--------------------------------------------------------------------------
    |
    | Here you may change the name of the session cookie that is created by
    | the framework. Typically, you should not need to change this value
    | since doing so does not grant a meaningful security improvement.
    |
    */

    'cookie' => env(
        'SESSION_COOKIE',
        Str::slug(env('APP_NAME', 'laravel'), '_').'_session'
    ),

    /*
    |--------------------------------------------------------------------------
    | Session Cookie Path
    |--------------------------------------------------------------------------
    |
    | The session cookie path determines the path for which the cookie will
    | be regarded as available. Typically, this will be the root path of
    | your application, but you're free to change this when necessary.
    |
    */

    'path' => env('SESSION_PATH', '/'),

    /*
    |--------------------------------------------------------------------------
    | Session Cookie Domain
    |--------------------------------------------------------------------------
    |
    | This value determines the domain and subdomains the session cookie is
    | available to. By default, the cookie will be available to the root
    | domain and all subdomains. Typically, this shouldn't be changed.
    |
    */

    'domain' => env('SESSION_DOMAIN'),

    /*
    |--------------------------------------------------------------------------
    | HTTPS Only Cookies
    |--------------------------------------------------------------------------
    |
    | By setting this option to true, session cookies will only be sent back
    | to the server if the browser has a HTTPS connection. This will keep
    | the cookie from being sent to you when it can't be done securely.
    |
    */

    'secure' => env('SESSION_SECURE_COOKIE'),

    /*
    |--------------------------------------------------------------------------
    | HTTP Access Only
    |--------------------------------------------------------------------------
    |
    | Setting this value to true will prevent JavaScript from accessing the
    | value of the cookie and the cookie will only be accessible through
    | the HTTP protocol. It's unlikely you should disable this option.
    |
    */

    'http_only' => env('SESSION_HTTP_ONLY', true),

    /*
    |--------------------------------------------------------------------------
    | Same-Site Cookies
    |--------------------------------------------------------------------------
    |
    | This option determines how your cookies behave when cross-site requests
    | take place, and can be used to mitigate CSRF attacks. By default, we
    | will set this value to "lax" to permit secure cross-site requests.
    |
    | See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#samesitesamesite-value
    |
    | Supported: "lax", "strict", "none", null
    |
    */

    'same_site' => env('SESSION_SAME_SITE', 'lax'),

    /*
    |--------------------------------------------------------------------------
    | Partitioned Cookies
    |--------------------------------------------------------------------------
    |
    | Setting this value to true will tie the cookie to the top-level site for
    | a cross-site context. Partitioned cookies are accepted by the browser
    | when flagged "secure" and the Same-Site attribute is set to "none".
    |
    */

    'partitioned' => env('SESSION_PARTITIONED_COOKIE', false),

];

```

# database\.gitignore

```
*.sqlite*

```

# database\database.sqlite

This is a binary file of the type: Binary

# database\factories\UserFactory.php

```php
<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}

```

# database\migrations\0001_01_01_000000_create_users_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('firstname');
            $table->string('lastname');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('country');
            $table->string('city')->nullable();
            $table->string('postal_code')->nullable();
            $table->string('profile_image')->nullable();
            $table->string('company_name')->nullable();
            $table->string('website')->nullable();
            $table->string('business_address')->nullable();
            $table->string('phone')->nullable();
            $table->enum('role', ['Investor', 'Sponsor', 'Inspector', 'Administrator'])->nullable();
            $table->timestamp('accepted_terms_at')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('google_id')->nullable();
            $table->tinyInteger('stage_completed')->default(1);
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};

```

# database\migrations\0001_01_01_000001_create_cache_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->mediumText('value');
            $table->integer('expiration');
        });

        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('owner');
            $table->integer('expiration');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cache');
        Schema::dropIfExists('cache_locks');
    }
};

```

# database\migrations\0001_01_01_000002_create_jobs_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue')->index();
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
        });

        Schema::create('job_batches', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->integer('total_jobs');
            $table->integer('pending_jobs');
            $table->integer('failed_jobs');
            $table->longText('failed_job_ids');
            $table->mediumText('options')->nullable();
            $table->integer('cancelled_at')->nullable();
            $table->integer('created_at');
            $table->integer('finished_at')->nullable();
        });

        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('failed_jobs');
    }
};

```

# database\migrations\2024_07_01_000001_add_current_step_and_completed_steps_to_business_information_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('business_information', function (Blueprint $table) {
            $table->integer('current_step')->default(1);
            $table->json('completed_steps')->default(json_encode([]));
        });
    }

    public function down(): void
    {
        Schema::table('business_information', function (Blueprint $table) {
            $table->dropColumn(['current_step', 'completed_steps']);
        });
    }
}; 
```

# database\migrations\2024_07_01_000002_add_current_step_and_completed_steps_to_company_representatives_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('company_representatives', function (Blueprint $table) {
            $table->json('completed_steps')->default(json_encode([]));
        });
    }

    public function down(): void
    {
        Schema::table('company_representatives', function (Blueprint $table) {
            $table->dropColumn('completed_steps');
        });
    }
}; 
```

# database\migrations\2025_06_05_235800_create_personal_access_tokens_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};

```

# database\migrations\2025_06_06_002154_add_two_factor_columns_to_users_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('two_factor_secret')
                ->after('password')
                ->nullable();

            $table->text('two_factor_recovery_codes')
                ->after('two_factor_secret')
                ->nullable();

            $table->timestamp('two_factor_confirmed_at')
                ->after('two_factor_recovery_codes')
                ->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'two_factor_secret',
                'two_factor_recovery_codes',
                'two_factor_confirmed_at',
            ]);
        });
    }
};

```

# database\migrations\2025_06_06_003101_create_personal_access_tokens_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personal_access_tokens');
    }
};

```

# database\migrations\2025_06_27_142548_create_business_information_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('business_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            // Step 1: Company Overview
            $table->string('preferred_currency')->nullable();
            $table->string('business_type')->nullable();
            $table->string('years_in_business')->nullable();
            $table->json('company_history')->nullable();
            $table->string('company_history_file_path')->nullable();
            $table->text('company_history_text')->nullable();

            $table->json('primary_focus')->nullable();

            // Step 2: Project Track Record
            $table->json('project_details')->nullable(); 
            $table->string('average_roi')->nullable();
            $table->json('projected_completion_time')->nullable();
            $table->string('actual_completion_time')->nullable();

            // Step 3: Investment Details
            $table->json('funding_structure')->nullable(); 
            $table->json('exit_strategy')->nullable();     
            $table->string('investment_currency')->nullable();
            $table->string('investment_size_range')->nullable();
            $table->boolean('raised_capital_before')->nullable();
            $table->json('investor_relationship')->nullable(); 
            $table->boolean('issues_with_payments')->nullable();
            $table->text('payment_issues_details')->nullable();

            // Step 4: Risk & Compliance
            $table->boolean('over_budget_projects')->nullable();
            $table->text('over_budget_handling')->nullable();
            $table->string('capital_percentage')->nullable();
            $table->json('interested_investment_types')->nullable(); 
            $table->boolean('legal_issues')->nullable();
            $table->text('legal_issues_details')->nullable();
            $table->text('compliance_details')->nullable();

            // Step 5: Communication & Final
            $table->string('update_frequency')->nullable();
            $table->json('social_links')->nullable();
            $table->json('supporting_documents')->nullable(); 
            $table->json('references')->nullable();

            $table->boolean('terms_accepted')->default(false);
            $table->string('status')->default('pending');
            $table->boolean('is_draft')->default(true);
            $table->integer('current_step')->default(1);
            $table->json('completed_steps')->default(json_encode([]));

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_information');
    }
};

```

# database\migrations\2025_07_01_000001_create_investments_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('investments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('project_uploads')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('amount');
            $table->string('status')->default('pending');
            $table->timestamp('invested_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('investments');
    }
}; 
```

# database\migrations\2025_07_01_000002_create_payouts_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payouts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('project_uploads')->onDelete('cascade');
            $table->string('amount');
            $table->timestamp('scheduled_date');
            $table->string('status')->default('pending');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payouts');
    }
}; 
```

# database\migrations\2025_07_10_123620_create_company_representatives_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('company_representatives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->integer('current_step')->default(1);

            // Step 1 Fields
            $table->string('relationship');
            $table->string('first_name');
            $table->string('last_name');
            $table->string('identification_type');
            $table->string('bvn')->nullable();
            $table->string('nin')->nullable();
            $table->string('social_security_number')->nullable();
            $table->text('address');
            $table->string('utility_bill')->nullable();
            $table->string('facial_capture')->nullable();
            $table->enum('facial_capture_status', ['pass', 'fail', 'not_attempted'])->default('not_attempted');

            // Step 2 Fields
            $table->string('bank_name')->nullable();
            $table->string('bank_branch')->nullable();
            $table->string('account_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('swift_code')->nullable();
            $table->string('sort_code')->nullable();
            $table->string('iban')->nullable();
            $table->string('routing_number')->nullable();
            $table->string('account_currency')->nullable();

            $table->boolean('terms_accepted')->nullable();
            $table->string('status')->default('pending');
            $table->boolean('is_completed')->default(false);
            $table->json('completed_steps')->default(json_encode([]));

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_representatives');
    }
};

```

# database\migrations\2025_08_06_001110_create_project_uploads_table.php

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('project_uploads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sponsor_id')->constrained('users');
            
            // Step 1 fields
            $table->string('currency'); 
            $table->string('sponsor_name', 100);
            $table->string('sponsor_logo_path')->nullable();
            
            // Step 2 fields
            $table->string('project_name', 100)->nullable();
            $table->string('project_subtitle', 100)->nullable();
            $table->text('project_summary')->nullable();
            $table->string('years_of_active_operation', 20)->nullable();
            $table->string('historical_portfolio_activity')->nullable();
            $table->string('assets_under_management')->nullable();
            $table->integer('realized_projects')->nullable();
            $table->integer('rc_brown_capital_offerings')->nullable();

                        
            // Step 4 fields
            $table->string('projected_valuation')->nullable();
            $table->string('timeline_of_completion_months')->nullable();
            $table->string('total_capital_required')->nullable();
            $table->string('total_debt_allocation_percent')->nullable();
            $table->string('debt_investment_tenure')->nullable();
            $table->string('debt_yield_percent')->nullable();
            $table->enum('debt_periodic_payment', ['monthly', 'quarterly', 'annually', 'biannually','no'])->nullable();
            $table->string('equity_investment_tenure')->nullable();
            $table->string('projected_returns_equity_percent')->nullable();
            $table->enum('equity_periodic_payment', ['monthly', 'quarterly', 'annually', 'biannually','no'])->nullable();
            $table->string('total_equity_allocation')->nullable();
            
            // Step 4 Property fields
            $table->string('property_address')->nullable();
            $table->text('location_description')->nullable();
            $table->enum('occupancy', ['vacant', 'partially_occupied', 'fully_occupied'])->nullable();
            $table->longText('about_property')->nullable();
            $table->longText('detailed_project_description')->nullable();
            $table->boolean('has_anchor_tenant')->nullable();
            $table->longText('anchor_tenant_details')->nullable();
            $table->boolean('has_anchor_buyer')->nullable();
            $table->longText('anchor_buyer_details')->nullable();
            $table->string('percent_leased')->nullable();
            $table->string('sq_ft_leased')->nullable();
            
            // Step 5 fields
            $table->string('investment_hold_period')->nullable();
            $table->date('acquisition_date')->nullable();
            $table->date('closing_date')->nullable();
            $table->date('target_exit_date_debt')->nullable();
            $table->date('target_exit_date_equity')->nullable();
            $table->date('offer_live_date')->nullable();
            $table->date('offer_closing_date')->nullable();
            $table->date('funds_due_date')->nullable();
            $table->date('target_escrow_closing_date')->nullable();
            $table->date('targeted_distribution_start_date_debt')->nullable();
            $table->date('targeted_distribution_start_date_equity')->nullable();
            $table->date('distributions_anticipated_begin_date')->nullable();
            $table->enum('frequency_of_distributions', ['monthly', 'quarterly', 'annually', 'at_maturity'])->nullable(); 
            
            // Step 6 fields
            $table->longText('sponsor_background')->nullable();
            $table->string('years_in_operation')->nullable();
            $table->string('historical_portfolio_activity_amount')->nullable();
            $table->string('projects_under_management_amount')->nullable();
            $table->string('total_square_feet_managed')->nullable();
            $table->integer('deals_funded_by_rc_brown')->nullable();
            $table->integer('number_of_properties_under_management')->nullable();
            $table->integer('total_number_of_realized_projects')->nullable();
            $table->integer('number_of_properties_developed')->nullable();
            $table->integer('number_of_properties_built_sold')->nullable();
            $table->string('highest_budget_for_project')->nullable();
            $table->integer('average_length_of_completion_months')->nullable();
            $table->json('full_track_record')->nullable();
                        
            // Step 8 fields
            $table->enum('offerings', ['equity', 'debt', 'both'])->nullable(); 
            $table->string('total_capitalization')->nullable();
            $table->string('debt_allocation')->nullable();
            $table->string('equity_allocation')->nullable();
            $table->string('sponsor_co_invest_range')->nullable();
            $table->date('offer_deadline')->nullable();
            $table->string('location')->nullable();
            $table->string('asset_type')->nullable();
            $table->string('strategy')->nullable();
            $table->string('objective')->nullable();
            
            // Step 8 Debt Details
            $table->string('debt_allocation_percent')->nullable();
            $table->string('debt_distribution_period')->nullable();
            $table->date('debt_target_distribution_start_date')->nullable();
            $table->string('debt_minimum_investment_amount')->nullable();
            $table->string('debt_maximum_investment_amount')->nullable();
            $table->string('debt_return_on_investment')->nullable();
            $table->string('debt_expected_minimum_annual_return')->nullable();
            $table->string('debt_expected_maximum_annual_return')->nullable();
            $table->string('debt_target_hold_period_years')->nullable();
            $table->date('debt_exit_date')->nullable();

            // Step 8 Expenses Details
            $table->string('expenses_taxes')->nullable();
            $table->string('expenses_insurance')->nullable();
            $table->string('expenses_management')->nullable();
            $table->string('expenses_repairs')->nullable();
            $table->string('expenses_utilities')->nullable();
            $table->string('expenses_interest')->nullable();
            $table->string('expenses_total')->nullable();
            $table->string('expenses_total_rental_income')->nullable();
            $table->json('expenses_additional')->nullable();
            
            // Step 8 Equity Details
            $table->string('equity_allocation_percent')->nullable();
            $table->enum('equity_distribution_frequency', ['monthly', 'quarterly', 'annually', 'semi_annually'])->nullable(); 
            $table->date('equity_target_distribution_start_date')->nullable();
            $table->string('equity_minimum_investment')->nullable();
            $table->string('equity_maximum_investment')->nullable();
            $table->date('equity_exit_date')->nullable();
            $table->string('equity_return_on_investment')->nullable();
            $table->string('equity_expected_minimum_return')->nullable();
            $table->string('equity_expected_maximum_return')->nullable();
            $table->string('equity_target_hold_period_years')->nullable();
            
            // Step 9 fields
            $table->string('budget_sheet_property_address')->nullable();
            $table->string('city')->nullable();
            $table->string('state')->nullable();
            $table->string('zip_code')->nullable();
            $table->text('in_depth_description_of_work')->nullable();
            $table->integer('project_timeline_months')->nullable();
            $table->boolean('adding_square_footage')->default(false);
            $table->string('square_footage_expansion_plan')->nullable();
            $table->decimal('total_construction_cost', 20, 2)->nullable();
            
            // Step 10 fields - Updated
            $table->json('picture_uploads')->nullable(); 
            $table->json('slides_uploads')->nullable(); 
            $table->json('video_uploads')->nullable(); 
            $table->string('fund_wallet_amount')->nullable(); 
            
            // Acknowledgement form fields
            $table->string('acknowledgement_form_pdf_path')->nullable();
            $table->string('signed_acknowledgement_form_path')->nullable();
            $table->timestamp('acknowledgement_form_signed_at')->nullable();
            $table->boolean('acknowledgement_form_signed')->default(false);
            
            // Progress tracking
            $table->enum('status', ['draft', 'pending', 'approved', 'rejected'])->default('draft');
            $table->integer('current_step')->default(1); 
            $table->json('completed_steps')->nullable(); 
            $table->timestamp('submitted_at')->nullable(); 
            
            $table->timestamps();
            $table->softDeletes();
        });

        // Step 3 Migration - Business Plan Ratings, Deal Snapshots, and Risk Considerations
        Schema::create('project_business_plan_ratings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('project_uploads')->onDelete('cascade');
            $table->string('category'); 
            $table->enum('input_rating', ['low', 'medium', 'high']); 
            $table->timestamps();
        });

        Schema::create('project_deal_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('project_uploads')->onDelete('cascade');
            $table->string('header');
            $table->text('description');
            $table->timestamps();
        });

        Schema::create('project_risk_considerations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('project_uploads')->onDelete('cascade');
            $table->string('potential_risk');
            $table->text('assessment_mitigation');
            $table->timestamps();
        });

        // Step 7 Migration - Physical Descriptions and Documents
        Schema::create('project_physical_descriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('project_uploads')->onDelete('cascade');
            $table->string('description_title');
            $table->text('description');
            $table->timestamps();
        });

        Schema::create('project_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('project_uploads')->onDelete('cascade');
            $table->enum('category', [
                'site_documents',
                'closing_documents', 
                'offering_information', 
                'sponsor_information', 
                'additional'
            ]); 
            $table->string('subcategory')->nullable(); 
            $table->string('document_name')->nullable(); 
            $table->string('file_path');
            $table->string('file_type'); 
            $table->string('original_filename');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // Step 9 Migration - Budget Sheet
        Schema::create('project_budget_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('project_uploads')->onDelete('cascade');
            $table->string('line_item');
            $table->text('description')->nullable();
            $table->text('scope_of_work')->nullable();
            $table->decimal('budget_amount', 15, 2);
            $table->timestamps();
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('project_additional_expenses');
        Schema::dropIfExists('project_budget_items');
        Schema::dropIfExists('project_documents');
        Schema::dropIfExists('project_physical_descriptions');
        Schema::dropIfExists('project_risk_considerations');
        Schema::dropIfExists('project_deal_snapshots');
        Schema::dropIfExists('project_business_plan_ratings');
        Schema::dropIfExists('project_uploads');
    }
};

```

# database\seeders\DatabaseSeeder.php

```php
<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}

```

# phpunit.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true"
>
    <testsuites>
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory>tests/Feature</directory>
        </testsuite>
    </testsuites>
    <source>
        <include>
            <directory>app</directory>
        </include>
    </source>
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="APP_MAINTENANCE_DRIVER" value="file"/>
        <env name="BCRYPT_ROUNDS" value="4"/>
        <env name="CACHE_STORE" value="array"/>
        <env name="DB_CONNECTION" value="sqlite"/>
        <env name="DB_DATABASE" value=":memory:"/>
        <env name="MAIL_MAILER" value="array"/>
        <env name="PULSE_ENABLED" value="false"/>
        <env name="QUEUE_CONNECTION" value="sync"/>
        <env name="SESSION_DRIVER" value="array"/>
        <env name="TELESCOPE_ENABLED" value="false"/>
    </php>
</phpunit>

```

# public\.htaccess

```
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Handle X-XSRF-Token Header
    RewriteCond %{HTTP:x-xsrf-token} .
    RewriteRule .* - [E=HTTP_X_XSRF_TOKEN:%{HTTP:X-XSRF-Token}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>

```

# public\favicon.ico

```ico

```

# public\index.php

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());

```

# public\robots.txt

```txt
User-agent: *
Disallow:

```

# README.md

```md
<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

```

# resources\views\.gitkeep

```


```

# resources\views\acknowledgemnet_form.blade.php

```php
<!DOCTYPE html>
<html>
<head>
    <title>Acknowledgement Form - {{ $project->project_name }}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        h1 { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .signature-area { margin-top: 100px; }
    </style>
</head>
<body>
    <h1>ACKNOWLEDGEMENT AND DISCLAIMER FORM</h1>
    
    <div class="section">
        <h2>Project Details</h2>
        <p><strong>Project Name:</strong> {{ $project->project_name }}</p>
        <p><strong>Sponsor:</strong> {{ $project->sponsor_name }}</p>
        <p><strong>Date:</strong> {{ $date }}</p>
    </div>
    
    <div class="section">
        <h2>ACKNOWLEDGEMENT</h2>
        <p>I acknowledge that I have reviewed all project details and agree to the terms and conditions outlined in this document.</p>
    </div>
    
    <div class="section">
        <h2>DISCLAIMER</h2>
        <p>This disclaimer outlines the risks and terms associated with this investment opportunity. By signing this form, I acknowledge that I understand the risks involved.</p>
    </div>
    
    <div class="signature-area">
        <p>SIGNATURE: _________________________________________</p>
        <p>DATE: ___________________________</p>
    </div>
</body>
</html>
```

# resources\views\welcome.blade.php

```php
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RC Brown Capital API</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <style>
        :root {
            --primary: #4361ee;
            --secondary: #3a0ca3;
            --accent: #f72585;
            --light: #f8f9fa;
            --dark: #212529;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            color: var(--dark);
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        header {
            text-align: center;
            padding: 3rem 0;
        }
        
        .logo {
            width: 120px;
            height: 120px;
            margin: 0 auto;
            background: var(--primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2rem;
            font-weight: bold;
            box-shadow: 0 10px 30px rgba(67, 97, 238, 0.3);
            animation: pulse 2s infinite;
        }
        
        h1 {
            font-size: 3rem;
            margin: 1.5rem 0;
            color: var(--secondary);
            background: linear-gradient(to right, var(--primary), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .tagline {
            font-size: 1.5rem;
            color: var(--dark);
            margin-bottom: 2rem;
            opacity: 0;
            animation: fadeIn 1s ease-in forwards;
        }
        
        .api-card {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            margin: 2rem 0;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
            opacity: 0;
            animation: slideUp 0.8s ease-in forwards;
            animation-delay: 0.3s;
        }
        
        .api-card:hover {
            transform: translateY(-5px);
        }
        
        .endpoint {
            display: flex;
            margin: 1.5rem 0;
            align-items: center;
        }
        
        .method {
            padding: 0.5rem 1rem;
            border-radius: 5px;
            font-weight: bold;
            margin-right: 1rem;
            min-width: 80px;
            text-align: center;
        }
        
        .get { background: #48bb78; color: white; }
        .post { background: #4299e1; color: white; }
        .put { background: #ed8936; color: white; }
        .delete { background: #f56565; color: white; }
        
        .path {
            font-family: monospace;
            background: #f8f9fa;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            flex-grow: 1;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }
        
        .feature {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            opacity: 0;
            animation: fadeIn 0.8s ease-in forwards;
        }
        
        .feature:nth-child(1) { animation-delay: 0.5s; }
        .feature:nth-child(2) { animation-delay: 0.7s; }
        .feature:nth-child(3) { animation-delay: 0.9s; }
        
        .feature:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: var(--primary);
        }
        
        footer {
            text-align: center;
            padding: 3rem 0;
            margin-top: 3rem;
            color: var(--dark);
            opacity: 0;
            animation: fadeIn 1s ease-in forwards;
            animation-delay: 1s;
        }
        
        @keyframes fadeIn {
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .btn {
            display: inline-block;
            padding: 0.8rem 2rem;
            background: var(--primary);
            color: white;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
        }
        
        .btn:hover {
            background: var(--secondary);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(67, 97, 238, 0.4);
        }
        
        .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }
            
            .tagline {
                font-size: 1.2rem;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="particles" id="particles-js"></div>
    
    <div class="container">
        <header class="animate__animated animate__fadeIn">
            <div class="logo">RBC</div>
            <h1 class="animate__animated animate__fadeIn">RC Brown Capital API</h1>
            <p class="tagline">Premium property listing API for real estate platforms</p>
        </header>
        
        <div class="api-card">
            <h2>API Endpoints</h2>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <span class="path">/api/v1/business-info</span>
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <span class="path">/api/v1/business-info</span>
            </div>
            
            <div class="endpoint">
                <span class="method put">PUT</span>
                <span class="path">/api/v1/business-info/{id}</span>
            </div>
            
            <div class="endpoint">
                <span class="method delete">DELETE</span>
                <span class="path">/api/v1/business-info/{id}</span>
            </div>
            
            <a href="#" class="btn">View Full Documentation</a>
        </div>
        
        <div class="features">
            <div class="feature">
                <div class="feature-icon">⚡</div>
                <h3>High Performance</h3>
                <p>Our API is built for speed with response times under 100ms for most requests.</p>
            </div>
            
            <div class="feature">
                <div class="feature-icon">🔒</div>
                <h3>Secure</h3>
                <p>Enterprise-grade security with OAuth 2.0, JWT tokens, and rate limiting.</p>
            </div>
            
            <div class="feature">
                <div class="feature-icon">📊</div>
                <h3>Real-time Data</h3>
                <p>Access to real-time financial data with WebSocket support.</p>
            </div>
        </div>
        
        <footer>
            <p>© 2025 RC Brown Capital. All Rights Reserved.</p>
            <p>Need help? <a href="mailto:support@rcbrownhomes.com">Contact our team</a></p>
        </footer>
    </div>
    
    <!-- Particles.js for background animation -->
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script>
        // Initialize particles.js
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#4361ee"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#3a0ca3",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "push": {
                        "particles_nb": 4
                    }
                }
            },
            "retina_detect": true
        });
        
        // Animate elements when they come into view
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.feature, .api-card, footer');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                }
            });
        };
        
        window.addEventListener('scroll', animateOnScroll);
        // Trigger once on load
        animateOnScroll();
    </script>
</body>
</html>
```

# routes\api.php

```php
<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\TwoFactorAuthenticationController;
use App\Http\Controllers\Auth\UserProfileController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Sponsor\BusinessInformationController;
use App\Http\Controllers\Sponsor\CompanyRepresentativeController;
use App\Http\Controllers\Sponsor\ProjectUploadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


// Public routes
Route::middleware(['guest'])->group(function () {
    // AUTHENTICATION
    Route::post('register/investor', [RegisteredUserController::class, 'registerInvestor'])->name('register.investor');
    Route::post('register/sponsor', [RegisteredUserController::class, 'registerSponsor'])->name('register.sponsor');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login');

    // GOOGLE AUTH
    Route::get('/auth/google/redirect', [GoogleController::class, 'redirectToGoogle']);
    Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

    // forgot password
    Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])->name('password.email');
    // reset password
    Route::post('/reset-password', [NewPasswordController::class, 'store'])->name('password.store');
    Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)->middleware([ 'signed', 'throttle:6,1'])->name('verification.verify');

});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])->middleware(['throttle:6,1'])->name('verification.send');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::get('/onboarding-status', [AuthenticatedSessionController::class, 'getOnboardingStatus'])->name('onboarding-status');

    // User profile
    Route::get('/user/profile', [UserProfileController::class, 'show']);
    Route::put('/user/profile/basic-info', [UserProfileController::class, 'updateBasicInfo']);
    Route::post('/user/profile/image', [UserProfileController::class, 'updateProfileImage']);
    Route::delete('/user/profile/image', [UserProfileController::class, 'deleteProfileImage']);

    // 2FA routes (Fortify)
    Route::post('/two-factor-authentication', [TwoFactorAuthenticationController::class, 'store']);
    Route::delete('/two-factor-authentication', [TwoFactorAuthenticationController::class, 'destroy']);
    Route::get('/two-factor-qr-code', [TwoFactorAuthenticationController::class, 'show']);
    Route::post('/two-factor-recovery-codes', [TwoFactorAuthenticationController::class, 'update']);
    Route::post('/verify-two-factor-code', [TwoFactorAuthenticationController::class, 'verify']);

    // business information
    Route::post('/sponsor-business-information', [BusinessInformationController::class, 'store']);
    Route::post('/sponsor-business-information/save-step/{step}', [BusinessInformationController::class, 'saveStep']);
    // company representative
    Route::post('/company-representative', [CompanyRepresentativeController::class, 'store']);
    Route::post('/company-representative/save-step/{step}', [CompanyRepresentativeController::class, 'saveStep']);
    // sponsor dashboard metrics
    Route::get('/sponsor/dashboard-metrics', [\App\Http\Controllers\Sponsor\SponsorDashboardController::class, 'metrics']);
    // projects upload
        Route::prefix('sponsor-projects')->group(function () {
            // Project initialization and management
            Route::get('/initialize', [ProjectUploadController::class, 'initialize']);
            Route::post('/start', [ProjectUploadController::class, 'store']); // Step 1 - Create new project
            
            // Universal save & exit functionality for any step
            Route::post('/{project}/save-step/{step}', [ProjectUploadController::class, 'saveStep']);
            
            // Individual step save endpoints (alternative approach)
            Route::post('/{project}/save-step1', [ProjectUploadController::class, 'saveStep1']);
            Route::post('/{project}/save-step2', [ProjectUploadController::class, 'saveStep2']);
            Route::post('/{project}/save-step3', [ProjectUploadController::class, 'saveStep3']);
            Route::post('/{project}/save-step4', [ProjectUploadController::class, 'saveStep4']);
            Route::post('/{project}/save-step5', [ProjectUploadController::class, 'saveStep5']);
            Route::post('/{project}/save-step6', [ProjectUploadController::class, 'saveStep6']);
            Route::post('/{project}/save-step7', [ProjectUploadController::class, 'saveStep7']);
            Route::post('/{project}/save-step8', [ProjectUploadController::class, 'saveStep8']);
            Route::post('/{project}/save-step9', [ProjectUploadController::class, 'saveStep9']);
            Route::post('/{project}/save-step10', [ProjectUploadController::class, 'saveStep10']);
            
            // Project management
            Route::get('/', [ProjectUploadController::class, 'index']); // List all projects
            Route::get('/{project}', [ProjectUploadController::class, 'show']); // Get single project
            Route::put('/{project}', [ProjectUploadController::class, 'update']); // Update project
            Route::delete('/{project}', [ProjectUploadController::class, 'destroy']); // Delete project
            
            // Final submission
            Route::post('/{project}/submit', [ProjectUploadController::class, 'submitForApproval']);
            
            // Step 7 specific routes
            Route::get('/document-options', [ProjectUploadController::class, 'getDocumentOptions']);
            Route::get('/{project}/documents/{category?}', [ProjectUploadController::class, 'getProjectDocuments']);
            
            // File upload route (for all file uploads across steps)
            Route::post('/{project}/upload-file', [ProjectUploadController::class, 'uploadFile']);
        });
    
    // File upload route (for all file uploads across steps)
    Route::post('/upload-file', [ProjectUploadController::class, 'uploadFile']);

});

// Project Upload PDF and Signing Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/project-uploads/{project}/download-acknowledgement-form', [ProjectUploadController::class, 'downloadAcknowledgementForm']);
    Route::post('/project-uploads/{project}/submit-signed-acknowledgement-form', [ProjectUploadController::class, 'submitSignedAcknowledgementForm']);
    Route::get('/project-uploads/{project}/signing-status', [ProjectUploadController::class, 'getSigningStatus']);
});


```

# routes\auth.php

```php
<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use Illuminate\Support\Facades\Route;

// Route::post('/register', [RegisteredUserController::class, 'store'])
//     ->middleware('guest')
//     ->name('register');

Route::post('register/investor', [RegisteredUserController::class, 'registerInvestor'])->middleware('guest')->name('register.investor');
Route::post('register/sponsor', [RegisteredUserController::class, 'registerSponsor'])->middleware('guest')->name('register.sponsor');

Route::post('/login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('guest')
    ->name('login');

Route::post('/forgot-password', [PasswordResetLinkController::class, 'store'])
    ->middleware('guest')
    ->name('password.email');

Route::post('/reset-password', [NewPasswordController::class, 'store'])
    ->middleware('guest')
    ->name('password.store');

Route::get('/verify-email/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth', 'signed', 'throttle:6,1'])
    ->name('verification.verify');

Route::post('/email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
    ->middleware(['auth', 'throttle:6,1'])
    ->name('verification.send');

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');

```

# routes\console.php

```php
<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

```

# routes\web.php

```php
<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

require __DIR__.'/auth.php';

```

# storage\app\.gitignore

```
*
!private/
!public/
!.gitignore

```

# storage\app\private\.gitignore

```
*
!.gitignore

```

# storage\app\public\.gitignore

```
*
!.gitignore

```

# storage\framework\.gitignore

```
compiled.php
config.php
down
events.scanned.php
maintenance.php
routes.php
routes.scanned.php
schedule-*
services.json

```

# storage\framework\cache\.gitignore

```
*
!data/
!.gitignore

```

# storage\framework\cache\data\.gitignore

```
*
!.gitignore

```

# storage\framework\sessions\.gitignore

```
*
!.gitignore

```

# storage\framework\testing\.gitignore

```
*
!.gitignore

```

# storage\framework\views\.gitignore

```
*
!.gitignore

```

# storage\framework\views\1d64dee000fcc46a8153213a4dfc82f5.php

```php
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title><?php echo $__env->yieldContent('title'); ?></title>

        <style>
            /*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */html{line-height:1.15;-webkit-text-size-adjust:100%}body{margin:0}a{background-color:transparent}code{font-family:monospace,monospace;font-size:1em}[hidden]{display:none}html{font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;line-height:1.5}*,:after,:before{box-sizing:border-box;border:0 solid #e2e8f0}a{color:inherit;text-decoration:inherit}code{font-family:Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}svg,video{display:block;vertical-align:middle}video{max-width:100%;height:auto}.bg-white{--bg-opacity:1;background-color:#fff;background-color:rgba(255,255,255,var(--bg-opacity))}.bg-gray-100{--bg-opacity:1;background-color:#f7fafc;background-color:rgba(247,250,252,var(--bg-opacity))}.border-gray-200{--border-opacity:1;border-color:#edf2f7;border-color:rgba(237,242,247,var(--border-opacity))}.border-gray-400{--border-opacity:1;border-color:#cbd5e0;border-color:rgba(203,213,224,var(--border-opacity))}.border-t{border-top-width:1px}.border-r{border-right-width:1px}.flex{display:flex}.grid{display:grid}.hidden{display:none}.items-center{align-items:center}.justify-center{justify-content:center}.font-semibold{font-weight:600}.h-5{height:1.25rem}.h-8{height:2rem}.h-16{height:4rem}.text-sm{font-size:.875rem}.text-lg{font-size:1.125rem}.leading-7{line-height:1.75rem}.mx-auto{margin-left:auto;margin-right:auto}.ml-1{margin-left:.25rem}.mt-2{margin-top:.5rem}.mr-2{margin-right:.5rem}.ml-2{margin-left:.5rem}.mt-4{margin-top:1rem}.ml-4{margin-left:1rem}.mt-8{margin-top:2rem}.ml-12{margin-left:3rem}.-mt-px{margin-top:-1px}.max-w-xl{max-width:36rem}.max-w-6xl{max-width:72rem}.min-h-screen{min-height:100vh}.overflow-hidden{overflow:hidden}.p-6{padding:1.5rem}.py-4{padding-top:1rem;padding-bottom:1rem}.px-4{padding-left:1rem;padding-right:1rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.pt-8{padding-top:2rem}.fixed{position:fixed}.relative{position:relative}.top-0{top:0}.right-0{right:0}.shadow{box-shadow:0 1px 3px 0 rgba(0,0,0,.1),0 1px 2px 0 rgba(0,0,0,.06)}.text-center{text-align:center}.text-gray-200{--text-opacity:1;color:#edf2f7;color:rgba(237,242,247,var(--text-opacity))}.text-gray-300{--text-opacity:1;color:#e2e8f0;color:rgba(226,232,240,var(--text-opacity))}.text-gray-400{--text-opacity:1;color:#cbd5e0;color:rgba(203,213,224,var(--text-opacity))}.text-gray-500{--text-opacity:1;color:#a0aec0;color:rgba(160,174,192,var(--text-opacity))}.text-gray-600{--text-opacity:1;color:#718096;color:rgba(113,128,150,var(--text-opacity))}.text-gray-700{--text-opacity:1;color:#4a5568;color:rgba(74,85,104,var(--text-opacity))}.text-gray-900{--text-opacity:1;color:#1a202c;color:rgba(26,32,44,var(--text-opacity))}.uppercase{text-transform:uppercase}.underline{text-decoration:underline}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.tracking-wider{letter-spacing:.05em}.w-5{width:1.25rem}.w-8{width:2rem}.w-auto{width:auto}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}@-webkit-keyframes spin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes spin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@-webkit-keyframes ping{0%{transform:scale(1);opacity:1}75%,to{transform:scale(2);opacity:0}}@keyframes ping{0%{transform:scale(1);opacity:1}75%,to{transform:scale(2);opacity:0}}@-webkit-keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}@keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}@-webkit-keyframes bounce{0%,to{transform:translateY(-25%);-webkit-animation-timing-function:cubic-bezier(.8,0,1,1);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:translateY(0);-webkit-animation-timing-function:cubic-bezier(0,0,.2,1);animation-timing-function:cubic-bezier(0,0,.2,1)}}@keyframes bounce{0%,to{transform:translateY(-25%);-webkit-animation-timing-function:cubic-bezier(.8,0,1,1);animation-timing-function:cubic-bezier(.8,0,1,1)}50%{transform:translateY(0);-webkit-animation-timing-function:cubic-bezier(0,0,.2,1);animation-timing-function:cubic-bezier(0,0,.2,1)}}@media (min-width:640px){.sm\:rounded-lg{border-radius:.5rem}.sm\:block{display:block}.sm\:items-center{align-items:center}.sm\:justify-start{justify-content:flex-start}.sm\:justify-between{justify-content:space-between}.sm\:h-20{height:5rem}.sm\:ml-0{margin-left:0}.sm\:px-6{padding-left:1.5rem;padding-right:1.5rem}.sm\:pt-0{padding-top:0}.sm\:text-left{text-align:left}.sm\:text-right{text-align:right}}@media (min-width:768px){.md\:border-t-0{border-top-width:0}.md\:border-l{border-left-width:1px}.md\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (min-width:1024px){.lg\:px-8{padding-left:2rem;padding-right:2rem}}@media (prefers-color-scheme:dark){.dark\:bg-gray-800{--bg-opacity:1;background-color:#2d3748;background-color:rgba(45,55,72,var(--bg-opacity))}.dark\:bg-gray-900{--bg-opacity:1;background-color:#1a202c;background-color:rgba(26,32,44,var(--bg-opacity))}.dark\:border-gray-700{--border-opacity:1;border-color:#4a5568;border-color:rgba(74,85,104,var(--border-opacity))}.dark\:text-white{--text-opacity:1;color:#fff;color:rgba(255,255,255,var(--text-opacity))}.dark\:text-gray-400{--text-opacity:1;color:#cbd5e0;color:rgba(203,213,224,var(--text-opacity))}}
        </style>

        <style>
            body {
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
            }
        </style>
    </head>
    <body class="antialiased">
        <div class="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center sm:pt-0">
            <div class="max-w-xl mx-auto sm:px-6 lg:px-8">
                <div class="flex items-center pt-8 sm:justify-start sm:pt-0">
                    <div class="px-4 text-lg text-gray-500 border-r border-gray-400 tracking-wider">
                        <?php echo $__env->yieldContent('code'); ?>
                    </div>

                    <div class="ml-4 text-lg text-gray-500 uppercase tracking-wider">
                        <?php echo $__env->yieldContent('message'); ?>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Exceptions/views/minimal.blade.php ENDPATH**/ ?>
```

# storage\framework\views\4b1bba04a2a350195bba58f6b9d39ebc.php

```php
<table class="subcopy" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td>
<?php echo new \Illuminate\Support\EncodedHtmlString(Illuminate\Mail\Markdown::parse($slot)); ?>

</td>
</tr>
</table>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Mail/resources/views/html/subcopy.blade.php ENDPATH**/ ?>
```

# storage\framework\views\4f3d94867dd6b1c934344ddbbfc141b4.php

```php
<?php if (isset($component)) { $__componentOriginalaa758e6a82983efcbf593f765e026bd9 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalaa758e6a82983efcbf593f765e026bd9 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => $__env->getContainer()->make(Illuminate\View\Factory::class)->make('mail::message'),'data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('mail::message'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>

<?php if(! empty($greeting)): ?>
# <?php echo new \Illuminate\Support\EncodedHtmlString($greeting); ?>

<?php else: ?>
<?php if($level === 'error'): ?>
# <?php echo app('translator')->get('Whoops!'); ?>
<?php else: ?>
# <?php echo app('translator')->get('Hello!'); ?>
<?php endif; ?>
<?php endif; ?>


<?php $__currentLoopData = $introLines; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $line): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
<?php echo new \Illuminate\Support\EncodedHtmlString($line); ?>


<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>


<?php if(isset($actionText)): ?>
<?php
    $color = match ($level) {
        'success', 'error' => $level,
        default => 'primary',
    };
?>
<?php if (isset($component)) { $__componentOriginal15a5e11357468b3880ae1300c3be6c4f = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal15a5e11357468b3880ae1300c3be6c4f = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => $__env->getContainer()->make(Illuminate\View\Factory::class)->make('mail::button'),'data' => ['url' => $actionUrl,'color' => $color]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('mail::button'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['url' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($actionUrl),'color' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($color)]); ?>
<?php echo new \Illuminate\Support\EncodedHtmlString($actionText); ?>

 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal15a5e11357468b3880ae1300c3be6c4f)): ?>
<?php $attributes = $__attributesOriginal15a5e11357468b3880ae1300c3be6c4f; ?>
<?php unset($__attributesOriginal15a5e11357468b3880ae1300c3be6c4f); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal15a5e11357468b3880ae1300c3be6c4f)): ?>
<?php $component = $__componentOriginal15a5e11357468b3880ae1300c3be6c4f; ?>
<?php unset($__componentOriginal15a5e11357468b3880ae1300c3be6c4f); ?>
<?php endif; ?>
<?php endif; ?>


<?php $__currentLoopData = $outroLines; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $line): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
<?php echo new \Illuminate\Support\EncodedHtmlString($line); ?>


<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>


<?php if(! empty($salutation)): ?>
<?php echo new \Illuminate\Support\EncodedHtmlString($salutation); ?>

<?php else: ?>
<?php echo app('translator')->get('Regards,'); ?><br>
<?php echo new \Illuminate\Support\EncodedHtmlString(config('app.name')); ?>

<?php endif; ?>


<?php if(isset($actionText)): ?>
 <?php $__env->slot('subcopy', null, []); ?> 
<?php echo app('translator')->get(
    "If you're having trouble clicking the \":actionText\" button, copy and paste the URL below\n".
    'into your web browser:',
    [
        'actionText' => $actionText,
    ]
); ?> <span class="break-all">[<?php echo new \Illuminate\Support\EncodedHtmlString($displayableActionUrl); ?>](<?php echo new \Illuminate\Support\EncodedHtmlString($actionUrl); ?>)</span>
 <?php $__env->endSlot(); ?>
<?php endif; ?>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalaa758e6a82983efcbf593f765e026bd9)): ?>
<?php $attributes = $__attributesOriginalaa758e6a82983efcbf593f765e026bd9; ?>
<?php unset($__attributesOriginalaa758e6a82983efcbf593f765e026bd9); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalaa758e6a82983efcbf593f765e026bd9)): ?>
<?php $component = $__componentOriginalaa758e6a82983efcbf593f765e026bd9; ?>
<?php unset($__componentOriginalaa758e6a82983efcbf593f765e026bd9); ?>
<?php endif; ?>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Notifications/resources/views/email.blade.php ENDPATH**/ ?>
```

# storage\framework\views\6a15f16ae483c3810f58b676e8fc049a.php

```php
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RC Brown Capital API</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <style>
        :root {
            --primary: #4361ee;
            --secondary: #3a0ca3;
            --accent: #f72585;
            --light: #f8f9fa;
            --dark: #212529;
        }
        
        body {
            font-family: 'Poppins', sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            color: var(--dark);
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        header {
            text-align: center;
            padding: 3rem 0;
        }
        
        .logo {
            width: 120px;
            height: 120px;
            margin: 0 auto;
            background: var(--primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2rem;
            font-weight: bold;
            box-shadow: 0 10px 30px rgba(67, 97, 238, 0.3);
            animation: pulse 2s infinite;
        }
        
        h1 {
            font-size: 3rem;
            margin: 1.5rem 0;
            color: var(--secondary);
            background: linear-gradient(to right, var(--primary), var(--accent));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .tagline {
            font-size: 1.5rem;
            color: var(--dark);
            margin-bottom: 2rem;
            opacity: 0;
            animation: fadeIn 1s ease-in forwards;
        }
        
        .api-card {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            margin: 2rem 0;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
            opacity: 0;
            animation: slideUp 0.8s ease-in forwards;
            animation-delay: 0.3s;
        }
        
        .api-card:hover {
            transform: translateY(-5px);
        }
        
        .endpoint {
            display: flex;
            margin: 1.5rem 0;
            align-items: center;
        }
        
        .method {
            padding: 0.5rem 1rem;
            border-radius: 5px;
            font-weight: bold;
            margin-right: 1rem;
            min-width: 80px;
            text-align: center;
        }
        
        .get { background: #48bb78; color: white; }
        .post { background: #4299e1; color: white; }
        .put { background: #ed8936; color: white; }
        .delete { background: #f56565; color: white; }
        
        .path {
            font-family: monospace;
            background: #f8f9fa;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            flex-grow: 1;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
        }
        
        .feature {
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            opacity: 0;
            animation: fadeIn 0.8s ease-in forwards;
        }
        
        .feature:nth-child(1) { animation-delay: 0.5s; }
        .feature:nth-child(2) { animation-delay: 0.7s; }
        .feature:nth-child(3) { animation-delay: 0.9s; }
        
        .feature:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            color: var(--primary);
        }
        
        footer {
            text-align: center;
            padding: 3rem 0;
            margin-top: 3rem;
            color: var(--dark);
            opacity: 0;
            animation: fadeIn 1s ease-in forwards;
            animation-delay: 1s;
        }
        
        @keyframes fadeIn {
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        
        .btn {
            display: inline-block;
            padding: 0.8rem 2rem;
            background: var(--primary);
            color: white;
            border-radius: 50px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 1rem;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
        }
        
        .btn:hover {
            background: var(--secondary);
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(67, 97, 238, 0.4);
        }
        
        .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }
            
            .tagline {
                font-size: 1.2rem;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="particles" id="particles-js"></div>
    
    <div class="container">
        <header class="animate__animated animate__fadeIn">
            <div class="logo">RBC</div>
            <h1 class="animate__animated animate__fadeIn">RC Brown Capital API</h1>
            <p class="tagline">Premium property listing API for real estate platforms</p>
        </header>
        
        <div class="api-card">
            <h2>API Endpoints</h2>
            
            <div class="endpoint">
                <span class="method get">GET</span>
                <span class="path">/api/v1/business-info</span>
            </div>
            
            <div class="endpoint">
                <span class="method post">POST</span>
                <span class="path">/api/v1/business-info</span>
            </div>
            
            <div class="endpoint">
                <span class="method put">PUT</span>
                <span class="path">/api/v1/business-info/{id}</span>
            </div>
            
            <div class="endpoint">
                <span class="method delete">DELETE</span>
                <span class="path">/api/v1/business-info/{id}</span>
            </div>
            
            <a href="#" class="btn">View Full Documentation</a>
        </div>
        
        <div class="features">
            <div class="feature">
                <div class="feature-icon">⚡</div>
                <h3>High Performance</h3>
                <p>Our API is built for speed with response times under 100ms for most requests.</p>
            </div>
            
            <div class="feature">
                <div class="feature-icon">🔒</div>
                <h3>Secure</h3>
                <p>Enterprise-grade security with OAuth 2.0, JWT tokens, and rate limiting.</p>
            </div>
            
            <div class="feature">
                <div class="feature-icon">📊</div>
                <h3>Real-time Data</h3>
                <p>Access to real-time financial data with WebSocket support.</p>
            </div>
        </div>
        
        <footer>
            <p>© 2025 RC Brown Capital. All Rights Reserved.</p>
            <p>Need help? <a href="mailto:support@rcbrownhomes.com">Contact our team</a></p>
        </footer>
    </div>
    
    <!-- Particles.js for background animation -->
    <script src="https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js"></script>
    <script>
        // Initialize particles.js
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#4361ee"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#3a0ca3",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "push": {
                        "particles_nb": 4
                    }
                }
            },
            "retina_detect": true
        });
        
        // Animate elements when they come into view
        const animateOnScroll = () => {
            const elements = document.querySelectorAll('.feature, .api-card, footer');
            
            elements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                }
            });
        };
        
        window.addEventListener('scroll', animateOnScroll);
        // Trigger once on load
        animateOnScroll();
    </script>
</body>
</html><?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\resources\views/welcome.blade.php ENDPATH**/ ?>
```

# storage\framework\views\6ef9aa3decafe930b39a7c63096c254f.php

```php
<?php echo e($slot); ?>

<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Mail/resources/views/text/footer.blade.php ENDPATH**/ ?>
```

# storage\framework\views\8cc9c881711bebe4a5d60f3645f755dc.php

```php
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title><?php echo new \Illuminate\Support\EncodedHtmlString(config('app.name')); ?></title>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<style>
@media only screen and (max-width: 600px) {
.inner-body {
width: 100% !important;
}

.footer {
width: 100% !important;
}
}

@media only screen and (max-width: 500px) {
.button {
width: 100% !important;
}
}
</style>
<?php echo $head ?? ''; ?>

</head>
<body>

<table class="wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td align="center">
<table class="content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<?php echo $header ?? ''; ?>


<!-- Email Body -->
<tr>
<td class="body" width="100%" cellpadding="0" cellspacing="0" style="border: hidden !important;">
<table class="inner-body" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
<!-- Body content -->
<tr>
<td class="content-cell">
<?php echo Illuminate\Mail\Markdown::parse($slot); ?>


<?php echo $subcopy ?? ''; ?>

</td>
</tr>
</table>
</td>
</tr>

<?php echo $footer ?? ''; ?>

</table>
</td>
</tr>
</table>
</body>
</html>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Mail/resources/views/html/layout.blade.php ENDPATH**/ ?>
```

# storage\framework\views\8e045985a1a5723176ac53901a0461ec.php

```php
<?php $__env->startSection('title', __('Not Found')); ?>
<?php $__env->startSection('code', '404'); ?>
<?php $__env->startSection('message', __('Not Found')); ?>

<?php echo $__env->make('errors::minimal', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Exceptions/views/404.blade.php ENDPATH**/ ?>
```

# storage\framework\views\9cea6d4305649ca4e616671b3ec30ba8.php

```php
<div class="hidden overflow-x-auto sm:col-span-1 lg:block">
    <div
        class="h-[35.5rem] scrollbar-hidden trace text-sm text-gray-400 dark:text-gray-300"
    >
        <div class="mb-2 inline-block rounded-full bg-red-500/20 px-3 py-2 dark:bg-red-500/20 sm:col-span-1">
            <button
                @click="includeVendorFrames = !includeVendorFrames"
                class="inline-flex items-center font-bold leading-5 text-red-500"
            >
                <span x-show="includeVendorFrames">Collapse</span>
                <span
                    x-cloak
                    x-show="!includeVendorFrames"
                    >Expand</span
                >
                <span class="ml-1">vendor frames</span>

                <div class="flex flex-col ml-1 -mt-2" x-cloak x-show="includeVendorFrames">
                    <?php if (isset($component)) { $__componentOriginal707ceba27255eae48fdb0f3529710ddf = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal707ceba27255eae48fdb0f3529710ddf = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.icons.chevron-down','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::icons.chevron-down'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal707ceba27255eae48fdb0f3529710ddf)): ?>
<?php $attributes = $__attributesOriginal707ceba27255eae48fdb0f3529710ddf; ?>
<?php unset($__attributesOriginal707ceba27255eae48fdb0f3529710ddf); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal707ceba27255eae48fdb0f3529710ddf)): ?>
<?php $component = $__componentOriginal707ceba27255eae48fdb0f3529710ddf; ?>
<?php unset($__componentOriginal707ceba27255eae48fdb0f3529710ddf); ?>
<?php endif; ?>
                    <?php if (isset($component)) { $__componentOriginal14b1cc5db95fcca4a0f06445821cff39 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal14b1cc5db95fcca4a0f06445821cff39 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.icons.chevron-up','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::icons.chevron-up'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal14b1cc5db95fcca4a0f06445821cff39)): ?>
<?php $attributes = $__attributesOriginal14b1cc5db95fcca4a0f06445821cff39; ?>
<?php unset($__attributesOriginal14b1cc5db95fcca4a0f06445821cff39); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal14b1cc5db95fcca4a0f06445821cff39)): ?>
<?php $component = $__componentOriginal14b1cc5db95fcca4a0f06445821cff39; ?>
<?php unset($__componentOriginal14b1cc5db95fcca4a0f06445821cff39); ?>
<?php endif; ?>
                </div>

                <div class="flex flex-col ml-1 -mt-2" x-cloak x-show="! includeVendorFrames">
                    <?php if (isset($component)) { $__componentOriginal14b1cc5db95fcca4a0f06445821cff39 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal14b1cc5db95fcca4a0f06445821cff39 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.icons.chevron-up','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::icons.chevron-up'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal14b1cc5db95fcca4a0f06445821cff39)): ?>
<?php $attributes = $__attributesOriginal14b1cc5db95fcca4a0f06445821cff39; ?>
<?php unset($__attributesOriginal14b1cc5db95fcca4a0f06445821cff39); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal14b1cc5db95fcca4a0f06445821cff39)): ?>
<?php $component = $__componentOriginal14b1cc5db95fcca4a0f06445821cff39; ?>
<?php unset($__componentOriginal14b1cc5db95fcca4a0f06445821cff39); ?>
<?php endif; ?>
                    <?php if (isset($component)) { $__componentOriginal707ceba27255eae48fdb0f3529710ddf = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal707ceba27255eae48fdb0f3529710ddf = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.icons.chevron-down','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::icons.chevron-down'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal707ceba27255eae48fdb0f3529710ddf)): ?>
<?php $attributes = $__attributesOriginal707ceba27255eae48fdb0f3529710ddf; ?>
<?php unset($__attributesOriginal707ceba27255eae48fdb0f3529710ddf); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal707ceba27255eae48fdb0f3529710ddf)): ?>
<?php $component = $__componentOriginal707ceba27255eae48fdb0f3529710ddf; ?>
<?php unset($__componentOriginal707ceba27255eae48fdb0f3529710ddf); ?>
<?php endif; ?>
                </div>
            </button>
        </div>

        <div class="mb-12 space-y-2">
            <?php $__currentLoopData = $exception->frames(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $frame): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <?php if(! $frame->isFromVendor()): ?>
                    <?php
                        $vendorFramesCollapsed = $exception->frames()->take($loop->index)->reverse()->takeUntil(fn ($frame) => ! $frame->isFromVendor());
                    ?>

                    <div x-show="! includeVendorFrames">
                        <?php if($vendorFramesCollapsed->isNotEmpty()): ?>
                            <div class="text-gray-500">
                                <?php echo e($vendorFramesCollapsed->count()); ?> vendor frame<?php echo e($vendorFramesCollapsed->count() > 1 ? 's' : ''); ?> collapsed
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endif; ?>

                <button
                    class="w-full text-left dark:border-gray-900"
                    x-show="<?php echo e($frame->isFromVendor() ? 'includeVendorFrames' : 'true'); ?>"
                    @click="index = <?php echo e($loop->index); ?>"
                >
                    <div
                        x-bind:class="
                            index === <?php echo e($loop->index); ?>

                                ? 'rounded-r-md bg-gray-100 dark:bg-gray-800 border-l dark:border dark:border-gray-700 border-l-red-500 dark:border-l-red-500'
                                : 'hover:bg-gray-100/75 dark:hover:bg-gray-800/75'
                        "
                    >
                        <div class="scrollbar-hidden overflow-x-auto border-l-2 border-transparent p-2">
                            <div class="nowrap text-gray-900 dark:text-gray-300">
                                <span class="inline-flex items-baseline">
                                    <span class="text-gray-900 dark:text-gray-300"><?php echo e($frame->source()); ?></span>
                                    <span class="font-mono text-xs">:<?php echo e($frame->line()); ?></span>
                                </span>
                            </div>
                            <div class="text-gray-500 dark:text-gray-400">
                                <?php echo e($exception->frames()->get($loop->index + 1)?->callable()); ?>

                            </div>
                        </div>
                    </div>
                </button>

                <?php if(! $frame->isFromVendor() && $exception->frames()->slice($loop->index + 1)->reject(fn ($frame) => $frame->isFromVendor())->isEmpty()): ?>
                    <?php if($exception->frames()->slice($loop->index + 1)->count()): ?>
                        <div x-show="! includeVendorFrames">
                            <div class="text-gray-500">
                                <?php echo e($exception->frames()->slice($loop->index + 1)->count()); ?> vendor
                                frame<?php echo e($exception->frames()->slice($loop->index + 1)->count() > 1 ? 's' : ''); ?> collapsed
                            </div>
                        </div>
                    <?php endif; ?>
                <?php endif; ?>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </div>
    </div>
</div>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Providers/../resources/exceptions/renderer/components/trace.blade.php ENDPATH**/ ?>
```

# storage\framework\views\9d5773a807e9f13dfa7c7f4c638d2a49.php

```php
<?php echo strip_tags($header ?? ''); ?>


<?php echo strip_tags($slot); ?>

<?php if(isset($subcopy)): ?>

<?php echo strip_tags($subcopy); ?>

<?php endif; ?>

<?php echo strip_tags($footer ?? ''); ?>

<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Mail/resources/views/text/layout.blade.php ENDPATH**/ ?>
```

# storage\framework\views\9f1958ef6e832e38d34adf4afb10b77d.php

```php
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4" style="margin-bottom: -8px;">
  <path fill-rule="evenodd" d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z" clip-rule="evenodd" />
</svg>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Providers/../resources/exceptions/renderer/components/icons/chevron-up.blade.php ENDPATH**/ ?>
```

# storage\framework\views\14f203757e6faded6a38d48539bc6fbb.php

```php
<?php echo e($slot); ?>

<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Mail/resources/views/text/subcopy.blade.php ENDPATH**/ ?>
```

# storage\framework\views\42f632dfdced3cc3e36a97572379c48d.php

```php
<tr>
<td>
<table class="footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td class="content-cell" align="center">
<?php echo new \Illuminate\Support\EncodedHtmlString(Illuminate\Mail\Markdown::parse($slot)); ?>

</td>
</tr>
</table>
</td>
</tr>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Mail/resources/views/html/footer.blade.php ENDPATH**/ ?>
```

# storage\framework\views\88f61e77523b07164d621253e32924ae.php

```php
<header class="mt-3 px-5 sm:mt-10">
    <div class="py-3 dark:border-gray-900 sm:py-5">
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <div class="rounded-full bg-red-500/20 p-4 dark:bg-red-500/20">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="h-6 w-6 fill-red-500 text-gray-50 dark:text-gray-950"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                    </svg>
                </div>

                <span class="text-dark ml-3 text-2xl font-bold dark:text-white sm:text-3xl">
                    <?php echo e($exception->title()); ?>

                </span>
            </div>

            <div class="flex items-center gap-3 sm:gap-6">
                <?php if (isset($component)) { $__componentOriginal9b6ddd2809dd60ece07dfaf1f3ef876f = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal9b6ddd2809dd60ece07dfaf1f3ef876f = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.theme-switcher','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::theme-switcher'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal9b6ddd2809dd60ece07dfaf1f3ef876f)): ?>
<?php $attributes = $__attributesOriginal9b6ddd2809dd60ece07dfaf1f3ef876f; ?>
<?php unset($__attributesOriginal9b6ddd2809dd60ece07dfaf1f3ef876f); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal9b6ddd2809dd60ece07dfaf1f3ef876f)): ?>
<?php $component = $__componentOriginal9b6ddd2809dd60ece07dfaf1f3ef876f; ?>
<?php unset($__componentOriginal9b6ddd2809dd60ece07dfaf1f3ef876f); ?>
<?php endif; ?>
            </div>
        </div>
    </div>
</header>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Providers/../resources/exceptions/renderer/components/navigation.blade.php ENDPATH**/ ?>
```

# storage\framework\views\92c195f95490e674c890574d29f7f8cf.php

```php
<svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    <?php echo e($attributes); ?>

>
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
</svg>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Providers/../resources/exceptions/renderer/components/icons/computer-desktop.blade.php ENDPATH**/ ?>
```

# storage\framework\views\93fda7ff0514fdb9efa8efaf561f3b3e.php

```php
<?php echo e($slot); ?>: <?php echo e($url); ?>

<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Mail/resources/views/text/button.blade.php ENDPATH**/ ?>
```

# storage\framework\views\459e85f747e48ad7a43656751e511429.php

```php
<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames((['url']));

foreach ($attributes->all() as $__key => $__value) {
    if (in_array($__key, $__propNames)) {
        $$__key = $$__key ?? $__value;
    } else {
        $__newAttributes[$__key] = $__value;
    }
}

$attributes = new \Illuminate\View\ComponentAttributeBag($__newAttributes);

unset($__propNames);
unset($__newAttributes);

foreach (array_filter((['url']), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars); ?>
<tr>
<td class="header">
<a href="<?php echo new \Illuminate\Support\EncodedHtmlString($url); ?>" style="display: inline-block;">
<?php if(trim($slot) === 'Laravel'): ?>
<img src="https://laravel.com/img/notification-logo.png" class="logo" alt="Laravel Logo">
<?php else: ?>
<?php echo $slot; ?>

<?php endif; ?>
</a>
</td>
</tr>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Mail/resources/views/html/header.blade.php ENDPATH**/ ?>
```

# storage\framework\views\642c90fcde4dfeb3c9b331f347aaec3b.php

```php
<?php $__currentLoopData = $exception->frames(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $frame): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <div
        class="sm:col-span-2"
        x-show="index === <?php echo e($loop->index); ?>"
    >
        <div class="mb-3">
            <div class="text-md text-gray-500 dark:text-gray-400">
                <div class="mb-2">

                    <?php if(config('app.editor')): ?>
                        <a href="<?php echo e($frame->editorHref()); ?>" class="text-blue-500 hover:underline">
                            <span class="wrap text-gray-900 dark:text-gray-300"><?php echo e($frame->file()); ?></span>
                        </a>
                    <?php else: ?>
                        <span class="wrap text-gray-900 dark:text-gray-300"><?php echo e($frame->file()); ?></span>
                    <?php endif; ?>

                    <span class="font-mono text-xs">:<?php echo e($frame->line()); ?></span>
                </div>
            </div>
        </div>
        <div class="pt-4 text-sm text-gray-500 dark:text-gray-400">
            <pre class="h-[32.5rem] rounded-md dark:bg-gray-800 border dark:border-gray-700"><template x-if="true"><code
                    style="display: none;"
                    id="frame-<?php echo e($loop->index); ?>"
                    class="language-php highlightable-code <?php if($loop->index === $exception->defaultFrame()): ?> default-highlightable-code <?php endif; ?> scrollbar-hidden overflow-y-hidden"
                    data-line-number="<?php echo e($frame->line()); ?>"
                    data-ln-start-from="<?php echo e(max($frame->line() - 5, 1)); ?>"
                ><?php echo e($frame->snippet()); ?></code></template></pre>
        </div>
    </div>
<?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Providers/../resources/exceptions/renderer/components/editor.blade.php ENDPATH**/ ?>
```

# storage\framework\views\12620bdf54f14516ac45797259258724.php

```php
<?php if (isset($component)) { $__componentOriginal3287929725b3f878740bf3f25881b9ff = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal3287929725b3f878740bf3f25881b9ff = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => $__env->getContainer()->make(Illuminate\View\Factory::class)->make('mail::layout'),'data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('mail::layout'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>

 <?php $__env->slot('header', null, []); ?> 
<?php if (isset($component)) { $__componentOriginal4b27c9cf0646a011e45f5c0081cff2ae = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal4b27c9cf0646a011e45f5c0081cff2ae = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => $__env->getContainer()->make(Illuminate\View\Factory::class)->make('mail::header'),'data' => ['url' => config('app.url')]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('mail::header'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['url' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute(config('app.url'))]); ?>
<?php echo new \Illuminate\Support\EncodedHtmlString(config('app.name')); ?>

 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal4b27c9cf0646a011e45f5c0081cff2ae)): ?>
<?php $attributes = $__attributesOriginal4b27c9cf0646a011e45f5c0081cff2ae; ?>
<?php unset($__attributesOriginal4b27c9cf0646a011e45f5c0081cff2ae); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal4b27c9cf0646a011e45f5c0081cff2ae)): ?>
<?php $component = $__componentOriginal4b27c9cf0646a011e45f5c0081cff2ae; ?>
<?php unset($__componentOriginal4b27c9cf0646a011e45f5c0081cff2ae); ?>
<?php endif; ?>
 <?php $__env->endSlot(); ?>


<?php echo $slot; ?>



<?php if(isset($subcopy)): ?>
 <?php $__env->slot('subcopy', null, []); ?> 
<?php if (isset($component)) { $__componentOriginala95a089fc4dac0df2b807f0c4d49e8b5 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginala95a089fc4dac0df2b807f0c4d49e8b5 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => $__env->getContainer()->make(Illuminate\View\Factory::class)->make('mail::subcopy'),'data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('mail::subcopy'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $subcopy; ?>

 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginala95a089fc4dac0df2b807f0c4d49e8b5)): ?>
<?php $attributes = $__attributesOriginala95a089fc4dac0df2b807f0c4d49e8b5; ?>
<?php unset($__attributesOriginala95a089fc4dac0df2b807f0c4d49e8b5); ?>
<?php endif; ?>
<?php if (isset($__componentOriginala95a089fc4dac0df2b807f0c4d49e8b5)): ?>
<?php $component = $__componentOriginala95a089fc4dac0df2b807f0c4d49e8b5; ?>
<?php unset($__componentOriginala95a089fc4dac0df2b807f0c4d49e8b5); ?>
<?php endif; ?>
 <?php $__env->endSlot(); ?>
<?php endif; ?>


 <?php $__env->slot('footer', null, []); ?> 
<?php if (isset($component)) { $__componentOriginalef4bd4280c5be2fca1cb0cfd4325d122 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalef4bd4280c5be2fca1cb0cfd4325d122 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => $__env->getContainer()->make(Illuminate\View\Factory::class)->make('mail::footer'),'data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('mail::footer'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
© <?php echo new \Illuminate\Support\EncodedHtmlString(date('Y')); ?> <?php echo new \Illuminate\Support\EncodedHtmlString(config('app.name')); ?>. <?php echo new \Illuminate\Support\EncodedHtmlString(__('All rights reserved.')); ?>

 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalef4bd4280c5be2fca1cb0cfd4325d122)): ?>
<?php $attributes = $__attributesOriginalef4bd4280c5be2fca1cb0cfd4325d122; ?>
<?php unset($__attributesOriginalef4bd4280c5be2fca1cb0cfd4325d122); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalef4bd4280c5be2fca1cb0cfd4325d122)): ?>
<?php $component = $__componentOriginalef4bd4280c5be2fca1cb0cfd4325d122; ?>
<?php unset($__componentOriginalef4bd4280c5be2fca1cb0cfd4325d122); ?>
<?php endif; ?>
 <?php $__env->endSlot(); ?>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal3287929725b3f878740bf3f25881b9ff)): ?>
<?php $attributes = $__attributesOriginal3287929725b3f878740bf3f25881b9ff; ?>
<?php unset($__attributesOriginal3287929725b3f878740bf3f25881b9ff); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal3287929725b3f878740bf3f25881b9ff)): ?>
<?php $component = $__componentOriginal3287929725b3f878740bf3f25881b9ff; ?>
<?php unset($__componentOriginal3287929725b3f878740bf3f25881b9ff); ?>
<?php endif; ?>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Mail/resources/views/html/message.blade.php ENDPATH**/ ?>
```

# storage\framework\views\a41a84337858836f7ef25d803c3e1ddc.php

```php
<script>

    (function () {
        const darkStyles = document.querySelector('style[data-theme="dark"]')?.textContent
        const lightStyles = document.querySelector('style[data-theme="light"]')?.textContent

        const removeStyles = () => {
            document.querySelector('style[data-theme="dark"]')?.remove()
            document.querySelector('style[data-theme="light"]')?.remove()
        }

        removeStyles()

        setDarkClass = () => {
            removeStyles()

            const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)

            isDark ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')

            if (isDark) {
                document.head.insertAdjacentHTML('beforeend', `<style data-theme="dark">${darkStyles}</style>`)
            } else {
                document.head.insertAdjacentHTML('beforeend', `<style data-theme="light">${lightStyles}</style>`)
            }
        }

        setDarkClass()

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setDarkClass)
    })();
</script>

<div
    class="relative"
    x-data="{
        menu: false,
        theme: localStorage.theme,
        darkMode() {
            this.theme = 'dark'
            localStorage.theme = 'dark'
            setDarkClass()
        },
        lightMode() {
            this.theme = 'light'
            localStorage.theme = 'light'
            setDarkClass()
        },
        systemMode() {
            this.theme = undefined
            localStorage.removeItem('theme')
            setDarkClass()
        },
    }"
    @click.outside="menu = false"
>
    <button
        x-cloak
        class="block rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
        :class="theme ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600 hover:text-gray-500 focus:text-gray-500 dark:hover:text-gray-500 dark:focus:text-gray-500'"
        @click="menu = ! menu"
    >
        <?php if (isset($component)) { $__componentOriginalbfde029a2e31d1ec96b5017ff81a67a7 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalbfde029a2e31d1ec96b5017ff81a67a7 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.icons.sun','data' => ['class' => 'block h-5 w-5 dark:hidden']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::icons.sun'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'block h-5 w-5 dark:hidden']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalbfde029a2e31d1ec96b5017ff81a67a7)): ?>
<?php $attributes = $__attributesOriginalbfde029a2e31d1ec96b5017ff81a67a7; ?>
<?php unset($__attributesOriginalbfde029a2e31d1ec96b5017ff81a67a7); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalbfde029a2e31d1ec96b5017ff81a67a7)): ?>
<?php $component = $__componentOriginalbfde029a2e31d1ec96b5017ff81a67a7; ?>
<?php unset($__componentOriginalbfde029a2e31d1ec96b5017ff81a67a7); ?>
<?php endif; ?>
        <?php if (isset($component)) { $__componentOriginal6dda8ad3ea7f20f6c0a87e7037386745 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal6dda8ad3ea7f20f6c0a87e7037386745 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.icons.moon','data' => ['class' => 'hidden h-5 w-5 dark:block']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::icons.moon'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'hidden h-5 w-5 dark:block']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal6dda8ad3ea7f20f6c0a87e7037386745)): ?>
<?php $attributes = $__attributesOriginal6dda8ad3ea7f20f6c0a87e7037386745; ?>
<?php unset($__attributesOriginal6dda8ad3ea7f20f6c0a87e7037386745); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal6dda8ad3ea7f20f6c0a87e7037386745)): ?>
<?php $component = $__componentOriginal6dda8ad3ea7f20f6c0a87e7037386745; ?>
<?php unset($__componentOriginal6dda8ad3ea7f20f6c0a87e7037386745); ?>
<?php endif; ?>
    </button>

    <div
        x-show="menu"
        class="absolute right-0 z-10 flex origin-top-right flex-col rounded-md bg-white shadow-xl ring-1 ring-gray-900/5 dark:bg-gray-800"
        style="display: none"
        @click="menu = false"
    >
        <button
            class="flex items-center gap-3 px-4 py-2 hover:rounded-t-md hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="theme === 'light' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'"
            @click="lightMode()"
        >
            <?php if (isset($component)) { $__componentOriginalbfde029a2e31d1ec96b5017ff81a67a7 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalbfde029a2e31d1ec96b5017ff81a67a7 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.icons.sun','data' => ['class' => 'h-5 w-5']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::icons.sun'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'h-5 w-5']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalbfde029a2e31d1ec96b5017ff81a67a7)): ?>
<?php $attributes = $__attributesOriginalbfde029a2e31d1ec96b5017ff81a67a7; ?>
<?php unset($__attributesOriginalbfde029a2e31d1ec96b5017ff81a67a7); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalbfde029a2e31d1ec96b5017ff81a67a7)): ?>
<?php $component = $__componentOriginalbfde029a2e31d1ec96b5017ff81a67a7; ?>
<?php unset($__componentOriginalbfde029a2e31d1ec96b5017ff81a67a7); ?>
<?php endif; ?>
            Light
        </button>
        <button
            class="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="theme === 'dark' ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'"
            @click="darkMode()"
        >
            <?php if (isset($component)) { $__componentOriginal6dda8ad3ea7f20f6c0a87e7037386745 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal6dda8ad3ea7f20f6c0a87e7037386745 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.icons.moon','data' => ['class' => 'h-5 w-5']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::icons.moon'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'h-5 w-5']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal6dda8ad3ea7f20f6c0a87e7037386745)): ?>
<?php $attributes = $__attributesOriginal6dda8ad3ea7f20f6c0a87e7037386745; ?>
<?php unset($__attributesOriginal6dda8ad3ea7f20f6c0a87e7037386745); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal6dda8ad3ea7f20f6c0a87e7037386745)): ?>
<?php $component = $__componentOriginal6dda8ad3ea7f20f6c0a87e7037386745; ?>
<?php unset($__componentOriginal6dda8ad3ea7f20f6c0a87e7037386745); ?>
<?php endif; ?>
            Dark
        </button>
        <button
            class="flex items-center gap-3 px-4 py-2 hover:rounded-b-md hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="theme === undefined ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'"
            @click="systemMode()"
        >
            <?php if (isset($component)) { $__componentOriginala52e607cb40b8eec566206ff9f3ca13c = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginala52e607cb40b8eec566206ff9f3ca13c = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.icons.computer-desktop','data' => ['class' => 'h-5 w-5']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::icons.computer-desktop'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'h-5 w-5']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginala52e607cb40b8eec566206ff9f3ca13c)): ?>
<?php $attributes = $__attributesOriginala52e607cb40b8eec566206ff9f3ca13c; ?>
<?php unset($__attributesOriginala52e607cb40b8eec566206ff9f3ca13c); ?>
<?php endif; ?>
<?php if (isset($__componentOriginala52e607cb40b8eec566206ff9f3ca13c)): ?>
<?php $component = $__componentOriginala52e607cb40b8eec566206ff9f3ca13c; ?>
<?php unset($__componentOriginala52e607cb40b8eec566206ff9f3ca13c); ?>
<?php endif; ?>
            System
        </button>
    </div>
</div>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Providers/../resources/exceptions/renderer/components/theme-switcher.blade.php ENDPATH**/ ?>
```

# storage\framework\views\ac6e69141bd9b733572a565ea65603b6.php

```php
<?php use \Illuminate\Support\Str; ?>
<?php if (isset($component)) { $__componentOriginal74daf2d0a9c625ad90327a6043d15980 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal74daf2d0a9c625ad90327a6043d15980 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.card','data' => ['class' => 'mt-6 overflow-x-auto']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::card'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'mt-6 overflow-x-auto']); ?>
    <div>
        <span class="text-xl font-bold lg:text-2xl">Request</span>
    </div>

    <div class="mt-2">
        <span><?php echo e($exception->request()->method()); ?></span>
        <span class="text-gray-500"><?php echo e(Str::start($exception->request()->path(), '/')); ?></span>
    </div>

    <div class="mt-4">
        <span class="font-semibold text-gray-900 dark:text-white">Headers</span>
    </div>

    <dl class="mt-1 grid grid-cols-1 rounded border dark:border-gray-800">
        <?php $__empty_1 = true; $__currentLoopData = $exception->requestHeaders(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $key => $value): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
            <div class="flex items-center gap-2 <?php echo e($loop->first ? '' : 'border-t'); ?> dark:border-gray-800">
                <span
                    data-tippy-content="<?php echo e($key); ?>"
                    class="lg:text-md w-[8rem] flex-none cursor-pointer truncate border-r px-5 py-3 text-sm dark:border-gray-800 lg:w-[12rem]"
                >
                    <?php echo e($key); ?>

                </span>
                <span
                    class="min-w-0 flex-grow"
                    style="
                        -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 1rem, #000 calc(100% - 3rem), transparent calc(100% - 1rem));
                    "
                >
                    <pre class="scrollbar-hidden overflow-y-hidden text-xs lg:text-sm"><code class="px-5 py-3 overflow-y-hidden scrollbar-hidden max-h-32 overflow-x-scroll scrollbar-hidden-x"><?php echo e($value); ?></code></pre>
                </span>
            </div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
            <span
                class="min-w-0 flex-grow"
                style="-webkit-mask-image: linear-gradient(90deg, transparent 0, #000 1rem, #000 calc(100% - 3rem), transparent calc(100% - 1rem))"
            >
                <pre class="scrollbar-hidden mx-5 my-3 overflow-y-hidden text-xs lg:text-sm"><code class="overflow-y-hidden scrollbar-hidden overflow-x-scroll scrollbar-hidden-x">No headers data</code></pre>
            </span>
        <?php endif; ?>
    </dl>

    <div class="mt-4">
        <span class="font-semibold text-gray-900 dark:text-white">Body</span>
    </div>

    <div class="mt-1 rounded border dark:border-gray-800">
        <div class="flex items-center">
            <span
                class="min-w-0 flex-grow"
                style="-webkit-mask-image: linear-gradient(90deg, transparent 0, #000 1rem, #000 calc(100% - 3rem), transparent calc(100% - 1rem))"
            >
                <pre class="scrollbar-hidden mx-5 my-3 overflow-y-hidden text-xs lg:text-sm"><code class="overflow-y-hidden scrollbar-hidden overflow-x-scroll scrollbar-hidden-x"><?php echo e($exception->requestBody() ?: 'No body data'); ?></code></pre>
            </span>
        </div>
    </div>

 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal74daf2d0a9c625ad90327a6043d15980)): ?>
<?php $attributes = $__attributesOriginal74daf2d0a9c625ad90327a6043d15980; ?>
<?php unset($__attributesOriginal74daf2d0a9c625ad90327a6043d15980); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal74daf2d0a9c625ad90327a6043d15980)): ?>
<?php $component = $__componentOriginal74daf2d0a9c625ad90327a6043d15980; ?>
<?php unset($__componentOriginal74daf2d0a9c625ad90327a6043d15980); ?>
<?php endif; ?>

<?php if (isset($component)) { $__componentOriginal74daf2d0a9c625ad90327a6043d15980 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal74daf2d0a9c625ad90327a6043d15980 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.card','data' => ['class' => 'mt-6 overflow-x-auto']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::card'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'mt-6 overflow-x-auto']); ?>
    <div>
        <span class="text-xl font-bold lg:text-2xl">Application</span>
    </div>

    <div class="mt-4">
        <span class="font-semibold text-gray-900 dark:text-white"> Routing </span>
    </div>

    <dl class="mt-1 grid grid-cols-1 rounded border dark:border-gray-800">
        <?php $__empty_1 = true; $__currentLoopData = $exception->applicationRouteContext(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $name => $value): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
            <div class="flex items-center gap-2 <?php echo e($loop->first ? '' : 'border-t'); ?> dark:border-gray-800">
                <span
                    data-tippy-content="<?php echo e($name); ?>"
                    class="lg:text-md w-[8rem] flex-none cursor-pointer truncate border-r px-5 py-3 text-sm dark:border-gray-800 lg:w-[12rem]"
                    ><?php echo e($name); ?></span
                >
                <span
                    class="min-w-0 flex-grow"
                    style="
                        -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 1rem, #000 calc(100% - 3rem), transparent calc(100% - 1rem));
                    "
                >
                    <pre class="scrollbar-hidden overflow-y-hidden text-xs lg:text-sm"><code class="px-5 py-3 overflow-y-hidden scrollbar-hidden max-h-32 overflow-x-scroll scrollbar-hidden-x"><?php echo e($value); ?></code></pre>
                </span>
            </div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
            <span
                class="min-w-0 flex-grow"
                style="-webkit-mask-image: linear-gradient(90deg, transparent 0, #000 1rem, #000 calc(100% - 3rem), transparent calc(100% - 1rem))"
            >
                <pre class="scrollbar-hidden mx-5 my-3 overflow-y-hidden text-xs lg:text-sm"><code class="overflow-y-hidden scrollbar-hidden overflow-x-scroll scrollbar-hidden-x">No routing data</code></pre>
            </span>
        <?php endif; ?>
    </dl>

    <?php if($routeParametersContext = $exception->applicationRouteParametersContext()): ?>
        <div class="mt-4">
            <span class="text-gray-900 dark:text-white text-sm"> Routing Parameters </span>
        </div>

        <div class="mt-1 rounded border dark:border-gray-800">
            <div class="flex items-center">
                <span
                    class="min-w-0 flex-grow"
                    style="-webkit-mask-image: linear-gradient(90deg, transparent 0, #000 1rem, #000 calc(100% - 3rem), transparent calc(100% - 1rem))"
                >
                    <pre class="scrollbar-hidden mx-5 my-3 overflow-y-hidden text-xs lg:text-sm"><code class="overflow-y-hidden scrollbar-hidden overflow-x-scroll scrollbar-hidden-x"><?php echo e($routeParametersContext); ?></code></pre>
                </span>
            </div>
        </div>
    <?php endif; ?>

    <div class="mt-4">
        <span class="font-semibold text-gray-900 dark:text-white"> Database Queries </span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
            <?php if(count($exception->applicationQueries()) === 100): ?>
                only the first 100 queries are displayed
            <?php endif; ?>
        </span>
    </div>

    <dl class="mt-1 grid grid-cols-1 rounded border dark:border-gray-800">
        <?php $__empty_1 = true; $__currentLoopData = $exception->applicationQueries(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as ['connectionName' => $connectionName, 'sql' => $sql, 'time' => $time]): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); $__empty_1 = false; ?>
            <div class="flex items-center gap-2 <?php echo e($loop->first ? '' : 'border-t'); ?> dark:border-gray-800">
                <div class="lg:text-md w-[8rem] flex-none truncate border-r px-5 py-3 text-sm dark:border-gray-800 lg:w-[12rem]">
                    <span><?php echo e($connectionName); ?></span>
                    <span class="hidden text-xs text-gray-500 lg:inline-block">(<?php echo e($time); ?> ms)</span>
                </div>
                <span
                    class="min-w-0 flex-grow"
                    style="
                        -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 1rem, #000 calc(100% - 3rem), transparent calc(100% - 1rem));
                    "
                >
                    <pre class="scrollbar-hidden overflow-y-hidden text-xs lg:text-sm"><code class="px-5 py-3 overflow-y-hidden scrollbar-hidden max-h-32 overflow-x-scroll scrollbar-hidden-x"><?php echo e($sql); ?></code></pre>
                </span>
            </div>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); if ($__empty_1): ?>
            <span
                class="min-w-0 flex-grow"
                style="-webkit-mask-image: linear-gradient(90deg, transparent 0, #000 1rem, #000 calc(100% - 3rem), transparent calc(100% - 1rem))"
            >
                <pre class="scrollbar-hidden mx-5 my-3 overflow-y-hidden text-xs lg:text-sm"><code class="overflow-y-hidden scrollbar-hidden overflow-x-scroll scrollbar-hidden-x">No query data</code></pre>
            </span>
        <?php endif; ?>
    </dl>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal74daf2d0a9c625ad90327a6043d15980)): ?>
<?php $attributes = $__attributesOriginal74daf2d0a9c625ad90327a6043d15980; ?>
<?php unset($__attributesOriginal74daf2d0a9c625ad90327a6043d15980); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal74daf2d0a9c625ad90327a6043d15980)): ?>
<?php $component = $__componentOriginal74daf2d0a9c625ad90327a6043d15980; ?>
<?php unset($__componentOriginal74daf2d0a9c625ad90327a6043d15980); ?>
<?php endif; ?>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Providers/../resources/exceptions/renderer/components/context.blade.php ENDPATH**/ ?>
```

# storage\framework\views\acf430c09594260b25c2e63263d3f35d.php

```php
<?php $attributes ??= new \Illuminate\View\ComponentAttributeBag;

$__newAttributes = [];
$__propNames = \Illuminate\View\ComponentAttributeBag::extractPropNames(([
    'url',
    'color' => 'primary',
    'align' => 'center',
]));

foreach ($attributes->all() as $__key => $__value) {
    if (in_array($__key, $__propNames)) {
        $$__key = $$__key ?? $__value;
    } else {
        $__newAttributes[$__key] = $__value;
    }
}

$attributes = new \Illuminate\View\ComponentAttributeBag($__newAttributes);

unset($__propNames);
unset($__newAttributes);

foreach (array_filter(([
    'url',
    'color' => 'primary',
    'align' => 'center',
]), 'is_string', ARRAY_FILTER_USE_KEY) as $__key => $__value) {
    $$__key = $$__key ?? $__value;
}

$__defined_vars = get_defined_vars();

foreach ($attributes->all() as $__key => $__value) {
    if (array_key_exists($__key, $__defined_vars)) unset($$__key);
}

unset($__defined_vars); ?>
<table class="action" align="<?php echo new \Illuminate\Support\EncodedHtmlString($align); ?>" width="100%" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td align="<?php echo new \Illuminate\Support\EncodedHtmlString($align); ?>">
<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td align="<?php echo new \Illuminate\Support\EncodedHtmlString($align); ?>">
<table border="0" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td>
<a href="<?php echo new \Illuminate\Support\EncodedHtmlString($url); ?>" class="button button-<?php echo new \Illuminate\Support\EncodedHtmlString($color); ?>" target="_blank" rel="noopener"><?php echo $slot; ?></a>
</td>
</tr>
</table>
</td>
</tr>
</table>
</td>
</tr>
</table>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Mail/resources/views/html/button.blade.php ENDPATH**/ ?>
```

# storage\framework\views\b24571c8a9b9bccc3e98611a5077ff1b.php

```php
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4" style="margin-bottom: -8px;">
    <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
</svg>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Providers/../resources/exceptions/renderer/components/icons/chevron-down.blade.php ENDPATH**/ ?>
```

# storage\framework\views\d4d7bde2869ed493efe84b343e7c276a.php

```php
<?php $__env->startSection('title', __('Page Expired')); ?>
<?php $__env->startSection('code', '419'); ?>
<?php $__env->startSection('message', __('Page Expired')); ?>

<?php echo $__env->make('errors::minimal', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Exceptions/views/419.blade.php ENDPATH**/ ?>
```

# storage\framework\views\d7c71308c8489fb2c96be0e6e596f949.php

```php
<?php if (isset($component)) { $__componentOriginal74daf2d0a9c625ad90327a6043d15980 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal74daf2d0a9c625ad90327a6043d15980 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.card','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::card'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
    <div class="md:flex md:items-center md:justify-between md:gap-2">
        <div class="min-w-0">
            <div class="inline-block rounded-full bg-red-500/20 px-3 py-2 max-w-full text-sm font-bold leading-5 text-red-500 truncate lg:text-base dark:bg-red-500/20">
                <span class="hidden md:inline">
                    <?php echo e($exception->class()); ?>

                </span>
                <span class="md:hidden">
                    <?php echo e(implode(' ', array_slice(explode('\\', $exception->class()), -1))); ?>

                </span>
            </div>
            <div class="mt-4 text-lg font-semibold text-gray-900 break-words dark:text-white lg:text-2xl">
                <?php echo e($exception->message()); ?>

            </div>
        </div>

        <div class="hidden text-right shrink-0 md:block md:min-w-64 md:max-w-80">
            <div>
                <span class="inline-block rounded-full bg-gray-200 px-3 py-2 text-sm leading-5 text-gray-900 max-w-full truncate dark:bg-gray-800 dark:text-white">
                    <?php echo e($exception->request()->method()); ?> <?php echo e($exception->request()->httpHost()); ?>

                </span>
            </div>
            <div class="px-4">
                <span class="text-sm text-gray-500 dark:text-gray-400">PHP <?php echo e(PHP_VERSION); ?> — Laravel <?php echo e(app()->version()); ?></span>
            </div>
        </div>
    </div>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal74daf2d0a9c625ad90327a6043d15980)): ?>
<?php $attributes = $__attributesOriginal74daf2d0a9c625ad90327a6043d15980; ?>
<?php unset($__attributesOriginal74daf2d0a9c625ad90327a6043d15980); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal74daf2d0a9c625ad90327a6043d15980)): ?>
<?php $component = $__componentOriginal74daf2d0a9c625ad90327a6043d15980; ?>
<?php unset($__componentOriginal74daf2d0a9c625ad90327a6043d15980); ?>
<?php endif; ?>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Providers/../resources/exceptions/renderer/components/header.blade.php ENDPATH**/ ?>
```

# storage\framework\views\da7c5688a23552e481e63096a43e34be.php

```php
<?php use \Illuminate\Foundation\Exceptions\Renderer\Renderer; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    />

    <title><?php echo e(config('app.name', 'Laravel')); ?></title>

    <link rel="icon" type="image/svg+xml"
          href="data:image/svg+xml,%3Csvg viewBox='0 -.11376601 49.74245785 51.31690859' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m49.626 11.564a.809.809 0 0 1 .028.209v10.972a.8.8 0 0 1 -.402.694l-9.209 5.302v10.509c0 .286-.152.55-.4.694l-19.223 11.066c-.044.025-.092.041-.14.058-.018.006-.035.017-.054.022a.805.805 0 0 1 -.41 0c-.022-.006-.042-.018-.063-.026-.044-.016-.09-.03-.132-.054l-19.219-11.066a.801.801 0 0 1 -.402-.694v-32.916c0-.072.01-.142.028-.21.006-.023.02-.044.028-.067.015-.042.029-.085.051-.124.015-.026.037-.047.055-.071.023-.032.044-.065.071-.093.023-.023.053-.04.079-.06.029-.024.055-.05.088-.069h.001l9.61-5.533a.802.802 0 0 1 .8 0l9.61 5.533h.002c.032.02.059.045.088.068.026.02.055.038.078.06.028.029.048.062.072.094.017.024.04.045.054.071.023.04.036.082.052.124.008.023.022.044.028.068a.809.809 0 0 1 .028.209v20.559l8.008-4.611v-10.51c0-.07.01-.141.028-.208.007-.024.02-.045.028-.068.016-.042.03-.085.052-.124.015-.026.037-.047.054-.071.024-.032.044-.065.072-.093.023-.023.052-.04.078-.06.03-.024.056-.05.088-.069h.001l9.611-5.533a.801.801 0 0 1 .8 0l9.61 5.533c.034.02.06.045.09.068.025.02.054.038.077.06.028.029.048.062.072.094.018.024.04.045.054.071.023.039.036.082.052.124.009.023.022.044.028.068zm-1.574 10.718v-9.124l-3.363 1.936-4.646 2.675v9.124l8.01-4.611zm-9.61 16.505v-9.13l-4.57 2.61-13.05 7.448v9.216zm-36.84-31.068v31.068l17.618 10.143v-9.214l-9.204-5.209-.003-.002-.004-.002c-.031-.018-.057-.044-.086-.066-.025-.02-.054-.036-.076-.058l-.002-.003c-.026-.025-.044-.056-.066-.084-.02-.027-.044-.05-.06-.078l-.001-.003c-.018-.03-.029-.066-.042-.1-.013-.03-.03-.058-.038-.09v-.001c-.01-.038-.012-.078-.016-.117-.004-.03-.012-.06-.012-.09v-21.483l-4.645-2.676-3.363-1.934zm8.81-5.994-8.007 4.609 8.005 4.609 8.006-4.61-8.006-4.608zm4.164 28.764 4.645-2.674v-20.096l-3.363 1.936-4.646 2.675v20.096zm24.667-23.325-8.006 4.609 8.006 4.609 8.005-4.61zm-.801 10.605-4.646-2.675-3.363-1.936v9.124l4.645 2.674 3.364 1.937zm-18.422 20.561 11.743-6.704 5.87-3.35-8-4.606-9.211 5.303-8.395 4.833z' fill='%23ff2d20'/%3E%3C/svg%3E" />

    <link
        href="https://fonts.bunny.net/css?family=figtree:300,400,500,600"
        rel="stylesheet"
    />

    <?php echo Renderer::css(); ?>


    <style>
        <?php $__currentLoopData = $exception->frames(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $frame): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            #frame-<?php echo e($loop->index); ?> .hljs-ln-line[data-line-number='<?php echo e($frame->line()); ?>'] {
                background-color: rgba(242, 95, 95, 0.4);
            }
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </style>
</head>
<body class="bg-gray-200/80 font-sans antialiased dark:bg-gray-950/95">
    <?php echo e($slot); ?>


    <?php echo Renderer::js(); ?>


    <script>
        !function(r,o){"use strict";var e,i="hljs-ln",l="hljs-ln-line",h="hljs-ln-code",s="hljs-ln-numbers",c="hljs-ln-n",m="data-line-number",a=/\r\n|\r|\n/g;function u(e){for(var n=e.toString(),t=e.anchorNode;"TD"!==t.nodeName;)t=t.parentNode;for(var r=e.focusNode;"TD"!==r.nodeName;)r=r.parentNode;var o=parseInt(t.dataset.lineNumber),a=parseInt(r.dataset.lineNumber);if(o==a)return n;var i,l=t.textContent,s=r.textContent;for(a<o&&(i=o,o=a,a=i,i=l,l=s,s=i);0!==n.indexOf(l);)l=l.slice(1);for(;-1===n.lastIndexOf(s);)s=s.slice(0,-1);for(var c=l,u=function(e){for(var n=e;"TABLE"!==n.nodeName;)n=n.parentNode;return n}(t),d=o+1;d<a;++d){var f=p('.{0}[{1}="{2}"]',[h,m,d]);c+="\n"+u.querySelector(f).textContent}return c+="\n"+s}function n(e){try{var n=o.querySelectorAll("code.hljs,code.nohighlight");for(var t in n)n.hasOwnProperty(t)&&(n[t].classList.contains("nohljsln")||d(n[t],e))}catch(e){r.console.error("LineNumbers error: ",e)}}function d(e,n){"object"==typeof e&&r.setTimeout(function(){e.innerHTML=f(e,n)},0)}function f(e,n){var t,r,o=(t=e,{singleLine:function(e){return!!e.singleLine&&e.singleLine}(r=(r=n)||{}),startFrom:function(e,n){var t=1;isFinite(n.startFrom)&&(t=n.startFrom);var r=function(e,n){return e.hasAttribute(n)?e.getAttribute(n):null}(e,"data-ln-start-from");return null!==r&&(t=function(e,n){if(!e)return n;var t=Number(e);return isFinite(t)?t:n}(r,1)),t}(t,r)});return function e(n){var t=n.childNodes;for(var r in t){var o;t.hasOwnProperty(r)&&(o=t[r],0<(o.textContent.trim().match(a)||[]).length&&(0<o.childNodes.length?e(o):v(o.parentNode)))}}(e),function(e,n){var t=g(e);""===t[t.length-1].trim()&&t.pop();if(1<t.length||n.singleLine){for(var r="",o=0,a=t.length;o<a;o++)r+=p('<tr><td class="{0} {1}" {3}="{5}"><div class="{2}" {3}="{5}"></div></td><td class="{0} {4}" {3}="{5}">{6}</td></tr>',[l,s,c,m,h,o+n.startFrom,0<t[o].length?t[o]:" "]);return p('<table class="{0}">{1}</table>',[i,r])}return e}(e.innerHTML,o)}function v(e){var n=e.className;if(/hljs-/.test(n)){for(var t=g(e.innerHTML),r=0,o="";r<t.length;r++){o+=p('<span class="{0}">{1}</span>\n',[n,0<t[r].length?t[r]:" "])}e.innerHTML=o.trim()}}function g(e){return 0===e.length?[]:e.split(a)}function p(e,t){return e.replace(/\{(\d+)\}/g,function(e,n){return void 0!==t[n]?t[n]:e})}r.hljs?(r.hljs.initLineNumbersOnLoad=function(e){"interactive"===o.readyState||"complete"===o.readyState?n(e):r.addEventListener("DOMContentLoaded",function(){n(e)})},r.hljs.lineNumbersBlock=d,r.hljs.lineNumbersValue=function(e,n){if("string"!=typeof e)return;var t=document.createElement("code");return t.innerHTML=e,f(t,n)},(e=o.createElement("style")).type="text/css",e.innerHTML=p(".{0}{border-collapse:collapse}.{0} td{padding:0}.{1}:before{content:attr({2})}",[i,c,m]),o.getElementsByTagName("head")[0].appendChild(e)):r.console.error("highlight.js not detected!"),document.addEventListener("copy",function(e){var n,t=window.getSelection();!function(e){for(var n=e;n;){if(n.className&&-1!==n.className.indexOf("hljs-ln-code"))return 1;n=n.parentNode}}(t.anchorNode)||(n=-1!==window.navigator.userAgent.indexOf("Edge")?u(t):t.toString(),e.clipboardData.setData("text/plain",n),e.preventDefault())})}(window,document);

        hljs.initLineNumbersOnLoad()

        window.addEventListener('load', function() {
            document.querySelectorAll('.renderer').forEach(function(element, index) {
                if (index > 0) {
                    element.remove();
                }
            });

            document.querySelector('.default-highlightable-code').style.display = 'block';

            document.querySelectorAll('.highlightable-code').forEach(function(element) {
                element.style.display = 'block';
            })
        });
    </script>
</body>
</html>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Providers/../resources/exceptions/renderer/components/layout.blade.php ENDPATH**/ ?>
```

# storage\framework\views\e2e2b33ab91d33ca685345d3cd78e8f1.php

```php
<?php if (isset($component)) { $__componentOriginal3287929725b3f878740bf3f25881b9ff = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal3287929725b3f878740bf3f25881b9ff = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => $__env->getContainer()->make(Illuminate\View\Factory::class)->make('mail::layout'),'data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('mail::layout'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
    
     <?php $__env->slot('header', null, []); ?> 
        <?php if (isset($component)) { $__componentOriginal4b27c9cf0646a011e45f5c0081cff2ae = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal4b27c9cf0646a011e45f5c0081cff2ae = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => $__env->getContainer()->make(Illuminate\View\Factory::class)->make('mail::header'),'data' => ['url' => config('app.url')]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('mail::header'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['url' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute(config('app.url'))]); ?>
            <?php echo e(config('app.name')); ?>

         <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal4b27c9cf0646a011e45f5c0081cff2ae)): ?>
<?php $attributes = $__attributesOriginal4b27c9cf0646a011e45f5c0081cff2ae; ?>
<?php unset($__attributesOriginal4b27c9cf0646a011e45f5c0081cff2ae); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal4b27c9cf0646a011e45f5c0081cff2ae)): ?>
<?php $component = $__componentOriginal4b27c9cf0646a011e45f5c0081cff2ae; ?>
<?php unset($__componentOriginal4b27c9cf0646a011e45f5c0081cff2ae); ?>
<?php endif; ?>
     <?php $__env->endSlot(); ?>

    
    <?php echo e($slot); ?>


    
    <?php if(isset($subcopy)): ?>
         <?php $__env->slot('subcopy', null, []); ?> 
            <?php if (isset($component)) { $__componentOriginala95a089fc4dac0df2b807f0c4d49e8b5 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginala95a089fc4dac0df2b807f0c4d49e8b5 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => $__env->getContainer()->make(Illuminate\View\Factory::class)->make('mail::subcopy'),'data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('mail::subcopy'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
                <?php echo e($subcopy); ?>

             <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginala95a089fc4dac0df2b807f0c4d49e8b5)): ?>
<?php $attributes = $__attributesOriginala95a089fc4dac0df2b807f0c4d49e8b5; ?>
<?php unset($__attributesOriginala95a089fc4dac0df2b807f0c4d49e8b5); ?>
<?php endif; ?>
<?php if (isset($__componentOriginala95a089fc4dac0df2b807f0c4d49e8b5)): ?>
<?php $component = $__componentOriginala95a089fc4dac0df2b807f0c4d49e8b5; ?>
<?php unset($__componentOriginala95a089fc4dac0df2b807f0c4d49e8b5); ?>
<?php endif; ?>
         <?php $__env->endSlot(); ?>
    <?php endif; ?>

    
     <?php $__env->slot('footer', null, []); ?> 
        <?php if (isset($component)) { $__componentOriginalef4bd4280c5be2fca1cb0cfd4325d122 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalef4bd4280c5be2fca1cb0cfd4325d122 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => $__env->getContainer()->make(Illuminate\View\Factory::class)->make('mail::footer'),'data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('mail::footer'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
            © <?php echo e(date('Y')); ?> <?php echo e(config('app.name')); ?>. <?php echo app('translator')->get('All rights reserved.'); ?>
         <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalef4bd4280c5be2fca1cb0cfd4325d122)): ?>
<?php $attributes = $__attributesOriginalef4bd4280c5be2fca1cb0cfd4325d122; ?>
<?php unset($__attributesOriginalef4bd4280c5be2fca1cb0cfd4325d122); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalef4bd4280c5be2fca1cb0cfd4325d122)): ?>
<?php $component = $__componentOriginalef4bd4280c5be2fca1cb0cfd4325d122; ?>
<?php unset($__componentOriginalef4bd4280c5be2fca1cb0cfd4325d122); ?>
<?php endif; ?>
     <?php $__env->endSlot(); ?>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal3287929725b3f878740bf3f25881b9ff)): ?>
<?php $attributes = $__attributesOriginal3287929725b3f878740bf3f25881b9ff; ?>
<?php unset($__attributesOriginal3287929725b3f878740bf3f25881b9ff); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal3287929725b3f878740bf3f25881b9ff)): ?>
<?php $component = $__componentOriginal3287929725b3f878740bf3f25881b9ff; ?>
<?php unset($__componentOriginal3287929725b3f878740bf3f25881b9ff); ?>
<?php endif; ?>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Mail/resources/views/text/message.blade.php ENDPATH**/ ?>
```

# storage\framework\views\e2ece8c232e5a9ab44537d8ec4322692.php

```php
<section
    <?php echo e($attributes->merge(['class' => "@container flex flex-col p-6 sm:p-12 bg-white dark:bg-gray-900/80 text-gray-900 dark:text-gray-100 rounded-lg default:col-span-full default:lg:col-span-6 default:row-span-1 dark:ring-1 dark:ring-gray-800 shadow-xl"])); ?>

>
    <?php echo e($slot); ?>

</section>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Providers/../resources/exceptions/renderer/components/card.blade.php ENDPATH**/ ?>
```

# storage\framework\views\e3a851a7bad1dc6001742a2911eec17d.php

```php
<svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    <?php echo e($attributes); ?>

>
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
</svg>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Providers/../resources/exceptions/renderer/components/icons/sun.blade.php ENDPATH**/ ?>
```

# storage\framework\views\e31ea6eba8513624ca32fb71ea98c77a.php

```php
<?php if (isset($component)) { $__componentOriginalbbd4eeea836234825f7514ed20d2d52d = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalbbd4eeea836234825f7514ed20d2d52d = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.layout','data' => ['exception' => $exception]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::layout'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['exception' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($exception)]); ?>
    <div class="renderer container mx-auto lg:px-8">
        <?php if (isset($component)) { $__componentOriginal10cd8b81fdad4ce00a06c99f27003014 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal10cd8b81fdad4ce00a06c99f27003014 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.navigation','data' => ['exception' => $exception]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::navigation'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['exception' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($exception)]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal10cd8b81fdad4ce00a06c99f27003014)): ?>
<?php $attributes = $__attributesOriginal10cd8b81fdad4ce00a06c99f27003014; ?>
<?php unset($__attributesOriginal10cd8b81fdad4ce00a06c99f27003014); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal10cd8b81fdad4ce00a06c99f27003014)): ?>
<?php $component = $__componentOriginal10cd8b81fdad4ce00a06c99f27003014; ?>
<?php unset($__componentOriginal10cd8b81fdad4ce00a06c99f27003014); ?>
<?php endif; ?>

        <main class="px-6 pb-12 pt-6">
            <div class="container mx-auto">
                <?php if (isset($component)) { $__componentOriginal1e817eb3c41fe3ea9eb0c15213c4b557 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal1e817eb3c41fe3ea9eb0c15213c4b557 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.header','data' => ['exception' => $exception]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::header'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['exception' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($exception)]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal1e817eb3c41fe3ea9eb0c15213c4b557)): ?>
<?php $attributes = $__attributesOriginal1e817eb3c41fe3ea9eb0c15213c4b557; ?>
<?php unset($__attributesOriginal1e817eb3c41fe3ea9eb0c15213c4b557); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal1e817eb3c41fe3ea9eb0c15213c4b557)): ?>
<?php $component = $__componentOriginal1e817eb3c41fe3ea9eb0c15213c4b557; ?>
<?php unset($__componentOriginal1e817eb3c41fe3ea9eb0c15213c4b557); ?>
<?php endif; ?>

                <?php if (isset($component)) { $__componentOriginal1dc7d865c9b6045c4d68faf8bde572ed = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal1dc7d865c9b6045c4d68faf8bde572ed = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.trace-and-editor','data' => ['exception' => $exception]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::trace-and-editor'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['exception' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($exception)]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal1dc7d865c9b6045c4d68faf8bde572ed)): ?>
<?php $attributes = $__attributesOriginal1dc7d865c9b6045c4d68faf8bde572ed; ?>
<?php unset($__attributesOriginal1dc7d865c9b6045c4d68faf8bde572ed); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal1dc7d865c9b6045c4d68faf8bde572ed)): ?>
<?php $component = $__componentOriginal1dc7d865c9b6045c4d68faf8bde572ed; ?>
<?php unset($__componentOriginal1dc7d865c9b6045c4d68faf8bde572ed); ?>
<?php endif; ?>

                <?php if (isset($component)) { $__componentOriginal523928ff754f95aea6faf87444393a04 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal523928ff754f95aea6faf87444393a04 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.context','data' => ['exception' => $exception]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::context'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['exception' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($exception)]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal523928ff754f95aea6faf87444393a04)): ?>
<?php $attributes = $__attributesOriginal523928ff754f95aea6faf87444393a04; ?>
<?php unset($__attributesOriginal523928ff754f95aea6faf87444393a04); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal523928ff754f95aea6faf87444393a04)): ?>
<?php $component = $__componentOriginal523928ff754f95aea6faf87444393a04; ?>
<?php unset($__componentOriginal523928ff754f95aea6faf87444393a04); ?>
<?php endif; ?>
            </div>
        </main>
    </div>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalbbd4eeea836234825f7514ed20d2d52d)): ?>
<?php $attributes = $__attributesOriginalbbd4eeea836234825f7514ed20d2d52d; ?>
<?php unset($__attributesOriginalbbd4eeea836234825f7514ed20d2d52d); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalbbd4eeea836234825f7514ed20d2d52d)): ?>
<?php $component = $__componentOriginalbbd4eeea836234825f7514ed20d2d52d; ?>
<?php unset($__componentOriginalbbd4eeea836234825f7514ed20d2d52d); ?>
<?php endif; ?>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Providers/../resources/exceptions/renderer/show.blade.php ENDPATH**/ ?>
```

# storage\framework\views\e4241d9b917065a04dc8886be2eec2d9.php

```php
<?php if (isset($component)) { $__componentOriginal74daf2d0a9c625ad90327a6043d15980 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal74daf2d0a9c625ad90327a6043d15980 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.card','data' => ['class' => 'mt-6 overflow-x-auto']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::card'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['class' => 'mt-6 overflow-x-auto']); ?>
    <div
        x-data="{
            includeVendorFrames: false,
            index: <?php echo e($exception->defaultFrame()); ?>,
        }"
    >
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3" x-clock>
            <?php if (isset($component)) { $__componentOriginal92c1a431b4816bac5d5a20d0fc1238ab = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal92c1a431b4816bac5d5a20d0fc1238ab = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.trace','data' => ['exception' => $exception]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::trace'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['exception' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($exception)]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal92c1a431b4816bac5d5a20d0fc1238ab)): ?>
<?php $attributes = $__attributesOriginal92c1a431b4816bac5d5a20d0fc1238ab; ?>
<?php unset($__attributesOriginal92c1a431b4816bac5d5a20d0fc1238ab); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal92c1a431b4816bac5d5a20d0fc1238ab)): ?>
<?php $component = $__componentOriginal92c1a431b4816bac5d5a20d0fc1238ab; ?>
<?php unset($__componentOriginal92c1a431b4816bac5d5a20d0fc1238ab); ?>
<?php endif; ?>
            <?php if (isset($component)) { $__componentOriginala2de13eefed6710e7b4064d57c6d0e47 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginala2de13eefed6710e7b4064d57c6d0e47 = $attributes; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'laravel-exceptions-renderer::components.editor','data' => ['exception' => $exception]] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('laravel-exceptions-renderer::editor'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\Illuminate\View\AnonymousComponent::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['exception' => \Illuminate\View\Compilers\BladeCompiler::sanitizeComponentAttribute($exception)]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginala2de13eefed6710e7b4064d57c6d0e47)): ?>
<?php $attributes = $__attributesOriginala2de13eefed6710e7b4064d57c6d0e47; ?>
<?php unset($__attributesOriginala2de13eefed6710e7b4064d57c6d0e47); ?>
<?php endif; ?>
<?php if (isset($__componentOriginala2de13eefed6710e7b4064d57c6d0e47)): ?>
<?php $component = $__componentOriginala2de13eefed6710e7b4064d57c6d0e47; ?>
<?php unset($__componentOriginala2de13eefed6710e7b4064d57c6d0e47); ?>
<?php endif; ?>
        </div>
    </div>
 <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal74daf2d0a9c625ad90327a6043d15980)): ?>
<?php $attributes = $__attributesOriginal74daf2d0a9c625ad90327a6043d15980; ?>
<?php unset($__attributesOriginal74daf2d0a9c625ad90327a6043d15980); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal74daf2d0a9c625ad90327a6043d15980)): ?>
<?php $component = $__componentOriginal74daf2d0a9c625ad90327a6043d15980; ?>
<?php unset($__componentOriginal74daf2d0a9c625ad90327a6043d15980); ?>
<?php endif; ?>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Providers/../resources/exceptions/renderer/components/trace-and-editor.blade.php ENDPATH**/ ?>
```

# storage\framework\views\edb6420641e1108758afe2b3c22996fa.php

```php
<svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    <?php echo e($attributes); ?>

>
    <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
</svg>
<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Foundation\Providers/../resources/exceptions/renderer/components/icons/moon.blade.php ENDPATH**/ ?>
```

# storage\framework\views\f2a1d95b3f14d26f993312cd49fefbad.php

```php
<?php echo e($slot); ?>: <?php echo e($url); ?>

<?php /**PATH C:\xampp\htdocs\RC-Brown-Capital-API\vendor\laravel\framework\src\Illuminate\Mail/resources/views/text/header.blade.php ENDPATH**/ ?>
```

# storage\logs\.gitignore

```
*
!.gitignore

```

# storage\logs\laravel.log

```log
[2025-06-06 00:32:32] local.ERROR: SQLSTATE[42S01]: Base table or view already exists: 1050 Table 'personal_access_tokens' already exists (Connection: mysql, SQL: create table `personal_access_tokens` (`id` bigint unsigned not null auto_increment primary key, `tokenable_type` varchar(255) not null, `tokenable_id` bigint unsigned not null, `name` varchar(255) not null, `token` varchar(64) not null, `abilities` text null, `last_used_at` timestamp null, `expires_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') {"exception":"[object] (Illuminate\\Database\\QueryException(code: 42S01): SQLSTATE[42S01]: Base table or view already exists: 1050 Table 'personal_access_tokens' already exists (Connection: mysql, SQL: create table `personal_access_tokens` (`id` bigint unsigned not null auto_increment primary key, `tokenable_type` varchar(255) not null, `tokenable_id` bigint unsigned not null, `name` varchar(255) not null, `token` varchar(64) not null, `abilities` text null, `last_used_at` timestamp null, `expires_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:822)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `p...', Array, Object(Closure))
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `p...', Array, Object(Closure))
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `p...')
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('personal_access...', Object(Closure))
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_06_06_003101_create_personal_access_tokens_table.php(14): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_06_06_0031...', Object(Closure))
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_06_06_0031...', Object(Closure))
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 2, false)
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#34 {main}

[previous exception] [object] (PDOException(code: 42S01): SQLSTATE[42S01]: Base table or view already exists: 1050 Table 'personal_access_tokens' already exists at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:568)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(568): PDOStatement->execute()
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(809): Illuminate\\Database\\Connection->Illuminate\\Database\\{closure}('create table `p...', Array)
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `p...', Array, Object(Closure))
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `p...', Array, Object(Closure))
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `p...')
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('personal_access...', Object(Closure))
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_06_06_003101_create_personal_access_tokens_table.php(14): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_06_06_0031...', Object(Closure))
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_06_06_0031...', Object(Closure))
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 2, false)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#35 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#36 {main}
"} 
[2025-06-09 07:05:23] local.ERROR: SQLSTATE[HY000] [2002] No connection could be made because the target machine actively refused it (Connection: mysql, SQL: select * from `sessions` where `id` = cpiCkuXuMleMalswDK6IAFqhpExnvk55hos4pF9l limit 1) {"exception":"[object] (Illuminate\\Database\\QueryException(code: 2002): SQLSTATE[HY000] [2002] No connection could be made because the target machine actively refused it (Connection: mysql, SQL: select * from `sessions` where `id` = cpiCkuXuMleMalswDK6IAFqhpExnvk55hos4pF9l limit 1) at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:822)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(976): Illuminate\\Database\\Connection->runQueryCallback('select * from `...', Array, Object(Closure))
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(955): Illuminate\\Database\\Connection->tryAgainIfCausedByLostConnection(Object(Illuminate\\Database\\QueryException), 'select * from `...', Array, Object(Closure))
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(778): Illuminate\\Database\\Connection->handleQueryException(Object(Illuminate\\Database\\QueryException), 'select * from `...', Array, Object(Closure))
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(395): Illuminate\\Database\\Connection->run('select * from `...', Array, Object(Closure))
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3131): Illuminate\\Database\\Connection->select('select * from `...', Array, false)
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3116): Illuminate\\Database\\Query\\Builder->runSelect()
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3706): Illuminate\\Database\\Query\\Builder->Illuminate\\Database\\Query\\{closure}()
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3115): Illuminate\\Database\\Query\\Builder->onceWithColumns(Array, Object(Closure))
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Concerns\\BuildsQueries.php(366): Illuminate\\Database\\Query\\Builder->get(Array)
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3038): Illuminate\\Database\\Query\\Builder->first(Array)
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\DatabaseSessionHandler.php(96): Illuminate\\Database\\Query\\Builder->find('cpiCkuXuMleMals...')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Store.php(116): Illuminate\\Session\\DatabaseSessionHandler->read('cpiCkuXuMleMals...')
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Store.php(104): Illuminate\\Session\\Store->readFromHandler()
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Store.php(88): Illuminate\\Session\\Store->loadSession()
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(146): Illuminate\\Session\\Store->start()
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\helpers.php(399): Illuminate\\Session\\Middleware\\StartSession->Illuminate\\Session\\Middleware\\{closure}(Object(Illuminate\\Session\\Store))
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(143): tap(Object(Illuminate\\Session\\Store), Object(Closure))
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(115): Illuminate\\Session\\Middleware\\StartSession->startSession(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store))
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(63): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(36): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(74): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(807): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(786): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(750): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(739): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(51): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#36 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#38 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#39 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(109): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#40 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#41 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(61): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(58): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#44 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#45 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\InvokeDeferredCallbacks.php(22): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#46 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\InvokeDeferredCallbacks->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\ValidatePathEncoding.php(26): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\ValidatePathEncoding->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#51 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#52 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1219): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#53 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\public\\index.php(20): Illuminate\\Foundation\\Application->handleRequest(Object(Illuminate\\Http\\Request))
#54 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\resources\\server.php(23): require_once('C:\\\\xampp\\\\htdocs...')
#55 {main}

[previous exception] [object] (PDOException(code: 2002): SQLSTATE[HY000] [2002] No connection could be made because the target machine actively refused it at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connectors\\Connector.php:66)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connectors\\Connector.php(66): PDO->__construct('mysql:host=127....', 'root', Object(SensitiveParameterValue), Array)
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connectors\\Connector.php(85): Illuminate\\Database\\Connectors\\Connector->createPdoConnection('mysql:host=127....', 'root', Object(SensitiveParameterValue), Array)
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connectors\\Connector.php(48): Illuminate\\Database\\Connectors\\Connector->tryAgainIfCausedByLostConnection(Object(PDOException), 'mysql:host=127....', 'root', Object(SensitiveParameterValue), Array)
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connectors\\MySqlConnector.php(24): Illuminate\\Database\\Connectors\\Connector->createConnection('mysql:host=127....', Array, Array)
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connectors\\ConnectionFactory.php(184): Illuminate\\Database\\Connectors\\MySqlConnector->connect(Array)
#5 [internal function]: Illuminate\\Database\\Connectors\\ConnectionFactory->Illuminate\\Database\\Connectors\\{closure}()
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(1228): call_user_func(Object(Closure))
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(509): Illuminate\\Database\\Connection->getPdo()
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(404): Illuminate\\Database\\Connection->getPdoForSelect(false)
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(809): Illuminate\\Database\\Connection->Illuminate\\Database\\{closure}('select * from `...', Array)
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(976): Illuminate\\Database\\Connection->runQueryCallback('select * from `...', Array, Object(Closure))
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(955): Illuminate\\Database\\Connection->tryAgainIfCausedByLostConnection(Object(Illuminate\\Database\\QueryException), 'select * from `...', Array, Object(Closure))
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(778): Illuminate\\Database\\Connection->handleQueryException(Object(Illuminate\\Database\\QueryException), 'select * from `...', Array, Object(Closure))
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(395): Illuminate\\Database\\Connection->run('select * from `...', Array, Object(Closure))
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3131): Illuminate\\Database\\Connection->select('select * from `...', Array, false)
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3116): Illuminate\\Database\\Query\\Builder->runSelect()
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3706): Illuminate\\Database\\Query\\Builder->Illuminate\\Database\\Query\\{closure}()
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3115): Illuminate\\Database\\Query\\Builder->onceWithColumns(Array, Object(Closure))
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Concerns\\BuildsQueries.php(366): Illuminate\\Database\\Query\\Builder->get(Array)
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3038): Illuminate\\Database\\Query\\Builder->first(Array)
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\DatabaseSessionHandler.php(96): Illuminate\\Database\\Query\\Builder->find('cpiCkuXuMleMals...')
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Store.php(116): Illuminate\\Session\\DatabaseSessionHandler->read('cpiCkuXuMleMals...')
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Store.php(104): Illuminate\\Session\\Store->readFromHandler()
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Store.php(88): Illuminate\\Session\\Store->loadSession()
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(146): Illuminate\\Session\\Store->start()
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\helpers.php(399): Illuminate\\Session\\Middleware\\StartSession->Illuminate\\Session\\Middleware\\{closure}(Object(Illuminate\\Session\\Store))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(143): tap(Object(Illuminate\\Session\\Store), Object(Closure))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(115): Illuminate\\Session\\Middleware\\StartSession->startSession(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(63): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(36): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(74): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(807): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#36 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(786): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#37 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(750): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#38 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(739): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#39 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#40 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#41 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#44 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#45 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(51): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#46 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(109): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#51 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(61): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#52 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#53 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(58): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#54 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#55 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\InvokeDeferredCallbacks.php(22): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#56 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\InvokeDeferredCallbacks->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#57 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\ValidatePathEncoding.php(26): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#58 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\ValidatePathEncoding->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#59 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#60 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#61 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#62 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1219): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#63 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\public\\index.php(20): Illuminate\\Foundation\\Application->handleRequest(Object(Illuminate\\Http\\Request))
#64 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\resources\\server.php(23): require_once('C:\\\\xampp\\\\htdocs...')
#65 {main}
"} 
[2025-06-09 07:05:46] local.ERROR: Maximum execution time of 60 seconds exceeded {"exception":"[object] (Symfony\\Component\\ErrorHandler\\Error\\FatalError(code: 0): Maximum execution time of 60 seconds exceeded at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\error-handler\\ErrorRenderer\\HtmlErrorRenderer.php:257)
[stacktrace]
#0 {main}
"} 
[2025-06-23 08:12:01] local.ERROR: SQLSTATE[HY000] [2002] No connection could be made because the target machine actively refused it (Connection: mysql, SQL: select * from `sessions` where `id` = olu7WM2VFdSu5pMDKeljP15l8HsQO6CiKcKmSD50 limit 1) {"exception":"[object] (Illuminate\\Database\\QueryException(code: 2002): SQLSTATE[HY000] [2002] No connection could be made because the target machine actively refused it (Connection: mysql, SQL: select * from `sessions` where `id` = olu7WM2VFdSu5pMDKeljP15l8HsQO6CiKcKmSD50 limit 1) at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:822)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(976): Illuminate\\Database\\Connection->runQueryCallback('select * from `...', Array, Object(Closure))
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(955): Illuminate\\Database\\Connection->tryAgainIfCausedByLostConnection(Object(Illuminate\\Database\\QueryException), 'select * from `...', Array, Object(Closure))
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(778): Illuminate\\Database\\Connection->handleQueryException(Object(Illuminate\\Database\\QueryException), 'select * from `...', Array, Object(Closure))
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(395): Illuminate\\Database\\Connection->run('select * from `...', Array, Object(Closure))
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3131): Illuminate\\Database\\Connection->select('select * from `...', Array, false)
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3116): Illuminate\\Database\\Query\\Builder->runSelect()
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3706): Illuminate\\Database\\Query\\Builder->Illuminate\\Database\\Query\\{closure}()
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3115): Illuminate\\Database\\Query\\Builder->onceWithColumns(Array, Object(Closure))
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Concerns\\BuildsQueries.php(366): Illuminate\\Database\\Query\\Builder->get(Array)
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3038): Illuminate\\Database\\Query\\Builder->first(Array)
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\DatabaseSessionHandler.php(96): Illuminate\\Database\\Query\\Builder->find('olu7WM2VFdSu5pM...')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Store.php(116): Illuminate\\Session\\DatabaseSessionHandler->read('olu7WM2VFdSu5pM...')
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Store.php(104): Illuminate\\Session\\Store->readFromHandler()
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Store.php(88): Illuminate\\Session\\Store->loadSession()
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(146): Illuminate\\Session\\Store->start()
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\helpers.php(399): Illuminate\\Session\\Middleware\\StartSession->Illuminate\\Session\\Middleware\\{closure}(Object(Illuminate\\Session\\Store))
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(143): tap(Object(Illuminate\\Session\\Store), Object(Closure))
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(115): Illuminate\\Session\\Middleware\\StartSession->startSession(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store))
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(63): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(36): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(74): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(807): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(786): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(750): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(739): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(51): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#36 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#37 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#38 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#39 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(109): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#40 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#41 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(48): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(58): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#44 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#45 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\InvokeDeferredCallbacks.php(22): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#46 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\InvokeDeferredCallbacks->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\ValidatePathEncoding.php(26): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\ValidatePathEncoding->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#51 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#52 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1219): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#53 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\public\\index.php(20): Illuminate\\Foundation\\Application->handleRequest(Object(Illuminate\\Http\\Request))
#54 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\resources\\server.php(23): require_once('C:\\\\xampp\\\\htdocs...')
#55 {main}

[previous exception] [object] (PDOException(code: 2002): SQLSTATE[HY000] [2002] No connection could be made because the target machine actively refused it at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connectors\\Connector.php:66)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connectors\\Connector.php(66): PDO->__construct('mysql:host=127....', 'root', Object(SensitiveParameterValue), Array)
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connectors\\Connector.php(85): Illuminate\\Database\\Connectors\\Connector->createPdoConnection('mysql:host=127....', 'root', Object(SensitiveParameterValue), Array)
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connectors\\Connector.php(48): Illuminate\\Database\\Connectors\\Connector->tryAgainIfCausedByLostConnection(Object(PDOException), 'mysql:host=127....', 'root', Object(SensitiveParameterValue), Array)
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connectors\\MySqlConnector.php(24): Illuminate\\Database\\Connectors\\Connector->createConnection('mysql:host=127....', Array, Array)
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connectors\\ConnectionFactory.php(184): Illuminate\\Database\\Connectors\\MySqlConnector->connect(Array)
#5 [internal function]: Illuminate\\Database\\Connectors\\ConnectionFactory->Illuminate\\Database\\Connectors\\{closure}()
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(1228): call_user_func(Object(Closure))
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(509): Illuminate\\Database\\Connection->getPdo()
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(404): Illuminate\\Database\\Connection->getPdoForSelect(false)
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(809): Illuminate\\Database\\Connection->Illuminate\\Database\\{closure}('select * from `...', Array)
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(976): Illuminate\\Database\\Connection->runQueryCallback('select * from `...', Array, Object(Closure))
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(955): Illuminate\\Database\\Connection->tryAgainIfCausedByLostConnection(Object(Illuminate\\Database\\QueryException), 'select * from `...', Array, Object(Closure))
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(778): Illuminate\\Database\\Connection->handleQueryException(Object(Illuminate\\Database\\QueryException), 'select * from `...', Array, Object(Closure))
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(395): Illuminate\\Database\\Connection->run('select * from `...', Array, Object(Closure))
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3131): Illuminate\\Database\\Connection->select('select * from `...', Array, false)
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3116): Illuminate\\Database\\Query\\Builder->runSelect()
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3706): Illuminate\\Database\\Query\\Builder->Illuminate\\Database\\Query\\{closure}()
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3115): Illuminate\\Database\\Query\\Builder->onceWithColumns(Array, Object(Closure))
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Concerns\\BuildsQueries.php(366): Illuminate\\Database\\Query\\Builder->get(Array)
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Query\\Builder.php(3038): Illuminate\\Database\\Query\\Builder->first(Array)
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\DatabaseSessionHandler.php(96): Illuminate\\Database\\Query\\Builder->find('olu7WM2VFdSu5pM...')
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Store.php(116): Illuminate\\Session\\DatabaseSessionHandler->read('olu7WM2VFdSu5pM...')
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Store.php(104): Illuminate\\Session\\Store->readFromHandler()
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Store.php(88): Illuminate\\Session\\Store->loadSession()
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(146): Illuminate\\Session\\Store->start()
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\helpers.php(399): Illuminate\\Session\\Middleware\\StartSession->Illuminate\\Session\\Middleware\\{closure}(Object(Illuminate\\Session\\Store))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(143): tap(Object(Illuminate\\Session\\Store), Object(Closure))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(115): Illuminate\\Session\\Middleware\\StartSession->startSession(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Session\\Middleware\\StartSession.php(63): Illuminate\\Session\\Middleware\\StartSession->handleStatefulRequest(Object(Illuminate\\Http\\Request), Object(Illuminate\\Session\\Store), Object(Closure))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Session\\Middleware\\StartSession->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse.php(36): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Cookie\\Middleware\\AddQueuedCookiesToResponse->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Cookie\\Middleware\\EncryptCookies.php(74): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Cookie\\Middleware\\EncryptCookies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#35 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(807): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#36 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(786): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#37 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(750): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#38 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(739): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#39 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#40 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#41 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#42 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#43 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#44 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#45 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(51): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#46 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#47 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#48 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#49 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(109): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#50 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#51 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(48): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#52 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#53 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(58): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#54 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#55 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\InvokeDeferredCallbacks.php(22): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#56 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\InvokeDeferredCallbacks->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#57 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\ValidatePathEncoding.php(26): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#58 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\ValidatePathEncoding->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#59 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#60 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#61 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#62 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1219): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#63 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\public\\index.php(20): Illuminate\\Foundation\\Application->handleRequest(Object(Illuminate\\Http\\Request))
#64 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\resources\\server.php(23): require_once('C:\\\\xampp\\\\htdocs...')
#65 {main}
"} 
[2025-06-27 13:00:26] local.ERROR: SQLSTATE[HY000]: General error: 1005 Can't create table `rcbrowncapital`.`business_information` (errno: 150 "Foreign key constraint is incorrectly formed") (Connection: mysql, SQL: alter table `business_information` add constraint `business_information_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on delete set null) {"exception":"[object] (Illuminate\\Database\\QueryException(code: HY000): SQLSTATE[HY000]: General error: 1005 Can't create table `rcbrowncapital`.`business_information` (errno: 150 \"Foreign key constraint is incorrectly formed\") (Connection: mysql, SQL: alter table `business_information` add constraint `business_information_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on delete set null) at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:822)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('alter table `bu...', Array, Object(Closure))
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('alter table `bu...', Array, Object(Closure))
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('alter table `bu...')
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('business_inform...', Object(Closure))
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_06_09_073356_create_business_information_table.php(15): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_06_09_0733...', Object(Closure))
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_06_09_0733...', Object(Closure))
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 3, false)
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#34 {main}

[previous exception] [object] (PDOException(code: HY000): SQLSTATE[HY000]: General error: 1005 Can't create table `rcbrowncapital`.`business_information` (errno: 150 \"Foreign key constraint is incorrectly formed\") at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:568)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(568): PDOStatement->execute()
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(809): Illuminate\\Database\\Connection->Illuminate\\Database\\{closure}('alter table `bu...', Array)
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('alter table `bu...', Array, Object(Closure))
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('alter table `bu...', Array, Object(Closure))
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('alter table `bu...')
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('business_inform...', Object(Closure))
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_06_09_073356_create_business_information_table.php(15): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_06_09_0733...', Object(Closure))
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_06_09_0733...', Object(Closure))
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 3, false)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#35 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#36 {main}
"} 
[2025-06-27 13:01:07] local.ERROR: SQLSTATE[42S01]: Base table or view already exists: 1050 Table 'business_information' already exists (Connection: mysql, SQL: create table `business_information` (`id` bigint unsigned not null auto_increment primary key, `user_id` bigint unsigned not null, `preferred_currency` varchar(255) null, `business_type` varchar(255) null, `years_in_business` varchar(255) null, `company_history` json null, `primary_focus` json null, `project_details` json null, `average_roi` varchar(255) null, `projected_completion_time` json null, `actual_completion_time` varchar(255) null, `funding_structure` json null, `exit_strategy` json null, `investment_currency` varchar(255) null, `investment_size_range` varchar(255) null, `raised_capital_before` tinyint(1) null, `investor_relationship` json null, `issues_with_payments` tinyint(1) null, `payment_issues_details` text null, `over_budget_projects` tinyint(1) null, `over_budget_handling` text null, `capital_percentage` varchar(255) null, `interested_investment_types` json null, `legal_issues` tinyint(1) null, `legal_issues_details` text null, `compliance_details` text null, `update_frequency` varchar(255) null, `social_links` json null, `supporting_documents` json null, `references` json null, `terms_accepted` tinyint(1) not null default '0', `status` varchar(255) not null default 'pending', `is_draft` tinyint(1) not null default '1', `created_at` timestamp null, `updated_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') {"exception":"[object] (Illuminate\\Database\\QueryException(code: 42S01): SQLSTATE[42S01]: Base table or view already exists: 1050 Table 'business_information' already exists (Connection: mysql, SQL: create table `business_information` (`id` bigint unsigned not null auto_increment primary key, `user_id` bigint unsigned not null, `preferred_currency` varchar(255) null, `business_type` varchar(255) null, `years_in_business` varchar(255) null, `company_history` json null, `primary_focus` json null, `project_details` json null, `average_roi` varchar(255) null, `projected_completion_time` json null, `actual_completion_time` varchar(255) null, `funding_structure` json null, `exit_strategy` json null, `investment_currency` varchar(255) null, `investment_size_range` varchar(255) null, `raised_capital_before` tinyint(1) null, `investor_relationship` json null, `issues_with_payments` tinyint(1) null, `payment_issues_details` text null, `over_budget_projects` tinyint(1) null, `over_budget_handling` text null, `capital_percentage` varchar(255) null, `interested_investment_types` json null, `legal_issues` tinyint(1) null, `legal_issues_details` text null, `compliance_details` text null, `update_frequency` varchar(255) null, `social_links` json null, `supporting_documents` json null, `references` json null, `terms_accepted` tinyint(1) not null default '0', `status` varchar(255) not null default 'pending', `is_draft` tinyint(1) not null default '1', `created_at` timestamp null, `updated_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:822)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `b...', Array, Object(Closure))
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `b...', Array, Object(Closure))
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `b...')
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('business_inform...', Object(Closure))
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_06_09_073356_create_business_information_table.php(15): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_06_09_0733...', Object(Closure))
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_06_09_0733...', Object(Closure))
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 3, false)
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#34 {main}

[previous exception] [object] (PDOException(code: 42S01): SQLSTATE[42S01]: Base table or view already exists: 1050 Table 'business_information' already exists at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:568)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(568): PDOStatement->execute()
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(809): Illuminate\\Database\\Connection->Illuminate\\Database\\{closure}('create table `b...', Array)
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `b...', Array, Object(Closure))
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `b...', Array, Object(Closure))
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `b...')
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('business_inform...', Object(Closure))
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_06_09_073356_create_business_information_table.php(15): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_06_09_0733...', Object(Closure))
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_06_09_0733...', Object(Closure))
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 3, false)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#35 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#36 {main}
"} 
[2025-06-27 13:01:35] local.ERROR: SQLSTATE[HY000]: General error: 1005 Can't create table `rcbrowncapital`.`business_information` (errno: 150 "Foreign key constraint is incorrectly formed") (Connection: mysql, SQL: alter table `business_information` add constraint `business_information_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on delete set null) {"exception":"[object] (Illuminate\\Database\\QueryException(code: HY000): SQLSTATE[HY000]: General error: 1005 Can't create table `rcbrowncapital`.`business_information` (errno: 150 \"Foreign key constraint is incorrectly formed\") (Connection: mysql, SQL: alter table `business_information` add constraint `business_information_user_id_foreign` foreign key (`user_id`) references `users` (`id`) on delete set null) at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:822)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('alter table `bu...', Array, Object(Closure))
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('alter table `bu...', Array, Object(Closure))
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('alter table `bu...')
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('business_inform...', Object(Closure))
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_06_09_073356_create_business_information_table.php(15): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_06_09_0733...', Object(Closure))
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_06_09_0733...', Object(Closure))
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 3, false)
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#34 {main}

[previous exception] [object] (PDOException(code: HY000): SQLSTATE[HY000]: General error: 1005 Can't create table `rcbrowncapital`.`business_information` (errno: 150 \"Foreign key constraint is incorrectly formed\") at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:568)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(568): PDOStatement->execute()
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(809): Illuminate\\Database\\Connection->Illuminate\\Database\\{closure}('alter table `bu...', Array)
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('alter table `bu...', Array, Object(Closure))
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('alter table `bu...', Array, Object(Closure))
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('alter table `bu...')
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('business_inform...', Object(Closure))
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_06_09_073356_create_business_information_table.php(15): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_06_09_0733...', Object(Closure))
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_06_09_0733...', Object(Closure))
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 3, false)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#35 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#36 {main}
"} 
[2025-07-07 00:24:41] local.ERROR: SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'property_address' (Connection: mysql, SQL: create table `project_uploads` (`id` bigint unsigned not null auto_increment primary key, `sponsor_id` bigint unsigned not null, `currency` varchar(255) not null, `sponsor_name` varchar(255) not null, `sponsor_logo_path` varchar(255) null, `project_name` varchar(255) null, `project_subtitle` varchar(255) null, `project_summary` text null, `historical_portfolio_activity` decimal(20, 2) null, `assets_under_management` decimal(20, 2) null, `realized_projects` int null, `rc_brown_capital_offerings` int null, `projected_valuation` decimal(20, 2) null, `timeline_of_completion_months` int null, `total_capital_required` decimal(20, 2) null, `total_debt_allocation_percent` decimal(5, 2) null, `debt_investment_tenure_months` int null, `projected_returns_equity_percent` decimal(5, 2) null, `total_equity_percent` decimal(5, 2) null, `property_address` varchar(255) null, `location_description` text null, `occupancy` enum('vacant', 'partially_occupied', 'fully_occupied') null, `about_property` text null, `detailed_project_description` text null, `has_anchor_tenant` tinyint(1) null, `anchor_tenant_details` text null, `has_anchor_buyer` tinyint(1) null, `anchor_buyer_details` text null, `percent_leased` decimal(5, 2) null, `sq_ft_leased` decimal(15, 2) null, `investment_hold_period_years` int null, `acquisition_date` date null, `closing_date` date null, `target_exit_date_debt` date null, `target_exit_date_equity` date null, `offer_live_date` date null, `offer_closing_date` date null, `funds_due_date` date null, `target_escrow_closing_date` date null, `targeted_distribution_start_date` date null, `distributions_anticipated_begin_date` date null, `frequency_of_distributions` enum('monthly', 'quarterly', 'annually', 'at_maturity') null, `sponsor_background` longtext null, `years_in_operation` varchar(255) null, `historical_portfolio_activity_amount` varchar(255) null, `projects_under_management_amount` varchar(255) null, `total_square_feet_managed` varchar(255) null, `deals_funded_by_rc_brown` int null, `number_of_properties_under_management` int null, `total_number_of_realized_projects` int null, `number_properties_developed` int null, `number_properties_built_sold` int null, `highest_budget_for_project` varchar(255) null, `average_length_of_completion_months` int null, `full_track_record` varchar(255) null, `total_capitalization` decimal(20, 2) null, `debt_allocation` decimal(20, 2) null, `equity_allocation` decimal(20, 2) null, `sponsor_co_invest_range` varchar(255) null, `offer_deadline` date null, `location` varchar(255) null, `asset_type` varchar(255) null, `strategy` varchar(255) null, `objective` varchar(255) null, `debt_allocation_percent` decimal(5, 2) null, `debt_distribution_period` varchar(255) null, `debt_target_distribution_start_date` date null, `debt_target_distribution_end_date` date null, `debt_minimum_investment_amount` decimal(15, 2) null, `debt_maximum_investment_amount` decimal(15, 2) null, `debt_expected_minimum_annual_return` decimal(5, 2) null, `debt_expected_maximum_annual_return` decimal(5, 2) null, `debt_target_hold_period_years` int null, `debt_exit_date` date null, `equity_allocation_percent` decimal(5, 2) null, `equity_distribution_period` varchar(255) null, `equity_target_distribution_start_date` date null, `equity_minimum_investment` decimal(15, 2) null, `equity_maximum_investment` decimal(15, 2) null, `equity_expected_minimum_return` decimal(5, 2) null, `equity_expected_maximum_return` decimal(5, 2) null, `equity_target_hold_period_years` int null, `equity_exit_date` date null, `property_address` varchar(255) null, `city` varchar(255) null, `state` varchar(255) null, `zip_code` varchar(255) null, `in_depth_description_of_work` text null, `project_timeline_months` int null, `adding_square_footage` tinyint(1) not null default '0', `square_footage_expansion_plan` varchar(255) null, `total_construction_cost` decimal(20, 2) null, `taxes` decimal(20, 2) null, `insurance` decimal(20, 2) null, `management` decimal(20, 2) null, `repairs` decimal(20, 2) null, `utilities` decimal(20, 2) null, `interest` decimal(20, 2) null, `total_expense` decimal(20, 2) null, `total_rental_income` decimal(20, 2) null, `total_equity_appreciation` decimal(20, 2) null, `status` enum('draft', 'pending', 'approved', 'rejected') not null default 'draft', `current_step` int not null default '1', `completed_steps` json not null default '[]', `submitted_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null, `deleted_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') {"exception":"[object] (Illuminate\\Database\\QueryException(code: 42S21): SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'property_address' (Connection: mysql, SQL: create table `project_uploads` (`id` bigint unsigned not null auto_increment primary key, `sponsor_id` bigint unsigned not null, `currency` varchar(255) not null, `sponsor_name` varchar(255) not null, `sponsor_logo_path` varchar(255) null, `project_name` varchar(255) null, `project_subtitle` varchar(255) null, `project_summary` text null, `historical_portfolio_activity` decimal(20, 2) null, `assets_under_management` decimal(20, 2) null, `realized_projects` int null, `rc_brown_capital_offerings` int null, `projected_valuation` decimal(20, 2) null, `timeline_of_completion_months` int null, `total_capital_required` decimal(20, 2) null, `total_debt_allocation_percent` decimal(5, 2) null, `debt_investment_tenure_months` int null, `projected_returns_equity_percent` decimal(5, 2) null, `total_equity_percent` decimal(5, 2) null, `property_address` varchar(255) null, `location_description` text null, `occupancy` enum('vacant', 'partially_occupied', 'fully_occupied') null, `about_property` text null, `detailed_project_description` text null, `has_anchor_tenant` tinyint(1) null, `anchor_tenant_details` text null, `has_anchor_buyer` tinyint(1) null, `anchor_buyer_details` text null, `percent_leased` decimal(5, 2) null, `sq_ft_leased` decimal(15, 2) null, `investment_hold_period_years` int null, `acquisition_date` date null, `closing_date` date null, `target_exit_date_debt` date null, `target_exit_date_equity` date null, `offer_live_date` date null, `offer_closing_date` date null, `funds_due_date` date null, `target_escrow_closing_date` date null, `targeted_distribution_start_date` date null, `distributions_anticipated_begin_date` date null, `frequency_of_distributions` enum('monthly', 'quarterly', 'annually', 'at_maturity') null, `sponsor_background` longtext null, `years_in_operation` varchar(255) null, `historical_portfolio_activity_amount` varchar(255) null, `projects_under_management_amount` varchar(255) null, `total_square_feet_managed` varchar(255) null, `deals_funded_by_rc_brown` int null, `number_of_properties_under_management` int null, `total_number_of_realized_projects` int null, `number_properties_developed` int null, `number_properties_built_sold` int null, `highest_budget_for_project` varchar(255) null, `average_length_of_completion_months` int null, `full_track_record` varchar(255) null, `total_capitalization` decimal(20, 2) null, `debt_allocation` decimal(20, 2) null, `equity_allocation` decimal(20, 2) null, `sponsor_co_invest_range` varchar(255) null, `offer_deadline` date null, `location` varchar(255) null, `asset_type` varchar(255) null, `strategy` varchar(255) null, `objective` varchar(255) null, `debt_allocation_percent` decimal(5, 2) null, `debt_distribution_period` varchar(255) null, `debt_target_distribution_start_date` date null, `debt_target_distribution_end_date` date null, `debt_minimum_investment_amount` decimal(15, 2) null, `debt_maximum_investment_amount` decimal(15, 2) null, `debt_expected_minimum_annual_return` decimal(5, 2) null, `debt_expected_maximum_annual_return` decimal(5, 2) null, `debt_target_hold_period_years` int null, `debt_exit_date` date null, `equity_allocation_percent` decimal(5, 2) null, `equity_distribution_period` varchar(255) null, `equity_target_distribution_start_date` date null, `equity_minimum_investment` decimal(15, 2) null, `equity_maximum_investment` decimal(15, 2) null, `equity_expected_minimum_return` decimal(5, 2) null, `equity_expected_maximum_return` decimal(5, 2) null, `equity_target_hold_period_years` int null, `equity_exit_date` date null, `property_address` varchar(255) null, `city` varchar(255) null, `state` varchar(255) null, `zip_code` varchar(255) null, `in_depth_description_of_work` text null, `project_timeline_months` int null, `adding_square_footage` tinyint(1) not null default '0', `square_footage_expansion_plan` varchar(255) null, `total_construction_cost` decimal(20, 2) null, `taxes` decimal(20, 2) null, `insurance` decimal(20, 2) null, `management` decimal(20, 2) null, `repairs` decimal(20, 2) null, `utilities` decimal(20, 2) null, `interest` decimal(20, 2) null, `total_expense` decimal(20, 2) null, `total_rental_income` decimal(20, 2) null, `total_equity_appreciation` decimal(20, 2) null, `status` enum('draft', 'pending', 'approved', 'rejected') not null default 'draft', `current_step` int not null default '1', `completed_steps` json not null default '[]', `submitted_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null, `deleted_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:822)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `p...', Array, Object(Closure))
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `p...', Array, Object(Closure))
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `p...')
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('project_uploads', Object(Closure))
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_06_09_073545_create_project_uploads_table.php(12): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_06_09_0735...', Object(Closure))
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_06_09_0735...', Object(Closure))
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 6, false)
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#34 {main}

[previous exception] [object] (PDOException(code: 42S21): SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'property_address' at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:568)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(568): PDOStatement->execute()
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(809): Illuminate\\Database\\Connection->Illuminate\\Database\\{closure}('create table `p...', Array)
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `p...', Array, Object(Closure))
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `p...', Array, Object(Closure))
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `p...')
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('project_uploads', Object(Closure))
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_06_09_073545_create_project_uploads_table.php(12): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_06_09_0735...', Object(Closure))
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_06_09_0735...', Object(Closure))
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 6, false)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#35 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#36 {main}
"} 
[2025-07-07 09:33:58] local.ERROR: SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'current_step' (Connection: mysql, SQL: alter table `company_representatives` add `current_step` int not null default '1') {"exception":"[object] (Illuminate\\Database\\QueryException(code: 42S21): SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'current_step' (Connection: mysql, SQL: alter table `company_representatives` add `current_step` int not null default '1') at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:822)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('alter table `co...', Array, Object(Closure))
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('alter table `co...', Array, Object(Closure))
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('alter table `co...')
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(460): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->table('company_represe...', Object(Closure))
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2024_07_01_000002_add_current_step_and_completed_steps_to_company_representatives_table.php(11): Illuminate\\Support\\Facades\\Facade::__callStatic('table', Array)
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2024_07_01_0000...', Object(Closure))
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2024_07_01_0000...', Object(Closure))
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 7, false)
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#34 {main}

[previous exception] [object] (PDOException(code: 42S21): SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'current_step' at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:568)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(568): PDOStatement->execute()
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(809): Illuminate\\Database\\Connection->Illuminate\\Database\\{closure}('alter table `co...', Array)
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('alter table `co...', Array, Object(Closure))
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('alter table `co...', Array, Object(Closure))
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('alter table `co...')
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(460): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->table('company_represe...', Object(Closure))
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2024_07_01_000002_add_current_step_and_completed_steps_to_company_representatives_table.php(11): Illuminate\\Support\\Facades\\Facade::__callStatic('table', Array)
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2024_07_01_0000...', Object(Closure))
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2024_07_01_0000...', Object(Closure))
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 7, false)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#35 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#36 {main}
"} 
[2025-07-07 09:36:12] local.ERROR: SQLSTATE[42S01]: Base table or view already exists: 1050 Table 'personal_access_tokens' already exists (Connection: mysql, SQL: create table `personal_access_tokens` (`id` bigint unsigned not null auto_increment primary key, `tokenable_type` varchar(255) not null, `tokenable_id` bigint unsigned not null, `name` varchar(255) not null, `token` varchar(64) not null, `abilities` text null, `last_used_at` timestamp null, `expires_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') {"exception":"[object] (Illuminate\\Database\\QueryException(code: 42S01): SQLSTATE[42S01]: Base table or view already exists: 1050 Table 'personal_access_tokens' already exists (Connection: mysql, SQL: create table `personal_access_tokens` (`id` bigint unsigned not null auto_increment primary key, `tokenable_type` varchar(255) not null, `tokenable_id` bigint unsigned not null, `name` varchar(255) not null, `token` varchar(64) not null, `abilities` text null, `last_used_at` timestamp null, `expires_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:822)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `p...', Array, Object(Closure))
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `p...', Array, Object(Closure))
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `p...')
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('personal_access...', Object(Closure))
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_06_06_003101_create_personal_access_tokens_table.php(14): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_06_06_0031...', Object(Closure))
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_06_06_0031...', Object(Closure))
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 8, false)
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#34 {main}

[previous exception] [object] (PDOException(code: 42S01): SQLSTATE[42S01]: Base table or view already exists: 1050 Table 'personal_access_tokens' already exists at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:568)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(568): PDOStatement->execute()
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(809): Illuminate\\Database\\Connection->Illuminate\\Database\\{closure}('create table `p...', Array)
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `p...', Array, Object(Closure))
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `p...', Array, Object(Closure))
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `p...')
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('personal_access...', Object(Closure))
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_06_06_003101_create_personal_access_tokens_table.php(14): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_06_06_0031...', Object(Closure))
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_06_06_0031...', Object(Closure))
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 8, false)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#35 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#36 {main}
"} 
[2025-07-10 12:03:17] local.ERROR: SQLSTATE[42S01]: Base table or view already exists: 1050 Table 'personal_access_tokens' already exists (Connection: mysql, SQL: create table `personal_access_tokens` (`id` bigint unsigned not null auto_increment primary key, `tokenable_type` varchar(255) not null, `tokenable_id` bigint unsigned not null, `name` varchar(255) not null, `token` varchar(64) not null, `abilities` text null, `last_used_at` timestamp null, `expires_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') {"exception":"[object] (Illuminate\\Database\\QueryException(code: 42S01): SQLSTATE[42S01]: Base table or view already exists: 1050 Table 'personal_access_tokens' already exists (Connection: mysql, SQL: create table `personal_access_tokens` (`id` bigint unsigned not null auto_increment primary key, `tokenable_type` varchar(255) not null, `tokenable_id` bigint unsigned not null, `name` varchar(255) not null, `token` varchar(64) not null, `abilities` text null, `last_used_at` timestamp null, `expires_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:822)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `p...', Array, Object(Closure))
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `p...', Array, Object(Closure))
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `p...')
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('personal_access...', Object(Closure))
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_06_06_003101_create_personal_access_tokens_table.php(14): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_06_06_0031...', Object(Closure))
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_06_06_0031...', Object(Closure))
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 9, false)
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#34 {main}

[previous exception] [object] (PDOException(code: 42S01): SQLSTATE[42S01]: Base table or view already exists: 1050 Table 'personal_access_tokens' already exists at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:568)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(568): PDOStatement->execute()
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(809): Illuminate\\Database\\Connection->Illuminate\\Database\\{closure}('create table `p...', Array)
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `p...', Array, Object(Closure))
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `p...', Array, Object(Closure))
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `p...')
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('personal_access...', Object(Closure))
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_06_06_003101_create_personal_access_tokens_table.php(14): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_06_06_0031...', Object(Closure))
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_06_06_0031...', Object(Closure))
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 9, false)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#35 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#36 {main}
"} 
[2025-08-04 21:23:06] local.ERROR: SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'debt_periodic_payment' (Connection: mysql, SQL: create table `project_uploads` (`id` bigint unsigned not null auto_increment primary key, `sponsor_id` bigint unsigned not null, `currency` varchar(255) not null, `sponsor_name` varchar(255) not null, `sponsor_logo_path` varchar(255) null, `project_name` varchar(255) null, `project_subtitle` varchar(255) null, `project_summary` text null, `historical_portfolio_activity` decimal(20, 2) null, `assets_under_management` decimal(20, 2) null, `realized_projects` int null, `rc_brown_capital_offerings` int null, `projected_valuation` varchar(255) null, `timeline_of_completion_months` varchar(255) null, `total_capital_required` varchar(255) null, `total_debt_allocation_percent` varchar(255) null, `debt_investment_tenure` varchar(255) null, `debt_yield_percent` varchar(255) null, `debt_periodic_payment` enum('monthly', 'quarterly', 'annually', 'bianually', 'no') null, `equity_investment_tenure` varchar(255) null, `projected_returns_equity_percent` varchar(255) null, `debt_periodic_payment` enum('monthly', 'quarterly', 'annually', 'bianually', 'no') null, `total_equity_allocation` varchar(255) null, `property_address` varchar(255) null, `location_description` text null, `occupancy` enum('vacant', 'partially_occupied', 'fully_occupied') null, `about_property` longtext null, `detailed_project_description` longtext null, `has_anchor_tenant` tinyint(1) null, `anchor_tenant_details` longtext null, `has_anchor_buyer` tinyint(1) null, `anchor_buyer_details` longtext null, `percent_leased` varchar(255) null, `sq_ft_leased` varchar(255) null, `investment_hold_period` varchar(255) null, `acquisition_date` date null, `closing_date` date null, `target_exit_date_debt` date null, `target_exit_date_equity` date null, `offer_live_date` date null, `offer_closing_date` date null, `funds_due_date` date null, `target_escrow_closing_date` date null, `targeted_distribution_start_date_debt` date null, `targeted_distribution_start_date_equity` date null, `distributions_anticipated_begin_date` date null, `frequency_of_distributions` enum('monthly', 'quarterly', 'annually', 'at_maturity') null, `sponsor_background` longtext null, `years_in_operation` varchar(255) null, `historical_portfolio_activity_amount` varchar(255) null, `projects_under_management_amount` varchar(255) null, `total_square_feet_managed` varchar(255) null, `deals_funded_by_rc_brown` int null, `number_of_properties_under_management` int null, `total_number_of_realized_projects` int null, `number_of_properties_developed` int null, `number_of_properties_built_sold` int null, `highest_budget_for_project` varchar(255) null, `average_length_of_completion_months` int null, `full_track_record` json null, `offerings` enum('equity', 'debt', 'both') null, `total_capitalization` varchar(255) null, `debt_allocation` varchar(255) null, `equity_allocation` varchar(255) null, `sponsor_co_invest_range` varchar(255) null, `offer_deadline` date null, `location` varchar(255) null, `asset_type` varchar(255) null, `strategy` varchar(255) null, `objective` varchar(255) null, `debt_allocation` varchar(255) null, `debt_distribution_period` varchar(255) null, `debt_target_distribution_start_date` date null, `debt_minimum_investment_amount` varchar(255) null, `debt_maximum_investment_amount` varchar(255) null, `debt_return_on_investment` varchar(255) null, `debt_expected_minimum_annual_return` varchar(255) null, `debt_expected_maximum_annual_return` varchar(255) null, `debt_target_hold_period_years` varchar(255) null, `debt_exit_date` date null, `expenses_taxes` varchar(255) null, `expenses_insurance` varchar(255) null, `expenses_management` varchar(255) null, `expenses_repairs` varchar(255) null, `expenses_utilities` varchar(255) null, `expenses_interest` varchar(255) null, `expenses_total` varchar(255) null, `expenses_total_rental_income` varchar(255) null, `expenses_additional` json null, `equity_allocation` varchar(255) null, `equity_distribution_frequency` enum('monthly', 'quarterly', 'annually', 'semi_annually') null, `equity_target_distribution_start_date` date null, `equity_minimum_investment` varchar(255) null, `equity_maximum_investment` varchar(255) null, `equity_exit_date` date null, `equity_return_on_investment` varchar(255) null, `equity_expected_minimum_return` varchar(255) null, `equity_expected_maximum_return` varchar(255) null, `equity_target_hold_period_years` varchar(255) null, `budget_sheet_property_address` varchar(255) null, `city` varchar(255) null, `state` varchar(255) null, `zip_code` varchar(255) null, `in_depth_description_of_work` text null, `project_timeline_months` int null, `adding_square_footage` tinyint(1) not null default '0', `square_footage_expansion_plan` varchar(255) null, `total_construction_cost` decimal(20, 2) null, `picture_uploads` json null, `slides_uploads` json null, `video_uploads` json null, `fund_wallet_amount` varchar(255) null, `acknowledgement_form_pdf_path` varchar(255) null, `signed_acknowledgement_form_path` varchar(255) null, `acknowledgement_form_signed_at` timestamp null, `acknowledgement_form_signed` tinyint(1) not null default '0', `status` enum('draft', 'pending', 'approved', 'rejected') not null default 'draft', `current_step` int not null default '1', `completed_steps` json not null default '[]', `submitted_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null, `deleted_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') {"exception":"[object] (Illuminate\\Database\\QueryException(code: 42S21): SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'debt_periodic_payment' (Connection: mysql, SQL: create table `project_uploads` (`id` bigint unsigned not null auto_increment primary key, `sponsor_id` bigint unsigned not null, `currency` varchar(255) not null, `sponsor_name` varchar(255) not null, `sponsor_logo_path` varchar(255) null, `project_name` varchar(255) null, `project_subtitle` varchar(255) null, `project_summary` text null, `historical_portfolio_activity` decimal(20, 2) null, `assets_under_management` decimal(20, 2) null, `realized_projects` int null, `rc_brown_capital_offerings` int null, `projected_valuation` varchar(255) null, `timeline_of_completion_months` varchar(255) null, `total_capital_required` varchar(255) null, `total_debt_allocation_percent` varchar(255) null, `debt_investment_tenure` varchar(255) null, `debt_yield_percent` varchar(255) null, `debt_periodic_payment` enum('monthly', 'quarterly', 'annually', 'bianually', 'no') null, `equity_investment_tenure` varchar(255) null, `projected_returns_equity_percent` varchar(255) null, `debt_periodic_payment` enum('monthly', 'quarterly', 'annually', 'bianually', 'no') null, `total_equity_allocation` varchar(255) null, `property_address` varchar(255) null, `location_description` text null, `occupancy` enum('vacant', 'partially_occupied', 'fully_occupied') null, `about_property` longtext null, `detailed_project_description` longtext null, `has_anchor_tenant` tinyint(1) null, `anchor_tenant_details` longtext null, `has_anchor_buyer` tinyint(1) null, `anchor_buyer_details` longtext null, `percent_leased` varchar(255) null, `sq_ft_leased` varchar(255) null, `investment_hold_period` varchar(255) null, `acquisition_date` date null, `closing_date` date null, `target_exit_date_debt` date null, `target_exit_date_equity` date null, `offer_live_date` date null, `offer_closing_date` date null, `funds_due_date` date null, `target_escrow_closing_date` date null, `targeted_distribution_start_date_debt` date null, `targeted_distribution_start_date_equity` date null, `distributions_anticipated_begin_date` date null, `frequency_of_distributions` enum('monthly', 'quarterly', 'annually', 'at_maturity') null, `sponsor_background` longtext null, `years_in_operation` varchar(255) null, `historical_portfolio_activity_amount` varchar(255) null, `projects_under_management_amount` varchar(255) null, `total_square_feet_managed` varchar(255) null, `deals_funded_by_rc_brown` int null, `number_of_properties_under_management` int null, `total_number_of_realized_projects` int null, `number_of_properties_developed` int null, `number_of_properties_built_sold` int null, `highest_budget_for_project` varchar(255) null, `average_length_of_completion_months` int null, `full_track_record` json null, `offerings` enum('equity', 'debt', 'both') null, `total_capitalization` varchar(255) null, `debt_allocation` varchar(255) null, `equity_allocation` varchar(255) null, `sponsor_co_invest_range` varchar(255) null, `offer_deadline` date null, `location` varchar(255) null, `asset_type` varchar(255) null, `strategy` varchar(255) null, `objective` varchar(255) null, `debt_allocation` varchar(255) null, `debt_distribution_period` varchar(255) null, `debt_target_distribution_start_date` date null, `debt_minimum_investment_amount` varchar(255) null, `debt_maximum_investment_amount` varchar(255) null, `debt_return_on_investment` varchar(255) null, `debt_expected_minimum_annual_return` varchar(255) null, `debt_expected_maximum_annual_return` varchar(255) null, `debt_target_hold_period_years` varchar(255) null, `debt_exit_date` date null, `expenses_taxes` varchar(255) null, `expenses_insurance` varchar(255) null, `expenses_management` varchar(255) null, `expenses_repairs` varchar(255) null, `expenses_utilities` varchar(255) null, `expenses_interest` varchar(255) null, `expenses_total` varchar(255) null, `expenses_total_rental_income` varchar(255) null, `expenses_additional` json null, `equity_allocation` varchar(255) null, `equity_distribution_frequency` enum('monthly', 'quarterly', 'annually', 'semi_annually') null, `equity_target_distribution_start_date` date null, `equity_minimum_investment` varchar(255) null, `equity_maximum_investment` varchar(255) null, `equity_exit_date` date null, `equity_return_on_investment` varchar(255) null, `equity_expected_minimum_return` varchar(255) null, `equity_expected_maximum_return` varchar(255) null, `equity_target_hold_period_years` varchar(255) null, `budget_sheet_property_address` varchar(255) null, `city` varchar(255) null, `state` varchar(255) null, `zip_code` varchar(255) null, `in_depth_description_of_work` text null, `project_timeline_months` int null, `adding_square_footage` tinyint(1) not null default '0', `square_footage_expansion_plan` varchar(255) null, `total_construction_cost` decimal(20, 2) null, `picture_uploads` json null, `slides_uploads` json null, `video_uploads` json null, `fund_wallet_amount` varchar(255) null, `acknowledgement_form_pdf_path` varchar(255) null, `signed_acknowledgement_form_path` varchar(255) null, `acknowledgement_form_signed_at` timestamp null, `acknowledgement_form_signed` tinyint(1) not null default '0', `status` enum('draft', 'pending', 'approved', 'rejected') not null default 'draft', `current_step` int not null default '1', `completed_steps` json not null default '[]', `submitted_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null, `deleted_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:822)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `p...', Array, Object(Closure))
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `p...', Array, Object(Closure))
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `p...')
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('project_uploads', Object(Closure))
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_08_04_212148_create_project_uploads_table.php(12): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_08_04_2121...', Object(Closure))
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_08_04_2121...', Object(Closure))
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 12, false)
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#34 {main}

[previous exception] [object] (PDOException(code: 42S21): SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'debt_periodic_payment' at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:568)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(568): PDOStatement->execute()
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(809): Illuminate\\Database\\Connection->Illuminate\\Database\\{closure}('create table `p...', Array)
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `p...', Array, Object(Closure))
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `p...', Array, Object(Closure))
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `p...')
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('project_uploads', Object(Closure))
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_08_04_212148_create_project_uploads_table.php(12): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_08_04_2121...', Object(Closure))
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_08_04_2121...', Object(Closure))
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 12, false)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#35 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#36 {main}
"} 
[2025-08-04 21:23:58] local.ERROR: SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'debt_allocation' (Connection: mysql, SQL: create table `project_uploads` (`id` bigint unsigned not null auto_increment primary key, `sponsor_id` bigint unsigned not null, `currency` varchar(255) not null, `sponsor_name` varchar(255) not null, `sponsor_logo_path` varchar(255) null, `project_name` varchar(255) null, `project_subtitle` varchar(255) null, `project_summary` text null, `historical_portfolio_activity` decimal(20, 2) null, `assets_under_management` decimal(20, 2) null, `realized_projects` int null, `rc_brown_capital_offerings` int null, `projected_valuation` varchar(255) null, `timeline_of_completion_months` varchar(255) null, `total_capital_required` varchar(255) null, `total_debt_allocation_percent` varchar(255) null, `debt_investment_tenure` varchar(255) null, `debt_yield_percent` varchar(255) null, `debt_periodic_payment` enum('monthly', 'quarterly', 'annually', 'bianually', 'no') null, `equity_investment_tenure` varchar(255) null, `projected_returns_equity_percent` varchar(255) null, `equity_periodic_payment` enum('monthly', 'quarterly', 'annually', 'bianually', 'no') null, `total_equity_allocation` varchar(255) null, `property_address` varchar(255) null, `location_description` text null, `occupancy` enum('vacant', 'partially_occupied', 'fully_occupied') null, `about_property` longtext null, `detailed_project_description` longtext null, `has_anchor_tenant` tinyint(1) null, `anchor_tenant_details` longtext null, `has_anchor_buyer` tinyint(1) null, `anchor_buyer_details` longtext null, `percent_leased` varchar(255) null, `sq_ft_leased` varchar(255) null, `investment_hold_period` varchar(255) null, `acquisition_date` date null, `closing_date` date null, `target_exit_date_debt` date null, `target_exit_date_equity` date null, `offer_live_date` date null, `offer_closing_date` date null, `funds_due_date` date null, `target_escrow_closing_date` date null, `targeted_distribution_start_date_debt` date null, `targeted_distribution_start_date_equity` date null, `distributions_anticipated_begin_date` date null, `frequency_of_distributions` enum('monthly', 'quarterly', 'annually', 'at_maturity') null, `sponsor_background` longtext null, `years_in_operation` varchar(255) null, `historical_portfolio_activity_amount` varchar(255) null, `projects_under_management_amount` varchar(255) null, `total_square_feet_managed` varchar(255) null, `deals_funded_by_rc_brown` int null, `number_of_properties_under_management` int null, `total_number_of_realized_projects` int null, `number_of_properties_developed` int null, `number_of_properties_built_sold` int null, `highest_budget_for_project` varchar(255) null, `average_length_of_completion_months` int null, `full_track_record` json null, `offerings` enum('equity', 'debt', 'both') null, `total_capitalization` varchar(255) null, `debt_allocation` varchar(255) null, `equity_allocation` varchar(255) null, `sponsor_co_invest_range` varchar(255) null, `offer_deadline` date null, `location` varchar(255) null, `asset_type` varchar(255) null, `strategy` varchar(255) null, `objective` varchar(255) null, `debt_allocation` varchar(255) null, `debt_distribution_period` varchar(255) null, `debt_target_distribution_start_date` date null, `debt_minimum_investment_amount` varchar(255) null, `debt_maximum_investment_amount` varchar(255) null, `debt_return_on_investment` varchar(255) null, `debt_expected_minimum_annual_return` varchar(255) null, `debt_expected_maximum_annual_return` varchar(255) null, `debt_target_hold_period_years` varchar(255) null, `debt_exit_date` date null, `expenses_taxes` varchar(255) null, `expenses_insurance` varchar(255) null, `expenses_management` varchar(255) null, `expenses_repairs` varchar(255) null, `expenses_utilities` varchar(255) null, `expenses_interest` varchar(255) null, `expenses_total` varchar(255) null, `expenses_total_rental_income` varchar(255) null, `expenses_additional` json null, `equity_allocation` varchar(255) null, `equity_distribution_frequency` enum('monthly', 'quarterly', 'annually', 'semi_annually') null, `equity_target_distribution_start_date` date null, `equity_minimum_investment` varchar(255) null, `equity_maximum_investment` varchar(255) null, `equity_exit_date` date null, `equity_return_on_investment` varchar(255) null, `equity_expected_minimum_return` varchar(255) null, `equity_expected_maximum_return` varchar(255) null, `equity_target_hold_period_years` varchar(255) null, `budget_sheet_property_address` varchar(255) null, `city` varchar(255) null, `state` varchar(255) null, `zip_code` varchar(255) null, `in_depth_description_of_work` text null, `project_timeline_months` int null, `adding_square_footage` tinyint(1) not null default '0', `square_footage_expansion_plan` varchar(255) null, `total_construction_cost` decimal(20, 2) null, `picture_uploads` json null, `slides_uploads` json null, `video_uploads` json null, `fund_wallet_amount` varchar(255) null, `acknowledgement_form_pdf_path` varchar(255) null, `signed_acknowledgement_form_path` varchar(255) null, `acknowledgement_form_signed_at` timestamp null, `acknowledgement_form_signed` tinyint(1) not null default '0', `status` enum('draft', 'pending', 'approved', 'rejected') not null default 'draft', `current_step` int not null default '1', `completed_steps` json not null default '[]', `submitted_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null, `deleted_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') {"exception":"[object] (Illuminate\\Database\\QueryException(code: 42S21): SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'debt_allocation' (Connection: mysql, SQL: create table `project_uploads` (`id` bigint unsigned not null auto_increment primary key, `sponsor_id` bigint unsigned not null, `currency` varchar(255) not null, `sponsor_name` varchar(255) not null, `sponsor_logo_path` varchar(255) null, `project_name` varchar(255) null, `project_subtitle` varchar(255) null, `project_summary` text null, `historical_portfolio_activity` decimal(20, 2) null, `assets_under_management` decimal(20, 2) null, `realized_projects` int null, `rc_brown_capital_offerings` int null, `projected_valuation` varchar(255) null, `timeline_of_completion_months` varchar(255) null, `total_capital_required` varchar(255) null, `total_debt_allocation_percent` varchar(255) null, `debt_investment_tenure` varchar(255) null, `debt_yield_percent` varchar(255) null, `debt_periodic_payment` enum('monthly', 'quarterly', 'annually', 'bianually', 'no') null, `equity_investment_tenure` varchar(255) null, `projected_returns_equity_percent` varchar(255) null, `equity_periodic_payment` enum('monthly', 'quarterly', 'annually', 'bianually', 'no') null, `total_equity_allocation` varchar(255) null, `property_address` varchar(255) null, `location_description` text null, `occupancy` enum('vacant', 'partially_occupied', 'fully_occupied') null, `about_property` longtext null, `detailed_project_description` longtext null, `has_anchor_tenant` tinyint(1) null, `anchor_tenant_details` longtext null, `has_anchor_buyer` tinyint(1) null, `anchor_buyer_details` longtext null, `percent_leased` varchar(255) null, `sq_ft_leased` varchar(255) null, `investment_hold_period` varchar(255) null, `acquisition_date` date null, `closing_date` date null, `target_exit_date_debt` date null, `target_exit_date_equity` date null, `offer_live_date` date null, `offer_closing_date` date null, `funds_due_date` date null, `target_escrow_closing_date` date null, `targeted_distribution_start_date_debt` date null, `targeted_distribution_start_date_equity` date null, `distributions_anticipated_begin_date` date null, `frequency_of_distributions` enum('monthly', 'quarterly', 'annually', 'at_maturity') null, `sponsor_background` longtext null, `years_in_operation` varchar(255) null, `historical_portfolio_activity_amount` varchar(255) null, `projects_under_management_amount` varchar(255) null, `total_square_feet_managed` varchar(255) null, `deals_funded_by_rc_brown` int null, `number_of_properties_under_management` int null, `total_number_of_realized_projects` int null, `number_of_properties_developed` int null, `number_of_properties_built_sold` int null, `highest_budget_for_project` varchar(255) null, `average_length_of_completion_months` int null, `full_track_record` json null, `offerings` enum('equity', 'debt', 'both') null, `total_capitalization` varchar(255) null, `debt_allocation` varchar(255) null, `equity_allocation` varchar(255) null, `sponsor_co_invest_range` varchar(255) null, `offer_deadline` date null, `location` varchar(255) null, `asset_type` varchar(255) null, `strategy` varchar(255) null, `objective` varchar(255) null, `debt_allocation` varchar(255) null, `debt_distribution_period` varchar(255) null, `debt_target_distribution_start_date` date null, `debt_minimum_investment_amount` varchar(255) null, `debt_maximum_investment_amount` varchar(255) null, `debt_return_on_investment` varchar(255) null, `debt_expected_minimum_annual_return` varchar(255) null, `debt_expected_maximum_annual_return` varchar(255) null, `debt_target_hold_period_years` varchar(255) null, `debt_exit_date` date null, `expenses_taxes` varchar(255) null, `expenses_insurance` varchar(255) null, `expenses_management` varchar(255) null, `expenses_repairs` varchar(255) null, `expenses_utilities` varchar(255) null, `expenses_interest` varchar(255) null, `expenses_total` varchar(255) null, `expenses_total_rental_income` varchar(255) null, `expenses_additional` json null, `equity_allocation` varchar(255) null, `equity_distribution_frequency` enum('monthly', 'quarterly', 'annually', 'semi_annually') null, `equity_target_distribution_start_date` date null, `equity_minimum_investment` varchar(255) null, `equity_maximum_investment` varchar(255) null, `equity_exit_date` date null, `equity_return_on_investment` varchar(255) null, `equity_expected_minimum_return` varchar(255) null, `equity_expected_maximum_return` varchar(255) null, `equity_target_hold_period_years` varchar(255) null, `budget_sheet_property_address` varchar(255) null, `city` varchar(255) null, `state` varchar(255) null, `zip_code` varchar(255) null, `in_depth_description_of_work` text null, `project_timeline_months` int null, `adding_square_footage` tinyint(1) not null default '0', `square_footage_expansion_plan` varchar(255) null, `total_construction_cost` decimal(20, 2) null, `picture_uploads` json null, `slides_uploads` json null, `video_uploads` json null, `fund_wallet_amount` varchar(255) null, `acknowledgement_form_pdf_path` varchar(255) null, `signed_acknowledgement_form_path` varchar(255) null, `acknowledgement_form_signed_at` timestamp null, `acknowledgement_form_signed` tinyint(1) not null default '0', `status` enum('draft', 'pending', 'approved', 'rejected') not null default 'draft', `current_step` int not null default '1', `completed_steps` json not null default '[]', `submitted_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null, `deleted_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:822)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `p...', Array, Object(Closure))
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `p...', Array, Object(Closure))
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `p...')
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('project_uploads', Object(Closure))
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_08_04_212148_create_project_uploads_table.php(12): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_08_04_2121...', Object(Closure))
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_08_04_2121...', Object(Closure))
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 12, false)
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#34 {main}

[previous exception] [object] (PDOException(code: 42S21): SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'debt_allocation' at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:568)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(568): PDOStatement->execute()
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(809): Illuminate\\Database\\Connection->Illuminate\\Database\\{closure}('create table `p...', Array)
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `p...', Array, Object(Closure))
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `p...', Array, Object(Closure))
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `p...')
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('project_uploads', Object(Closure))
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_08_04_212148_create_project_uploads_table.php(12): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_08_04_2121...', Object(Closure))
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_08_04_2121...', Object(Closure))
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 12, false)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#35 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#36 {main}
"} 
[2025-08-04 21:25:59] local.ERROR: SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'equity_allocation' (Connection: mysql, SQL: create table `project_uploads` (`id` bigint unsigned not null auto_increment primary key, `sponsor_id` bigint unsigned not null, `currency` varchar(255) not null, `sponsor_name` varchar(255) not null, `sponsor_logo_path` varchar(255) null, `project_name` varchar(255) null, `project_subtitle` varchar(255) null, `project_summary` text null, `historical_portfolio_activity` decimal(20, 2) null, `assets_under_management` decimal(20, 2) null, `realized_projects` int null, `rc_brown_capital_offerings` int null, `projected_valuation` varchar(255) null, `timeline_of_completion_months` varchar(255) null, `total_capital_required` varchar(255) null, `total_debt_allocation_percent` varchar(255) null, `debt_investment_tenure` varchar(255) null, `debt_yield_percent` varchar(255) null, `debt_periodic_payment` enum('monthly', 'quarterly', 'annually', 'bianually', 'no') null, `equity_investment_tenure` varchar(255) null, `projected_returns_equity_percent` varchar(255) null, `equity_periodic_payment` enum('monthly', 'quarterly', 'annually', 'bianually', 'no') null, `total_equity_allocation` varchar(255) null, `property_address` varchar(255) null, `location_description` text null, `occupancy` enum('vacant', 'partially_occupied', 'fully_occupied') null, `about_property` longtext null, `detailed_project_description` longtext null, `has_anchor_tenant` tinyint(1) null, `anchor_tenant_details` longtext null, `has_anchor_buyer` tinyint(1) null, `anchor_buyer_details` longtext null, `percent_leased` varchar(255) null, `sq_ft_leased` varchar(255) null, `investment_hold_period` varchar(255) null, `acquisition_date` date null, `closing_date` date null, `target_exit_date_debt` date null, `target_exit_date_equity` date null, `offer_live_date` date null, `offer_closing_date` date null, `funds_due_date` date null, `target_escrow_closing_date` date null, `targeted_distribution_start_date_debt` date null, `targeted_distribution_start_date_equity` date null, `distributions_anticipated_begin_date` date null, `frequency_of_distributions` enum('monthly', 'quarterly', 'annually', 'at_maturity') null, `sponsor_background` longtext null, `years_in_operation` varchar(255) null, `historical_portfolio_activity_amount` varchar(255) null, `projects_under_management_amount` varchar(255) null, `total_square_feet_managed` varchar(255) null, `deals_funded_by_rc_brown` int null, `number_of_properties_under_management` int null, `total_number_of_realized_projects` int null, `number_of_properties_developed` int null, `number_of_properties_built_sold` int null, `highest_budget_for_project` varchar(255) null, `average_length_of_completion_months` int null, `full_track_record` json null, `offerings` enum('equity', 'debt', 'both') null, `total_capitalization` varchar(255) null, `debt_allocation` varchar(255) null, `equity_allocation` varchar(255) null, `sponsor_co_invest_range` varchar(255) null, `offer_deadline` date null, `location` varchar(255) null, `asset_type` varchar(255) null, `strategy` varchar(255) null, `objective` varchar(255) null, `debt_allocation_percent` varchar(255) null, `debt_distribution_period` varchar(255) null, `debt_target_distribution_start_date` date null, `debt_minimum_investment_amount` varchar(255) null, `debt_maximum_investment_amount` varchar(255) null, `debt_return_on_investment` varchar(255) null, `debt_expected_minimum_annual_return` varchar(255) null, `debt_expected_maximum_annual_return` varchar(255) null, `debt_target_hold_period_years` varchar(255) null, `debt_exit_date` date null, `expenses_taxes` varchar(255) null, `expenses_insurance` varchar(255) null, `expenses_management` varchar(255) null, `expenses_repairs` varchar(255) null, `expenses_utilities` varchar(255) null, `expenses_interest` varchar(255) null, `expenses_total` varchar(255) null, `expenses_total_rental_income` varchar(255) null, `expenses_additional` json null, `equity_allocation` varchar(255) null, `equity_distribution_frequency` enum('monthly', 'quarterly', 'annually', 'semi_annually') null, `equity_target_distribution_start_date` date null, `equity_minimum_investment` varchar(255) null, `equity_maximum_investment` varchar(255) null, `equity_exit_date` date null, `equity_return_on_investment` varchar(255) null, `equity_expected_minimum_return` varchar(255) null, `equity_expected_maximum_return` varchar(255) null, `equity_target_hold_period_years` varchar(255) null, `budget_sheet_property_address` varchar(255) null, `city` varchar(255) null, `state` varchar(255) null, `zip_code` varchar(255) null, `in_depth_description_of_work` text null, `project_timeline_months` int null, `adding_square_footage` tinyint(1) not null default '0', `square_footage_expansion_plan` varchar(255) null, `total_construction_cost` decimal(20, 2) null, `picture_uploads` json null, `slides_uploads` json null, `video_uploads` json null, `fund_wallet_amount` varchar(255) null, `acknowledgement_form_pdf_path` varchar(255) null, `signed_acknowledgement_form_path` varchar(255) null, `acknowledgement_form_signed_at` timestamp null, `acknowledgement_form_signed` tinyint(1) not null default '0', `status` enum('draft', 'pending', 'approved', 'rejected') not null default 'draft', `current_step` int not null default '1', `completed_steps` json not null default '[]', `submitted_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null, `deleted_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') {"exception":"[object] (Illuminate\\Database\\QueryException(code: 42S21): SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'equity_allocation' (Connection: mysql, SQL: create table `project_uploads` (`id` bigint unsigned not null auto_increment primary key, `sponsor_id` bigint unsigned not null, `currency` varchar(255) not null, `sponsor_name` varchar(255) not null, `sponsor_logo_path` varchar(255) null, `project_name` varchar(255) null, `project_subtitle` varchar(255) null, `project_summary` text null, `historical_portfolio_activity` decimal(20, 2) null, `assets_under_management` decimal(20, 2) null, `realized_projects` int null, `rc_brown_capital_offerings` int null, `projected_valuation` varchar(255) null, `timeline_of_completion_months` varchar(255) null, `total_capital_required` varchar(255) null, `total_debt_allocation_percent` varchar(255) null, `debt_investment_tenure` varchar(255) null, `debt_yield_percent` varchar(255) null, `debt_periodic_payment` enum('monthly', 'quarterly', 'annually', 'bianually', 'no') null, `equity_investment_tenure` varchar(255) null, `projected_returns_equity_percent` varchar(255) null, `equity_periodic_payment` enum('monthly', 'quarterly', 'annually', 'bianually', 'no') null, `total_equity_allocation` varchar(255) null, `property_address` varchar(255) null, `location_description` text null, `occupancy` enum('vacant', 'partially_occupied', 'fully_occupied') null, `about_property` longtext null, `detailed_project_description` longtext null, `has_anchor_tenant` tinyint(1) null, `anchor_tenant_details` longtext null, `has_anchor_buyer` tinyint(1) null, `anchor_buyer_details` longtext null, `percent_leased` varchar(255) null, `sq_ft_leased` varchar(255) null, `investment_hold_period` varchar(255) null, `acquisition_date` date null, `closing_date` date null, `target_exit_date_debt` date null, `target_exit_date_equity` date null, `offer_live_date` date null, `offer_closing_date` date null, `funds_due_date` date null, `target_escrow_closing_date` date null, `targeted_distribution_start_date_debt` date null, `targeted_distribution_start_date_equity` date null, `distributions_anticipated_begin_date` date null, `frequency_of_distributions` enum('monthly', 'quarterly', 'annually', 'at_maturity') null, `sponsor_background` longtext null, `years_in_operation` varchar(255) null, `historical_portfolio_activity_amount` varchar(255) null, `projects_under_management_amount` varchar(255) null, `total_square_feet_managed` varchar(255) null, `deals_funded_by_rc_brown` int null, `number_of_properties_under_management` int null, `total_number_of_realized_projects` int null, `number_of_properties_developed` int null, `number_of_properties_built_sold` int null, `highest_budget_for_project` varchar(255) null, `average_length_of_completion_months` int null, `full_track_record` json null, `offerings` enum('equity', 'debt', 'both') null, `total_capitalization` varchar(255) null, `debt_allocation` varchar(255) null, `equity_allocation` varchar(255) null, `sponsor_co_invest_range` varchar(255) null, `offer_deadline` date null, `location` varchar(255) null, `asset_type` varchar(255) null, `strategy` varchar(255) null, `objective` varchar(255) null, `debt_allocation_percent` varchar(255) null, `debt_distribution_period` varchar(255) null, `debt_target_distribution_start_date` date null, `debt_minimum_investment_amount` varchar(255) null, `debt_maximum_investment_amount` varchar(255) null, `debt_return_on_investment` varchar(255) null, `debt_expected_minimum_annual_return` varchar(255) null, `debt_expected_maximum_annual_return` varchar(255) null, `debt_target_hold_period_years` varchar(255) null, `debt_exit_date` date null, `expenses_taxes` varchar(255) null, `expenses_insurance` varchar(255) null, `expenses_management` varchar(255) null, `expenses_repairs` varchar(255) null, `expenses_utilities` varchar(255) null, `expenses_interest` varchar(255) null, `expenses_total` varchar(255) null, `expenses_total_rental_income` varchar(255) null, `expenses_additional` json null, `equity_allocation` varchar(255) null, `equity_distribution_frequency` enum('monthly', 'quarterly', 'annually', 'semi_annually') null, `equity_target_distribution_start_date` date null, `equity_minimum_investment` varchar(255) null, `equity_maximum_investment` varchar(255) null, `equity_exit_date` date null, `equity_return_on_investment` varchar(255) null, `equity_expected_minimum_return` varchar(255) null, `equity_expected_maximum_return` varchar(255) null, `equity_target_hold_period_years` varchar(255) null, `budget_sheet_property_address` varchar(255) null, `city` varchar(255) null, `state` varchar(255) null, `zip_code` varchar(255) null, `in_depth_description_of_work` text null, `project_timeline_months` int null, `adding_square_footage` tinyint(1) not null default '0', `square_footage_expansion_plan` varchar(255) null, `total_construction_cost` decimal(20, 2) null, `picture_uploads` json null, `slides_uploads` json null, `video_uploads` json null, `fund_wallet_amount` varchar(255) null, `acknowledgement_form_pdf_path` varchar(255) null, `signed_acknowledgement_form_path` varchar(255) null, `acknowledgement_form_signed_at` timestamp null, `acknowledgement_form_signed` tinyint(1) not null default '0', `status` enum('draft', 'pending', 'approved', 'rejected') not null default 'draft', `current_step` int not null default '1', `completed_steps` json not null default '[]', `submitted_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null, `deleted_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:822)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `p...', Array, Object(Closure))
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `p...', Array, Object(Closure))
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `p...')
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('project_uploads', Object(Closure))
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_08_04_212148_create_project_uploads_table.php(12): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_08_04_2121...', Object(Closure))
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_08_04_2121...', Object(Closure))
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 12, false)
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#34 {main}

[previous exception] [object] (PDOException(code: 42S21): SQLSTATE[42S21]: Column already exists: 1060 Duplicate column name 'equity_allocation' at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:568)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(568): PDOStatement->execute()
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(809): Illuminate\\Database\\Connection->Illuminate\\Database\\{closure}('create table `p...', Array)
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `p...', Array, Object(Closure))
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `p...', Array, Object(Closure))
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `p...')
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('project_uploads', Object(Closure))
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_08_04_212148_create_project_uploads_table.php(12): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_08_04_2121...', Object(Closure))
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_08_04_2121...', Object(Closure))
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 12, false)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#35 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#36 {main}
"} 
[2025-08-05 23:04:54] local.ERROR: SQLSTATE[42000]: Syntax error or access violation: 1118 Row size too large. The maximum row size for the used table type, not counting BLOBs, is 65535. This includes storage overhead, check the manual. You have to change some columns to TEXT or BLOBs (Connection: mysql, SQL: create table `project_uploads` (`id` bigint unsigned not null auto_increment primary key, `sponsor_id` bigint unsigned not null, `currency` varchar(255) not null, `sponsor_name` varchar(255) not null, `sponsor_logo_path` varchar(255) null, `project_name` varchar(255) null, `project_subtitle` varchar(255) null, `project_summary` text null, `years_of_active_operation` varchar(255) null, `historical_portfolio_activity` varchar(255) null, `assets_under_management` varchar(20) null, `realized_projects` int null, `rc_brown_capital_offerings` int null, `projected_valuation` varchar(255) null, `timeline_of_completion_months` varchar(255) null, `total_capital_required` varchar(255) null, `total_debt_allocation_percent` varchar(255) null, `debt_investment_tenure` varchar(255) null, `debt_yield_percent` varchar(255) null, `debt_periodic_payment` enum('monthly', 'quarterly', 'annually', 'bianually', 'no') null, `equity_investment_tenure` varchar(255) null, `projected_returns_equity_percent` varchar(255) null, `equity_periodic_payment` enum('monthly', 'quarterly', 'annually', 'bianually', 'no') null, `total_equity_allocation` varchar(255) null, `property_address` varchar(255) null, `location_description` text null, `occupancy` enum('vacant', 'partially_occupied', 'fully_occupied') null, `about_property` longtext null, `detailed_project_description` longtext null, `has_anchor_tenant` tinyint(1) null, `anchor_tenant_details` longtext null, `has_anchor_buyer` tinyint(1) null, `anchor_buyer_details` longtext null, `percent_leased` varchar(255) null, `sq_ft_leased` varchar(255) null, `investment_hold_period` varchar(255) null, `acquisition_date` date null, `closing_date` date null, `target_exit_date_debt` date null, `target_exit_date_equity` date null, `offer_live_date` date null, `offer_closing_date` date null, `funds_due_date` date null, `target_escrow_closing_date` date null, `targeted_distribution_start_date_debt` date null, `targeted_distribution_start_date_equity` date null, `distributions_anticipated_begin_date` date null, `frequency_of_distributions` enum('monthly', 'quarterly', 'annually', 'at_maturity') null, `sponsor_background` longtext null, `years_in_operation` varchar(255) null, `historical_portfolio_activity_amount` varchar(255) null, `projects_under_management_amount` varchar(255) null, `total_square_feet_managed` varchar(255) null, `deals_funded_by_rc_brown` int null, `number_of_properties_under_management` int null, `total_number_of_realized_projects` int null, `number_of_properties_developed` int null, `number_of_properties_built_sold` int null, `highest_budget_for_project` varchar(255) null, `average_length_of_completion_months` int null, `full_track_record` json null, `offerings` enum('equity', 'debt', 'both') null, `total_capitalization` varchar(255) null, `debt_allocation` varchar(255) null, `equity_allocation` varchar(255) null, `sponsor_co_invest_range` varchar(255) null, `offer_deadline` date null, `location` varchar(255) null, `asset_type` varchar(255) null, `strategy` varchar(255) null, `objective` varchar(255) null, `debt_allocation_percent` varchar(255) null, `debt_distribution_period` varchar(255) null, `debt_target_distribution_start_date` date null, `debt_minimum_investment_amount` varchar(255) null, `debt_maximum_investment_amount` varchar(255) null, `debt_return_on_investment` varchar(255) null, `debt_expected_minimum_annual_return` varchar(255) null, `debt_expected_maximum_annual_return` varchar(255) null, `debt_target_hold_period_years` varchar(255) null, `debt_exit_date` date null, `expenses_taxes` varchar(255) null, `expenses_insurance` varchar(255) null, `expenses_management` varchar(255) null, `expenses_repairs` varchar(255) null, `expenses_utilities` varchar(255) null, `expenses_interest` varchar(255) null, `expenses_total` varchar(255) null, `expenses_total_rental_income` varchar(255) null, `expenses_additional` json null, `equity_allocation_percent` varchar(255) null, `equity_distribution_frequency` enum('monthly', 'quarterly', 'annually', 'semi_annually') null, `equity_target_distribution_start_date` date null, `equity_minimum_investment` varchar(255) null, `equity_maximum_investment` varchar(255) null, `equity_exit_date` date null, `equity_return_on_investment` varchar(255) null, `equity_expected_minimum_return` varchar(255) null, `equity_expected_maximum_return` varchar(255) null, `equity_target_hold_period_years` varchar(255) null, `budget_sheet_property_address` varchar(255) null, `city` varchar(255) null, `state` varchar(255) null, `zip_code` varchar(255) null, `in_depth_description_of_work` text null, `project_timeline_months` int null, `adding_square_footage` tinyint(1) not null default '0', `square_footage_expansion_plan` varchar(255) null, `total_construction_cost` decimal(20, 2) null, `picture_uploads` json null, `slides_uploads` json null, `video_uploads` json null, `fund_wallet_amount` varchar(255) null, `acknowledgement_form_pdf_path` varchar(255) null, `signed_acknowledgement_form_path` varchar(255) null, `acknowledgement_form_signed_at` timestamp null, `acknowledgement_form_signed` tinyint(1) not null default '0', `status` enum('draft', 'pending', 'approved', 'rejected') not null default 'draft', `current_step` int not null default '1', `completed_steps` json not null default '[]', `submitted_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null, `deleted_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') {"exception":"[object] (Illuminate\\Database\\QueryException(code: 42000): SQLSTATE[42000]: Syntax error or access violation: 1118 Row size too large. The maximum row size for the used table type, not counting BLOBs, is 65535. This includes storage overhead, check the manual. You have to change some columns to TEXT or BLOBs (Connection: mysql, SQL: create table `project_uploads` (`id` bigint unsigned not null auto_increment primary key, `sponsor_id` bigint unsigned not null, `currency` varchar(255) not null, `sponsor_name` varchar(255) not null, `sponsor_logo_path` varchar(255) null, `project_name` varchar(255) null, `project_subtitle` varchar(255) null, `project_summary` text null, `years_of_active_operation` varchar(255) null, `historical_portfolio_activity` varchar(255) null, `assets_under_management` varchar(20) null, `realized_projects` int null, `rc_brown_capital_offerings` int null, `projected_valuation` varchar(255) null, `timeline_of_completion_months` varchar(255) null, `total_capital_required` varchar(255) null, `total_debt_allocation_percent` varchar(255) null, `debt_investment_tenure` varchar(255) null, `debt_yield_percent` varchar(255) null, `debt_periodic_payment` enum('monthly', 'quarterly', 'annually', 'bianually', 'no') null, `equity_investment_tenure` varchar(255) null, `projected_returns_equity_percent` varchar(255) null, `equity_periodic_payment` enum('monthly', 'quarterly', 'annually', 'bianually', 'no') null, `total_equity_allocation` varchar(255) null, `property_address` varchar(255) null, `location_description` text null, `occupancy` enum('vacant', 'partially_occupied', 'fully_occupied') null, `about_property` longtext null, `detailed_project_description` longtext null, `has_anchor_tenant` tinyint(1) null, `anchor_tenant_details` longtext null, `has_anchor_buyer` tinyint(1) null, `anchor_buyer_details` longtext null, `percent_leased` varchar(255) null, `sq_ft_leased` varchar(255) null, `investment_hold_period` varchar(255) null, `acquisition_date` date null, `closing_date` date null, `target_exit_date_debt` date null, `target_exit_date_equity` date null, `offer_live_date` date null, `offer_closing_date` date null, `funds_due_date` date null, `target_escrow_closing_date` date null, `targeted_distribution_start_date_debt` date null, `targeted_distribution_start_date_equity` date null, `distributions_anticipated_begin_date` date null, `frequency_of_distributions` enum('monthly', 'quarterly', 'annually', 'at_maturity') null, `sponsor_background` longtext null, `years_in_operation` varchar(255) null, `historical_portfolio_activity_amount` varchar(255) null, `projects_under_management_amount` varchar(255) null, `total_square_feet_managed` varchar(255) null, `deals_funded_by_rc_brown` int null, `number_of_properties_under_management` int null, `total_number_of_realized_projects` int null, `number_of_properties_developed` int null, `number_of_properties_built_sold` int null, `highest_budget_for_project` varchar(255) null, `average_length_of_completion_months` int null, `full_track_record` json null, `offerings` enum('equity', 'debt', 'both') null, `total_capitalization` varchar(255) null, `debt_allocation` varchar(255) null, `equity_allocation` varchar(255) null, `sponsor_co_invest_range` varchar(255) null, `offer_deadline` date null, `location` varchar(255) null, `asset_type` varchar(255) null, `strategy` varchar(255) null, `objective` varchar(255) null, `debt_allocation_percent` varchar(255) null, `debt_distribution_period` varchar(255) null, `debt_target_distribution_start_date` date null, `debt_minimum_investment_amount` varchar(255) null, `debt_maximum_investment_amount` varchar(255) null, `debt_return_on_investment` varchar(255) null, `debt_expected_minimum_annual_return` varchar(255) null, `debt_expected_maximum_annual_return` varchar(255) null, `debt_target_hold_period_years` varchar(255) null, `debt_exit_date` date null, `expenses_taxes` varchar(255) null, `expenses_insurance` varchar(255) null, `expenses_management` varchar(255) null, `expenses_repairs` varchar(255) null, `expenses_utilities` varchar(255) null, `expenses_interest` varchar(255) null, `expenses_total` varchar(255) null, `expenses_total_rental_income` varchar(255) null, `expenses_additional` json null, `equity_allocation_percent` varchar(255) null, `equity_distribution_frequency` enum('monthly', 'quarterly', 'annually', 'semi_annually') null, `equity_target_distribution_start_date` date null, `equity_minimum_investment` varchar(255) null, `equity_maximum_investment` varchar(255) null, `equity_exit_date` date null, `equity_return_on_investment` varchar(255) null, `equity_expected_minimum_return` varchar(255) null, `equity_expected_maximum_return` varchar(255) null, `equity_target_hold_period_years` varchar(255) null, `budget_sheet_property_address` varchar(255) null, `city` varchar(255) null, `state` varchar(255) null, `zip_code` varchar(255) null, `in_depth_description_of_work` text null, `project_timeline_months` int null, `adding_square_footage` tinyint(1) not null default '0', `square_footage_expansion_plan` varchar(255) null, `total_construction_cost` decimal(20, 2) null, `picture_uploads` json null, `slides_uploads` json null, `video_uploads` json null, `fund_wallet_amount` varchar(255) null, `acknowledgement_form_pdf_path` varchar(255) null, `signed_acknowledgement_form_path` varchar(255) null, `acknowledgement_form_signed_at` timestamp null, `acknowledgement_form_signed` tinyint(1) not null default '0', `status` enum('draft', 'pending', 'approved', 'rejected') not null default 'draft', `current_step` int not null default '1', `completed_steps` json not null default '[]', `submitted_at` timestamp null, `created_at` timestamp null, `updated_at` timestamp null, `deleted_at` timestamp null) default character set utf8mb4 collate 'utf8mb4_unicode_ci') at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:822)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `p...', Array, Object(Closure))
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `p...', Array, Object(Closure))
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `p...')
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('project_uploads', Object(Closure))
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_08_05_230240_create_project_uploads_table.php(12): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_08_05_2302...', Object(Closure))
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_08_05_2302...', Object(Closure))
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 13, false)
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#34 {main}

[previous exception] [object] (PDOException(code: 42000): SQLSTATE[42000]: Syntax error or access violation: 1118 Row size too large. The maximum row size for the used table type, not counting BLOBs, is 65535. This includes storage overhead, check the manual. You have to change some columns to TEXT or BLOBs at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php:568)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(568): PDOStatement->execute()
#1 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(809): Illuminate\\Database\\Connection->Illuminate\\Database\\{closure}('create table `p...', Array)
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(776): Illuminate\\Database\\Connection->runQueryCallback('create table `p...', Array, Object(Closure))
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Connection.php(557): Illuminate\\Database\\Connection->run('create table `p...', Array, Object(Closure))
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Blueprint.php(119): Illuminate\\Database\\Connection->statement('create table `p...')
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(618): Illuminate\\Database\\Schema\\Blueprint->build()
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Schema\\Builder.php(472): Illuminate\\Database\\Schema\\Builder->build(Object(Illuminate\\Database\\Schema\\Blueprint))
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Support\\Facades\\Facade.php(361): Illuminate\\Database\\Schema\\Builder->create('project_uploads', Object(Closure))
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\database\\migrations\\2025_08_05_230240_create_project_uploads_table.php(12): Illuminate\\Support\\Facades\\Facade::__callStatic('create', Array)
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(514): Illuminate\\Database\\Migrations\\Migration@anonymous->up()
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(439): Illuminate\\Database\\Migrations\\Migrator->runMethod(Object(Illuminate\\Database\\MySqlConnection), Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(448): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->runMigration(Object(Illuminate\\Database\\Migrations\\Migration@anonymous), 'up')
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\View\\Components\\Task.php(41): Illuminate\\Database\\Migrations\\Migrator->Illuminate\\Database\\Migrations\\{closure}()
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(805): Illuminate\\Console\\View\\Components\\Task->render('2025_08_05_2302...', Object(Closure))
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(250): Illuminate\\Database\\Migrations\\Migrator->write('Illuminate\\\\Cons...', '2025_08_05_2302...', Object(Closure))
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(210): Illuminate\\Database\\Migrations\\Migrator->runUp('C:\\\\xampp\\\\htdocs...', 13, false)
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(137): Illuminate\\Database\\Migrations\\Migrator->runPending(Array, Array)
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(116): Illuminate\\Database\\Migrations\\Migrator->run(Array, Array)
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Migrations\\Migrator.php(665): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->Illuminate\\Database\\Console\\Migrations\\{closure}()
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(109): Illuminate\\Database\\Migrations\\Migrator->usingConnection(NULL, Object(Closure))
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Database\\Console\\Migrations\\MigrateCommand.php(88): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->runMigrations()
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(36): Illuminate\\Database\\Console\\Migrations\\MigrateCommand->handle()
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Util.php(43): Illuminate\\Container\\BoundMethod::Illuminate\\Container\\{closure}()
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(96): Illuminate\\Container\\Util::unwrapIfClosure(Object(Closure))
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\BoundMethod.php(35): Illuminate\\Container\\BoundMethod::callBoundMethod(Object(Illuminate\\Foundation\\Application), Array, Object(Closure))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Container\\Container.php(754): Illuminate\\Container\\BoundMethod::call(Object(Illuminate\\Foundation\\Application), Array, Array, NULL)
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(211): Illuminate\\Container\\Container->call(Array)
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Command\\Command.php(318): Illuminate\\Console\\Command->execute(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Console\\Command.php(180): Symfony\\Component\\Console\\Command\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Illuminate\\Console\\OutputStyle))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(1092): Illuminate\\Console\\Command->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(341): Symfony\\Component\\Console\\Application->doRunCommand(Object(Illuminate\\Database\\Console\\Migrations\\MigrateCommand), Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\symfony\\console\\Application.php(192): Symfony\\Component\\Console\\Application->doRun(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Console\\Kernel.php(197): Symfony\\Component\\Console\\Application->run(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1234): Illuminate\\Foundation\\Console\\Kernel->handle(Object(Symfony\\Component\\Console\\Input\\ArgvInput), Object(Symfony\\Component\\Console\\Output\\ConsoleOutput))
#35 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\artisan(16): Illuminate\\Foundation\\Application->handleCommand(Object(Symfony\\Component\\Console\\Input\\ArgvInput))
#36 {main}
"} 
[2025-08-06 00:08:10] local.ERROR: syntax error, unexpected single-quoted string "historical_portfolio_activity", expecting "]" {"exception":"[object] (ParseError(code: 0): syntax error, unexpected single-quoted string \"historical_portfolio_activity\", expecting \"]\" at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\app\\Http\\Controllers\\Sponsor\\ProjectUploadController.php:160)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\composer\\ClassLoader.php(427): Composer\\Autoload\\{closure}('C:\\\\xampp\\\\htdocs...')
#1 [internal function]: Composer\\Autoload\\ClassLoader->loadClass('App\\\\Http\\\\Contro...')
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Route.php(1119): is_a('App\\\\Http\\\\Contro...', 'Illuminate\\\\Rout...', true)
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Route.php(1056): Illuminate\\Routing\\Route->controllerMiddleware()
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(820): Illuminate\\Routing\\Route->gatherMiddleware()
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(802): Illuminate\\Routing\\Router->gatherRouteMiddleware(Object(Illuminate\\Routing\\Route))
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(786): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(750): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(739): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(51): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(109): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(61): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(58): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\InvokeDeferredCallbacks.php(22): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\InvokeDeferredCallbacks->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\ValidatePathEncoding.php(26): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\ValidatePathEncoding->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1219): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\public\\index.php(20): Illuminate\\Foundation\\Application->handleRequest(Object(Illuminate\\Http\\Request))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\resources\\server.php(23): require_once('C:\\\\xampp\\\\htdocs...')
#35 {main}
"} 
[2025-08-06 00:12:46] local.ERROR: syntax error, unexpected single-quoted string "historical_portfolio_activity", expecting "]" {"exception":"[object] (ParseError(code: 0): syntax error, unexpected single-quoted string \"historical_portfolio_activity\", expecting \"]\" at C:\\xampp\\htdocs\\RC-Brown-Capital-API\\app\\Http\\Controllers\\Sponsor\\ProjectUploadController.php:160)
[stacktrace]
#0 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\composer\\ClassLoader.php(427): Composer\\Autoload\\{closure}('C:\\\\xampp\\\\htdocs...')
#1 [internal function]: Composer\\Autoload\\ClassLoader->loadClass('App\\\\Http\\\\Contro...')
#2 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Route.php(1119): is_a('App\\\\Http\\\\Contro...', 'Illuminate\\\\Rout...', true)
#3 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Route.php(1056): Illuminate\\Routing\\Route->controllerMiddleware()
#4 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(820): Illuminate\\Routing\\Route->gatherMiddleware()
#5 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(802): Illuminate\\Routing\\Router->gatherRouteMiddleware(Object(Illuminate\\Routing\\Route))
#6 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(786): Illuminate\\Routing\\Router->runRouteWithinStack(Object(Illuminate\\Routing\\Route), Object(Illuminate\\Http\\Request))
#7 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(750): Illuminate\\Routing\\Router->runRoute(Object(Illuminate\\Http\\Request), Object(Illuminate\\Routing\\Route))
#8 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Routing\\Router.php(739): Illuminate\\Routing\\Router->dispatchToRoute(Object(Illuminate\\Http\\Request))
#9 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(200): Illuminate\\Routing\\Router->dispatch(Object(Illuminate\\Http\\Request))
#10 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(169): Illuminate\\Foundation\\Http\\Kernel->Illuminate\\Foundation\\Http\\{closure}(Object(Illuminate\\Http\\Request))
#11 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#12 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull.php(31): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#13 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\ConvertEmptyStringsToNull->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#14 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest.php(21): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#15 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\TrimStrings.php(51): Illuminate\\Foundation\\Http\\Middleware\\TransformsRequest->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#16 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\TrimStrings->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#17 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\ValidatePostSize.php(27): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#18 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\ValidatePostSize->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#19 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance.php(109): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#20 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\PreventRequestsDuringMaintenance->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#21 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\HandleCors.php(61): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#22 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\HandleCors->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#23 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\TrustProxies.php(58): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#24 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\TrustProxies->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#25 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Middleware\\InvokeDeferredCallbacks.php(22): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#26 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Foundation\\Http\\Middleware\\InvokeDeferredCallbacks->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#27 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Http\\Middleware\\ValidatePathEncoding.php(26): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#28 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(208): Illuminate\\Http\\Middleware\\ValidatePathEncoding->handle(Object(Illuminate\\Http\\Request), Object(Closure))
#29 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Pipeline\\Pipeline.php(126): Illuminate\\Pipeline\\Pipeline->Illuminate\\Pipeline\\{closure}(Object(Illuminate\\Http\\Request))
#30 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(175): Illuminate\\Pipeline\\Pipeline->then(Object(Closure))
#31 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Http\\Kernel.php(144): Illuminate\\Foundation\\Http\\Kernel->sendRequestThroughRouter(Object(Illuminate\\Http\\Request))
#32 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\Application.php(1219): Illuminate\\Foundation\\Http\\Kernel->handle(Object(Illuminate\\Http\\Request))
#33 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\public\\index.php(20): Illuminate\\Foundation\\Application->handleRequest(Object(Illuminate\\Http\\Request))
#34 C:\\xampp\\htdocs\\RC-Brown-Capital-API\\vendor\\laravel\\framework\\src\\Illuminate\\Foundation\\resources\\server.php(23): require_once('C:\\\\xampp\\\\htdocs...')
#35 {main}
"} 

```

# tests\Feature\Auth\AuthenticationTest.php

```php
<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertNoContent();
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertNoContent();
    }
}

```

# tests\Feature\Auth\EmailVerificationTest.php

```php
<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class EmailVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_email_can_be_verified(): void
    {
        $user = User::factory()->unverified()->create();

        Event::fake();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        $response = $this->actingAs($user)->get($verificationUrl);

        Event::assertDispatched(Verified::class);
        $this->assertTrue($user->fresh()->hasVerifiedEmail());
        $response->assertRedirect(config('app.frontend_url').'/dashboard?verified=1');
    }

    public function test_email_is_not_verified_with_invalid_hash(): void
    {
        $user = User::factory()->unverified()->create();

        $verificationUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1('wrong-email')]
        );

        $this->actingAs($user)->get($verificationUrl);

        $this->assertFalse($user->fresh()->hasVerifiedEmail());
    }
}

```

# tests\Feature\Auth\PasswordResetTest.php

```php
<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    public function test_reset_password_link_can_be_requested(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', ['email' => $user->email]);

        Notification::assertSentTo($user, ResetPassword::class);
    }

    public function test_password_can_be_reset_with_valid_token(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $this->post('/forgot-password', ['email' => $user->email]);

        Notification::assertSentTo($user, ResetPassword::class, function (object $notification) use ($user) {
            $response = $this->post('/reset-password', [
                'token' => $notification->token,
                'email' => $user->email,
                'password' => 'password',
                'password_confirmation' => 'password',
            ]);

            $response
                ->assertSessionHasNoErrors()
                ->assertStatus(200);

            return true;
        });
    }
}

```

# tests\Feature\Auth\RegistrationTest.php

```php
<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertNoContent();
    }
}

```

# tests\Feature\ExampleTest.php

```php
<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}

```

# tests\TestCase.php

```php
<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    //
}

```

# tests\Unit\ExampleTest.php

```php
<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_that_true_is_true(): void
    {
        $this->assertTrue(true);
    }
}

```

