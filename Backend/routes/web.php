<?php

use Illuminate\Support\Facades\Route;

use App\Models\Highway;

use App\Http\Controllers\gallery_usersController;

Route::get('projekt/{any?}', function () {
    return file_get_contents(public_path('projekt/index.html'));
})->where('any', '.*');

Route::controller(gallery_usersController::class)->group(function () {

    Route::get('/PixelArtSpotlight/ertekeles_get', 'ertekeles_get');
    //törli a kommenteket
    Route::delete('/PixelArtSpotlight/comment/delete/{id}', 'comment_delete');
    //lekéri a kommenteket
    Route::post('/PixelArtSpotlight/comment_get', 'comment_get');
    //menti a kommenteket
    Route::post('/PixelArtSpotlight/comment', 'comment_post');

    // meni a rajzot de keményen  felhasznalo_id + razjpixelek 

    // Felhasználó bejelentkezése email + jelszó
    Route::post('/PixelArtSpotlight/register', 'register');

    //kepet ad vissza kep id alapján (kepid)
    Route::post('/PixelArtSpotlight/getHexCodesbykepid', 'getHexCodesbykepid');

    Route::post('/PixelArtSpotlight/pass_update', 'pass_update');
    //Képet töröl kép id alapján (kepid)
    // Felhasználó regisztrálása email + név + jelszó
    Route::post('/PixelArtSpotlight/login', 'login');
    //udpdateli a képet kepid + hex_codes[]
    // Elfelejtett jelszo email
    Route::post('/PixelArtSpotlight/forgot_password', 'forgot_password');
    Route::get('/PixelArtSpotlight/getHexCodes', [App\Http\Controllers\gallery_usersController::class, 'getHexCodes']);
    Route::get('/PixelArtSpotlight/getUser/{id}', [App\Http\Controllers\gallery_usersController::class, 'gallery_get_user']);
    Route::post('/PixelArtSpotlight/getHexCodesbyid', [App\Http\Controllers\gallery_usersController::class, 'getHexCodesbyid']);
    Route::get('/PixelArtSpotlight/kepek/search/{query}', [gallery_usersController::class, 'query_kepek']);
    Route::get('/PixelArtSpotlight/hashtags/search/{query}', [gallery_usersController::class, 'query_hashtags']);

    Route::get('/PixelArtSpotlight/hashtags', 'hashtags_get');
    Route::post('/PixelArtSpotlight/hashtags', 'hashtags_post');

    Route::get('/PixelArtSpotlight/kepek', 'kepek_get');
    Route::get('/PixelArtSpotlight/kepek/{id}', 'kepek_get_id');
    Route::post('/PixelArtSpotlight/rate', [gallery_usersController::class, 'rate']);
    Route::get('/PixelArtSpotlight/likeok/{kepId}', [gallery_usersController::class, 'likesCount']);

});

Route::middleware('auth:sanctum')->group(function () {
    //Route::post('/PixelArtSpotlight/getHexCodesbyid', [App\Http\Controllers\gallery_usersController::class, 'getHexCodesbyid']);

    Route::post('/PixelArtSpotlight/delete', [App\Http\Controllers\gallery_usersController::class, 'delete']);
    Route::post('/PixelArtSpotlight/update', [App\Http\Controllers\gallery_usersController::class, 'update']);
    Route::post('/PixelArtSpotlight/save', [App\Http\Controllers\gallery_usersController::class, 'save']);
    Route::get('/PixelArtSpotlight/user', [App\Http\Controllers\gallery_usersController::class, 'user']);
    Route::post('/PixelArtSpotlight/logout', [App\Http\Controllers\gallery_usersController::class, 'logout']);
});
