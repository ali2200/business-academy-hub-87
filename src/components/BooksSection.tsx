
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Star, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useContent } from "@/hooks/use-content";
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

const BooksSection = () => {
  const { content, loading } = useContent('books');
  
  // Fetch real books data from Supabase
  const { data: books, isLoading: isBooksLoading } = useQuery({
    queryKey: ['homepage-books'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) {
        console.error('Error fetching books:', error);
        throw error;
      }
      
      return data || [];
    }
  });
  
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

  // Use fallback data if no books are loaded yet
  const displayBooks = books && books.length > 0 ? books : [];

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
        {isBooksLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden border-none shadow-card hover:shadow-hover transition-all duration-500">
                <div className="h-48 sm:h-60 md:h-64 lg:h-[320px] bg-gray-200 animate-pulse"></div>
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="h-6 bg-gray-200 animate-pulse mb-2 rounded"></div>
                  <div className="h-4 bg-gray-200 animate-pulse mb-2 rounded w-2/3 mx-auto"></div>
                  <div className="flex justify-center mt-3 space-x-1 rtl:space-x-reverse">
                    {[...Array(5)].map((_, j) => (
                      <div key={j} className="w-4 h-4 bg-gray-200 animate-pulse rounded-full"></div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-3 md:p-4 pt-0 flex justify-between items-center">
                  <div className="h-6 bg-gray-200 animate-pulse w-16 rounded"></div>
                  <div className="h-8 bg-gray-200 animate-pulse w-24 rounded"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : displayBooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-8">
            {displayBooks.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">لا توجد كتب متاحة حالياً</p>
          </div>
        )}

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
  book: any;
  index: number;
};

const BookCard = ({ book, index }: BookCardProps) => {
  // Determine if book is new based on creation date (within last 30 days)
  const isNew = new Date(book.created_at).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;
  
  // Determine if book is bestseller (simple logic based on purchases count)
  const isBestseller = book.purchases_count && book.purchases_count > 50;

  // Fallback rating information
  const rating = 4.7;
  const reviewCount = 85;

  return (
    <Card className="overflow-hidden border-none shadow-card hover:shadow-hover transition-all duration-500 card-hover reveal-on-scroll" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="relative group">
        {/* Cover image with overlay */}
        <div className="relative h-48 sm:h-60 md:h-64 lg:h-[320px] overflow-hidden">
          <img 
            src={book.cover_url || `https://source.unsplash.com/random/600x900?book,${book.id}`} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
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
          {isBestseller && (
            <span className="bg-secondary text-white text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full whitespace-nowrap">
              الأكثر مبيعًا
            </span>
          )}
          {isNew && (
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
          <span className="text-xs md:text-sm font-medium">{rating}</span>
          <span className="text-[10px] md:text-xs text-gray-500">({reviewCount})</span>
        </div>
        
        {/* Book details */}
        <div className="flex justify-center text-[10px] md:text-sm text-gray-500 mb-2 md:mb-3">
          <div className="flex items-center">
            <BookOpen size={12} className="ml-1" />
            <span>{book.pages || 250} صفحة</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 md:p-4 pt-0 flex justify-between items-center border-t border-gray-100">
        <div>
          <span className="text-secondary font-bold text-sm md:text-xl">{book.price} {book.currency}</span>
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
