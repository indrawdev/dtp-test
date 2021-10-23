<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Education;
use App\Models\Experience;
use App\Http\Resources\EmployeeResource;
use App\Http\Resources\EducationResource;
use App\Http\Resources\ExperienceResource;
use Exception;

class EmployeesController extends Controller
{
    public function index()
    {
        try {
            $employees = Employee::with(['educations', 'experiences'])->orderBy('created_at', 'desc')->get();
            if ($employees->count() > 0) {
                return EmployeeResource::collection($employees);
            } else {
                return response()->json(['error' => 'Not found'], 404);
            }
        } catch (Exception $e) {
            return $e;
        }
    }

    public function loadEducation($id)
    {
        try {
            $educations = Education::where('employee_id', $id)->orderBy('created_at', 'desc')->get();
            if ($educations->count() > 0) {
                return EducationResource::collection($educations);
            } else {
                return response()->json(['error' => 'Not found'], 404);
            }
        } catch (Exception $e) {
            return $e;
        }
    }

    public function loadExperience($id)
    {
        try {
            $experiences = Experience::where('employee_id', $id)->orderBy('created_at', 'desc')->get();
            if ($experiences->count() > 0) {
                return ExperienceResource::collection($experiences);
            } else {
                return response()->json(['error' => 'Not found'], 404);
            }
        } catch (Exception $e) {
            return $e;
        }
    }

    public function store(Request $request)
    {
        //
    }

    public function storeEducation(Request $request)
    {
        //
    }

    public function storeExperience(Request $request)
    {
        //
    }

    public function update(Request $request, $id)
    {
        //
    }

    public function destroy($id)
    {
        //
    }
}
