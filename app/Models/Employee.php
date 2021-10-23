<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    public function educations()
    {
        return $this->hasMany('App\Models\Education');
    }

    public function experiences()
    {
        return $this->hasMany('App\Models\Experience');
    }
}
