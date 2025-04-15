<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=ű, initial-scale=1.0">
    <title>Document</title>
    <style>

input[type="range"]::-moz-range-thumb {
     background-color: green;
}


        table,
        th,
        td {
            border: 1px solid black;
        }

        td,
        th {
            border-collapse: collapse;
            padding: 5px;
        }






    </style>
</head>

<body>
    <h1>A szavazás eredménye</h1>
    <div  id="tablazat">

    </div>
</body>

</html>

<script>
    function HTTPRequest(url, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (callback != null) callback(this.responseText)
            };
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }

    function Frissit() {
        HTTPRequest('/szavazat-tablazat', function (response) {
            document.getElementById('tablazat').innerHTML = response;
        })
    }

    Frissit();

    setInterval(Frissit, 1000);
</script>
