<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. CANDIDATES BASE TABLE
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('phone')->nullable();
            $table->string('avatar_url')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->string('nik')->nullable(); // KTP
            $table->string('linkedin_url')->nullable();
            $table->string('portfolio_url')->nullable();

            $table->text('summary')->nullable();

            // Gamifikasi & Kelengkapan Profil
            $table->tinyInteger('profile_completeness')->default(0);
            $table->tinyInteger('profile_level')->default(1);

            // Kolom CV Utama (Relasi foreign key-nya diikat di bawah untuk menghindari error circular dependency)
            $table->unsignedBigInteger('default_cv_id')->nullable();

            $table->enum('status', ['active', 'hired', 'rejected'])->default('active');

            $table->timestamps();
        });

        Schema::create('candidate_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->onDelete('cascade');
            $table->string('region_code')->nullable();
            $table->text('full_address')->nullable();
            $table->string('postal_code')->nullable();
            $table->timestamps();
        });

        // 2. CANDIDATE DOCUMENTS (Laci Brankas File)
        Schema::create('candidate_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete()->index();
            $table->string('document_type'); // cv, cover_letter, id_card, paklaring, certificate, dll
            $table->string('file_path');
            $table->string('file_name')->nullable();
            $table->timestamps();
        });

        // Mengikat relasi CV Utama ke tabel dokumen (Mencegah Circular Dependency)
        Schema::table('candidates', function (Blueprint $table) {
            $table->foreign('default_cv_id')->references('id')->on('candidate_documents')->nullOnDelete();
        });

        // 3. EDUCATIONS (Update: Enum Degree & Max GPA)
        Schema::create('educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete()->index();
            $table->string('school_name');

            // Enum tingkat pendidikan
            $table->enum('degree', ['TK', 'SD', 'SMP', 'SMA', 'SMK', 'D1', 'D2', 'D3', 'D4', 'S1', 'S2', 'S3'])->nullable();

            $table->string('field_of_study')->nullable();
            $table->year('start_year')->nullable();
            $table->year('end_year')->nullable();

            // GPA dan Nilai Maksimal (contoh: 3.80 dari 4.00, atau 85.00 dari 100.00)
            $table->decimal('gpa', 5, 2)->nullable();
            $table->decimal('max_gpa', 5, 2)->nullable(); // Bisa diset default 4.00 di level aplikasi

            $table->timestamps();
        });

        // 4. EXPERIENCES (Update: Tambah Relasi Dokumen untuk Paklaring)
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete()->index();
            $table->string('company_name');
            $table->string('position');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_current')->default(false);
            $table->text('description')->nullable();

            // Bukti pengalaman kerja (Paklaring / Surat Keterangan Kerja)
            $table->foreignId('document_id')->nullable()->constrained('candidate_documents')->nullOnDelete();

            $table->timestamps();
        });

        // 5. MASTER SKILLS sudah ada di migrasi sebelumnya

        Schema::create('candidate_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();
            $table->foreignId('skill_id')->constrained()->cascadeOnDelete();
            $table->string('level')->nullable();
            $table->timestamps();
            $table->unique(['candidate_id', 'skill_id']);
        });

        // 6. MASTER LANGUAGES & RELATIONS
        Schema::create('languages', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        Schema::create('candidate_languages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete();
            $table->foreignId('language_id')->constrained()->cascadeOnDelete();
            $table->string('proficiency')->nullable();
            $table->timestamps();
            $table->unique(['candidate_id', 'language_id']);
        });

        // 7. ACHIEVEMENTS & TRAININGS (Update: Tambah Relasi Dokumen)
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete()->index();
            $table->string('title');
            $table->string('issuer')->nullable();
            $table->text('description')->nullable();
            $table->date('date')->nullable();

            // Bukti Piagam/Pencapaian
            $table->foreignId('document_id')->nullable()->constrained('candidate_documents')->nullOnDelete();

            $table->timestamps();
        });

        Schema::create('trainings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete()->index();
            $table->string('title');
            $table->string('institution')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->text('description')->nullable();

            // Bukti Sertifikat Pelatihan
            $table->foreignId('document_id')->nullable()->constrained('candidate_documents')->nullOnDelete();

            $table->timestamps();
        });

        // 8. CERTIFICATIONS 
        Schema::create('certifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained()->cascadeOnDelete()->index();
            $table->string('name');
            $table->string('issuer')->nullable();
            $table->string('credential_id')->nullable();
            $table->string('credential_url')->nullable();
            $table->date('issued_date')->nullable();
            $table->date('expired_date')->nullable();

            // Bukti Sertifikasi Profesional
            $table->foreignId('document_id')->nullable()->constrained('candidate_documents')->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        // Drop foreign key dari candidates dulu sebelum mendrop tabel dokumen
        Schema::table('candidates', function (Blueprint $table) {
            $table->dropForeign(['default_cv_id']);
        });

        Schema::dropIfExists('certifications');
        Schema::dropIfExists('trainings');
        Schema::dropIfExists('achievements');
        Schema::dropIfExists('candidate_languages');
        Schema::dropIfExists('languages');
        Schema::dropIfExists('candidate_skills');
        Schema::dropIfExists('experiences');
        Schema::dropIfExists('educations');
        Schema::dropIfExists('candidate_documents');
        Schema::dropIfExists('candidate_addresses');
        Schema::dropIfExists('candidates');
    }
};
