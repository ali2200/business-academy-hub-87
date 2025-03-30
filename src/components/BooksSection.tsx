import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useContent } from "@/hooks/use-content";

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
  const { content, loading } = useContent('books');
  
  // Default content
  const defaultContent = {
    title: 'أحدث الكتب المتخصصة',
    subtitle: 'مجموعة مختارة من أفضل الكتب المتخصصة في مجالات البيزنس والمبيعات والتسويق',
    button_text: 'عرض جميع الكتب',
    badge_text: 'مكتبتنا'
  };

  // Merge default content with loaded content
  const booksContent = {
    ...defaultContent,
    ...content
  };

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
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-16 reveal-on-scroll">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-3 md:mb-4">{booksContent.badge_text}</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6">{booksContent.title}</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            {booksContent.subtitle}
          </p>
        </div>

        {/* Books grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
          {BOOKS.map((book, index) => (
            <BookCard key={book.id} book={book} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 md:mt-16 reveal-on-scroll">
          <Link to="/books">
            <Button className="bg-primary hover:bg-primary-light text-white px-6 py-5 md:px-8 md:py-6 rounded-xl flex items-center space-x-2 rtl:space-x-reverse mx-auto shadow-lg hover:shadow-xl transition-all text-base md:text-lg">
              <span>{booksContent.button_text}</span>
              <ArrowLeft size={18} />
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
        <div className="relative h-48 sm:h-60 md:h-64 lg:h-[320px] overflow-hidden">
          <img 
            src={book.cover} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 md:p-6">
            <Link to={`/books/${book.id}`}>
              <Button size="sm" className="bg-white text-primary hover:bg-primary hover:text-white transition-all mb-2 md:mb-4 text-xs md:text-sm">
                عرض التفاصيل
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 md:gap-2">
          {book.isBestseller && (
            <span className="bg-secondary text-white text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full whitespace-nowrap">
              الأكثر مبيعًا
            </span>
          )}
          {book.isNew && (
            <span className="bg-green-500 text-white text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full">
              جديد
            </span>
          )}
        </div>
      </div>
      
      <CardContent className="p-3 md:p-4 text-center">
        <h3 className="text-base md:text-xl font-bold text-primary mb-0.5 md:mb-1 line-clamp-1">{book.title}</h3>
        <p className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2">{book.author}</p>
        
        {/* Rating */}
        <div className="flex items-center justify-center space-x-1 rtl:space-x-reverse mb-2 md:mb-3">
          <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-xs md:text-sm font-medium">{book.rating}</span>
          <span className="text-[10px] md:text-xs text-gray-500">({book.reviewCount})</span>
        </div>
        
        {/* Book details */}
        <div className="flex justify-center text-[10px] md:text-sm text-gray-500 mb-2 md:mb-3">
          <div className="flex items-center">
            <BookOpen size={12} className="ml-1" />
            <span>{book.pages} صفحة</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 md:p-4 pt-0 flex justify-between items-center border-t border-gray-100">
        <div>
          <span className="text-secondary font-bold text-sm md:text-xl">{book.price} ج.م</span>
        </div>
        <Link to={`/books/${book.id}`}>
          <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs md:text-sm">
            اشتري الآن
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BooksSection;
