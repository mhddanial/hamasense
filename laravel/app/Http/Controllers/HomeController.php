<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Article;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    private array $navItems = [
        ['name' => 'Beranda', 'link' => '/'],
        ['name' => 'Tentang', 'link' => '/about'],
        ['name' => 'Artikel', 'link' => '/articles'],
    ];

    public function index()
    {
        $features = [
            "Deteksi hama instan hanya dalam hitungan detik",
            "Solusi perawatan tanaman berkelanjutan tersedia untuk dijelajahi",
            "Prediksi cuaca untuk meningkatkan kualitas tanaman",
            "Dilengkapi dengan fitur komunitas untuk membantu sesama",
        ];

        $faqs = [
            [
                'q' => 'Bagaimana cara kerja HAMASENSE dalam mendeteksi hama?',
                'a' => 'Anda cukup ambil atau unggah foto tanaman. Model AI kami akan menganalisis pola pada daun, batang, dan buah untuk mengidentifikasi jenis hama/penyakit lalu menampilkan tingkat keyakinan dan rekomendasi penanganan.',
            ],
            [
                'q' => 'Seberapa akurat deteksinya?',
                'a' => 'Akurasi rata-rata tinggi pada komoditas populer (tomat, cabai, pisang, jagung, singkong), namun tetap dipengaruhi kualitas foto, pencahayaan, dan sudut pengambilan. Kami menampilkan skor keyakinan agar Anda bisa menilai hasilnya.',    
            ],
            [
                'q' => 'Apakah data dan foto saya disimpan?',
                'a' => 'Secara default, kami hanya menyimpan data yang diperlukan untuk meningkatkan kualitas model dan pengalaman pengguna. Anda dapat menghapus riwayat deteksi kapan saja dari dashboard dan mengatur preferensi privasi.',
            ],
            [
                'q' => "Apakah aplikasi bisa digunakan tanpa internet?",
                'a' => "Model berjalan di server sehingga koneksi internet diperlukan untuk analisis. Namun, Anda tetap bisa memotret lalu mengunggah saat koneksi tersedia.",
            ],
            [
                'q' => "Tanaman apa saja yang didukung?",
                'a' => "Saat ini fokus pada tomat, cabai, pisang, jagung, dan singkong. Dukungan tanaman lain akan ditambahkan bertahap. Anda bisa mengajukan permintaan tanaman baru melalui menu Masukan.",
            ],
            [
                'q' => "Bagaimana jika hasil deteksi tidak sesuai?",
                'a' => "Coba unggah foto yang lebih tajam/terang atau dari sudut berbeda. Anda juga dapat membandingkan dengan contoh gejala, atau bertanya di Komunitas untuk verifikasi dari pengguna lain.",
            ],
            [
                'q' => "Apakah ada rekomendasi penanganan yang ramah lingkungan?",
                'a' => "Ya. Kami menampilkan opsi organik dan praktik budidaya berkelanjutan (sanitasi, rotasi, jarak tanam, predator alami) selain opsi kimia yang lazim.",
            ],
            [
                'q' => "Bagaimana cara menghubungi dukungan?",
                'a' => "Gunakan menu Bantuan di aplikasi atau kirim email ke hamasense.app@gmail.com Sertakan foto/gejala serta waktu kejadian agar tim kami bisa membantu lebih cepat.",
            ],
            
        ];

        $detect_examples = [
            [
                'id' => 1,
                'plantName' => 'Tomat',
                'disease' => 'Busuk Daun (Late Blight)',
                'severity' => 'Tinggi', 
                'confidence' => 92, 
                'description' => 'Bercak coklat gelap pada daun, cepat menyebar saat lembab.',
                'symptoms' => ['Bercak coklat pada daun', 'Tepi daun mengering', 'Buah membusuk'],
                'treatment' => ['Gunakan fungisida berbasis tembaga', 'Perbaiki sirkulasi udara', 'Hindari penyiraman dari atas'],
                'prevention' => ['Rotasi tanaman', 'Pilih varietas tahan penyakit', 'Bersihkan sisa tanaman sakit'],
                'image' => '/images/tomato_late_blight.jpg',
            ],
            [
                'id' => 2,
                'plantName' => 'Cabai',
                'disease' => 'Bercak Bakteri (Bacterial Spot)',
                'severity' => 'Sedang', 
                'confidence' => 92, 
                'description' => 'Infeksi bakteri yang menyebabkan bercak basah pada daun dan buah, seringkali membuatnya rontok.',
                'symptoms' => [
                    'Bercak kecil basah (water-soaked) pada daun',
                    'Bercak menjadi gelap, kering, dan berkerak',
                    'Daun menguning dan rontok sebelum waktunya'
                ],
                'treatment' => [
                    'Semprotkan bakterisida (berbahan tembaga)',
                    'Buang dan musnahkan bagian tanaman yang terinfeksi',
                    'Kurangi penyiraman dari atas (overhead watering)'
                ],
                'prevention' => [
                    'Gunakan benih atau bibit yang sehat (bersertifikat)',
                    'Lakukan rotasi tanaman (jangan tanam cabai/tomat berurutan)',
                    'Jaga jarak tanam agar sirkulasi udara baik'
                ],
                'image' => '/images/pepper_bell_bacterial_spot.jpg',
            ],
            [
                'id' => 3,
                'plantName' => 'Singkong',
                'disease' => 'Tungau Hijau (Cassava Green Mite)',
                'severity' => 'Sedang', 
                'confidence' => 92, 
                'description' => 'Bercak coklat gelap pada daun, cepat menyebar saat lembab.',
                'symptoms' => [
                    "Daun muda menguning atau berbintik kuning (klorosis)",
                    "Bentuk daun tidak normal atau keriting",
                    "Pertumbuhan tanaman kerdil atau tunas terhambat"
                ],
                'treatment' => [
                    "Semprotkan akarisida (pembasmi tungau) yang efektif",
                    "Lepaskan musuh alami (tungau predator)",
                    "Gunakan sabun insektisida atau minyak nimba"
                ],
                'prevention' => [
                    "Tanam varietas singkong yang tahan hama",
                    "Gunakan bibit yang sehat dan bebas tungau",
                    "Lakukan sanitasi kebun (membersihkan gulma)"
                ],
                'image' => '/images/cassava_green_mite.jpg',
            ],
            [
                'id' => 4,
                'plantName' => 'Jagung',
                'disease' => 'Ulat Grayak (Armyworm)',
                'severity' => 'Sedang', 
                'confidence' => 80, 
                'description' => 'Larva memakan daun meninggalkan lubang tidak beraturan.',
                'symptoms' => ['Daun berlubang', 'Kotoran ulat pada daun', 'Kerusakan cepat meluas'],
                'treatment' => ['PoTrap feromon', 'Ambil manual ulat', 'Gunakan BT (Bacillus thuringiensis)'],
                'prevention' => ['Pasang perangkap lampu', 'Bersihkan gulma sekitar', 'Rotasi tanaman'],
                'image' => '/images/maize_armyworm.jpg',
            ],
            
        ];

        return Inertia::render('home/index', [
            'navItems' => $this->navItems,
            'features' => $features,
            'detectionExamples' => $detect_examples,
            'faqs' => $faqs,
        ]);
    }

    public function about()
    {
        return Inertia::render('about/index', [
            'navItems' => $this->navItems,
            'hero' => [
                'title' => 'Tentang HAMASENSE',
                'subtitle' => 'Misi kami membantu petani & pehobi ...',
            ],
        ]);
    }

    public function articles(Request $request)
    {
        // contoh pagination pakai Eloquent (opsional)
        // $articles = Article::query()
        //     ->select(['id','title','excerpt','cover','slug','published_at'])
        //     ->latest('published_at')
        //     ->paginate(9)
        //     ->onEachSide(1);

        return Inertia::render('articles/index', [
            'navItems' => $this->navItems,
            // 'articles' => [
            //     'data' => $articles->items(),
            //     'current_page' => $articles->currentPage(),
            //     'last_page' => $articles->lastPage(),
            // ],
        ]);
    }

    public function articleShow($slug)
    {
        // 1) DUMMY DATA – bisa dipindah ke file config/ atau service jika mau
        $articles = collect([
            [
                'id' => 42,
                'title' => 'Rotasi Tanaman Efektif untuk Menekan Busuk Daun pada Tomat',
                'slug' => 'rotasi-tanaman-busuk-daun-tomat',
                'excerpt' => 'Panduan praktis menerapkan rotasi tanaman, sanitasi lahan, dan pemantauan mikroklimat…',
                'category' => 'Budidaya',
                'author' => 'Rina Putri',
                'date' => '2025-07-12',
                'image' => '/images/tomato_late_blight.jpg',
                'readingTime' => '6 menit',
                // Konten paragraf
                'body' => [
                    'Rotasi tanaman yang tepat dapat menekan insiden busuk daun pada tomat secara signifikan dengan cara memutus siklus patogen di lahan dan menurunkan inokulum di tanah maupun sisa tanaman. Praktik ini efektif bila dipadukan dengan sanitasi, manajemen kelembapan, dan penggunaan varietas toleran serta fungisida protektan saat kondisi rawan.',
                ],
                // Referensi sumber (untuk anti-hoaks)
                'references' => [
                    [
                        'id' => 1,
                        'source' => 'Food and Agriculture Organization (FAO)',
                        'title' => 'Integrated Pest Management for Tomato: Late Blight',    
                        'author' => 'FAO Plant Production and Protection Division',
                        'url' => 'https://www.fao.org/',
                        'accessedAt' => '2025-11-08',
                    ],
                    [
                        'id' => 2,
                        'source' => 'University Extension',
                        'title' => 'Managing Late Blight in Tomatoes',
                        'author' => 'Dept. of Plant Pathology',
                        'url' => 'https://example-extension.edu/late-blight',
                        'accessedAt' => '2025-11-09',
                    ],
                    [
                        'id' => 3,
                        'source' => 'Journal of Plant Disease Management',
                        'title' => 'Crop Rotation and Disease Suppression in Solanaceae',
                        'author' => 'S. Rahman et al.',
                        'url' => 'https://doi.org/10.0000/jpdm.2025.12345',
                        'accessedAt' => '2025-11-10',
                    ],
                ],
            ],
            // …kalau mau tambah artikel dummy lain di sini
        ]);

        // 2) Cari artikel berdasarkan slug
        $article = $articles->firstWhere('slug', $slug);

        // 3) 404 kalau tidak ketemu (biar siap produksi)
        if (!$article) {
            abort(404);
        }

        // 4) Kirim ke halaman React (Inertia)
        return Inertia::render('articles/show', [
            'navItems' => $this->navItems,
            'article'  => $article,
        ]);
    }
}
