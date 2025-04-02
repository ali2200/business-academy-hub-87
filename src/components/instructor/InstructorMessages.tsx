
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { 
  Search, 
  Send,
  MessageSquare
} from 'lucide-react';
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Mock data for demonstration purposes
const mockContacts = [
  {
    id: '1',
    name: 'أحمد محمد',
    avatar: '',
    lastMessage: 'أستاذ، أود الاستفسار عن موعد الامتحان القادم.',
    unread: true,
    time: '11:30 ص',
    course: 'البرمجة بلغة جافا'
  },
  {
    id: '2',
    name: 'سارة عبدالله',
    avatar: '',
    lastMessage: 'شكراً على الإجابة السريعة!',
    unread: false,
    time: 'أمس',
    course: 'تطوير تطبيقات الويب'
  },
  {
    id: '3',
    name: 'محمد علي',
    avatar: '',
    lastMessage: 'هل يمكنني الحصول على مصادر إضافية للمحاضرة الأخيرة؟',
    unread: true,
    time: 'أمس',
    course: 'قواعد البيانات'
  },
  {
    id: '4',
    name: 'فاطمة أحمد',
    avatar: '',
    lastMessage: 'المشروع النهائي جاهز للتسليم، يمكنك مراجعته.',
    unread: false,
    time: '2 يوليو',
    course: 'البرمجة بلغة جافا'
  },
  {
    id: '5',
    name: 'عمر خالد',
    avatar: '',
    lastMessage: 'أستاذ، أواجه مشكلة في التمرين الرابع...',
    unread: false,
    time: '1 يوليو',
    course: 'تطوير تطبيقات الويب'
  }
];

const mockMessages = [
  {
    id: '1',
    sender: 'student',
    text: 'أستاذ، أود الاستفسار عن موعد الامتحان القادم؟',
    time: 'أمس، 11:30 ص'
  },
  {
    id: '2',
    sender: 'instructor',
    text: 'مرحباً أحمد، الامتحان القادم سيكون يوم الثلاثاء القادم الساعة 10 صباحاً.',
    time: 'أمس، 12:15 م'
  },
  {
    id: '3',
    sender: 'student',
    text: 'شكراً لك أستاذ. هل سيكون هناك مراجعة قبل الامتحان؟',
    time: 'أمس، 12:20 م'
  },
  {
    id: '4',
    sender: 'instructor',
    text: 'نعم، سأقوم بعمل محاضرة مراجعة يوم الأحد القادم الساعة 6 مساءً. سأرسل الرابط على المنصة.',
    time: 'أمس، 12:30 م'
  },
  {
    id: '5',
    sender: 'student',
    text: 'تمام، شكراً جزيلاً لك!',
    time: 'أمس، 12:32 م'
  },
  {
    id: '6',
    sender: 'instructor',
    text: 'عفواً، بالتوفيق في الامتحان!',
    time: 'أمس، 12:35 م'
  },
  {
    id: '7',
    sender: 'student',
    text: 'أستاذ، هل يمكنني أيضاً الحصول على ملفات المحاضرة السابقة؟ لم أتمكن من تحميلها بسبب مشكلة في الإنترنت.',
    time: 'اليوم، 9:15 ص'
  }
];

const InstructorMessages = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState(mockContacts);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.course.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg = {
      id: Date.now().toString(),
      sender: 'instructor',
      text: newMessage,
      time: 'الآن'
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Mark conversation as read when replying
    if (selectedContact) {
      setContacts(contacts.map(contact => 
        contact.id === selectedContact ? { ...contact, unread: false } : contact
      ));
    }
  };
  
  const handleSelectContact = (contactId: string) => {
    setSelectedContact(contactId);
    
    // Mark as read
    setContacts(contacts.map(contact => 
      contact.id === contactId ? { ...contact, unread: false } : contact
    ));
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">رسائل الطلاب</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-[calc(100vh-230px)]">
            <CardHeader className="pb-3">
              <div className="space-y-4">
                <CardTitle>المحادثات</CardTitle>
                <div className="relative">
                  <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="البحث عن محادثة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-330px)]">
                {filteredContacts.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">لا توجد محادثات</h3>
                    <p className="text-gray-500 px-4">
                      {searchQuery ? 'لا توجد نتائج للبحث. حاول استخدام كلمات مختلفة.' : 'لم تبدأ أي محادثات بعد.'}
                    </p>
                  </div>
                ) : (
                  <div>
                    {filteredContacts.map((contact) => (
                      <div key={contact.id}>
                        <div 
                          className={`flex items-start p-4 hover:bg-gray-50 cursor-pointer ${selectedContact === contact.id ? 'bg-gray-50' : ''}`}
                          onClick={() => handleSelectContact(contact.id)}
                        >
                          <div className="relative flex-shrink-0">
                            <Avatar>
                              <AvatarImage src={contact.avatar} />
                              <AvatarFallback>{contact.name.slice(0, 2)}</AvatarFallback>
                            </Avatar>
                            {contact.unread && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1 mr-3 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className={`text-sm font-medium truncate ${contact.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                                {contact.name}
                              </h3>
                              <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0 mr-1">
                                {contact.time}
                              </span>
                            </div>
                            <p className={`text-xs truncate mt-1 ${contact.unread ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                              {contact.lastMessage}
                            </p>
                            <p className="text-xs text-primary mt-1">
                              {contact.course}
                            </p>
                          </div>
                        </div>
                        <Separator />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-230px)]">
            {selectedContact ? (
              <>
                <CardHeader className="border-b pb-3">
                  <div className="flex items-center">
                    <Avatar>
                      <AvatarImage src={contacts.find(c => c.id === selectedContact)?.avatar || ''} />
                      <AvatarFallback>
                        {contacts.find(c => c.id === selectedContact)?.name.slice(0, 2) || '??'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="mr-3">
                      <CardTitle className="text-lg">
                        {contacts.find(c => c.id === selectedContact)?.name || 'محادثة'}
                      </CardTitle>
                      <p className="text-xs text-primary mt-1">
                        {contacts.find(c => c.id === selectedContact)?.course || ''}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col h-[calc(100%-70px)]">
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div 
                          key={message.id}
                          className={`flex ${message.sender === 'instructor' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`rounded-lg p-3 max-w-[80%] ${
                              message.sender === 'instructor' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <p className="text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === 'instructor' 
                                ? 'text-primary-foreground/70' 
                                : 'text-gray-500'
                            }`}>
                              {message.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  <div className="p-4 border-t">
                    <div className="flex items-center">
                      <Input
                        placeholder="اكتب رسالتك هنا..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="ml-2"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                      />
                      <Button 
                        size="icon" 
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              <div className="h-full flex items-center justify-center flex-col p-6">
                <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">لم يتم اختيار محادثة</h3>
                <p className="text-gray-500 text-center">
                  اختر محادثة من القائمة على اليمين للبدء في الرد على الطلاب.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstructorMessages;
