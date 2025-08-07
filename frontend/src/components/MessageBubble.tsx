const MessageBubble = ({ text, sender }: { text: string; sender: 'bot' | 'user' }) => (
  <div className={`p-2 rounded mb-1 ${sender === 'bot' ? 'bg-white' : 'bg-yellow-300 text-right'}`}>
    <div className="whitespace-pre-wrap">{text}</div>
  </div>
);

export default MessageBubble;
