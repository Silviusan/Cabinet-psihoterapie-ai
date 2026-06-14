import { Message } from '@/lib/therapists';

interface Props {
  message: Message;
  therapistName: string;
  therapistIcon: string;
}

export default function MessageBubble({ message, therapistName, therapistIcon }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`message-bubble flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className="flex flex-col items-center mr-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-xl">
            {therapistIcon}
          </div>
          <span className="text-xs text-gray-500 mt-1 font-medium">{therapistName}</span>
        </div>
      )}

      <div className="flex flex-col max-w-[80%]">
        {isUser && (
          <span className="text-xs text-gray-500 mb-1 text-right font-medium">Tu</span>
        )}
        <div
          className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-tl-2xl rounded-bl-2xl rounded-tr-sm shadow-md'
              : 'bg-white text-gray-800 shadow rounded-tr-2xl rounded-br-2xl rounded-tl-sm border border-gray-100'
          }`}
        >
          {message.content}
        </div>
      </div>

      {isUser && (
        <div className="flex flex-col items-center ml-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-lg">
            👤
          </div>
        </div>
      )}
    </div>
  );
}
