use App\Http\Controllers\ComputerController;

Route::get('/computers', [ComputerController::class, 'list']);
Route::post('/computers', [ComputerController::class, 'upload']);
Route::delete('/computers/{id}', [ComputerController::class, 'delete']);
