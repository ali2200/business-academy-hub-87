
import React, { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import BookReviewForm from './BookReviewForm';

interface Review {
  id: string;
  user_id: string;
  rating: number;
  review_text: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
}

interface BookReviewsProps {
  bookId: string;
}

const BookReviews = ({ bookId }: BookReviewsProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      
      // Using a stored procedure to get reviews since types are not updated
      const { data, error } = await supabase.rpc('get_book_reviews', {
        p_book_id: bookId
      });
      
      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }
      
      // Calculate average rating
      if (data && data.length > 0) {
        const sum = data.reduce((acc: number, review: any) => acc + review.rating, 0);
        setAverageRating(sum / data.length);
        setReviewsCount(data.length);
        
        // Fetch user information for each review
        const reviewsWithUserInfo = await Promise.all(
          data.map(async (review: any) => {
            // Fetch user profile
            const { data: profileData } = await supabase
              .from('profiles')
              .select('display_name, email')
              .eq('id', review.user_id)
              .single();
            
            return {
              ...review,
              user_name: profileData?.display_name || 'مستخدم',
              user_email: profileData?.email
            };
          })
        );
        
        setReviews(reviewsWithUserInfo);
      } else {
        setReviews([]);
        setAverageRating(0);
        setReviewsCount(0);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchReviews();
  }, [bookId]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  const handleReviewSubmitted = () => {
    fetchReviews(); // Refresh reviews after submission
  };

  return (
    <div className="space-y-8">
      {/* Rating summary */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        <div className="bg-gray-50 p-6 rounded-lg text-center flex-shrink-0">
          <div className="text-5xl font-bold text-primary mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center text-yellow-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={18}
                className={i < Math.floor(averageRating) ? "fill-yellow-400" : "fill-gray-300"}
              />
            ))}
          </div>
          <div className="text-gray-500">{reviewsCount} تقييم</div>
        </div>
        
        <div className="flex-grow">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4">جاري تحميل التقييمات...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = reviews.filter(r => r.rating === rating).length;
                const percentage = (count / reviewsCount) * 100;
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <div className="w-12 text-sm text-right">{rating} نجوم</div>
                    <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm text-left">{count}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-12">
              لا توجد تقييمات لهذا الكتاب حالياً، كن أول من يقيم هذا الكتاب
            </p>
          )}
        </div>
      </div>
      
      {/* Add review form */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-bold mb-4">أضف تقييمك</h3>
        <BookReviewForm bookId={bookId} onReviewSubmitted={handleReviewSubmitted} />
      </div>
      
      {/* Reviews list */}
      {reviews.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold mb-4">التقييمات</h3>
          {reviews.map(review => (
            <div key={review.id} className="border-b border-gray-200 pb-6 mb-6">
              <div className="flex items-start">
                <div className="bg-gray-100 rounded-full p-3 mr-4">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <h4 className="font-semibold text-lg ml-2">{review.user_name}</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16}
                          className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-gray-500 text-sm mb-2">
                    {formatDate(review.created_at)}
                  </div>
                  <p className="text-gray-700">{review.review_text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookReviews;
