import React, { useEffect, useRef, useState } from 'react';
import { api } from '../api';
import './SchoolChat.css';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export default function SchoolChat({ open, setOpen }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: '안녕하세요! 원하는 학교 조건을 말씀해 주시면 딱 맞는 학교를 추천해 드릴게요 😊' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    const query = input.trim();
    if (!query || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: query }]);
    setLoading(true);
    try {
      const res = await api.chatSchool({ query });
      setMessages(prev => [...prev, { role: 'ai', text: res.answer }]);
    } catch {
      setMessages(prev => [...prev, { role: 'ai', text: '죄송해요, 답변을 가져오지 못했어요.' }]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(v => !v)} title="AI 학교 추천 채팅">
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            <span>🤖 AI 학교 추천</span>
            <button className="chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble chat-bubble-${m.role}`}>
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="chat-bubble chat-bubble-ai chat-typing">
                <span /><span /><span />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="chat-input-row">
            <textarea
              className="chat-input"
              placeholder="예) 기숙사 있고 IT 분야 학교 알려줘"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              rows={1}
            />
            <button className="chat-send" onClick={send} disabled={loading || !input.trim()}>
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
