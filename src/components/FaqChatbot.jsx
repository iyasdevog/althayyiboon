import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  Coins, 
  Clock, 
  MapPin, 
  GraduationCap, 
  CheckCircle2, 
  ChevronRight, 
  RotateCcw, 
  Heart, 
  ExternalLink,
  Star,
  ThumbsUp,
  MessageSquare,
  Lock,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

// Standard FAQ Knowledge Base with Guided Prompts
const FAQ_KNOWLEDGE_BASE = [
  {
    id: 'privacy',
    title: '🔒 Reciprocal Privacy',
    prompt: 'How does reciprocal privacy work? Can strangers see my profile?',
    keywords: ['privacy', 'private', 'secure', 'reciprocal', 'stranger', 'photo', 'view', 'who can see', 'opposite', 'lock'],
    response: `Al-ThayyiBoon strictly enforces **Reciprocal Modest Viewing**:
• **Opposite-Gender Only:** Registered Brides (or their Walis) can only view Groom proposals, and registered Grooms can only view Bride proposals.
• **No Public Browsing:** Casual anonymous visitors and search engine bots cannot browse real candidate details.
• **Zero Web Scraping:** Phone numbers and sensitive contact details are never exposed publicly—they require reciprocal Wali authorization and contact unlock.`,
    action: { label: 'Register Proposal', type: 'open_add' }
  },
  {
    id: 'fee',
    title: '💰 Registration & Contact Fee (₹15)',
    prompt: 'Why is there a registration fee and contact view fee?',
    keywords: ['fee', 'cost', 'charge', '15', 'rupees', 'price', 'payment', 'money', 'free', 'why pay', 'unlock'],
    response: `We charge a nominal registration fee and a tiny contact unlock fee (**₹15 / 1 Credit**):
1. **Eliminate Brokers & Fake Accounts:** Unlike free open groups that get flooded with spammers and middlemen, the token fee ensures only serious candidates and genuine parents join.
2. **Platform Sustainability & Wali Verification:** It funds manual phone verification, hosting, and data security without selling user data or showing annoying pop-up ads.
3. **Halal & Modest:** You only unlock contacts of proposals you genuinely match with.`,
    action: { label: 'Learn About Pricing & Credits', type: 'open_wallet' }
  },
  {
    id: 'validity',
    title: '⏳ 3-Month Active Listing',
    prompt: 'Why are profile listings valid for only 3 months?',
    keywords: ['validity', '3 month', 'three month', 'expire', 'duration', 'renew', 'stale', 'active', 'old'],
    response: `To guarantee that 100% of proposals on Al-ThayyiBoon are **fresh and active**:
• Traditional matrimony sites are cluttered with profiles from years ago whose marriages were already solemnized.
• Every listing on Al-ThayyiBoon remains active for **90 days (3 months)**.
• If still searching, the candidate or parent can easily renew with a single tap. If solemnized, the proposal automatically retires—saving families from unnecessary calls.`,
    action: { label: 'View Validity Policy', type: 'open_validity' }
  },
  {
    id: 'qualifications',
    title: '🎓 Islamic & Academic Degrees',
    prompt: 'What Islamic & University qualifications are supported?',
    keywords: ['qualification', 'degree', 'islamic', 'wafi', 'wafiyya', 'dawa', 'sharia', 'afzal', 'hafiz', 'alim', 'doctor', 'engineer', 'study', 'academic', 'mbb', 'btech'],
    response: `Al-ThayyiBoon proudly bridges **both Islamic Scholarship & Higher Academic Excellence**:
• **Islamic Institutions:** Wafi, Wafiyya, Da'wa / Sharee'a graduates, Afzal-ul-Ulama, Certified Hafiz-ul-Qur'an, and Alim/Ulama qualifications across recognized Kerala boards.
• **Academic & Professional:** MBBS / MD Doctors, B.Tech / M.Tech Software Engineers, Ph.D. Scholars, CA / CMA, Civil Services, and University Masters/Bachelors.
• You can filter proposals having dual qualifications (e.g. Wafiyya + B.Sc or Wafi + M.A.).`,
    action: { label: 'Filter by Qualification', type: 'open_filters' }
  },
  {
    id: 'location',
    title: '📍 Malabar & Kerala Locations',
    prompt: 'How does location and distance filter work in Malabar areas?',
    keywords: ['location', 'place', 'distance', 'malabar', 'koolimadu', 'town', 'district', 'km', 'gps', 'malappuram', 'kozhikode', 'kannur', 'kasaragod', 'wayanad', 'palakkad'],
    response: `We have indexed **over 165+ Kerala towns and junction localities**, with exhaustive coverage across Malabar:
• **Towns Covered:** Malappuram, Kozhikode, Kannur, Kasaragod, Wayanad, Palakkad, and local areas like Koolimadu, Mavoor, Feroke, Manjeri, Tirur, Vadakara, Thalassery, etc.
• **GPS Distance Radius:** You can filter candidates within 5 km, 15 km, 25 km, or 50 km of your own town or current GPS location.
• **Native Mahallu & Nearest Town:** Candidates can specify both their exact local village/mahallu and nearest town for accurate GPS distance.`,
    action: { label: 'Search by Distance', type: 'open_filters' }
  },
  {
    id: 'verification',
    title: '🛡️ Verification & Wali Supervision',
    prompt: 'How does Wali and candidate verification work?',
    keywords: ['verify', 'verification', 'wali', 'parent', 'guardian', 'trust', 'fake', 'admin', 'identity'],
    response: `Every proposal on Al-ThayyiBoon is tied to a responsible guardian (Wali):
• Direct contact details must belong to the Father, Mother, Brother, or lawful Guardian.
• Admin audits new submissions to verify Islamic credentials and ensure authenticity.
• Any inappropriate submission is immediately banned to safeguard community modesty.`,
    action: { label: 'Contact Admin', type: 'open_whatsapp' }
  },
  {
    id: 'edit_remove',
    title: '✏️ Edit or Delete Proposal',
    prompt: 'How do I edit or remove my proposal after solemnization?',
    keywords: ['edit', 'delete', 'remove', 'change', 'update', 'pin', 'solemnized', 'nikah', 'hide'],
    response: `You retain full control over your proposal at all times:
1. Locate your card on the website or visit your proposal link.
2. Click the **Edit (pencil)** icon on the card.
3. Enter your **4-Digit Edit PIN** set during registration, or sign in with the Google / Email account you used.
4. You can update details, change photos, or click **"Delete Proposal"** once your Nikah is fixed.`,
    action: { label: 'Browse Proposals', type: 'open_browse' }
  }
];

// Feedback Area Options for Customer Improvement Suggestions
const IMPROVEMENT_AREAS = [
  { id: 'mobile_ui', label: '📱 Mobile Experience & Ergonomics', desc: 'Layout, buttons, readability on phone' },
  { id: 'location_search', label: '📍 Location & Malabar Towns', desc: 'GPS accuracy, more local village names' },
  { id: 'privacy_modesty', label: '🔒 Privacy & Modesty Controls', desc: 'Reciprocal lock, photo protection' },
  { id: 'registration_form', label: '📝 Registration Form Simplicity', desc: 'Step-by-step proposal submission' },
  { id: 'filters_sorting', label: '🔍 Filters & Search Options', desc: 'Islamic degrees, age, distance radius' },
  { id: 'payment_unlock', label: '💳 Payment & ₹15 Unlock System', desc: 'UPI payment, wallet recharge convenience' },
  { id: 'speed_performance', label: '⚡ Website Speed & Smoothness', desc: 'Page load times and responsiveness' },
  { id: 'new_feature', label: '✨ Other / New Feature Idea', desc: 'Any new tool or idea for the community' }
];

export default function FaqChatbot({ 
  isOpen, 
  onClose, 
  onOpenAddModal, 
  onOpenWalletModal,
  onOpenFilterSidebar,
  onOpenValidityModal,
  onShowToast 
}) {
  const { currentUser, pricing } = useAuth();
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'feedback'
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial Conversation Messages with Warm Thank You Note
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Assalamu Alaikum wa Rahmatullahi wa Barakatuh! 🌸\n\n**Thank you for choosing Al-ThayyiBoon Matrimony (അൽ-ത്വയ്യിബൂൻ).**\n\nWe are committed to providing a halal, modest, and verified matrimonial platform for Kerala Muslim families. How may I assist you today?`,
      timestamp: new Date()
    },
    {
      id: 'welcome-2',
      sender: 'bot',
      text: `You can tap any guided topic below, type your question, or tap **"Suggest Improvements"** to help us make the website even better!`,
      isGuidedPrompt: true,
      timestamp: new Date()
    }
  ]);

  // Feedback Form State
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [senderName, setSenderName] = useState(currentUser?.name || '');
  const [senderContact, setSenderContact] = useState(currentUser?.phone || '');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isTyping, isOpen, activeTab]);

  // Handle Guided Prompt Click
  const handleSelectFaq = (faq) => {
    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: faq.prompt,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const botMsg = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: faq.response,
        action: faq.action,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 450);
  };

  // Handle User Free-Text Question
  const handleSendMessage = (e) => {
    e?.preventDefault();
    const query = inputText.trim();
    if (!query) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simple Smart Keyword Search
    setTimeout(() => {
      const lower = query.toLowerCase();

      // Check if user is asking to give feedback/suggestion
      if (lower.includes('suggest') || lower.includes('feedback') || lower.includes('improve') || lower.includes('complaint') || lower.includes('idea')) {
        const botMsg = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: `We would love to hear your thoughts! You can mark the specific areas you'd like improved using our dedicated Suggestion form.`,
          action: { label: 'Open Suggestion Form', type: 'open_feedback_tab' },
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
        setIsTyping(false);
        return;
      }

      // Match against FAQ database keywords
      let bestFaq = null;
      let highestMatches = 0;

      for (const faq of FAQ_KNOWLEDGE_BASE) {
        let matchCount = 0;
        for (const kw of faq.keywords) {
          if (lower.includes(kw)) matchCount++;
        }
        if (matchCount > highestMatches) {
          highestMatches = matchCount;
          bestFaq = faq;
        }
      }

      if (bestFaq && highestMatches > 0) {
        const botMsg = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: bestFaq.response,
          action: bestFaq.action,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
      } else {
        const botMsg = {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: `Thank you for reaching out! While I may not have the exact answer in my quick guide, our support team is happy to assist you directly on WhatsApp. You can also share an improvement suggestion or check out the common topics below.`,
          action: { label: 'Chat with Admin on WhatsApp', type: 'open_whatsapp' },
          isGuidedPrompt: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMsg]);
      }

      setIsTyping(false);
    }, 500);
  };

  // Handle Action Button Clicks in Bot Responses
  const handleActionClick = (action) => {
    if (!action) return;
    if (action.type === 'open_add') {
      onClose();
      onOpenAddModal?.();
    } else if (action.type === 'open_wallet') {
      onClose();
      onOpenWalletModal?.();
    } else if (action.type === 'open_filters') {
      onClose();
      onOpenFilterSidebar?.();
    } else if (action.type === 'open_validity') {
      onClose();
      onOpenValidityModal?.();
    } else if (action.type === 'open_feedback_tab') {
      setActiveTab('feedback');
    } else if (action.type === 'open_browse') {
      onClose();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action.type === 'open_whatsapp') {
      const waLink = pricing?.whatsappGroupLink || 'https://wa.me/919447123456?text=Assalamu%20Alaikum.%20I%20have%20an%20inquiry%20regarding%20Al-ThayyiBoon%20Matrimony.';
      window.open(waLink, '_blank', 'noopener,noreferrer');
    }
  };

  // Toggle Improvement Area selection
  const handleToggleArea = (areaId) => {
    setSelectedAreas(prev => 
      prev.includes(areaId)
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };

  // Submit Feedback / Suggestions
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackNote.trim() && selectedAreas.length === 0) {
      onShowToast?.("Please choose at least one area or enter your suggestion.");
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const payload = {
        rating,
        selectedAreas,
        selectedAreaLabels: selectedAreas.map(id => IMPROVEMENT_AREAS.find(a => a.id === id)?.label || id),
        feedbackNote: feedbackNote.trim(),
        senderName: senderName.trim() || 'Anonymous Member',
        senderContact: senderContact.trim() || 'Not Provided',
        userId: currentUser?.uid || null,
        userEmail: currentUser?.email || null,
        createdAt: serverTimestamp(),
        device: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          screen: `${window.innerWidth}x${window.innerHeight}`
        }
      };

      // 1. Save to Firestore
      try {
        const feedbackCol = collection(db, 'feedback');
        await addDoc(feedbackCol, payload);
      } catch (err) {
        console.warn("Firestore feedback sync error, saving locally:", err);
      }

      // 2. Local Storage Cache
      try {
        const existing = JSON.parse(localStorage.getItem('althayyiboon_feedback_cache') || '[]');
        existing.unshift({ ...payload, localSavedAt: new Date().toISOString() });
        localStorage.setItem('althayyiboon_feedback_cache', JSON.stringify(existing.slice(0, 20)));
      } catch (localErr) {
        console.warn("Could not cache feedback locally:", localErr);
      }

      setFeedbackSubmitted(true);
      onShowToast?.("JazakAllahu Khair! Your suggestion has been received.");
    } catch (err) {
      console.error("Feedback submission error:", err);
      onShowToast?.("Suggestion received! Thank you for helping us improve.");
      setFeedbackSubmitted(true);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Send suggestion to Admin WhatsApp directly
  const handleSendToWhatsApp = () => {
    const areaTexts = selectedAreas.map(id => IMPROVEMENT_AREAS.find(a => a.id === id)?.label).filter(Boolean).join(', ');
    const ratingStars = '⭐'.repeat(rating);
    const msg = 
      `*Al-ThayyiBoon Website Suggestion*\n\n` +
      `👤 *From:* ${senderName || 'Valued Member'}\n` +
      `⭐ *Rating:* ${ratingStars} (${rating}/5)\n` +
      (areaTexts ? `📌 *Areas for Improvement:*\n${areaTexts}\n\n` : '') +
      `💬 *Suggestion / Feedback:*\n${feedbackNote || 'No extra note provided.'}`;

    const url = `https://wa.me/919447123456?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-1',
        sender: 'bot',
        text: `Assalamu Alaikum wa Rahmatullahi wa Barakatuh! 🌸\n\n**Thank you for choosing Al-ThayyiBoon Matrimony (അൽ-ത്വയ്യിബൂൻ).**\n\nWe are committed to providing a halal, modest, and verified matrimonial platform for Kerala Muslim families. How may I assist you today?`,
        timestamp: new Date()
      },
      {
        id: 'welcome-2',
        sender: 'bot',
        text: `You can tap any guided topic below, type your question, or tap **"Suggest Improvements"** to help us make the website even better!`,
        isGuidedPrompt: true,
        timestamp: new Date()
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-end sm:justify-end p-0 sm:p-6 sm:pb-8 pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="faq-chatbot-title"
    >
      {/* Dim backdrop on mobile viewports for focus */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm sm:hidden pointer-events-auto transition-opacity"
      ></div>

      {/* Floating Chat Container */}
      <div className="relative w-full sm:w-[420px] h-[90dvh] sm:h-[620px] max-h-[92dvh] bg-slate-900 border border-slate-700/80 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto z-10 animate-fade-in transition-all">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img 
                  src="/brand-icon.png" 
                  alt="Al-ThayyiBoon Logo" 
                  className="w-9 h-9 rounded-xl object-cover ring-1 ring-emerald-500/30 shadow-md"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-pulse"></span>
              </div>
              <div>
                <h2 id="faq-chatbot-title" className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Al-ThayyiBoon Assistant</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-400 font-semibold border border-emerald-500/30">
                    Live FAQ
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <span>Halal Matrimonial Guide &amp; Feedback</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Restart Chat"
                aria-label="Restart Chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close Chat"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="mt-3 grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQ &amp; Guidance</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('feedback')}
              className={`py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'feedback'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Suggest Improvement</span>
            </button>
          </div>
        </div>

        {/* TAB 1: FAQ CHATBOT */}
        {activeTab === 'chat' && (
          <>
            {/* Scrollable Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar mobile-scroll-container">
              
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none font-medium'
                      : 'bg-slate-950/90 text-slate-200 border border-slate-800/90 rounded-tl-none space-y-2'
                  }`}>
                    {/* Bot Message Body */}
                    <div className="whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Action Button attached to bot message */}
                    {msg.action && (
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleActionClick(msg.action)}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition-all cursor-pointer shadow-sm active:scale-95"
                        >
                          <span>{msg.action.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Guided Prompt Quick Selectors under welcome */}
                  {msg.isGuidedPrompt && (
                    <div className="w-full mt-3 space-y-1.5">
                      <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Popular Questions
                      </p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {FAQ_KNOWLEDGE_BASE.slice(0, 5).map((faq) => (
                          <button
                            key={faq.id}
                            type="button"
                            onClick={() => handleSelectFaq(faq)}
                            className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                          >
                            <span className="font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors">
                              {faq.title}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                          </button>
                        ))}

                        {/* Direct Suggestion CTA in list */}
                        <button
                          type="button"
                          onClick={() => setActiveTab('feedback')}
                          className="w-full text-left p-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs text-amber-200 font-semibold transition-all flex items-center justify-between group cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>💡 Have a suggestion to improve the website?</span>
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </button>
                      </div>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-500 mt-1 px-1">
                    {msg.sender === 'bot' ? 'Assistant' : 'You'}
                  </span>
                </div>
              ))}

              {/* Bot Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 w-24">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Chips Bar */}
            <div className="px-3 py-2 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {FAQ_KNOWLEDGE_BASE.map(faq => (
                <button
                  key={faq.id}
                  type="button"
                  onClick={() => handleSelectFaq(faq)}
                  className="shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-[11px] font-medium text-slate-300 hover:text-emerald-300 transition-colors cursor-pointer"
                >
                  {faq.title}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2 shrink-0 pb-safe">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask a question about fees, privacy, etc..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-emerald-500 text-xs transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-slate-950 font-bold transition-all cursor-pointer shadow-md shrink-0"
                aria-label="Send Message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}

        {/* TAB 2: SUGGESTION & IMPROVEMENT FORM */}
        {activeTab === 'feedback' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 custom-scrollbar mobile-scroll-container pb-safe">
            {feedbackSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4 animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">JazakAllahu Khair!</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed">
                    Thank you for sharing your valuable suggestions with Al-ThayyiBoon. Our development and admin team review user ideas regularly to enhance everyone's experience.
                  </p>
                </div>

                <div className="w-full space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSendToWhatsApp}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send this Suggestion directly on WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFeedbackSubmitted(false);
                      setFeedbackNote('');
                      setSelectedAreas([]);
                      setActiveTab('chat');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Back to FAQ Chat
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Help Us Improve Al-ThayyiBoon</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                    We actively build Al-ThayyiBoon around community feedback. Mark the areas where you think we need further improvement:
                  </p>
                </div>

                {/* 1. Improvement Areas Selection */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Select Areas for Improvement (Choose all that apply):
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {IMPROVEMENT_AREAS.map(area => {
                      const isSelected = selectedAreas.includes(area.id);
                      return (
                        <button
                          key={area.id}
                          type="button"
                          onClick={() => handleToggleArea(area.id)}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-sm'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-xs flex items-center gap-1.5">
                              <span>{area.label}</span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {area.desc}
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ml-2 ${
                            isSelected 
                              ? 'bg-amber-500 border-amber-400 text-slate-950' 
                              : 'border-slate-700 bg-slate-900'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Rating */}
                <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Overall Experience Rating:
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      {rating === 5 ? '⭐⭐⭐⭐⭐ Excellent' :
                       rating === 4 ? '⭐⭐⭐⭐ Good' :
                       rating === 3 ? '⭐⭐⭐ Average' :
                       rating === 2 ? '⭐⭐ Needs Work' : '⭐ Poor'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 rounded-lg hover:scale-110 transition-transform cursor-pointer"
                        aria-label={`Rate ${star} Stars`}
                      >
                        <Star 
                          className={`w-6 h-6 transition-colors ${
                            star <= (hoverRating || rating)
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Detailed Suggestion Textarea */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                    Your Specific Suggestions / Ideas:
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackNote}
                    onChange={(e) => setFeedbackNote(e.target.value)}
                    placeholder="Tell us what felt difficult, what features you would like added (e.g. more Malabar towns, specific filters, easier verification), or any issue you encountered..."
                    className="w-full p-3 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-amber-500 text-xs resize-none"
                  />
                </div>

                {/* 4. Contact Details (Optional) */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Your Name (Optional)</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. K. Rasheed"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white border border-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">WhatsApp / Phone (Optional)</label>
                    <input
                      type="tel"
                      value={senderContact}
                      onChange={(e) => setSenderContact(e.target.value)}
                      placeholder="For admin follow up"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 text-white border border-slate-800 text-xs"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={isSubmittingFeedback}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingFeedback ? (
                      <span>Submitting Suggestion...</span>
                    ) : (
                      <>
                        <ThumbsUp className="w-4 h-4" />
                        <span>Submit My Suggestions</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
