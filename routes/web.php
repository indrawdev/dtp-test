<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeesController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('employee');
});

Route::post('/employees/main', [EmployeesController::class, 'loadEmployee']);
Route::post('/employees/educations', [EmployeesController::class, 'loadEducation']);
Route::post('/employees/experiences', [EmployeesController::class, 'loadExperience']);
Route::post('/employees/store', [EmployeesController::class, 'store']);
Route::post('/employees/savedu', [EmployeesController::class, 'storeEducation']);
Route::post('/employees/savexp', [EmployeesController::class, 'storeExperience']);
Route::post('/employees/delete', [EmployeesController::class, 'destroy']);
