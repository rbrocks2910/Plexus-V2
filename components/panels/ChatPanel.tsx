import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types';
import { PaperAirplaneIcon } from '../icons/PanelIcons';

interface ChatPanelProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  patientName: string;
  isLoading: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ chatHistory, onSendMessage, patientName, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-[#161B22] border border-slate-700 rounded-lg flex flex-col h-[75vh] max-h-[800px]">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-bold text-cyan-400">Consultation with {patientName}</h3>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'patient' && <div className="w-8 h-8 rounded-full bg-cyan-900 flex items-center justify-center font-bold text-sm flex-shrink-0 text-cyan-300">{patientName.charAt(0)}</div>}
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
             {msg.sender === 'user' && <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center font-bold text-sm flex-shrink-0">YOU</div>}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-end gap-2">
                 <div className="w-8 h-8 rounded-full bg-cyan-900 flex items-center justify-center font-bold text-sm flex-shrink-0 text-cyan-300">{patientName.charAt(0)}</div>
                <div className="p-3 rounded-lg bg-slate-700 text-slate-200 rounded-bl-none">
                    <div className="flex items-center space-x-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse-fast"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse-medium"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse-slow"></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question..."
            className="flex-1 bg-[#0D1117] border border-slate-600 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            disabled={isLoading}
          />
          <button onClick={handleSend} disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-full p-2.5 transition duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed">
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;