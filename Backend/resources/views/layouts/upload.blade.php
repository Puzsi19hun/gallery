@extends('layouts.app')

@section('title', 'CSV Feltöltés')

@section('content')
<form action="{{ url('/szamitogep/beir') }}" method="POST">
    @csrf
    <label for="csv_data">CSV:</label>
    <textarea name="csv_data" id="csv_data" rows="10" cols="30"></textarea>
    <button type="submit">Feltöltés</button>
</form>
@endsection
