<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use App\Models\Education;
use App\Models\Experience;
use App\Http\Resources\EmployeeResource;
use App\Http\Resources\EducationResource;
use App\Http\Resources\ExperienceResource;
use Illuminate\Support\Facades\DB;
use Exception;

class EmployeesController extends Controller
{
    public function loadEmployee(Request $request)
    {
        $search = $request->input('search');
        try {
            $employees = Employee::with(['educations', 'experiences'])
                ->where('name', 'LIKE', '%' . $search . '%')
                ->orderBy('created_at', 'desc')
                ->get();
            if ($employees->count() > 0) {
                return EmployeeResource::collection($employees);
            } else {
                return response()->json(['error' => 'Not found'], 404);
            }
        } catch (Exception $e) {
            return $e;
        }
    }

    public function loadEducation(Request $request)
    {
        $id = $request->input('employee_id');

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

    public function loadExperience(Request $request)
    {
        $id = $request->input('employee_id');

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
        $validated = $request->validate([
            'name' => 'required|max:255',
            'address' => 'required',
            'identity' => 'required',
        ]);

        if ($validated) {
            $id = $request->input('id');
            try {
                if ($id) {
                    $employee = Employee::find($id);
                    $employee->name = $request->name;
                    $employee->address = $request->address;
                    $employee->identity = $request->identity;
                    $employee->save();
                    return response()->json(['result' => 'Success'], 200);
                } else {
                    $employee = new Employee();
                    $employee->name = $request->name;
                    $employee->address = $request->address;
                    $employee->identity = $request->identity;
                    $employee->save();
                    return response()->json(['result' => 'Success'], 200);
                }
            } catch (Exception $e) {
                return $e;
            }
        } else {
            // return response()->json(['result' => $validated->errors()], 400);
        }
    }

    public function storeEducation(Request $request)
    {
        $employee = $request->input('employee_id');
        $school = explode('|', $request->input('school'));
        $major = explode('|', $request->input('major'));
        $start = explode('|', $request->input('start'));
        $end = explode('|', $request->input('end'));

        $sum = count($school) - 1;
        if ($sum > 0) {
            DB::table('education')->where('employee_id', '=', $employee)->delete();

            for ($i = 1; $i <= $sum; $i++) {
                $detail = array(
                    'employee_id' => $employee,
                    'school' => $school[$i],
                    'major' => $major[$i],
                    'start' => $start[$i],
                    'end' => $end[$i],
                );
                DB::table('education')->insert($detail);
            }
            return response()->json(['result' => 'Success'], 201);
        }
        return response()->json(['result' => 'Error'], 400);
    }

    public function storeExperience(Request $request)
    {
        $employee = $request->input('employee_id');
        $company = explode('|', $request->input('company'));
        $position = explode('|', $request->input('position'));
        $year = explode('|', $request->input('year'));

        $sum = count($company) - 1;
        if ($sum > 0) {
            DB::table('experiences')->where('employee_id', '=', $employee)->delete();

            for ($i = 1; $i <= $sum; $i++) {
                $detail = array(
                    'employee_id' => $employee,
                    'company' => $company[$i],
                    'position' => $position[$i],
                    'year' => $year[$i],
                );
                DB::table('experiences')->insert($detail);
            }
            return response()->json(['result' => 'Success'], 201);
        }
        return response()->json(['result' => 'Error'], 400);
    }

    public function destroy(Request $request)
    {
        $id = $request->input('id');
        if ($id) {
            $employee = Employee::find($id);
            if ($employee) {
                $employee->delete();
                return response()->json(['result' => 'Success'], 200);
            } else {
                return response()->json(['result' => 'Not found'], 404);
            }
        }
        return response()->json(['result' => 'Not found'], 404);
    }
}
