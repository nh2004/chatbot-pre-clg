import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

interface PreBotProps {
  systemPrompt?: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const PreBot = ({ systemPrompt }: PreBotProps): JSX.Element => {
  // We instruct the AI to use Markdown for better formatting.
  // In PreBot.tsx
  const DEFAULT_SYSTEM_PROMPT = `You are PreBot, a friendly, knowledgeable, and highly engaging AI counselor for Indian engineering college admissions.

Your primary goal is to provide accurate, encouraging, and visually appealing information.

***You MUST format ALL of your responses using advanced GitHub Flavored Markdown.***

Here's how to make your responses great:
- **Use Emojis:** Add personality and visual cues. For example: 💡 for tips, ✅ for advantages, ❌ for disadvantages, 🎓 for college info, and 🎉 for good news.
- **Use Tables:** When comparing colleges, branches, or fees, ALWAYS use a Markdown table. It's the clearest way to present data.
- **Use Lists:** Use bulleted or numbered lists for steps, features, or key points.
- **Use Bold & Italics:** Emphasize important terms, ranks, or deadlines.
- **Use Blockquotes:** For important notes, warnings, or direct quotes.

**Example of a great response:**

> Here is a comparison of the CSE programs at two top NITs based on last year's closing ranks for a General, Other State student:

| College 🎓         | Closing Rank (Approx.) 📈 | Key Feature                                  |
| ------------------ | ------------------------- | -------------------------------------------- |
| **NIT Trichy**     | ~980                      | Excellent placement record and campus life.  |
| **NIT Warangal**   | ~1500                     | Strong research focus and great alumni network. |

> 💡 **Remember:** Ranks can fluctuate each year! This is just for reference.

Now, be creative and make your answers as helpful and clear as possible!`;

  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false); // Used to disable the input during response streaming.
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // This effect ensures the chat view always scrolls to the latest message.
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // The chat session is memoized to persist the conversation history.
  const chatSession = useMemo(() => {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_UP },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_UP },
      ],
    });
    const initialHistory = [
      { role: 'user', parts: [{ text: systemPrompt || DEFAULT_SYSTEM_PROMPT }] },
      { role: 'model', parts: [{ text: 'Okay, I understand my role. I will now respond using GitHub Flavored Markdown to make my answers clear and structured.' }] },
    ];
    return model.startChat({ history: initialHistory });
  }, [systemPrompt]);

  // Handles sending the user's message and streaming the bot's response.
  const handleSendMessage = async (messageText?: string) => {
    const textToSend = (messageText || inputValue).trim();
    if (!textToSend) return;

    const userMessage: Message = { id: Date.now().toString(), text: textToSend, sender: 'user', timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // First, add a temporary placeholder for the bot's message.
    const botMessageId = (Date.now() + 1).toString();
    const botMessagePlaceholder: Message = { id: botMessageId, text: '', sender: 'bot', timestamp: new Date() };
    setMessages(prev => [...prev, botMessagePlaceholder]);

    try {
      // Stream the response from the API.
      const result = await chatSession.sendMessageStream(textToSend);
      let accumulatedText = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;

        // Update the bot's message in the state with the incoming text.
        setMessages(prev => prev.map(msg =>
          msg.id === botMessageId ? { ...msg, text: accumulatedText } : msg
        ));
      }
    } catch (error) {
      console.error('Gemini API Streaming Error:', error);
      setMessages(prev => prev.map(msg =>
        msg.id === botMessageId ? { ...msg, text: "An error occurred. Please check the console." } : msg
      ));
    } finally {
      // Re-enable the input field once the stream is complete.
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); handleSendMessage(); };
  const handleSuggestionClick = (suggestion: string) => handleSendMessage(suggestion);
  const handleQuickActionClick = (action: string) => handleSendMessage(action);
  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const quickActions = ['Predict my rank', 'Predict colleges', 'College info', 'Talk to a senior'];
  const suggestionButtons = ['Know colleges based on my JEE Mains rank', 'Know about a specific college', 'I want to talk to a senior from a college']; 
  const RightArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2} // Increased strokeWidth for a slightly bolder arrow
    stroke="currentColor"
    className="w-4 h-4 text-gray-500" // Adjust color and size as needed
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
  </svg>
);
  

  return (
    <div className="min-h-screen bg-transparent ">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-b from-yellow-100 to-orange-200 rounded-2xl p-6 sticky top-8 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-20 h-20  rounded-full flex items-center justify-center">
                  <img src="/left-sidebar.png" alt="PreBot Logo" className="w-16 h-16 object-contain" />
                </div>
                <h2 className="text-3xl font-semibold text-gray-800">PreBot</h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">PreBot is your smart and friendly AI counselor that helps you navigate engineering college admissions.</p>
              <p className="text-sm text-gray-600 mb-6">From predicting colleges based on your JEE rank to exploring campus details or connecting with seniors, PreBot is here to guide you every step of the way.</p>
              <div className="space-y-3">{quickActions.map((action) => (<button key={action} onClick={() => handleQuickActionClick(action)} className="w-full text-left px-4 py-3 bg-gradient-to-br from-[#FFFCF7] via-[#FFFCF7] to-[#FFFCF7]' hover:bg-yellow-200 rounded-lg text-sm font-medium text-gray-700 transition-colors flex items-center justify-between">{action}<RightArrowIcon /> </button>))}</div>
              
            </div>
          </div>
          {/* Main Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-transparent rounded-2xl h-[85vh] flex flex-col">
              {/* These utility classes hide the scrollbar for a cleaner look. */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {messages.length === 0 ? (
                  <div className="flex flex-col h-full justify-center items-center text-center">
                    <img src="/prebot-logo.png" alt="PreBot Logo" className="w-32 h-32 mb-4" />
                    <p className="text-gray-600 text-lg mb-6">Hi! I'm <span className="text-orange-500 font-medium">PreBot</span>, your PreCollege AI counselor.<br />How can I help you with your engineering college counselling today?</p>
                    <div className="flex flex-wrap justify-center gap-3 mb-4">{suggestionButtons.map((suggestion) => (<button key={suggestion} onClick={() => handleSuggestionClick(suggestion)} className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-orange-200">{suggestion}</button>))}</div>
                    <p className="text-gray-500 italic text-sm">Got something else on your mind? Just type your question in the chatbox!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-start gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === 'user' ? 'bg-blue-500' : 'bg-orange-400'}`}>{message.sender === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}</div>
                          <div className={`rounded-2xl markdown-content p-4 text-sm leading-relaxed ${message.sender === 'user' ? 'bg-white text-black' : 'bg-transparent text-black'}`}>
                            {/* We render bot messages with ReactMarkdown to display formatted text. */}
                            {message.sender === 'bot' ? (
                              <ReactMarkdown remarkPlugins={[remarkGfm, remarkEmoji]}>{message.text}</ReactMarkdown>

                            ) : (
                              <p>{message.text}</p>
                            )}
                            <p className={`text-xs mt-2 text-right text-gray-500`}>{formatTime(message.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Chat Input Form */}
              <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSubmit} className="flex gap-3">
                  <div className="flex items-center w-full px-4 py-2 rounded-full border border-gray-300 bg-white focus-within:ring-2 focus-within:ring-orange-400 transition-shadow">
                    <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="What's on your mind? Let PreBot help you..." className="flex-1 focus:outline-none bg-transparent text-gray-800" disabled={isTyping} />
                    <button type="submit" disabled={!inputValue.trim() || isTyping} className="ml-2 p-2 text-orange-500 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center rounded-full hover:bg-orange-100"><Send className="w-5 h-5" /></button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};