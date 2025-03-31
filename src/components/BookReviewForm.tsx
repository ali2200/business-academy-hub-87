
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BookReviewFormProps {
  bookId: string;
  onReviewSubmitted: () => void;
}

interface ReviewFormData {
  review: string;
}

const BookReviewForm = ({ bookId, onReviewSubmitted }: BookReviewFormProps) => {
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormData>();
  
  // Submit the review
  const onSubmit = async (data: ReviewFormData) => {
    try {
      setIsSubmitting(true);
      
      // Check if user is authenticated
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("يجب تسجيل الدخول لإضافة تقييم");
        return;
      }
      
      // Submit the review using a direct query since types aren't updated yet
      const { error } = await supabase.rpc('create_book_review', {
        p_book_id: bookId,
        p_user_id: session.session.user.id,
        p_rating: rating,
        p_review_text: data.review
      });
      
      if (error) {
        console.error('Error submitting review:', error);
        if (error.code === '23505') {
          toast.error("لقد قمت بتقييم هذا الكتاب من قبل");
        } else {
          toast.error("حدث خطأ أثناء إرسال التقييم");
        }
        return;
      }
      
      toast.success("تم إرسال تقييمك بنجاح");
      reset();
      setRating(5);
      onReviewSubmitted();
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error("حدث خطأ غير متوقع");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-gray-700 mb-2">التقييم</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star 
                className={`h-8 w-8 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
              />
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label htmlFor="review" className="block text-gray-700 mb-2">التعليق</label>
        <Textarea
          id="review"
          {...register('review', { required: 'التعليق مطلوب' })}
          placeholder="اكتب تعليقك هنا..."
          rows={4}
          className={errors.review ? 'border-red-500' : ''}
        />
        {errors.review && (
          <p className="text-red-500 text-sm mt-1">{errors.review.message}</p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className="bg-primary hover:bg-primary-dark" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
      </Button>
    </form>
  );
};

export default BookReviewForm;
