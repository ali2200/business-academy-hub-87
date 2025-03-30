
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock } from 'lucide-react';

interface CourseCardProps {
  id: string;
  title: string;
  description?: string;
  instructor: string;
  image?: string;
  price: number;
  currency: string;
  category?: string;
  level?: string;
  duration?: string;
  students?: number;
  isNew?: boolean;
  isHot?: boolean;
}

export const CourseCard = ({
  id,
  title,
  description,
  instructor,
  image,
  price,
  currency,
  category,
  level,
  duration,
  students = 0,
  isNew = false,
  isHot = false
}: CourseCardProps) => {
  
  // Map category code to Arabic display name
  const getCategoryName = (categoryCode?: string): string => {
    if (!categoryCode) return 'عام';
    
    const categoryMap: {[key: string]: string} = {
      'sales': 'مبيعات',
      'marketing': 'تسويق',
      'business': 'إدارة',
      'entrepreneurship': 'ريادة أعمال',
      'development': 'تطوير ذاتي'
    };
    
    return categoryMap[categoryCode] || categoryCode;
  };
  
  // Map level code to Arabic display name
  const getLevelName = (levelCode?: string): string => {
    if (!levelCode) return 'عام';
    
    const levelMap: {[key: string]: string} = {
      'beginner': 'مبتدئ',
      'intermediate': 'متوسط',
      'advanced': 'متقدم',
      'all': 'جميع المستويات'
    };
    
    return levelMap[levelCode] || levelCode;
  };

  return (
    <Card className="overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500">
      {/* Image */}
      <div className="relative overflow-hidden h-40 md:h-48">
        <img 
          src={image || `https://source.unsplash.com/random/400x300?business,${id}`} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 md:gap-2">
          {isHot && (
            <span className="bg-red-500 text-white text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full">
              الأكثر مبيعًا
            </span>
          )}
          {isNew && (
            <span className="bg-green-500 text-white text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full">
              جديد
            </span>
          )}
        </div>
        
        {/* Category */}
        <div className="absolute bottom-2 right-2">
          <span className="bg-white/80 backdrop-blur-md text-primary text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full">
            {getCategoryName(category)}
          </span>
        </div>
      </div>
      
      <CardHeader className="p-3 md:p-4 pb-0">
        <div className="font-semibold text-xs md:text-sm text-gray-500 mb-1 md:mb-2 flex items-center">
          <span>{instructor}</span>
          <span className="mx-1 md:mx-2">•</span>
          <span>{getLevelName(level)}</span>
        </div>
        <h3 className="text-base md:text-xl font-bold text-primary line-clamp-2">{title}</h3>
      </CardHeader>
      
      <CardContent className="p-3 md:p-4">
        <p className="text-gray-600 text-xs md:text-sm line-clamp-2 mb-3 md:mb-4">
          {description || 'دورة تدريبية متميزة لتطوير مهاراتك'}
        </p>
        <div className="flex justify-between text-xs md:text-sm text-gray-500">
          <div className="flex items-center">
            <Users size={14} className="ml-1" />
            <span>{students} طالب</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="ml-1" />
            <span>{duration || '-'}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-3 md:p-4 pt-2 md:pt-0 flex justify-between items-center border-t border-gray-100 mt-2">
        <div>
          <span className="text-secondary font-bold text-base md:text-xl">{price} {currency}</span>
        </div>
        <Link to={`/courses/${id}`}>
          <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white transition-all text-xs md:text-sm">
            عرض التفاصيل
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
