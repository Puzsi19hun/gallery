<?php
namespace App\Services;

use App\Models\hashtags;

class HashtagValidatorService
{
    /**
     * Ellenőrzi, hogy a hashtag nem spam vagy random karakterek.
     *
     * @param string $hashtag
     * @return bool
     */
    public function isValid(string $hashtag): bool
    {
        // A hashtag szó csupaszítása (# eltávolítása)
        $hashtag = trim($hashtag, '#');

        // Ellenőrizzük, hogy nem üres, legalább 2 karakter hosszú
        if (strlen($hashtag) < 2) {
            return false;
        }

        // Ha túl sok számot vagy speciális karaktert tartalmaz, akkor nem érvényes
        if (preg_match('/[^a-zA-Z0-9]/', $hashtag)) {
            return false;
        }

        // Ha túl hosszú (például 30 karakter fölött), akkor szintén nem érvényes
        if (strlen($hashtag) > 30) {
            return false;
        }

        // Ellenőrizzük, hogy már létezik-e a hashtag az adatbázisban
        if ($this->hashtagExists($hashtag)) {
            return false;
        }

        return true;
    }

    /**
     * Ellenőrzi, hogy létezik-e már a hashtag az adatbázisban.
     *
     * @param string $hashtag
     * @return bool
     */
    private function hashtagExists(string $hashtag): bool
    {
        return Hashtags::where('name', $hashtag)->exists();
    }
}

