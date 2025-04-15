<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>regisztálcio</title>
</head>
<body>
<h1>regisztalcio</h1>
<form action="{{route('Regiszalcio')}}">
@csrf
<p>nev:</p><input type="text" maxlength=225 name="name" >
<p>email:</p><input type="email" maxlength=225 name="email" >
<p>password:</p> <input type="password" maxlength=225 name="password" ><br>
<input type="submit">







</form>    

</body>
</html>