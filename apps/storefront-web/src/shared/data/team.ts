// Team members and company values for the About page

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  accent: string;
}

export interface CompanyValue {
  icon: string;
  title: string;
  desc: string;
}

export const TEAM: TeamMember[] = [
  {
    name: "I Gede Bayu Pamungkas",
    role: "Frontend Developer",
    bio: "Bayu membangun tampilan Novarium dari nol — dari arsitektur komponen Next.js hingga animasi micro-interaction yang membuat pengalaman belanja terasa premium dan mulus.",
    avatar: "https://ghdadhlyhzdkrjlurifj.supabase.co/storage/v1/object/public/Developer/Bayu.jpeg",
    accent: "#9cad8f",
  },
  {
    name: "Fifin Agustiana",
    role: "UI/UX Designer",
    bio: "Fifin adalah otak di balik identitas visual Novarium. Dengan pendekatan user-centered design, setiap pixel dirancang untuk menciptakan estetika yang intuitif dan elegan.",
    avatar: "https://ghdadhlyhzdkrjlurifj.supabase.co/storage/v1/object/public/Developer/Fifin.png",
    accent: "#9b51e0",
  },
  {
    name: "Safdar Rahman",
    role: "Backend Developer",
    bio: "Rahman membangun fondasi teknis Novarium — dari arsitektur microservices, integrasi payment gateway Midtrans, hingga sistem manajemen pesanan yang andal.",
    avatar: "https://ghdadhlyhzdkrjlurifj.supabase.co/storage/v1/object/public/Developer/Rahman.png",
    accent: "#e05177",
  },
  {
    name: "Zilal Afwu Rahman",
    role: "DevOps Engineer",
    bio: "Zilal memastikan Novarium selalu online dan scalable — mengelola containerisasi Docker, pipeline deployment, dan infrastruktur yang menjaga layanan tetap stabil.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    accent: "#27ae60",
  },
];

export const VALUES: CompanyValue[] = [
  { icon: "✦", title: "Craftsmanship", desc: "Setiap produk dibuat dengan presisi tinggi — dari pemilihan benang pertama hingga proses finishing terakhir." },
  { icon: "◆", title: "Sustainability", desc: "Produksi yang bertanggung jawab bertemu dengan desain modern, dirancang untuk bertahan lebih dari satu musim." },
  { icon: "●", title: "Inovasi", desc: "Kami terus mendorong batas dalam teknologi kain, ilmu pencocokan ukuran, dan pengalaman berbelanja." },
  { icon: "▲", title: "Komunitas", desc: "Novarium bukan sekadar merek — ini adalah budaya dari mereka yang menolak untuk menjadi biasa." },
];
