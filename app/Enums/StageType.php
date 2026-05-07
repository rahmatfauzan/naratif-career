<?php

namespace App\Enums;

enum StageType: string
{
    case Screening = 'screening';
    case Assessment = 'assessment';
    case Interview = 'interview';
    case Offer = 'offer';
    case Other = 'other';
}
