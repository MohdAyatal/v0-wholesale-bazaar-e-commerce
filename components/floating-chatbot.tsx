'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Phone } from 'lucide-react'

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<{ type: 'user' | 'bot'; text: string }[]>([
    { type: 'bot', text: 'How may I help you?' }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage = inputValue
    setMessages(prev => [...prev, { type: 'user', text: userMessage }])
    setInputValue('')

    // Simulate bot response with API call (using placeholder for now)
    try {
      // In production, this would call your actual chatbot API
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(prev => [...prev, { type: 'bot', text: data.reply }])
      } else {
        // Fallback response
        setMessages(prev => [...prev, { type: 'bot', text: 'Thank you for your message. How else can I help you?' }])
      }
    } catch (error) {
      // Fallback response
      setMessages(prev => [...prev, { type: 'bot', text: 'Thank you for your message. Our team will assist you shortly.' }])
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all z-40 flex items-center justify-center"
        style={{ backgroundColor: 'var(--primary)', color: 'white' }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 w-96 rounded-lg shadow-2xl overflow-hidden z-40 flex flex-col"
          style={{ backgroundColor: 'var(--background)', maxHeight: '500px' }}
        >
          {/* Header */}
          <div className="p-4 text-white" style={{ backgroundColor: 'var(--primary)' }}>
            <h3 className="font-bold">Wholesale Baazar Support</h3>
            <p className="text-sm opacity-90">We&apos;re here to help!</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.type === 'user'
                      ? 'text-white'
                      : 'border'
                  }`}
                  style={{
                    backgroundColor: msg.type === 'user' ? 'var(--primary)' : 'var(--surface)',
                    borderColor: msg.type === 'user' ? 'var(--primary)' : 'var(--border)',
                    color: msg.type === 'user' ? 'white' : 'var(--text-primary)'
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 rounded-lg border"
                style={{ borderColor: 'var(--border)' }}
              />
              <button
                onClick={handleSendMessage}
                className="p-2 rounded-lg text-white transition hover:opacity-90"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
