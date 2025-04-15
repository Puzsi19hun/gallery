<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ShipmentController extends Controller
{
    public function index()
    {
        $id = request('id');
        $hasparatlan = false;
        
        if(strlen($id) != 10 or is_numeric($id) == false)
        {
            $data = [
             'id' => "Hibás id"
            ];
        }
    
        
        else
        {   
            for ($j = 0; $j < strlen($id); $j++)
            {
                if($id[$j] % 2 != 0)
                {
                    $hasparatlan = true;
                    
                }
            }
            if($hasparatlan)
            {
                $data = [
                    'id' => "Érvénytelen"
                ];
            }
            else{
                $data = [
                    "id"=> "OK"
                    
                ];
            }
        }
        return view('shipment', $data); 
    }

    public function two()
    {
        $x= request('x');
        $y= request('y');
        $z= request('z');

        if(!(isset($x) && isset($y) && isset($z)))
        {
            return view('hiba'); 
        }

    }


}