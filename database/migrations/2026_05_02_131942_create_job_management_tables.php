<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pipelines', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('pipeline_stages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pipeline_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->integer('order');
            $table->enum('type', ['screening', 'assessment', 'interview', 'offer', 'other']);
            $table->text('description')->nullable();
            $table->string('duration')->nullable();
            $table->boolean('is_final')->default(false);
            $table->timestamps();
            $table->index(['pipeline_id', 'order']);
        });

        Schema::create('pipeline_stage_criteria', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pipeline_stage_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->float('weight')->default(0);
            $table->timestamps();
        });

        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('job_posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->foreignId('department_id')->constrained()->cascadeOnDelete();
            $table->enum('type', ['full-time', 'part-time', 'contract', 'internship', 'freelance']);
            $table->enum('location', ['onsite', 'remote', 'hybrid']);
            $table->unsignedBigInteger('salary')->nullable();
            $table->longText('description')->nullable();
            $table->jsonb('requirements')->nullable();
            $table->jsonb('nice_to_have')->nullable();
            $table->jsonb('benefits')->nullable();
            $table->string('experience_level')->nullable();
            $table->integer('team_size')->nullable();
            $table->date('deadline')->nullable();
            $table->string('status')->default('draft');
            $table->integer('headcount_target')->default(1);
            $table->integer('headcount_filled')->default(0);
            $table->foreignId('pipeline_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
            $table->index('status');
            $table->index('type');
            $table->index('location');
            $table->index('deadline');
            $table->index(['status', 'department_id']);
        });

        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('job_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_post_id')->constrained('job_posts')->cascadeOnDelete();
            $table->foreignId('skill_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_skills');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('job_posts');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('pipeline_stage_criteria');
        Schema::dropIfExists('pipeline_stages');
        Schema::dropIfExists('pipelines');
    }
};
