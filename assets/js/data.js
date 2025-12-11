window.projects = [
  {
    title: "SuperCashier",
    description:
      "Sistem Point of Sale (POS) Full-Stack untuk bisnis retail yang menggabungkan aplikasi mobile Flutter dengan REST API Laravel backend. Sistem ini menyediakan manajemen inventori real-time, transaksi penjualan otomatis, dan integrasi payment gateway Midtrans.",
    tags: ["Flutter", "Dart", "JWT", "Laravel", "PHP", "MySQL", "Cloudinary"],
    repo: "https://github.com/Kemal1101/pos_kasir_backend",
    details: {
      timeline: "2025 · 2 bulan",
      role: "Project Manager & Fullstack Developer",
      keyFeatures: [
        "Membangun dan meluncurkan sistem POS full-stack (Flutter & Laravel) untuk lingkungan produksi.",
        "Manajemen inventori real-time dengan mekanisme pessimistic locking untuk menjaga integritas data stok.",
        "Membuat aplikasi mobile dengan sinkronisasi keranjang otomatis dengan kalkulasi subtotal.",
        "Autentikasi aman berbasis JWT dan Role-Based Access Control (RBAC) untuk pengaturan hak akses bertingkat.",
        "Sinkronisasi keranjang belanja real-time dengan kalkulasi otomatis untuk pajak, diskon, dan subtotal.",
        "Penanganan transaksi robust dengan validasi bertingkat dan rollback otomatis untuk mencegah kegagalan data.",
        "Sistem pelaporan dan dashboard analitik komprehensif dengan fitur ekspor data ke format PDF.",
      ],
      responsibilities: [
        " Merancang arsitektur sistem lengkap termasuk diagram konteks, kontainer, komponen, ERD, dan sequence diagram.",
        "Menetapkan pendekatan pengembangan API-first dengan kontrak yang jelas antara sisi frontend dan backend.",
        "Menetapkan standar kualitas kode dan format respons API yang konsisten.",
        "Membangun RESTful API dengan 8+ controller endpoint yang melayani 15+ rute API.",
        "Mengembangkan manajemen stok cerdas dengan operasi increment/decrement yang atomik.",
        "Mengoptimalkan query database menggunakan Eloquent ORM eager loading guna mengurangi masalah N+1 query.",
        "Menerapkan manajemen siklus hidup otomatis untuk penjualan (dibuat otomatis saat item pertama masuk, dihapus saat kosong).",
      ],
      images: [
        "./assets/img/superCashier/1.png",
        "./assets/img/superCashier/2.png",
        "./assets/img/superCashier/3.png",
        "./assets/img/superCashier/4.png",
        "./assets/img/superCashier/5.png",
        "./assets/img/superCashier/6.png",
        "./assets/img/superCashier/7.png",
        "./assets/img/superCashier/8.png",
        "./assets/img/superCashier/9.png",
      ],
    },
  },
  {
    title: "SIPTOC",
    description:
      "Sistem Administrasi Tes TOEIC sebuah solusi terintegrasi yang dirancang untuk mengelola dan menyederhanakan keseluruhan proses penyelenggaraan Tes TOEIC Internasional bagi mahasiswa Politeknik Negeri Malang (Polinema).",
    tags: ["Laravel", "PHP", "JavaScript", "MySQL", "Bootstrap"],
    repo: "https://github.com/Kemal1101/toeic",
    details: {
      timeline: "2025 · 4 bulan",
      role: "Fullstack Developer",
      keyFeatures: [
        "Autentikasi pengguna dan manajemen peran (RBAC) untuk kontrol akses modul.",
        "Pendaftaran peserta TOEIC dengan validasi data dan pengelolaan status.",
        "Manajemen jadwal ujian (buat, ubah, batalkan, dan publikasi jadwal).",
        "Input, perhitungan, dan rekap nilai Listening/Reading beserta status kelulusan.",
        "Generate sertifikat dan laporan otomatis dalam format PDF siap cetak.",
        "Upload dan manajemen dokumen (surat pernyataan, tanda tangan, foto) dengan storage Laravel.",
        "Dashboard admin berbasis AdminLTE dengan ringkasan metrik dan navigasi modular.",
        "RESTful API untuk integrasi frontend dan kebutuhan eksternal.",
      ],
      responsibilities: [
        "Merancang dan membangun backend Laravel modular beserta RESTful API.",
        "Mengintegrasikan pembuatan PDF otomatis menggunakan barryvdh/laravel-dompdf.",
        "Menerapkan keamanan RBAC, CSRF, validasi input, dan hashing password.",
        "Mendesain skema database, relasi Eloquent, serta mengoptimalkan query.",
        "Mengembangkan UI dashboard dengan Blade, AdminLTE, dan Vite.",
        "Menangani build, migrasi, deployment, serta monitoring log dan bug.",
      ],
      images: [
        "./assets/img/siptoc/Screenshot 2025-10-12 161115.png",
        "./assets/img/siptoc/image (1).png",
        "./assets/img/siptoc/Screenshot 2025-10-14 204127.png",
        "./assets/img/siptoc/image (2).png",
        "./assets/img/siptoc/Screenshot 2025-10-14 204044.png",
      ],
    },
  },
  {
    title: "Bebas Tanggungan",
    description:
      "Proyek ini bertujuan untuk mengatasi inefisiensi dalam proses birokrasi penyelesaian tanggungan mahasiswa di Jurusan Teknologi Informasi, Politeknik Negeri Malang, yang sebelumnya masih dilakukan secara manual.",
    tags: ["JavaScript", "PHP", "SQL Server", "Bootstrap"],
    repo: "https://github.com/zidnafaz/BebasTanggungan",
    details: {
      timeline: "2024 · 4 bulan",
      role: "Backend Developer",
      keyFeatures: [
        "Sistem multi-role verifikasi lintas unit (LT6, LT7, Perpus, Pusat).",
        "Dashboard progres persentase mahasiswa real-time (Chart.js).",
        "Upload dokumen akademik terstruktur dengan status otomatis.",
        "Generasi & pengelolaan “nomor surat” idempoten.",
        "Pembuatan PDF surat resmi dengan font & tanda tangan digital.",
        "Admin portal untuk review dan konfirmasi dokumen per unit.",
        "Integrasi SQL Server teroptimasi untuk data akademik & tugas akhir.",
      ],
      responsibilities: [
        "Membangun API PHP untuk alur verifikasi Mahasiswa dan Admin.",
        "Integrasi SQL Server (sqlsrv) dengan query terparametrisasi dan stored procedure.",
        "Mengelola pembuatan “nomor surat” yang idempoten untuk rekomendasi ijazah.",
        "Menyediakan endpoint JSON untuk Chart.js dengan kontrak respons stabil.",
        "Menerapkan autentikasi cookie dan pembatasan akses berbasis peran.",
        "Mengamankan dari SQL injection dan XSS melalui validasi dan encoding output.",
        "Mengembangkan handler upload berkas dengan validasi tipe, ukuran, dan penyimpanan terstruktur.",
        "Mengoptimalkan query dan indeks untuk mempercepat pemuatan dashboard.",
      ],
      images: [
        "./assets/img/bebasTanggungan/image.png",
        "./assets/img/bebasTanggungan/image (1).png",
        "./assets/img/bebasTanggungan/image (2).png",
        "./assets/img/bebasTanggungan/image (3).png",
        "./assets/img/bebasTanggungan/image (4).png",
      ],
    },
  },
  {
    title: "TAHES",
    description:
      'Aplikasi "TAHES" adalah sebuah solusi kesehatan mobile berbasis kecerdasan buatan (AI) yang dirancang secara spesifik untuk mengatasi masalah stunting pada anak di Indonesia dengan memberdayakan orang tua, Posyandu, dan Kementerian Kesehatan.',
    tags: ["Figma"],
    docs: "https://drive.google.com/file/d/1DAaloJrnz7hu1youd42psVqr6JrbI3xZ/view?usp=sharing",
    details: {
      timeline: "2024 · 1 minggu",
      role: "UI/UX Designer",
      keyFeatures: [
        'Kalkulasi Stunting: Sistem dapat mengkalkulasi tingkat stunting yang dialami anak berdasarkan parameter pengukuran , seperti yang ditunjukkan pada fitur "Hasil Analisa Pengukuran".',
        'Rekomendasi Gizi Berbasis AI: AI TAHES merancang program perbaikan gizi yang disesuaikan dengan kebutuhan dan kondisi anak , seperti "Tambahan Kalori" dan "Peningkatan Kualitas Makanan".',
        'Chatbot AI (HelpBox): Menyediakan "HelpBox dengan AI" untuk menjawab pertanyaan orang tua atau caregiver seputar stunting , yang divisualisasikan sebagai fitur "Chat with AI".',
        'Monitoring Daring: Memantau perkembangan dan pertumbuhan bayi setiap bulannya secara daring melalui aplikasi , termasuk pencatatan "Riwayat Data Pengukuran".',
        'Agregasi Data Posyandu: Mengakumulasi dan mengkalkulasi data anak yang mengalami stunting di tiap Posyandu untuk dikirimkan ke KEMENKES setiap bulan , seperti terlihat pada "Rekap Data Posyandu".',
      ],
      responsibilities: [],
      images: ["./assets/img/tahes-BIw83oOH.png"],
    },
  },
];

window.skills = [
  {
    category: "Frontend",
    items: [
      "JavaScript",
      "HTML",
      "CSS",
      "Blade",
      "vite",
      "Flutter",
      "Dart",
      "jquery",
      "Bootstrap",
    ],
  },
  {
    category: "Backend",
    items: ["php", "Node.js", "laravel", "RESTful API", "MySQL", "Auth & JWT"],
  },
  {
    category: "Tools",
    items: ["Git & GitHub", "VS Code", "SQL Server"],
  },
];

// Sertifikasi (contoh data – ganti dengan sertifikat asli kamu)
window.certifications = [
  {
    title: "Associate Data Scientist",
    issuer: "Kementrian Komunikasi dan Digital",
    date: "2025",
    description:
      "Menguasai konsep dasar dan tools Data Science, proses data (mengumpulkan, menelaah, memvalidasi, menentukan objek, membersihkan, mengkonstruksi, dan menentukan label data), hingga membangun dan mengevaluasi hasil pemodelan.",
    skills: ["Python", "Machine Learning"],
    credentialUrl:
      "https://drive.google.com/file/d/1D_L1DszxbnrDi0lQwoK-Yta2fzDBNQsG/view?usp=drive_link",
  },
  {
    title: "AI Ready ASEAN",
    issuer: "ASEAN Foundation",
    date: "2025",
    description:
      "Menguasai fundamental AI generatif, penerapan praktis untuk meningkatkan produktivitas, serta prinsip-prinsip utama penggunaan AI yang etis, aman, dan bertanggung jawab.",
    skills: ["Generative AI", "Ethical AI Use"],
    credentialUrl:
      "https://drive.google.com/file/d/1nOo0lvqSNxFbOieB_2t_28A4PCCbI8rG/view?usp=drive_link",
  },
];

// Contact links (icons rendered in Contact section)
window.contactLinks = [
  { type: "github", label: "GitHub", url: "https://github.com/Kemal1101" },
  {
    type: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/mkemalsr1101/",
  },
  { type: "email", label: "Email", url: "mailto:kemalsyahru15@gmail.com" },
];
