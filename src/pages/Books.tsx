
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, BookOpen, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

// Mock data for books
const BOOKS = [
  {
    id: 1,
    title: 'أسرار البيع الناجح',
    author: 'د. أحمد محمد',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1974&auto=format&fit=crop',
    price: 199,
    rating: 4.8,
    reviewCount: 124,
    description: 'كتاب شامل يكشف أسرار وتقنيات البيع الاحترافي ومهارات الإقناع والتفاوض',
    pages: 280,
    category: 'مبيعات',
    isBestseller: true
  },
  {
    id: 2,
    title: 'استراتيجيات التسويق الحديثة',
    author: 'م. سارة أحمد',
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=2730&auto=format&fit=crop',
    price: 229,
    rating: 4.6,
    reviewCount: 87,
    description: 'دليلك الشامل لاستراتيجيات التسويق الرقمي والتقليدي لنمو الأعمال في السوق المصري',
    pages: 320,
    category: 'تسويق',
    isNew: true
  },
  {
    id: 3,
    title: 'من الصفر إلى المليون',
    author: 'م. محمد علي',
    cover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1776&auto=format&fit=crop',
    price: 249,
    rating: 4.9,
    reviewCount: 156,
    description: 'رحلة من الصفر لبناء مشروع ناجح وتحقيق الثروة في السوق المصري',
    pages: 350,
    category: 'ريادة أعمال',
    isBestseller: true
  },
  {
    id: 4,
    title: 'قواعد الإدارة الناجحة',
    author: 'د. أمير حسن',
    cover: 'https://images.unsplash.com/photo-1585521551452-b228136cc626?q=80&w=1974&auto=format&fit=crop',
    price: 179,
    rating: 4.5,
    reviewCount: 68,
    description: 'كتاب يشرح أسس ومبادئ الإدارة الناجحة وكيفية تطبيقها في الشركات والمؤسسات',
    pages: 240,
    category: 'إدارة',
    isNew: true
  },
  {
    id: 5,
    title: 'فن التفاوض في عالم الأعمال',
    author: 'د. سامي حسن',
    cover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2070&auto=format&fit=crop',
    price: 159,
    rating: 4.7,
    reviewCount: 93,
    description: 'تعلم أساسيات وتقنيات التفاوض الناجح في مختلف المواقف التجارية',
    pages: 220,
    category: 'مبيعات',
    isBestseller: true
  },
  {
    id: 6,
    title: 'إدارة المشاريع الصغيرة',
    author: 'م. خالد أحمد',
    cover: 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=1974&auto=format&fit=crop',
    price: 189,
    rating: 4.4,
    reviewCount: 57,
    description: 'دليل عملي لإدارة المشاريع الصغيرة من الفكرة إلى التنفيذ والنجاح',
    pages: 260,
    category: 'ريادة أعمال',
    isNew: true
  },
  {
    id: 7,
    title: 'أسرار التسويق الرقمي',
    author: 'د. سارة أحمد',
    cover: 'https://images.unsplash.com/photo-1618365908648-e71bd5716cba?q=80&w=2070&auto=format&fit=crop',
    price: 219,
    rating: 4.9,
    reviewCount: 112,
    description: 'دليلك الشامل للتسويق الرقمي عبر مختلف المنصات بخطوات عملية واضحة',
    pages: 310,
    category: 'تسويق',
    isBestseller: true
  },
  {
    id: 8,
    title: 'كيف تبني علامة تجارية ناجحة',
    author: 'أ. هاني محمود',
    cover: 'https://images.unsplash.com/photo-1519811170192-85eacae209da?q=80&w=2070&auto=format&fit=crop',
    price: 239,
    rating: 4.6,
    reviewCount: 78,
    description: 'خطوات بناء علامة تجارية قوية ومؤثرة في السوق من الصفر',
    pages: 290,
    category: 'تسويق',
    isNew: true
  }
];

// Categories
const CATEGORIES = ['الكل', 'مبيعات', 'تسويق', 'إدارة', 'ريادة أعمال', 'تطوير ذاتي'];

const Books = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]);
  const [filteredBooks, setFilteredBooks] = useState(BOOKS);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = BOOKS;

    // Search filter
    if (searchTerm) {
      result = result.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'الكل') {
      result = result.filter(book => book.category === selectedCategory);
    }

    // Price filter
    result = result.filter(book => 
      book.price >= priceRange[0] && book.price <= priceRange[1]
    );

    setFilteredBooks(result);
  }, [searchTerm, selectedCategory, priceRange]);

  // Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
      observer.observe(el);
    });

    return () => {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        observer.unobserve(el);
      });
    };
  }, [filteredBooks]);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16 animated-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">مكتبتنا</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">كتب متخصصة في مجالات البيزنس</h1>
            <p className="text-gray-600 mb-8">
              تصفح مجموعة متميزة من الكتب المتخصصة في مجالات البيزنس والمبيعات والتسويق
            </p>
            
            {/* Search bar */}
            <div className="relative max-w-lg mx-auto mb-8">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                type="text" 
                placeholder="ابحث عن كتاب..." 
                className="py-6 pr-10 rounded-xl border-gray-300 focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Books listing */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters - Mobile Toggle */}
            <div className="lg:hidden w-full mb-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                <span>{showFilters ? 'إخفاء الفلاتر' : 'عرض الفلاتر'}</span>
              </Button>
            </div>
            
            {/* Filters sidebar */}
            <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h3 className="text-xl font-bold mb-6 text-primary">تصفية النتائج</h3>
                
                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">التصنيفات</h4>
                  <div className="space-y-2">
                    {CATEGORIES.map(category => (
                      <button
                        key={category}
                        className={`block w-full text-right py-1 px-2 rounded-md transition-colors ${
                          selectedCategory === category 
                            ? 'bg-primary text-white' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Price range */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">السعر</h4>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 300]}
                      max={300}
                      step={10}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-2"
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>{priceRange[0]} ج.م</span>
                      <span>{priceRange[1]} ج.م</span>
                    </div>
                  </div>
                </div>
                
                {/* Reset filters */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('الكل');
                    setPriceRange([0, 300]);
                  }}
                >
                  إعادة تعيين الفلاتر
                </Button>
              </div>
            </div>
            
            {/* Books grid */}
            <div className="lg:w-3/4">
              {filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredBooks.map((book, index) => (
                    <BookCard key={book.id} book={book} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                  <h3 className="text-xl font-bold mb-2">لا توجد نتائج</h3>
                  <p className="text-gray-600">لم نتمكن من العثور على كتب تطابق معايير البحث الخاصة بك</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

type BookCardProps = {
  book: typeof BOOKS[0];
  index: number;
};

const BookCard = ({ book, index }: BookCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-card hover:shadow-hover transition-all duration-500 card-hover reveal-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="relative group">
        {/* Cover image with overlay */}
        <div className="relative h-[320px] overflow-hidden">
          <img 
            src={book.cover} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
            <Link to={`/books/${book.id}`}>
              <Button className="bg-white text-primary hover:bg-primary hover:text-white transition-all mb-4">
                عرض التفاصيل
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {book.isBestseller && (
            <span className="bg-secondary text-white text-xs px-3 py-1 rounded-full">
              الأكثر مبيعًا
            </span>
          )}
          {book.isNew && (
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
              جديد
            </span>
          )}
        </div>
      </div>
      
      <CardContent className="p-4 text-center">
        <h3 className="text-xl font-bold text-primary mb-1 line-clamp-1">{book.title}</h3>
        <p className="text-gray-600 mb-2">{book.author}</p>
        
        {/* Rating */}
        <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse mb-3">
          <div className="text-yellow-400 flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={16}
                className={i < Math.floor(book.rating) ? "fill-yellow-400" : "fill-gray-300"}
              />
            ))}
          </div>
          <span className="text-sm font-medium">{book.rating}</span>
          <span className="text-xs text-gray-500">({book.reviewCount} تقييم)</span>
        </div>
        
        {/* Book details */}
        <div className="flex justify-center text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <BookOpen size={16} className="ml-1" />
            <span>{book.pages} صفحة</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t border-gray-100">
        <div>
          <span className="text-secondary font-bold text-xl">{book.price} ج.م</span>
        </div>
        <Link to={`/books/${book.id}`}>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-all">
            اشتري الآن
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Books;
