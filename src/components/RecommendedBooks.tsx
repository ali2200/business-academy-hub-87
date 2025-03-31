
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
        
        // Try to get recommendations from the recommendations table
        const { data: recommendedBooks, error: recommendationsError } = await supabase
          .from('book_recommendations')
          .select('recommended_book_id')
          .eq('book_id', bookId)
          .limit(4);
        
        if (recommendationsError) {
          console.error('Error fetching recommendations:', recommendationsError);
        }
        
        if (recommendedBooks && recommendedBooks.length > 0) {
          // If recommendations exist, fetch the book details
          const recommendedIds = recommendedBooks.map(item => item.recommended_book_id);
          
          const { data: booksData, error: booksError } = await supabase
            .from('books')
            .select('*')
            .in('id', recommendedIds)
            .eq('status', 'published')
            .limit(4);
          
          if (booksError) {
            console.error('Error fetching recommended books:', booksError);
          } else if (booksData) {
            setBooks(booksData);
          }
        } else {
          // If no recommendations, fetch books by category
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
            <Link to={`/book/${book.id}`}>
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
