
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold mb-6 text-secondary">بيزنس أكاديمي</h3>
            <p className="mb-6 text-white/80 leading-relaxed">
              منصة تعليمية رائدة في مجال البيزنس والمبيعات والتسويق، نقدم محتوى عربي أصيل يناسب السوق المصري والعربي.
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <SocialIcon icon={Facebook} href="#" delay={0.1} />
              <SocialIcon icon={Twitter} href="#" delay={0.2} />
              <SocialIcon icon={Instagram} href="#" delay={0.3} />
              <SocialIcon icon={Linkedin} href="#" delay={0.4} />
              <SocialIcon icon={Youtube} href="#" delay={0.5} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-2xl font-bold mb-6 text-secondary">روابط سريعة</h3>
            <ul className="space-y-3">
              <FooterLink href="/" text="الرئيسية" delay={0.1} />
              <FooterLink href="/courses" text="الدورات" delay={0.2} />
              <FooterLink href="/books" text="الكتب" delay={0.3} />
              <FooterLink href="/about" text="من نحن" delay={0.4} />
              <FooterLink href="/contact" text="اتصل بنا" delay={0.5} />
            </ul>
          </div>

          {/* Courses */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-2xl font-bold mb-6 text-secondary">الدورات</h3>
            <ul className="space-y-3">
              <FooterLink href="/courses/sales" text="مهارات البيع" delay={0.1} />
              <FooterLink href="/courses/marketing" text="التسويق الرقمي" delay={0.2} />
              <FooterLink href="/courses/business" text="ريادة الأعمال" delay={0.3} />
              <FooterLink href="/courses/management" text="إدارة الأعمال" delay={0.4} />
              <FooterLink href="/courses/finance" text="الإدارة المالية" delay={0.5} />
            </ul>
          </div>

          {/* Contact */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <h3 className="text-2xl font-bold mb-6 text-secondary">اتصل بنا</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 rtl:space-x-reverse">
                <Mail size={18} className="text-secondary flex-shrink-0" />
                <span>info@business-academy.com</span>
              </li>
              <li className="flex items-center space-x-3 rtl:space-x-reverse">
                <Phone size={18} className="text-secondary flex-shrink-0" />
                <span>+20 123 456 7890</span>
              </li>
              <li className="flex items-start space-x-3 rtl:space-x-reverse">
                <MapPin size={18} className="text-secondary flex-shrink-0 mt-1" />
                <span>القاهرة، مصر</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-center md:text-right mb-4 md:mb-0">
              © {currentYear} بيزنس أكاديمي. جميع الحقوق محفوظة
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <Link to="/terms" className="text-white/60 hover:text-white transition-colors">الشروط والأحكام</Link>
              <Link to="/privacy" className="text-white/60 hover:text-white transition-colors">سياسة الخصوصية</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

type SocialIconProps = {
  icon: React.FC<any>;
  href: string;
  delay: number;
};

const SocialIcon = ({ icon: Icon, href, delay }: SocialIconProps) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="bg-white/10 hover:bg-secondary transition-colors p-2 rounded-full animate-fade-in"
    style={{ animationDelay: `${delay}s` }}
  >
    <Icon size={18} />
  </a>
);

type FooterLinkProps = {
  href: string;
  text: string;
  delay: number;
};

const FooterLink = ({ href, text, delay }: FooterLinkProps) => (
  <li className="animate-fade-in" style={{ animationDelay: `${delay}s` }}>
    <Link 
      to={href} 
      className="text-white/80 hover:text-secondary transition-colors relative hover:pr-2"
    >
      {text}
    </Link>
  </li>
);

export default Footer;
