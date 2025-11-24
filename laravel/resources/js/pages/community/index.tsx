    import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
  Search,
  Plus,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MapPin,
  MoreHorizontal,
  BadgeCheck,
  TrendingUp,
  Users,
  MessageSquare,
  Filter,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

// ==========================================
// 1. DUMMY DATA (Untuk Preview Tampilan)
// ==========================================
const POSTS = [
  {
    id: 1,
    user: {
      name: "Budi Hartono",
      username: "@budipetani",
      avatar: "https://i.pravatar.cc/150?u=budi",
      verified: true,
      location: "Malang, Jawa Timur",
    },
    type: "share", // share | ask
    time: "2 jam yang lalu",
    content:
      "Selamat pagi teman-teman! Kemarin saya berhasil mengatasi serangan kutu daun di tanaman tomat menggunakan campuran sabun dan minyak nimba. Hasil sangat memuaskan dalam 3 hari! Ada yang pernah mencoba metode organik lainnya?",
    image: "/images/tomato_early_blight_0026.JPG", // Pakai gambar yg ada di public folder anda
    tags: ["organik", "kutu-daun", "tomat", "tips"],
    stats: { likes: 24, comments: 8, shares: 3 },
    isLiked: false,
  },
  {
    id: 2,
    user: {
      name: "Sari Indrawati",
      username: "@sarigarden",
      avatar: "https://i.pravatar.cc/150?u=sari",
      verified: false,
      location: "Bandung, Jawa Barat",
    },
    type: "ask",
    time: "4 jam yang lalu",
    content:
      "Bantuan dong teman-teman! Tanaman cabai saya daunnya menguning dan ada bintik-bintik putih. Sudah 1 minggu tapi belum membaik. Kira-kira hama apa ya? Dan bagaimana cara mengatasinya?",
    image: null,
    tags: ["cabai", "help", "daun-kuning"],
    stats: { likes: 12, comments: 15, shares: 2 },
    isLiked: true,
  },
];

const CONTRIBUTORS = [
  { rank: 1, name: "Budi Hartono", posts: 45, likes: 234, avatar: "https://i.pravatar.cc/150?u=budi" },
  { rank: 2, name: "Ahmad Fauzi", posts: 38, likes: 189, avatar: "https://i.pravatar.cc/150?u=ahmad" },
  { rank: 3, name: "Sari Indrawati", posts: 29, likes: 156, avatar: "https://i.pravatar.cc/150?u=sari" },
  { rank: 4, name: "Rina Susanti", posts: 24, likes: 134, avatar: "https://i.pravatar.cc/150?u=rina" },
];

const TRENDING_TAGS = [
  "organik", "tomat", "tips", "cabai", "kutu-daun", "pestisida", "ai", "teknologi"
];

// ==========================================
// 2. KOMPONEN: POST CARD
// ==========================================
const PostCard = ({ post }: { post: typeof POSTS[0] }) => {
  return (
    <Card className="mb-4 border-sidebar-border/60 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm">{post.user.name}</span>
              {post.user.verified && (
                <BadgeCheck className="h-4 w-4 text-blue-500" fill="currentColor" color="white" />
              )}
              <span className="text-muted-foreground text-xs">{post.user.username}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              <span className="flex items-center gap-1">
                 <MapPin className="h-3 w-3" /> {post.user.location}
              </span>
              <span>•</span>
              <span>{post.time}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
            {post.type === 'share' ? (
                 <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
                    <Share2 className="w-3 h-3 mr-1" /> Berbagi
                 </Badge>
            ) : (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">
                    <MessageSquare className="w-3 h-3 mr-1" /> Bertanya
                 </Badge>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
            </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3 space-y-3">
        <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
          {post.content}
        </p>
        
        {post.image && (
          <div className="rounded-lg overflow-hidden border bg-muted/30">
             {/* Simulasi Image Error Handling agar tidak pecah */}
             <img 
                src={post.image} 
                alt="Post attachment" 
                className="w-full object-cover max-h-[400px]"
                onError={(e) => {
                    e.currentTarget.src = "https://placehold.co/600x400?text=Gambar+Postingan";
                }}
             />
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs font-medium text-emerald-600 hover:underline cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-3 border-t flex justify-between">
         <div className="flex gap-4">
            <Button variant="ghost" size="sm" className={`gap-1.5 px-2 ${post.isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground'}`}>
                <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                <span className="text-xs">{post.stats.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 px-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs">{post.stats.comments}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1.5 px-2 text-muted-foreground">
                <Share2 className="h-4 w-4" />
                <span className="text-xs">{post.stats.shares}</span>
            </Button>
         </div>
         <Button variant="ghost" size="sm" className="h-8 w-8 px-0 text-muted-foreground">
             <Bookmark className="h-4 w-4" />
         </Button>
      </CardFooter>
    </Card>
  );
};

// ==========================================
// 3. MAIN PAGE
// ==========================================
export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("trending");

  return (
    <AppLayout breadcrumbs={[{ title: "Komunitas Petani", href: "/community" }]}>
      <Head title="Komunitas Petani Indonesia" />

      <div className="flex flex-col gap-6 p-4 md:px-12 max-w-7xl mx-auto w-full">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col gap-1">
             <h1 className="text-2xl font-bold tracking-tight text-foreground">Komunitas Petani</h1>
             <p className="text-muted-foreground text-sm">Berbagi pengalaman, tips, dan solusi bersama sesama petani Indonesia.</p>
        </div>

        {/* SEARCH & ACTION BAR */}
        <div className="flex flex-col md:flex-row gap-3 items-center sticky top-0 z-10 bg-background/95 backdrop-blur py-2">
             <Button className="bg-emerald-600 hover:bg-emerald-700 text-white w-full md:w-auto shadow-md">
                <Plus className="mr-2 h-4 w-4" /> Buat Postingan
             </Button>
             <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari postingan, pengguna, atau tag..."
                  className="pl-9 w-full bg-background border-muted-foreground/20 focus:border-emerald-500"
                />
             </div>
             <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                   <div className="flex items-center gap-2">
                       <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                       <SelectValue placeholder="Kategori" />
                   </div>
                </SelectTrigger>
                <SelectContent>
                   <SelectItem value="all">Semua Kategori</SelectItem>
                   <SelectItem value="share">Tips & Trik</SelectItem>
                   <SelectItem value="ask">Tanya Jawab</SelectItem>
                   <SelectItem value="news">Berita Tani</SelectItem>
                </SelectContent>
             </Select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT CONTENT (FEED) - 8 COLS */}
            <div className="lg:col-span-8 w-full">
                 <Tabs defaultValue="trending" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="mb-4 bg-muted/50 p-1">
                        <TabsTrigger value="trending" className="flex-1">Trending</TabsTrigger>
                        <TabsTrigger value="latest" className="flex-1">Terbaru</TabsTrigger>
                        <TabsTrigger value="following" className="flex-1">Mengikuti</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="trending" className="space-y-4 min-h-[500px]">
                        {POSTS.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </TabsContent>
                    <TabsContent value="latest">
                        <div className="py-8 text-center text-muted-foreground text-sm">Belum ada postingan terbaru.</div>
                    </TabsContent>
                    <TabsContent value="following">
                         <div className="py-8 text-center text-muted-foreground text-sm">Anda belum mengikuti siapapun.</div>
                    </TabsContent>
                 </Tabs>
            </div>

            {/* RIGHT SIDEBAR - 4 COLS */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
                
                {/* 1. STATISTIK KOMUNITAS */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4 text-emerald-600" /> Statistik Komunitas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                         <div className="flex justify-between items-center text-sm">
                             <span className="text-muted-foreground">Total Anggota</span>
                             <span className="font-semibold">12,847</span>
                         </div>
                         <Separator />
                         <div className="flex justify-between items-center text-sm">
                             <span className="text-muted-foreground">Postingan Hari Ini</span>
                             <span className="font-semibold">234</span>
                         </div>
                         <Separator />
                         <div className="flex justify-between items-center text-sm">
                             <span className="text-muted-foreground">Online Sekarang</span>
                             <span className="font-semibold text-emerald-600">1,892</span>
                         </div>
                    </CardContent>
                </Card>

                {/* 2. TOP CONTRIBUTOR */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-emerald-600" /> Kontributor Teratas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {CONTRIBUTORS.map((user) => (
                             <div key={user.rank} className="flex items-center gap-3">
                                 <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white ${
                                     user.rank === 1 ? 'bg-emerald-500' : 
                                     user.rank === 2 ? 'bg-emerald-400' : 
                                     user.rank === 3 ? 'bg-emerald-300' : 'bg-gray-300'
                                 }`}>
                                     {user.rank}
                                 </div>
                                 <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                 </Avatar>
                                 <div className="flex-1 overflow-hidden">
                                     <p className="text-sm font-medium truncate">{user.name}</p>
                                     <p className="text-[10px] text-muted-foreground">{user.posts} posts • {user.likes} likes</p>
                                 </div>
                             </div>
                        ))}
                    </CardContent>
                </Card>

                {/* 3. TRENDING TAGS */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Tag className="h-4 w-4" /> Tag Trending
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {TRENDING_TAGS.map((tag) => (
                                <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-emerald-100 hover:text-emerald-800 transition-colors">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                
                {/* 4. RULES */}
                 <Card className="bg-muted/30 border-dashed">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <BadgeCheck className="h-4 w-4" /> Aturan Komunitas
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs text-muted-foreground">
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Saling menghormati sesama anggota</li>
                            <li>Berbagi informasi yang akurat</li>
                            <li>Tidak spam atau promosi berlebihan</li>
                            <li>Gunakan bahasa yang sopan</li>
                        </ul>
                        <Button variant="link" className="h-auto p-0 text-xs text-emerald-600">
                            Baca Selengkapnya
                        </Button>
                    </CardContent>
                </Card>

            </div>
        </div>
      </div>
    </AppLayout>
  );
}