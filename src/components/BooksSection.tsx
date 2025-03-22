
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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
    isNew: true
  }
];

const BooksSection = () => {
  // Observer for scroll animations
  React.useEffect(() => {
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
  }, []);

  return (
    <section className="section-padding bg-white">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="text-center mb-16 reveal-on-scroll">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">مكتبتنا</Badge>
          <h2 className="text-4xl font-bold mb-6">أحدث الكتب المتخصصة</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            مجموعة مختارة من أفضل الكتب المتخصصة في مجالات البيزنس والمبيعات والتسويق لتطوير مهاراتك ومعرفتك
          </p>
        </div>

        {/* Books grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {BOOKS.map((book, index) => (
            <BookCard key={book.id} book={book} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 reveal-on-scroll">
          <Link to="/books">
            <Button className="bg-primary hover:bg-primary-light text-white px-8 py-6 rounded-xl flex items-center space-x-2 rtl:space-x-reverse mx-auto shadow-lg hover:shadow-xl transition-all">
              <span className="text-lg">عرض جميع الكتب</span>
              <ArrowLeft size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
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
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
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

export default BooksSection;
