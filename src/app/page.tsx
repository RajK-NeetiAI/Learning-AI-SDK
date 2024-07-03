'use client';

import { useChat } from 'ai/react';
import { useRef, useEffect, useState } from 'react';
import { readStreamableValue } from 'ai/rsc';
import { continueConversation } from '@/app/actions';
import { type CoreMessage } from 'ai';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [data, setData] = useState<any>();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  return (
    <div className="flex flex-col w-full max-w-xl py-12 mx-auto stretch h-screen scroll">
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <div className="flex-grow overflow-auto scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} className="whitespace-pre-wrap text-justify">
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.content as string}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        className="mt-auto"
        onSubmit={async e => {
          e.preventDefault();
          const newMessages: CoreMessage[] = [
            ...messages,
            { content: input, role: 'user' },
          ];
          setMessages(newMessages);
          setInput('');
          const result = await continueConversation(newMessages);
          console.log(result);
          setData(result.data);
          for await (const content of readStreamableValue(result.message)) {
            setMessages([
              ...newMessages,
              {
                role: 'assistant',
                content: content as string,
              },
            ]);
          }
        }}
      >
        <input
          className="w-full max-w-xl p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={e => setInput(e.target.value)}
        />
      </form>
    </div>
  );
};
