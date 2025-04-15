<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css">
    <title>Document</title>
</head>
<body>
    <div style="text-align: center">
        <h1>feltoltes</h1>
    </div>
    <form action=/termekek/termekpost method="post" enctype="multipart/form-data">
        @csrf
        <label>Név*</label>
        <input required name="cim" type="text" maxlength=50>
        <br>
        <label>Ár*</label>
        <input name="leiras" type="text" maxlength=100>
        <br>
        <label>Akcios Ár</label>
        <input name="leiras" type="text" maxlength=100>
        <br>
        <label>Leírás</label>
        <input name="leiras" type="text" maxlength=100>
        <br>


        <input required name="file" type="file" accept="image/*">
        <br>
        <input type="submit" value="Feltöltés">
    </form>


    @if(session('success'))
    <div style="color: green">
        {{ session('success') }}
    </div>
    @elseif (session('error'))
    <div style="color: red">
        {{ session('error') }}
    </div>
    @endif
    </div>
</body>
</html>