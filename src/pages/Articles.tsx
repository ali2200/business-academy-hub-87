
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ChevronLeft, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import Navbar from '@/components/Navbar';

// Mock articles data
const ARTICLES_DATA = [
  {
    id: "1",
    title: "10 استراتيجيات لزيادة المبيعات في 2023",
    excerpt: "تعرف على أفضل استراتيجيات زيادة المبيعات التي يمكنك تطبيقها في عملك التجاري لتحقيق نمو ملحوظ في الإيرادات خلال عام 2023.",
    author: "أحمد محمد",
    date: "15 مايو 2023",
    readTime: "8 دقائق",
    category: "المبيعات",
    tags: ["مبيعات", "استراتيجيات", "تسويق"],
    image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "كيف تبني علاقات قوية مع العملاء",
    excerpt: "العلاقات القوية مع العملاء هي أساس نجاح أي عمل تجاري. اكتشف كيفية بناء وتعزيز هذه العلاقات للحفاظ على ولاء العملاء على المدى الطويل.",
    author: "سارة أحمد",
    date: "3 يونيو 2023",
    readTime: "6 دقائق",
    category: "خدمة العملاء",
    tags: ["علاقات العملاء", "ولاء العملاء", "خدمة العملاء"],
    image: "https://images.unsplash.com/photo-1525130413817-d45c1d127c42?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "أساسيات التسويق عبر وسائل التواصل الاجتماعي",
    excerpt: "دليل شامل لأساسيات التسويق عبر منصات التواصل الاجتماعي المختلفة، وكيفية الاستفادة منها لتعزيز وجودك الرقمي وزيادة المبيعات.",
    author: "محمد علي",
    date: "20 أبريل 2023",
    readTime: "10 دقائق",
    category: "التسويق الرقمي",
    tags: ["تسويق رقمي", "وسائل التواصل الاجتماعي", "فيسبوك", "انستغرام"],
    image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "تحديات ريادة الأعمال في العالم العربي",
    excerpt: "نظرة معمقة على التحديات التي تواجه رواد الأعمال في العالم العربي، وكيفية التغلب عليها لبناء شركات ناجحة ومستدامة.",
    author: "ليلى محمود",
    date: "10 يوليو 2023",
    readTime: "12 دقيقة",
    category: "ريادة الأعمال",
    tags: ["ريادة أعمال", "تحديات", "حلول", "نجاح"],
    image: "https://images.unsplash.com/photo-1664575599618-8f6bd76fc670?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "5",
    title: "كيفية إعداد خطة تسويقية فعالة",
    excerpt: "دليل خطوة بخطوة لإعداد خطة تسويقية متكاملة وفعالة تساعدك على تحقيق أهدافك التسويقية وزيادة وصولك لجمهورك المستهدف.",
    author: "مصطفى كمال",
    date: "5 أغسطس 2023",
    readTime: "9 دقائق",
    category: "التسويق",
    tags: ["خطة تسويق", "استراتيجية", "تخطيط"],
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "تقنيات التفاوض الفعال في مجال الأعمال",
    excerpt: "اكتشف أهم تقنيات واستراتيجيات التفاوض الفعال التي يمكنك استخدامها في صفقاتك التجارية لتحقيق نتائج أفضل والحصول على ما تريد.",
    author: "عمرو خالد",
    date: "22 سبتمبر 2023",
    readTime: "7 دقائق",
    category: "مهارات الأعمال",
    tags: ["تفاوض", "صفقات", "مهارات"],
    image: "https://images.unsplash.com/photo-1573496546036-d67bef578c2b?q=80&w=2069&auto=format&fit=crop",
  },
];

// Mock categories
const CATEGORIES = [
  { name: "المبيعات", count: 12 },
  { name: "التسويق", count: 18 },
  { name: "التسويق الرقمي", count: 9 },
  { name: "خدمة العملاء", count: 7 },
  { name: "ريادة الأعمال", count: 15 },
  { name: "مهارات الأعمال", count: 11 },
];

// Mock popular tags
const POPULAR_TAGS = [
  "مبيعات", "تسويق", "ريادة أعمال", "تطوير الذات", "إدارة الوقت", 
  "تسويق رقمي", "وسائل التواصل الاجتماعي", "خدمة العملاء", "تحفيز"
];

const Articles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Filter articles based on search, category, and tag
  const filteredArticles = ARTICLES_DATA.filter(article => {
    const matchesSearch = searchQuery === "" || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === null || 
      article.category === selectedCategory;
    
    const matchesTag = selectedTag === null || 
      article.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero section */}
          <section className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">مقالات بيزنس أكاديمي</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              مقالات متخصصة في عالم الأعمال، المبيعات، والتسويق لمساعدتك على النمو والنجاح في مجالك
            </p>
            
            <div className="mt-8 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="search"
                  placeholder="ابحث عن مقالة..."
                  className="pl-4 pr-10 py-6 text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </section>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="space-y-8 sticky top-28">
                {/* Categories section */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">التصنيفات</h3>
                  <ul className="space-y-2">
                    <li>
                      <button 
                        onClick={() => setSelectedCategory(null)}
                        className={`w-full text-right py-2 px-3 rounded-md transition-colors ${
                          selectedCategory === null ? 'bg-primary text-white' : 'hover:bg-gray-100'
                        }`}
                      >
                        جميع المقالات
                      </button>
                    </li>
                    {CATEGORIES.map(category => (
                      <li key={category.name}>
                        <button 
                          onClick={() => setSelectedCategory(category.name)}
                          className={`w-full text-right py-2 px-3 rounded-md transition-colors ${
                            selectedCategory === category.name ? 'bg-primary text-white' : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>{category.name}</span>
                            <span className={`${
                              selectedCategory === category.name ? 'bg-white text-primary' : 'bg-gray-100'
                            } text-xs px-2 py-1 rounded-full`}>
                              {category.count}
                            </span>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Popular tags */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold text-primary mb-4">الوسوم الشائعة</h3>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR_TAGS.map(tag => (
                      <Badge 
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        className="cursor-pointer text-sm py-1 px-3"
                        onClick={() => selectedTag === tag ? setSelectedTag(null) : setSelectedTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main content */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              {/* Filtered results info */}
              {(selectedCategory || selectedTag || searchQuery) && (
                <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-600">نتائج البحث: </span>
                      <span className="font-medium">{filteredArticles.length} مقالة</span>
                      
                      {selectedCategory && (
                        <Badge className="mr-2 bg-primary">
                          {selectedCategory}
                          <button 
                            className="mr-1 ml-1 focus:outline-none" 
                            onClick={() => setSelectedCategory(null)}
                          >
                            ×
                          </button>
                        </Badge>
                      )}
                      
                      {selectedTag && (
                        <Badge className="mr-2 bg-primary">
                          {selectedTag}
                          <button 
                            className="mr-1 ml-1 focus:outline-none" 
                            onClick={() => setSelectedTag(null)}
                          >
                            ×
                          </button>
                        </Badge>
                      )}
                      
                      {searchQuery && (
                        <Badge className="mr-2 bg-primary">
                          "{searchQuery}"
                          <button 
                            className="mr-1 ml-1 focus:outline-none" 
                            onClick={() => setSearchQuery("")}
                          >
                            ×
                          </button>
                        </Badge>
                      )}
                    </div>
                    
                    {(selectedCategory || selectedTag || searchQuery) && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedCategory(null);
                          setSelectedTag(null);
                          setSearchQuery("");
                        }}
                      >
                        إعادة ضبط
                      </Button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Articles grid */}
              {filteredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredArticles.map(article => (
                    <article key={article.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      
                      <div className="p-6">
                        <Badge variant="secondary" className="mb-3">
                          {article.category}
                        </Badge>
                        
                        <h2 className="text-xl font-bold text-primary mb-3 hover:text-secondary transition-colors line-clamp-2">
                          <Link to={`/articles/${article.id}`}>
                            {article.title}
                          </Link>
                        </h2>
                        
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-gray-500 text-sm">
                          <div className="flex items-center">
                            <User size={14} className="ml-1" />
                            <span>{article.author}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar size={14} className="ml-1" />
                            <span>{article.date}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock size={14} className="ml-1" />
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                        
                        <div className="mt-5 pt-5 border-t border-gray-100 flex justify-between items-center">
                          <div className="flex flex-wrap gap-1">
                            {article.tags.slice(0, 2).map(tag => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="text-xs cursor-pointer"
                                onClick={() => setSelectedTag(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                            {article.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">+{article.tags.length - 2}</Badge>
                            )}
                          </div>
                          
                          <Link to={`/articles/${article.id}`} className="flex items-center text-primary hover:text-secondary transition-colors text-sm font-medium">
                            <span>اقرأ المزيد</span>
                            <ChevronLeft size={16} className="mr-1" />
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                  <h3 className="text-xl font-bold mb-2 text-primary">لا توجد نتائج</h3>
                  <p className="text-gray-600 mb-6">لم يتم العثور على مقالات تطابق معايير البحث</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedTag(null);
                      setSearchQuery("");
                    }}
                  >
                    عرض جميع المقالات
                  </Button>
                </div>
              )}
              
              {/* Pagination */}
              {filteredArticles.length > 0 && (
                <Pagination className="mt-12">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">
                        2
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">
                        3
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Articles;
