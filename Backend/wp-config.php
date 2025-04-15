<?php
/**
 * A WordPress fő konfigurációs állománya
 *
 * Ebben a fájlban a következő beállításokat lehet megtenni: MySQL beállítások
 * tábla előtagok, titkos kulcsok, a WordPress nyelve, és ABSPATH.
 * További információ a fájl lehetséges opcióiról angolul itt található:
 * {@link http://codex.wordpress.org/Editing_wp-config.php Editing wp-config.php}
 *  A MySQL beállításokat a szolgáltatónktól kell kérni.
 *
 * Ebből a fájlból készül el a telepítési folyamat közben a wp-config.php
 * állomány. Nem kötelező a webes telepítés használata, elegendő átnevezni
 * "wp-config.php" névre, és kitölteni az értékeket.
 *
 * @package WordPress
 */

// ** MySQL beállítások - Ezeket a szolgálatótól lehet beszerezni ** //
/** Adatbázis neve */
define( 'DB_NAME', 'nagypeti_wp' );

/** MySQL felhasználónév */
define( 'DB_USER', 'nagypeti' );

/** MySQL jelszó. */
define( 'DB_PASSWORD', 'thisIsMor1czCloudMF!?' );

/** MySQL  kiszolgáló neve */
define( 'DB_HOST', 'localhost' );

/** Az adatbázis karakter kódolása */
define( 'DB_CHARSET', 'utf8mb4' );

/** Az adatbázis egybevetése */
define('DB_COLLATE', '');

/**#@+
 * Bejelentkezést tikosító kulcsok
 *
 * Változtassuk meg a lenti konstansok értékét egy-egy tetszóleges mondatra.
 * Generálhatunk is ilyen kulcsokat a {@link http://api.wordpress.org/secret-key/1.1/ WordPress.org titkos kulcs szolgáltatásával}
 * Ezeknek a kulcsoknak a módosításával bármikor kiléptethető az összes bejelentkezett felhasználó az oldalról.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY', '{yyc[yA LNT.#9K/O<LUdSVf1S~*jYI]aMP7ay&`uPb?{]PwyRJkg=+dX?:VL,uc' );
define( 'SECURE_AUTH_KEY', 'N3ZHHyV&Scs)^.M9;G{+gUg?Lz{{^^f}&Mj&.PXD`[vt[.=>nIJPH~D/`*|:Ic*p' );
define( 'LOGGED_IN_KEY', '1@lG8^=H{1W9^-.iPuaKZ&[=[-*rw$N1eE7-m$z<[7hXZ*upFH3Jj&^7zvf1aj):' );
define( 'NONCE_KEY', '(j2[I}gVeiB 1qvE&Y~a>+I$LTyZC[SI>N#piPxsQtrN{O*+*!B=q+&sCx(Ae/iH' );
define( 'AUTH_SALT',        ';3rOe8F5uNZ1E!e@uc-T2u=sn5td`</X73B|Aor0@%Ur0<u#VUv?~.7f-fTTFbZd' );
define( 'SECURE_AUTH_SALT', 's+r3$~{fUs<Y,-9HYF?; >(~A1z~hCV,]zyg<i+g3jY%Td2UisYifdV]_QWb,PZt' );
define( 'LOGGED_IN_SALT',   './KQ|`9ioEt<+YQElh-q3&7*}H|Ur05Jkk|VJ/IvCCw~@J9Mw,!Z!.oYtt]GPjla' );
define( 'NONCE_SALT',       '~6Ll4dodh >fy)W7v^g;#>.wSop$^YaQhZ3i&5nPR-Ypv*j},mT@0vpJAf:wnI#o' );

/**#@-*/

/**
 * WordPress-adatbázis tábla előtag.
 *
 * Több blogot is telepíthetünk egy adatbázisba, ha valamennyinek egyedi
 * előtagot adunk. Csak számokat, betűket és alulvonásokat adhatunk meg.
 */
$table_prefix = 'wp_';

/**
 * Fejlesztőknek: WordPress hibakereső mód.
 *
 * Engedélyezzük ezt a megjegyzések megjelenítéséhez a fejlesztés során.
 * Erősen ajánlott, hogy a bővítmény- és sablonfejlesztők használják a WP_DEBUG
 * konstansot.
 */
define('WP_DEBUG', false);

/* Ennyi volt, kellemes blogolást! */
/* That's all, stop editing! Happy publishing. */

/** A WordPress könyvtár abszolút elérési útja. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Betöltjük a WordPress változókat és szükséges fájlokat. */
require_once(ABSPATH . 'wp-settings.php');
