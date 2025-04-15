<!doctype html>
<html lang="hu">

<head>
    <title>Napok</title>

    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />


    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous" />
</head>
<style>
body {
    padding: 2rem;
    font-family: 'Just Another Hand', cursive;
    background: #f3f3f3;
}

.sketchy {
    margin: 0.8vw;
    border: 3px solid #333333;
    font-size: 1rem;
    border-radius: 2% 6% 5% 4% / 1% 1% 2% 4%;
    text-transform: uppercase;
    letter-spacing: 0.3ch;
    background: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
    text-align: center;    
    width: 150PX;
    height: 120px;
    
}

</style>


<body>

    <main>


    <form action="/napok/foglalas" method="post">
                @csrf
        @php $napok = ['Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat', 'Vasárnap']; @endphp

        <div class="container">
    <div class="row d-flex justify-content-center align-items-center"> 
        @foreach ($napok as $i => $nap)
            <div class="col-1 sketchy text-center" style="background-color: {{ $lista->get($i)->foglalt != 'nincs' ? '#D70040' : ''}};">
                <div>{{ $nap }}</div>
                <div>Foglaló: {{ $lista->get($i)->foglalt }}</div>
                <button onclick="post()" name="id" value="{{ $i+1 }}" class="imput" type="submit" > {{ $lista->get($i)->foglalt != 'nincs' ? 'Lemond' : 'Foglalás' }} </button>

            </div>
        @endforeach
    </div>
</div>

<div style="margin-top:20px;" class="container">
<div class="d-flex justify-content-center align-items-center col-12"> 
    <h1>Név:</h1>

                <input type="text" class="form-control" name="name" style="max-width: 300px;">

               
     </div>
     </div>
     </form>



      




    </main>


    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
        crossorigin="anonymous"></script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"
        integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+"
        crossorigin="anonymous"></script>
</body>

</html>