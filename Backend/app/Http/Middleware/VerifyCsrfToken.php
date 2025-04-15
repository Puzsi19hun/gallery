<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * Azon URL-ek, amelyek kivételek a CSRF védelemből.
     *
     * @var array
     */
    protected $except = [
        // Add meg az API útvonalakat, amelyek mentesülnek a CSRF-védelem alól
        'api/szarsag',
        '/PixelArtSpotlight/',
        'PixelArtSpotlight/',
        "https://nagypeti.moriczcloud.hu/",
        "https://nagypeti.moriczcloud.hu/PixelArtSpotlight",
        "https://nagypeti.moriczcloud.hu/PixelArtSpotlight/",
        ,
    ];
}