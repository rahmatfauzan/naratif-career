<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 📩 JOB APPLICATIONS (Jembatan antara Candidate dan Job Post)
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();

            // Relasi ke Loker
            $table->foreignId('job_post_id')->constrained()->cascadeOnDelete();

            // Relasi ke Pelamar
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();

            // Posisi di Kanban Board (Relasi ke Stage)
            $table->foreignId('current_stage_id')->nullable()->constrained('pipeline_stages')->nullOnDelete();

            // Dokumen CV spesifik yang dipakai melamar
            $table->foreignId('cv_document_id')->nullable()->constrained('candidate_documents')->nullOnDelete();

            // Catatan internal HR untuk pelamar ini
            $table->text('internal_notes')->nullable();

            // Skor kecocokan kandidat (jika nanti ada fitur auto-scoring)
            $table->decimal('match_score', 5, 2)->nullable();

            $table->timestamps();
            $table->softDeletes();

            // Indexing agar load Kanban board cepat
            $table->index(['job_post_id', 'current_stage_id']);

            // Pastikan kandidat tidak spam melamar 2 kali di loker yang sama
            $table->unique(['job_post_id', 'candidate_id']);
        });

        // 📝 JOB QUESTIONS (Form Dinamis HRD yang kita bahas sebelumnya)
        Schema::create('job_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_post_id')->constrained()->cascadeOnDelete();
            $table->string('question');
            $table->enum('type', ['text', 'boolean', 'file', 'multiple_choice']);
            $table->jsonb('options')->nullable();
            $table->boolean('is_required')->default(false);
            $table->timestamps();
        });

        // 💬 JOB APPLICATION ANSWERS (Jawaban Kandidat)
        Schema::create('job_application_answers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('job_question_id')->constrained()->cascadeOnDelete();
            $table->text('answer_text')->nullable();
            // Jika jawaban berupa file (seperti KTP/SIM), simpan ID ke brankas dokumen
            $table->foreignId('candidate_document_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_application_answers');
        Schema::dropIfExists('job_questions');
        Schema::dropIfExists('job_applications');
    }
};
