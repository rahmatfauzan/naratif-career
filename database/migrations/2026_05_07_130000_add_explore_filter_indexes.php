<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('job_posts', function (Blueprint $table) {
            $table->index(['status', 'type', 'location', 'deadline'], 'job_posts_explore_filters_index');
        });

        Schema::table('job_skills', function (Blueprint $table) {
            $table->unique(['job_post_id', 'skill_id'], 'job_skills_unique_job_skill');
            $table->index(['skill_id', 'job_post_id'], 'job_skills_skill_job_index');
        });
    }

    public function down(): void
    {
        Schema::table('job_skills', function (Blueprint $table) {
            $table->dropUnique('job_skills_unique_job_skill');
            $table->dropIndex('job_skills_skill_job_index');
        });

        Schema::table('job_posts', function (Blueprint $table) {
            $table->dropIndex('job_posts_explore_filters_index');
        });
    }
};
