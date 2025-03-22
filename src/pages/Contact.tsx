
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Reset form after some time
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }, 5000);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Header */}
      <section className="pt-32 pb-16 animated-gradient">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 mb-4">اتصل بنا</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">تواصل معنا</h1>
            <p className="text-gray-600 mb-8">
              فريقنا جاهز للإجابة على أسئلتك ومساعدتك في كل ما تحتاجه. نحن هنا لخدمتك.
            </p>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-8 text-primary">معلومات التواصل</h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full ml-4">
                    <Mail size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-primary">البريد الإلكتروني</h3>
                    <p className="text-gray-600 mb-1">للاستفسارات العامة:</p>
                    <a href="mailto:info@business-academy.com" className="text-secondary hover:text-secondary-dark transition-colors">
                      info@business-academy.com
                    </a>
                    <p className="text-gray-600 mt-2 mb-1">للدعم الفني:</p>
                    <a href="mailto:support@business-academy.com" className="text-secondary hover:text-secondary-dark transition-colors">
                      support@business-academy.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full ml-4">
                    <Phone size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-primary">الهاتف</h3>
                    <p className="text-gray-600 mb-1">خدمة العملاء:</p>
                    <a href="tel:+201234567890" className="text-secondary hover:text-secondary-dark transition-colors">
                      +20 123 456 7890
                    </a>
                    <p className="text-gray-600 mt-2 mb-1">الدعم الفني:</p>
                    <a href="tel:+201234567891" className="text-secondary hover:text-secondary-dark transition-colors">
                      +20 123 456 7891
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full ml-4">
                    <MapPin size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-primary">العنوان</h3>
                    <p className="text-gray-600 mb-1">المقر الرئيسي:</p>
                    <p className="text-gray-800">
                      123 شارع التحرير، الدور الخامس، ميدان التحرير، القاهرة، مصر
                    </p>
                    <p className="text-gray-600 mt-2 mb-1">ساعات العمل:</p>
                    <p className="text-gray-800">
                      من الأحد إلى الخميس: 9 صباحًا - 5 مساءً
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Social Media */}
              <div className="mt-12">
                <h3 className="text-xl font-bold mb-4 text-primary">تابعنا على</h3>
                <div className="flex space-x-4 rtl:space-x-reverse">
                  <a href="#" className="bg-primary/10 hover:bg-primary hover:text-white text-primary p-3 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a href="#" className="bg-primary/10 hover:bg-primary hover:text-white text-primary p-3 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                  </a>
                  <a href="#" className="bg-primary/10 hover:bg-primary hover:text-white text-primary p-3 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                  </a>
                  <a href="#" className="bg-primary/10 hover:bg-primary hover:text-white text-primary p-3 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                  </a>
                  <a href="#" className="bg-primary/10 hover:bg-primary hover:text-white text-primary p-3 rounded-full transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide-youtube"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path><path d="m10 15 5-3-5-3z"></path></svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-3xl font-bold mb-8 text-primary">أرسل رسالة</h2>
                
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} className="text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-primary">تم إرسال رسالتك بنجاح!</h3>
                    <p className="text-gray-600">
                      شكرًا لتواصلك معنا. سنقوم بالرد عليك في أقرب وقت ممكن.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block font-medium text-gray-700 mb-2">الاسم الكامل</label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="أدخل اسمك الكامل"
                          required
                          className="w-full py-3"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="أدخل بريدك الإلكتروني"
                          required
                          className="w-full py-3"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block font-medium text-gray-700 mb-2">رقم الهاتف</label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="أدخل رقم هاتفك"
                          className="w-full py-3"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block font-medium text-gray-700 mb-2">الموضوع</label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="موضوع الرسالة"
                          required
                          className="w-full py-3"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block font-medium text-gray-700 mb-2">الرسالة</label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="اكتب رسالتك هنا..."
                        required
                        className="w-full min-h-[150px]"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary-light text-white py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          جاري الإرسال...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Send size={20} className="ml-2" />
                          إرسال الرسالة
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3453.6657835067293!2d31.23439491512709!3d30.044219881882267!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145841885535bec7%3A0x520da52b3a7a660f!2z2YXZitiv2KfZhiDYp9mE2KrYrdix2YrYsdiMINin2YTYudiq2KjYqdiMINmF2K3Yp9mB2KjYqSDYp9mE2YLYp9mH2LHYqeKArA!5e0!3m2!1sar!2seg!4v1636544254672!5m2!1sar!2seg" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
              className="animate-fade-in"
            ></iframe>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">الأسئلة الشائعة</Badge>
            <h2 className="text-3xl font-bold mb-6 text-primary">الأسئلة المتكررة</h2>
            <p className="text-gray-600">
              فيما يلي إجابات على بعض الأسئلة الشائعة التي قد تكون لديك
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FaqItem 
              question="كيف يمكنني التسجيل في إحدى الدورات؟"
              answer="يمكنك التسجيل في أي دورة من خلال زيارة صفحة الدورة واختيار زر 'اشترك الآن'، ثم اتباع خطوات التسجيل وإتمام عملية الدفع."
            />
            <FaqItem 
              question="هل يمكنني الوصول للمحتوى بعد انتهاء الدورة؟"
              answer="نعم، بمجرد شرائك للدورة ستتمكن من الوصول إليها مدى الحياة ويمكنك مراجعة المحتوى في أي وقت."
            />
            <FaqItem 
              question="هل أحصل على شهادة بعد إكمال الدورة؟"
              answer="نعم، ستحصل على شهادة إتمام معتمدة بعد إكمال جميع متطلبات الدورة والاختبارات النهائية."
            />
            <FaqItem 
              question="ما هي سياسة استرداد الأموال؟"
              answer="نقدم ضمان استرداد الأموال خلال 14 يومًا من تاريخ الشراء إذا لم تكن راضيًا عن الدورة، شريطة ألا تتجاوز نسبة المشاهدة 30% من محتوى الدورة."
            />
            <FaqItem 
              question="هل هناك خصومات للمجموعات أو الشركات؟"
              answer="نعم، نقدم خصومات خاصة للمجموعات والشركات. للاستفسار عن الخصومات والعروض الخاصة، يرجى التواصل مع فريق المبيعات."
            />
            <FaqItem 
              question="كيف يمكنني التواصل مع المدرب أثناء الدورة؟"
              answer="يمكنك التواصل مع المدرب من خلال منتدى الدورة، حيث يمكنك طرح الأسئلة ومناقشة المواضيع مع المدرب والطلاب الآخرين."
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

type FaqItemProps = {
  question: string;
  answer: string;
};

const FaqItem = ({ question, answer }: FaqItemProps) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all animate-fade-in">
    <h3 className="text-xl font-bold mb-3 text-primary">{question}</h3>
    <p className="text-gray-600">{answer}</p>
  </div>
);

export default Contact;
