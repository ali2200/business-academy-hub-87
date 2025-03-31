
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen } from 'lucide-react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface Book {
  id: string;
  title: string;
  author: string;
  cover_url: string;
  price: number;
  currency: string;
  pages: number;
}

interface RecommendedBooksProps {
  bookId: string;
  category?: string;
}

const RecommendedBooks = ({ bookId, category }: RecommendedBooksProps) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        setIsLoading(true);
        
        // Using a stored procedure to get recommendations since types are not updated
        const { data: recommendedBooks, error } = await supabase.rpc('get_recommended_books', {
          p_book_id: bookId,
          p_limit: 4
        });
        
        if (error) {
          console.error('Error fetching recommendations:', error);
          
          // If no recommendations, fetch books by category as fallback
          const { data: similarBooks, error: similarBooksError } = await supabase
            .from('books')
            .select('*')
            .eq('status', 'published')
            .eq(category ? 'category' : 'id', category || bookId) // Use category if provided
            .neq('id', bookId) // Exclude current book
            .order('created_at', { ascending: false })
            .limit(4);
          
          if (similarBooksError) {
            console.error('Error fetching similar books:', similarBooksError);
          } else if (similarBooks) {
            setBooks(similarBooks);
          }
        } else if (recommendedBooks) {
          setBooks(recommendedBooks);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedBooks();
  }, [bookId, category]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse bg-gray-100 h-80"></Card>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return null; // Don't show the section if no recommendations
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <Card key={book.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="relative h-52">
            <img 
              src={book.cover_url || `https://source.unsplash.com/random/600x900?book,${book.id}`} 
              alt={book.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
          
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold text-primary mb-1 line-clamp-1">{book.title}</h3>
            <p className="text-gray-600 text-sm mb-2">{book.author}</p>
            
            <div className="flex justify-center text-yellow-400 mb-2">
              <Star className="w-4 h-4 fill-yellow-400" />
              <span className="text-sm font-medium mr-1">4.5</span>
            </div>
            
            <div className="flex justify-center text-sm text-gray-500 mb-2">
              <BookOpen size={16} className="ml-1" />
              <span>{book.pages || '250'} صفحة</span>
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <span className="text-secondary font-bold">{book.price} {book.currency}</span>
            <Link to={`/books/${book.id}`}>
              <Button 
                variant="outline" 
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-white"
              >
                عرض
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default RecommendedBooks;
