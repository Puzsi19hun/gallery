<!doctype html>
<html lang="en">
    <head>
        <title>Foglalas</title>
        <!-- Required meta tags -->
        <meta charset="utf-8" />
        <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <!-- Bootstrap CSS v5.2.1 -->
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
            crossorigin="anonymous"
        />
    </head>

    <body>















        <main>
    <label for="emelet">Emelet:</label>
    <select onchange="updateLakasOptions()" id="emelet" name="emelet">
        <option value="" disabled selected>Válassz emeletet...</option>
        <option value="1">1.</option>
        <option value="2">2.</option>
        <option value="3">3.</option>
        <option value="4">4.</option>
        <option value="5">5.</option>
        <option value="6">6.</option>
    </select>
    
 
    <label for="lakas">Lakás:</label>
    <select id="lakas" name="lakas">
        <option value="" disabled selected>Válassz lakást...</option>
        <option value="1">1.</option>
        <option value="2">2.</option>
        <option value="3">3.</option>
        <option value="4">4.</option>
    </select>

    
    <button type="submit">Foglalás</button>
</form>
        </main>


















       
       
        <script
            src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
            integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
            crossorigin="anonymous"
        ></script>

        <script
            src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"
            integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+"
            crossorigin="anonymous"
        ></script>

        <script>
            function updateLakasOptions() {
              var emelet = document.getElementById('emelet').value; 
              var lakasSelect = document.getElementById('lakas'); 
          
              
              for (var i = 0; i < lakasSelect.options.length; i++) {
                lakasSelect.options[i].disabled = false;
              }
          
             
              if (emelet == "1" || emelet == "6") {
                for (var i = 0; i < lakasSelect.options.length; i++) {
                  if (lakasSelect.options[i].value == "2" || lakasSelect.options[i].value == "3") {
                    lakasSelect.options[i].disabled = true;
                  }
                }
              }
            }


            
          </script>
    </body>
</html>
