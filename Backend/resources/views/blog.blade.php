<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        header {
            text-align: center;
        }
        .content {
            margin-top: 20px;
        }
        .content img {
            max-width: 100%;
            height: auto;
        }
        .dark-mode {
            background-color: #333;
            color: #f0f0f0;
        }
    </style>
</head>
<body class="{{ request()->has('dark') ? 'dark-mode' : '' }}">
    <header>
        <h1>{{ $title }}</h1>
        <p><strong>Szerző:</strong> {{ $author }}</p>
        <p><strong>Dátum:</strong> {{ $date }}</p>
    </header>

    <div class="content">
        @if(isset($image))
            <img src="{{ $image }}" alt="{{ $title }}">
        @endif
        <p>{{ $content }}</p>
    </div>
</body>
</html>
