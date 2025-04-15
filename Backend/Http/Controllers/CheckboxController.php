<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckboxController extends Controller
{
    public function showUploadForm()
    {
        return view('computers.upload');
    }

    public function upload(Request $request)
    {
        $request->validate([
            'csv_data' => 'required',
        ]);

        $csvData = $request->input('csv_data');
        $lines = explode("\n", $csvData);
        $errors = [];

        foreach ($lines as $index => $line) {
            if ($index === 0) continue; // Skip header row

            $data = str_getcsv($line, ';');
            if (count($data) !== 5) {
                $errors[] = $line;
                continue;
            }

            try {
                Computer::firstOrCreate(
                    ['gyarto' => $data[0], 'tipus' => $data[1]],
                    ['ram' => $data[2], 'ssd' => $data[3], 'monitor' => $data[4]]
                );
            } catch (\Exception $e) {
                $errors[] = $line;
            }
        }

        if (count($errors) > 0) {
            return response()->json(['errors' => $errors], 422);
        }

        return response()->json([], 200);
    }

    public function list()
    {
        $computers = Computer::all();
        return view('computers.list', compact('computers'));
    }

    public function delete($id)
    {
        $computer = Computer::findOrFail($id);
        $computer->delete();
        return redirect()->route('computers.list');
    }
} 
