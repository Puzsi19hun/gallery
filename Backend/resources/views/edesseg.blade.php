<!doctype html>
<html lang="hu">

<head>
    <title>Edesseg</title>

    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />


    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous" />
</head>
<style>


</style>


<body>

    <main>
       

    <form action="/edesseg/felvitel" method="post">
                @csrf
<div class="container">
    <div class="row d-flex justify-content-center align-items-center">
        <div class=" col-4">
                @foreach ($edessegLista as $i => $edes)
               <div>{{$edes["edessegek"]}} || {{$edes["ar"]}} <button >hozzaad</button></div>
                @endforeach
            </div>
            <div class=" col-4">
                @foreach ($edessegtablaLista as $tabla)
                <div>{{$tabla["nev"]}} || <input type="checkbox"></div>
            @endforeach
            </div>
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