<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lakas</title>
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">

</head>

<body>
    <div class="container building mt-4">

        @php
            $roomsByFloor = $data->groupBy('emelet');
        @endphp

        @foreach ($roomsByFloor as $floorRooms)
            <div class="">
                <div class="row col-md-8">
                    @foreach ($floorRooms as $index => $lakas)
                        @if ($floorRooms->count() == 2 && $index == 0)
                            <div class="col-md-1">
                                <div class="window 
                                                {{ $lakas->foglalte === 1 ? 'foglalt' : 'elerheto' }}">
                                </div>
                            </div>
                        @elseif ($floorRooms->count() == 2 && $index == 1)
                            <div class="col-md-2"></div>
                            <div class="col-md-1">
                                <div class="window 
                                                {{ $lakas->foglalte === 1 ? 'foglalt' : 'elerheto' }}">
                                </div>
                            </div>
                        @else
                            <div class="col-md-1">
                                <div class="window 
                                                {{ $lakas->foglalte === 1 ? 'foglalt' : 'elerheto' }}">
                                </div>
                            </div>
                        @endif
                    @endforeach
                </div>
        @endforeach


            <div class="col-md-6">
                <div>
                    <label>Emelet:</label>
                    <select id="floorSelect" onchange="updateApartmentOptions()">
                        <option value="0">Földszint</option>
                        <option value="1">1. Emelet</option>
                        <option value="2">2. Emelet</option>
                        <option value="3">3. Emelet</option>
                        <option value="4">4. Emelet</option>
                        <option value="5">5. Emelet</option>
                    </select>
                </div>

                <div>
                    <label>Lakás:</label>
                    <select id="apartmentSelect" onchange="updateFloorOptions()">
                        <option value="4">1. Lakas</option>
                        <option value="3" disabled>2. Lakas</option>
                        <option value="2" disabled>3. Lakas</option>
                        <option value="1">4. Lakas</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-3">
                <button class="button-25" onclick="uploadClick()">Foglalás</button>
            </div>
        </div>
        <div style="margin-top:10px;" class="row">
            <div class="col-md-3">
                <button class="button-25" onclick="deleteClick()">Törlés</button>
            </div>
        </div>
    </div>

    <script>
        function updateApartmentOptions() {
            const floorSelect = document.getElementById("floorSelect");
            const apartmentSelect = document.getElementById("apartmentSelect");

            for (let i = 0; i < apartmentSelect.options.length; i++) {
                apartmentSelect.options[i].disabled = false;
            }

            if (floorSelect.value === "0" || floorSelect.value === "5") {
                apartmentSelect.options[1].disabled = true;
                apartmentSelect.options[2].disabled = true;
            }
        }

        function updateApartmentOptions() {
            const floorSelect = document.getElementById("floorSelect");
            const apartmentSelect = document.getElementById("apartmentSelect");

            for (let i = 0; i < apartmentSelect.options.length; i++) {
                apartmentSelect.options[i].disabled = false;
            }

            if (floorSelect.value === "0" || floorSelect.value === "5") {
                apartmentSelect.options[0].selected = true;
                apartmentSelect.options[1].disabled = true;
                apartmentSelect.options[2].disabled = true;
            }
        }

        function uploadClick() {
            const emelet = document.getElementById("floorSelect").value;
            const lakas = document.getElementById("apartmentSelect").value;
            window.location.replace("/Lakas/foglal/" + emelet + "/" + lakas);
        }
        function deleteClick() {
            const emelet = document.getElementById("floorSelect").value;
            const lakas = document.getElementById("apartmentSelect").value;
            window.location.replace("/Lakas/torol/" + emelet + "/" + lakas);
        }
    </script>
    <style>
        body {
            background-color: gray;
            color: white;
        }

        .foglalt {
            background-color: red;
        }

        .elerheto {
            background-color: lightgreen;
        }

        .window {
            width: 50px;
            height: 50px;
            margin: 5px 0;

        }


        /* CSS */
        .button-25 {
            background-color: #36A9AE;
            background-image: linear-gradient(#37ADB2, #329CA0);
            border: 1px solid #2A8387;
            border-radius: 4px;
            box-shadow: rgba(0, 0, 0, 0.12) 0 1px 1px;
            color: #FFFFFF;
            cursor: pointer;
            display: block;
            font-family: -apple-system, ".SFNSDisplay-Regular", "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: 17px;
            line-height: 100%;
            margin: 0;
            outline: 0;
            padding: 11px 15px 12px;
            text-align: center;
            transition: box-shadow .05s ease-in-out, opacity .05s ease-in-out;
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
            width: 100%;
        }

        .button-25:hover {
            box-shadow: rgba(255, 255, 255, 0.3) 0 0 2px inset, rgba(0, 0, 0, 0.4) 0 1px 2px;
            text-decoration: none;
            transition-duration: .15s, .15s;
        }

        .button-25:active {
            box-shadow: rgba(0, 0, 0, 0.15) 0 2px 4px inset, rgba(0, 0, 0, 0.4) 0 1px 1px;
        }

        .button-25:disabled {
            cursor: not-allowed;
            opacity: .6;
        }

        .button-25:disabled:active {
            pointer-events: none;
        }

        .button-25:disabled:hover {
            box-shadow: none;
        }
    </style>
</body>

</html>