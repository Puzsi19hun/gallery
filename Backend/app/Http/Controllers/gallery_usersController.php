<?php

namespace App\Http\Controllers;

use App\Models\ertekeles;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use GuzzleHttp\Client;
use App\Models\gallery_users;
use App\Models\kepek;
use App\Models\ertekelesek;
use App\Models\kommentek;
use App\Models\hashtags;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Kwn\Wordlist\Wordlist;
use App\Services\HashtagValidatorService;
use Illuminate\Support\Facades\Validator;
class gallery_usersController extends Controller
{
    protected $aktualisido;
    protected $ip;
    protected $location;
    protected $helyzet;
    protected $location_coords;
    protected $image_url;
    protected $client;

    public function __construct(Request $request)
    {
        $this->aktualisido = Carbon::now()->addMinutes(60);
        $this->ip = $request->ip();
        $this->client = new Client();
        $this->location = $this->getLocationFromIp();
        $this->helyzet = $this->formatLocation($this->location);
        $this->location_coords = $this->location['location'] ?? '47.4979,19.0402';
        $this->image_url = $this->generateGoogleMapsUrl($this->location_coords);
    }

    private function getLocationFromIp()
    {
        try {
            $response = $this->client->get("https://api.ip2location.io/?key=" . env('IP2LOCATION_API_KEY') . "&ip=" . $this->ip . "&format=json");
            $data = json_decode($response->getBody(), true);

            if (isset($data['latitude']) && isset($data['longitude'])) {
                $latitude = $data['latitude'];
                $longitude = $data['longitude'];
            } else {
                Log::warning("Invalid response from IP geolocation API: " . json_encode($data));

                $latitude = '47.4979';
                $longitude = '19.0402';
            }

            return [
                'ip' => $data['ip'] ?? 'N/A',
                'city' => $data['city_name'] ?? 'N/A',
                'region' => $data['region_name'] ?? 'N/A',
                'country' => $data['country_name'] ?? 'N/A',
                'location' => "{$latitude},{$longitude}"
            ];
        } catch (\Exception $e) {
            Log::error("IP geolocation failed: " . $e->getMessage());

            return [
                'ip' => 'N/A',
                'city' => 'N/A',
                'region' => 'N/A',
                'country' => 'N/A',
                'location' => '47.4979,19.0402'
            ];
        }
    }

    private function formatLocation($location)
    {
        return $location['country'] . " - " . $location['region'] . " - " . $location['city'];
    }

    private function generateGoogleMapsUrl($coords)
    {
        return "https://maps.googleapis.com/maps/api/staticmap?center={$coords}&zoom=13&size=600x300&markers=color:red%7Clabel:C%7C{$coords}&key=" . env('GOOGLE_MAPS_API_KEY');
    }

    public function comment_post(Request $request)
    {
        $userId = $request->input('user_id');
        $kepId = $request->input('kep_id');
        $szoveg = $request->input('komment');

        if (!$userId || !$kepId || !$szoveg || trim($szoveg) === '') {
            return response()->json([
                'status' => 'error',
                'message' => 'Missing or invalid parameters! The comment cannot be empty.'
            ], 400);
        }

        $kep = Kepek::find($kepId);
        if (!$kep) {
            return response()->json([
                'status' => 'error',
                'message' => 'The specified image was not found.'
            ], 404);
        }

        try {
            $komment = kommentek::create([
                'user_id' => $userId,
                'kep_id' => $kepId,
                'komment' => $szoveg,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'The comment has been successfully saved.',
                'data' => [
                    'id' => $komment->id,
                    'user_id' => $komment->user_id,
                    'kep_id' => $komment->kep_id,
                    'komment' => $komment->komment,
                ]
            ], 201);
        } catch (\Exception $e) {
            Log::error('Failed to save comment: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while saving the comment.'
            ], 500);
        }
    }

    public function comment_get(Request $request)
    {
        $kommentek = kommentek::where('kep_id', $request->kep_id)->get();

        $kommentek = $kommentek->map(function ($komment) {
            $user = gallery_users::find($komment->user_id);
            $komment->user_name = $user ? $user->name : 'Unknown';
            return $komment;
        });

        return response()->json([
            'message' => $kommentek->isNotEmpty() ? $kommentek : 'Something went wrong'
        ]);
    }

    public function comment_delete(Request $request)
    {
        $id = $request->id;
        $delete = kommentek::find($id)->delete();

        return response()->json([
            'message' => $delete ? "Successfully deleted!" : "Something went wrong!"
        ]);
    }

    public function forgot_password(Request $request)
    {
        $user = gallery_users::where('email', $request->input('email'))->first();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $token = Str::random(16);
        $user->update(['pass_token' => $token]);

        $frontendUrl = 'https://nagypeti.moriczcloud.hu/projekt/#/new-pass';
        $resetLink = "$frontendUrl?token=$token";

        $message = "
            <html>
                <body>
                    <div style='background: linear-gradient(to bottom, rgba(28, 143, 151, 0.31), rgba(165, 8, 165, 0.31)), url(\"https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/152164099/original/d793cc44e3997aa1d090c5d4d8041d7feb28e235/create-pixel-art-backgrounds.png\"); background-size: cover; border-radius: 10px 70% 37%  10px;  color:#c9f7cd; padding: 20px;'>
                        <h1 style='color:#c9f7cd;'>A password reset request was made for your account, $user->name!</h1>
                        <h2 style='color:#c9f7cd;'>
                            To reset your password:
                            <a href='$resetLink' style='color:#FFD700 ;text-decoration: underline;'>Reset Password</a>
                        </h2>
                        <h3 style='color:#c9f7cd;'>Request time: " . now() . "</h3>
                        <img style='border-radius: 10px;' src='$this->image_url' alt='Map' />
                    </div>
                </body>
            </html>
        ";

        $headers = "Content-type: text/html; charset=UTF-8";
        mail($request->input('email'), "Forgot Password!", $message, $headers);

        return response()->json(['message' => 'Password reset link sent!']);
    }

    public function save(Request $request)
    {
        $userId = Auth::id();

        if (!is_array(json_decode($request->input('hex_codes')))) {
            return response()->json([
                'status' => 'error',
                'message' => 'A hex_codes mezőnek tömbnek kell lennie!'
            ], 400);
        }

        $binaryData = '';
        foreach (json_decode($request->input('hex_codes')) as $hexCode) {
            $hexCode = ltrim($hexCode, '#');
            if (strlen($hexCode) % 2 !== 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Érvénytelen hex kód: ' . $hexCode
                ], 400);
            }
            $binaryData .= hex2bin($hexCode);
        }

        $compressedData = '';
        $segmentLength = 3;
        $previousSegment = '';
        $count = 1;

        for ($i = 0; $i < strlen($binaryData); $i += $segmentLength) {
            $currentSegment = substr($binaryData, $i, $segmentLength);

            if ($currentSegment === $previousSegment) {
                $count++;
            } else {
                if ($previousSegment !== '') {
                    $compressedData .= ($count > 1)
                        ? '(' . $count . '*' . base64_encode($previousSegment) . ')'
                        : base64_encode($previousSegment);
                }
                $previousSegment = $currentSegment;
                $count = 1;
            }
        }

        if ($previousSegment !== '') {
            $compressedData .= ($count > 1)
                ? '(' . $count . '*' . base64_encode($previousSegment) . ')'
                : base64_encode($previousSegment);
        }

        $forked = 0;
        $forkedFrom = null;

        if ($request->input('forked')) {
            $forked = 1;
        }

        Kepek::create([
            'user_id' => $userId,
            'hashtag' => $compressedData,
            'hashtags' => $request->input('hashtags'),
            'width' => $request->input('width'),
            'name' => $request->input('name'),
            'canBeEdited' => $request->input('canBeEdited'),
            'forkedFrom' => $request->input('forkedFrom'),
            'forked' => $forked,
            'description' => $request->input('description') ?? null,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Hex codes has been successfully saved!',
        ], 200);
    }

    public function delete(Request $request)
    {
        $kepid = $request->input('kepid');

        $delete = Kepek::where('id', $kepid)->delete();

        if ($delete) {
            return response()->json([
                'status' => 'success',
                'message' => 'Successfully deleted!'
            ], 200);
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete!'
            ], 400);
        }
    }

    public function update(Request $request)
    {
        $kepid = $request->input('kepid');
        $hexCodes = $request->input('hex_codes');

        if (!is_array($hexCodes)) {
            return response()->json(['status' => 'error', 'message' => 'Invalid hex code format!'], 400);
        }

        $binaryData = '';
        foreach ($hexCodes as $hexCode) {
            $hexCode = substr($hexCode, 1);
            if (strlen($hexCode) % 2 !== 0) {
                return response()->json(['status' => 'error', 'message' => 'Invalid hexadecimal characters!'], 400);
            }
            $binaryData .= hex2bin($hexCode);
        }

        $compressedData = '';
        $segmentLength = 3;
        $previousSegment = '';
        $count = 1;

        for ($i = 0; $i < mb_strlen($binaryData, '8bit'); $i += $segmentLength) {
            $currentSegment = substr($binaryData, $i, $segmentLength);

            if ($currentSegment === $previousSegment) {
                $count++;
            } else {
                if ($previousSegment !== '') {
                    if ($count > 1) {
                        $compressedData .= '(' . $count . "*" . base64_encode($previousSegment) . ')';
                    } else {
                        $compressedData .= base64_encode($previousSegment);
                    }
                }
                $previousSegment = $currentSegment;
                $count = 1;
            }
        }

        if ($previousSegment !== '') {
            if ($count > 1) {
                $compressedData .= '(' . $count . "*" . base64_encode($previousSegment) . ')';
            } else {
                $compressedData .= base64_encode($previousSegment);
            }
        }

        $updated = kepek::where('id', $kepid)->update([
            'hashtag' => $compressedData,
        ]);

        if (!$updated) {
            return response()->json(['status' => 'error', 'message' => 'Failed to update data!'], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Hex codes successfully saved!',
        ], 200);
    }

    public function getHexCodesbykepid(Request $request)
    {
        $buser = Auth::user(); 
        $buserId = $buser ? $buser->id : null;

        $kepid = $request->input('kepid');

        if (!$kepid) {
            return response()->json(['error' => 'kepid is required'], 400);
        }

        $record = kepek::with('user:id,name')
            ->select(['id', 'user_id', 'width', 'name', 'canBeEdited', 'hashtag', 'hashtags', 'forked', 'forkedFrom', 'description'])
            ->where('id', $kepid)
            ->first();

        if (!$record) {
            return response()->json(['error' => 'No image found with the given kepid'], 404);
        }

        if (!$record->hashtag) {
            return response()->json(['error' => 'No hashtag data available for this image'], 404);
        }

        $compressedData = $record->hashtag;
        $binaryData = '';

        preg_match_all('/\((\d+)\*([A-Za-z0-9+\/=]+)\)|([A-Za-z0-9+\/=]+)/', $compressedData, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            if (!empty($match[1]) && !empty($match[2])) {
                $count = intval($match[1]);
                $decodedSegment = base64_decode($match[2]);
                $binaryData .= str_repeat($decodedSegment, $count);
            } elseif (!empty($match[3])) {
                $binaryData .= base64_decode($match[3]);
            }
        }

        $hexCodesForRecord = [];
        for ($i = 0; $i < strlen($binaryData); $i += 3) {
            $hexCode = substr($binaryData, $i, 3);
            if (strlen($hexCode) == 3) {
                $hexCodesForRecord[] = '#' . bin2hex($hexCode);
            }
        }

        $user = $record->user;

       
        $hashtagIds = json_decode($record->hashtags, true);

        $hashtagNames = [];
        if (is_array($hashtagIds)) {
            $hashtagNames = hashtags::whereIn('id', $hashtagIds)->pluck('name')->toArray();
        }

        $likes = ertekelesek::where('kep_id', $record->id)
            ->where('likes', 1)
            ->count();

        $dislikes = ertekelesek::where('kep_id', $record->id)
            ->where('likes', -1)
            ->count();

        $rating = $likes - $dislikes;

        $userVote = null;
        if ($buserId) {
            $ertekeles = ertekelesek::where('kep_id', $record->id)
                ->where('user_id', $buserId)
                ->first();

            if ($ertekeles) {
                $userVote = $ertekeles->likes;
            }
        }

        $hexCodesByImage[] = [
            'user_id' => $record->user_id,
            'user_name' => $user ? $user->name : 'N/A',
            "name" => $record->name,
            'image_id' => $record->id,
            'width' => $record->width,
            'hex_codes' => $hexCodesForRecord,
            'canBeEdited' => $record->canBeEdited,
            'forkedFrom' => $record->forkedFrom,
            'forked' => $record->forked,
            'hashtags' => $hashtagNames,
            'description' => $record->description ?? null,
            'likes' => $likes,
            'dislikes' => $dislikes,
            'rating' => $rating,
            'vote_by_user' => $userVote, 

        ];

        return response()->json($hexCodesByImage, 200);
    }
    public function getHexCodes()
    {
        $buser = Auth::user(); 
        $userId = $buser ? $buser->id : null;
        $records = kepek::all();

        $hexCodesByImage = [];

        foreach ($records as $record) {
            if ($record->hashtag) {
                $compressedData = $record->hashtag;
                $binaryData = '';

                preg_match_all('/\((\d+)\*([A-Za-z0-9+\/=]+)\)|([A-Za-z0-9+\/=]+)/', $compressedData, $matches, PREG_SET_ORDER);

                foreach ($matches as $match) {
                    if (!empty($match[1]) && !empty($match[2])) {
                        $count = intval($match[1]);
                        $decodedSegment = base64_decode($match[2]);
                        $binaryData .= str_repeat($decodedSegment, $count);
                    } elseif (!empty($match[3])) {
                        $binaryData .= base64_decode($match[3]);
                    }
                }

                $hexCodesForRecord = [];
                for ($i = 0; $i < strlen($binaryData); $i += 3) {
                    $hexCode = substr($binaryData, $i, 3);
                    if (strlen($hexCode) == 3) {
                        $hexCodesForRecord[] = '#' . bin2hex($hexCode);
                    }
                }

                $user = $record->user;

               
                $hashtagIds = json_decode($record->hashtags, true);

                $hashtagNames = [];
                if (is_array($hashtagIds)) {
                    $hashtagNames = hashtags::whereIn('id', $hashtagIds)->pluck('name')->toArray();
                }


                $likes = ertekelesek::where('kep_id', $record->id)
                    ->where('likes', 1)
                    ->count();

                $dislikes = ertekelesek::where('kep_id', $record->id)
                    ->where('likes', -1)
                    ->count();

                $rating = $likes - $dislikes;
                $userVote = null;
                if ($userId) {
                    $ertekeles = ertekelesek::where('kep_id', $record->id)
                        ->where('user_id', $userId)
                        ->first();

                    if ($ertekeles) {
                        $userVote = $ertekeles->likes; 
                    }
                }

                $hexCodesByImage[] = [
                    'user_id' => $record->user_id,
                    'user_name' => $user ? $user->name : 'N/A',
                    "name" => $record->name,
                    'image_id' => $record->id,
                    'width' => $record->width,
                    'hex_codes' => $hexCodesForRecord,
                    'canBeEdited' => $record->canBeEdited,
                    'forkedFrom' => $record->forkedFrom,
                    'forked' => $record->forked,
                    'hashtags' => $hashtagNames,
                    'description' => $record->description ?? null,
                    'likes' => $likes,
                    'dislikes' => $dislikes,
                    'rating' => $rating,
                    'vote_by_user' => $userVote, 
                ];
            }
        }

        return response()->json([
            $hexCodesByImage,
        ], 200);
    }



    public function ertekeles_get(Request $request)
    {

        $ertekelesek = ertekelesek::get();

        return response()->json($ertekelesek, 400);

    }




    public function getHexCodesbyid(Request $request)
    {


        $userId = $request->input('user_id');

        if (!$userId) {
            return response()->json(['error' => 'user_id is required'], 400);
        }

        $records = kepek::where('user_id', $userId)->with('user')->get();

        $hexCodesByImage = $records->map(function ($record) {
            if (!$record->hashtag) {
                return null;
            }
            $buser = Auth::user(); 
            $buserId = $buser ? $buser->id : null;

            $binaryData = '';

            preg_match_all('/\((\d+)\*([A-Za-z0-9+\/=]+)\)|([A-Za-z0-9+\/=]+)/', $record->hashtag, $matches, PREG_SET_ORDER);

            foreach ($matches as $match) {
                if (!empty($match[1]) && !empty($match[2])) {
                    $count = intval($match[1]);
                    $decodedSegment = base64_decode($match[2]);
                    $binaryData .= str_repeat($decodedSegment, $count);
                } elseif (!empty($match[3])) {
                    $binaryData .= base64_decode($match[3]);
                }
            }

            $hexCodesForRecord = [];
            for ($i = 0; $i < strlen($binaryData); $i += 3) {
                $hexCode = substr($binaryData, $i, 3);
                if (strlen($hexCode) == 3) {
                    $hexCodesForRecord[] = '#' . bin2hex($hexCode);
                }
            }

            $hashtagIds = json_decode($record->hashtags, true);

            $hashtagNames = [];
            if (is_array($hashtagIds)) {
                $hashtagNames = hashtags::whereIn('id', $hashtagIds)->pluck('name')->toArray();
            }
            $likes = ertekelesek::where('kep_id', $record->id)
                ->where('likes', 1)
                ->count();

            $dislikes = ertekelesek::where('kep_id', $record->id)
                ->where('likes', -1)
                ->count();

            $rating = $likes - $dislikes;

            $userVote = null;
            if ($buserId) {
                $ertekeles = ertekelesek::where('kep_id', $record->id)
                    ->where('user_id', $buserId)
                    ->first();

                if ($ertekeles) {
                    $userVote = $ertekeles->likes;
                }
            } 
            return [
                'user_id' => $record->user_id,
                'user_name' => $record->user->name ?? null,
                'image_id' => $record->id,
                'width' => $record->width,
                'name' => $record->name,
                'canBeEdited' => $record->canBeEdited,
                'hex_codes' => $hexCodesForRecord,
                'description' => $record->description ?? null,
                'hashtags' => $hashtagNames,
                'likes' => $likes,
                'dislikes' => $dislikes,
                'rating' => $rating,
                'vote_by_user' => $userVote, 


            ];
        })->filter()->values(); // Eltávolítja a null elemeket és újraindexeli az adatokat By: Dr. ChatGPT a mester

        return response()->json($hexCodesByImage, 200);
    }




    public function gallery_get_user($id)
    {
        $user = gallery_users::where('id', $id)->first();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $user
        ], 200);
    }


    public function register(Request $request)
    {
        $user = gallery_users::create([
            'name' => $request->input('name'),
            'email' => $request->input('email'),
            'password' => Hash::make($request->input('password'))
        ]);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed'
            ], 500);
        }
        $frontendUrl = 'https://nagypeti.moriczcloud.hu/projekt/welcome';
        $welcomeLink = "$frontendUrl?user={$user->name}";

        $message = "
            <html>
                <body>
                    <div style='background: linear-gradient(to bottom, rgba(28, 143, 151, 0.31), rgba(165, 8, 165, 0.31)), url(\"https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/152164099/original/d793cc44e3997aa1d090c5d4d8041d7feb28e235/create-pixel-art-backgrounds.png\"); background-size: cover; border-radius: 10px 70% 37%  10px; color:#c9f7cd; padding: 20px;'>
                        <h1 style='color:#c9f7cd;'>Welcome, {$user->name}!</h1>
                        <h2 style='color:#c9f7cd;'>
                            Thank you for registering! Explore the gallery:
                            <a href='$welcomeLink' style='color:#FFD700; text-decoration: underline;'>View Gallery</a>
                        </h2>
                        <h3 style='color:#c9f7cd;'>Registration date: " . now() . "</h3>
                        <img style='border-radius: 10px;' src='$this->image_url' alt='Map' />
                    </div>
                </body>
            </html>
        ";

        $headers = "Content-type: text/html; charset=UTF-8";
        mail($request->input('email'), "Welcome to the Gallery!", $message, $headers);

        return response()->json([
            'status' => 'success',
            'message' => 'Registration is successful',
        ], 201);
    }


    public function login(Request $request)
    {
        if (!Auth::attempt($request->only("email", "password"))) {
            return response([
                'message' => 'Invalid credentials!'
            ], 401);
        }

        $user = Auth::user();

        $existingToken = $user->tokens()->where('name', 'token')->first();

        if ($existingToken) {
            $existingToken->delete();
        }

        $token = $user->createToken('token')->plainTextToken;

        $cookie = cookie('jwt', $token, 60 * 24);

        return response([
            'message' => $token
        ])->withCookie($cookie);
    }


    public function logout(Request $request)
    {
        $cookie = Cookie::forget('jwt');
        auth()->guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        $request->user()->tokens()->delete();
        return response([
            "message" => "Success"
        ])->withCookie($cookie);
    }

    public function user()
    {
        return Auth::user();
    }


    public function pass_update(Request $request)
    {
        $token = gallery_users::where('pass_token', $request->input('pass_token'))->first();

        if ($token) {
            $updated = $token->update([
                'password' => Hash::make($request->input('password')),
            ]);
            return response()->json([
                'status' => 'success',
                'data' => $token
            ], 200);
        } else {
            return response()->json([
                'error' => 'token is not valid'
            ], 400);
        }
    }

    public function query_kepek($query)
    {
        $buser = Auth::user(); 
        $buserId = $buser ? $buser->id : null;
        
        $matchingHashtagIds = Hashtags::where('name', 'like', "%$query%")->pluck('id')->toArray();

       
        $results = Kepek::where('name', 'like', "%$query%")
            ->orWhereHas('user', function ($q) use ($query) {
                $q->where('name', 'like', "%$query%");
            })
            ->orWhere(function ($q) use ($matchingHashtagIds) {
                foreach ($matchingHashtagIds as $id) {
                    $q->orWhereJsonContains('hashtags', $id);  
                }
            })
            ->get();


        if ($results->isEmpty()) {
            return response()->json(['error' => 'Not found.'], 404);
        }

        $hexCodesByImage = [];

        foreach ($results as $record) {
            if ($record->hashtag) {
                $compressedData = $record->hashtag;
                $binaryData = '';


                preg_match_all('/\((\d+)\*([A-Za-z0-9+\/=]+)\)|([A-Za-z0-9+\/=]+)/', $compressedData, $matches, PREG_SET_ORDER);


                foreach ($matches as $match) {

                    if (!empty($match[1]) && !empty($match[2])) {
                        $count = intval($match[1]);
                        $decodedSegment = base64_decode($match[2]);
                        $binaryData .= str_repeat($decodedSegment, $count);
                    } elseif (!empty($match[3])) {
                        $binaryData .= base64_decode($match[3]);
                    }
                }


                $hexCodesForRecord = [];
                $binaryLength = strlen($binaryData);


                for ($i = 0; $i < $binaryLength; $i += 3) {
                    $hexCode = substr($binaryData, $i, 3);
                    if (strlen($hexCode) == 3) {
                        $hexCodesForRecord[] = '#' . bin2hex($hexCode);
                    }
                }


                $user = $record->user;
                $hashtagIds = json_decode($record->hashtags, true);

                $hashtagNames = [];
                if (is_array($hashtagIds)) {
                    $hashtagNames = hashtags::whereIn('id', $hashtagIds)->pluck('name')->toArray();
                }

                $likes = ertekelesek::where('kep_id', $record->id)
                    ->where('likes', 1)
                    ->count();

                $dislikes = ertekelesek::where('kep_id', $record->id)
                    ->where('likes', -1)
                    ->count();

                $rating = $likes - $dislikes;
                $userVote = null;
                if ($buserId) {
                    $ertekeles = ertekelesek::where('kep_id', $record->id)
                        ->where('user_id', $buserId)
                        ->first();

                    if ($ertekeles) {
                        $userVote = $ertekeles->likes;
                    }
                } 
                $hexCodesByImage[] = [
                    'user_id' => $record->user_id,
                    'user_name' => $user ? $user->name : 'N/A',
                    "name" => $record->name,
                    'image_id' => $record->id,
                    'width' => $record->width,
                    'hex_codes' => $hexCodesForRecord,
                    'canBeEdited' => $record->canBeEdited,
                    'forkedFrom' => $record->forkedFrom,
                    'forked' => $record->forked,
                    'hashtags' => $hashtagNames,
                    'description' => $record->description ?? null,
                    'likes' => $likes,
                    'dislikes' => $dislikes,
                    'rating' => $rating,
                    'vote_by_user' => $userVote, 
                ];
            }
        }


        return response()->json($hexCodesByImage, 200);
    }


    public function query_hashtags($query)
    {
        $results = Hashtags::where('name', 'like', "%$query%")->get()->toArray();

        return response()->json($results);
    }


    public function hashtags_get(request $request, $id)
    {
        $hashtags = hashtags::where('id', $id)->first();
        return $hashtags;
    }





    public function hashtags_post(Request $request, HashtagValidatorService $validator)
    {
       
        $validatorInput = Validator::make($request->all(), [
            'name' => 'required|string|min:2|max:30'
        ]);

        if ($validatorInput->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid input.',
                'errors' => $validatorInput->errors()
            ], 422);
        }

      
        $hashtagName = trim($request->input('name'), '# ');

   
        if (!$validator->isValid($hashtagName)) {
            return response()->json([
                'status' => 'error',
                'message' => 'This hashtag is either invalid or already exists.'
            ], 422);
        }

       
        $hashtag = Hashtags::create([
            'name' => $hashtagName,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Hashtag created.',
            'data' => [
                'id' => $hashtag->id, 
                'name' => $hashtag->name
            ]
        ]);
    }


    public function rate(Request $request)
    {
        $userId = $request->input('user_id');
        $kepId = $request->input('kep_id');
        $action = $request->input('action');

        if (!$userId || !$kepId || !in_array($action, ['like', 'dislike'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Hiányzó vagy hibás paraméter!'
            ], 400);
        }

        $kep = Kepek::find($kepId);

        if (!$kep) {
            return response()->json([
                'status' => 'error',
                'message' => 'This picture is not valid'
            ], 404);
        }

        $likes = ($action === 'like') ? 1 : -1;

     
        $existing = ertekelesek::where('user_id', $userId)
            ->where('kep_id', $kepId)
            ->first();

      
        if ($existing && $existing->likes == $likes) {
            $existing->delete();

            return response()->json([
                'status' => 'success',
                'message' => 'You successfully removed your rating.',
                'likes' => null
            ]);
        }


        $ertekeles = ertekelesek::updateOrCreate(
            ['user_id' => $userId, 'kep_id' => $kepId],
            ['likes' => $likes]
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully saved.',
            'likes' => $ertekeles->likes
        ]);
    }



    public function likesCount($kepId)
    {

        $likes = ertekelesek::where('kep_id', $kepId)->where('likes', 1)->count();


        $dislikes = ertekelesek::where('kep_id', $kepId)->where('likes', -1)->count();

        $count = $likes - $dislikes;

        return response()->json([
            'kep_id' => $kepId,
            'likes' => $likes,
            'dislikes' => $dislikes,
            'count' => $count
        ]);
    }



}
