/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { MapView } from './components/MapView';
import { chatWithMaps, ChatMessage, MapPlace } from './services/gemini';
import { Send, MapPin, Search, MessageSquare, Navigation, ExternalLink, Loader2, Compass } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      role: 'model', 
      text: "Hello! I'm your GeoChat assistant. I can help you find places, restaurants, and landmarks using real-time Google Maps data. Where would you like to explore today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([37.7749, -122.4194]); // Default SF
  const [locationName, setLocationName] = useState('San Francisco, CA');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLocationName('Your Current Location');
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const result = await chatWithMaps(input, messages, {
      latitude: userLocation[0],
      longitude: userLocation[1]
    });

    setMessages(prev => [...prev, { 
      role: 'model', 
      text: result.text,
      places: result.places 
    }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-stone-50 font-sans overflow-hidden">
      {/* Sidebar / Chat Area */}
      <div className="w-full md:w-[450px] flex flex-col border-r border-black/5 bg-white shadow-xl z-20">
        <header className="p-6 border-bottom border-black/5 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Compass size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-stone-900">GeoChat AI</h1>
              <div className="flex items-center gap-1 text-xs text-stone-500">
                <MapPin size={12} className="text-emerald-600" />
                <span>{locationName}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={cn(
                "flex flex-col max-w-[90%]",
                msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div 
                className={cn(
                  "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                  msg.role === 'user' 
                    ? "bg-emerald-600 text-white rounded-tr-none" 
                    : "bg-stone-100 text-stone-800 rounded-tl-none border border-black/5"
                )}
              >
                <div className="prose prose-sm max-w-none prose-stone dark:prose-invert">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>

              {msg.places && msg.places.length > 0 && (
                <div className="mt-3 w-full space-y-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1">Found Locations</p>
                  {msg.places.map((place, j) => (
                    <a 
                      key={j}
                      href={place.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-white border border-black/5 rounded-xl hover:bg-stone-50 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-stone-100 rounded-lg flex items-center justify-center text-stone-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                          <Navigation size={14} />
                        </div>
                        <span className="text-xs font-medium text-stone-700 truncate max-w-[180px]">{place.title}</span>
                      </div>
                      <ExternalLink size={14} className="text-stone-300 group-hover:text-emerald-500" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-stone-400 text-xs italic">
              <Loader2 size={14} className="animate-spin" />
              <span>Searching Google Maps...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-6 bg-white border-t border-black/5">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about nearby places..."
              className="w-full pl-4 pr-12 py-4 bg-stone-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:bg-white transition-all outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="mt-3 text-[10px] text-center text-stone-400">
            Powered by Gemini 2.5 Flash & Google Maps Grounding
          </p>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 h-[40vh] md:h-full relative">
        <MapView center={userLocation} places={[]} />
      </div>
    </div>
  );
}
