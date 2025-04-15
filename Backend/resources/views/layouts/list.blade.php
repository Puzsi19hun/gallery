@extends('layouts.app')

@section('content')
    <table>
        <thead>
            <tr>
                <th>Gyártó</th>
                <th>Típus</th>
                <th>RAM</th>
                <th>SSD</th>
                <th>Monitor</th>
                <th>Műveletek</th>
            </tr>
        </thead>
        <tbody>
            @foreach($computers as $computer)
                <tr>
                    <td>{{ $computer->gyarto }}</td>
                    <td>{{ $computer->tipus }}</td>
                    <td>{{ $computer->ram }} GB</td>
                    <td>{{ $computer->ssd }} GB</td>
                    <td>{{ $computer->monitor ? '✔' : '⨉' }}</td>
                    <td>
                        <form action="/szamitogep/torles/{{ $computer->id }}" method="POST" onsubmit="return confirm('Biztos törölni szeretné?');">
                            @csrf
                            @method('DELETE')
                            <button type="submit">Törlés</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
    <a href="/szamitogep/feltoltes">Új CSV feltöltése</a>
@endsection
