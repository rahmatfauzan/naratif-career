// resources/js/types/job.ts

import { Department } from './department';
import { Skill } from './skill';
export const LEVEL = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
export type Level = (typeof LEVEL)[number];

export const JOB_TYPES = [
    'full-time',
    'part-time',
    'contract',
    'internship',
    'freelance',
] as const;
export type JobType = (typeof JOB_TYPES)[number];

export const JOB_LOCATIONS = ['onsite', 'remote', 'hybrid'] as const;
export type JobLocation = (typeof JOB_LOCATIONS)[number];

export interface BaseJob {
    id: number;
    title: string;
    slug: string;
    department_id: number;
    type: JobType;
    location: JobLocation;
}
// ---------------------------------------------------------
// Tipe untuk Home (getJobCatalog), Explore & Similar Jobs
// ---------------------------------------------------------
export interface JobCardType extends BaseJob {
    // Optional (karena getJobCatalog nggak narik ini, tapi Explore narik)
    salary?: string | null;
    experience_level?: string | null;
    deadline?: string | null;
    created_at?: string;

    // Relasi (wajib ada karena selalu di-load pakai with)
    department: Department;
    skills: Skill[];
}

// ---------------------------------------------------------
// Tipe untuk Job Detail (getJobDetail)
// ---------------------------------------------------------
export interface JobDetailType extends BaseJob {
    // Semua field tambahan yang cuma di-select di getJobDetail
    salary: string | null;
    description: string;
    requirements: string[];
    nice_to_have: string[] | null;
    benefits: string[] | null;
    experience_level: string | null;
    team_size: number | null;
    deadline: string | null;
    created_at: string;

    // Relasi
    department: Department;
    skills: Skill[];
}
