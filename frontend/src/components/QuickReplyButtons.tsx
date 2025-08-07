import type { QuickReply } from '../types/scenario';

const QuickReplyButtons = ({
  replies,
  onSelect,
}: {
  replies: QuickReply[];
  onSelect: (value: string) => void;
}) => (
  <div className="flex space-x-2 mt-4">
    {replies.map((r) => (
      <button
        key={r.value}
        className="px-4 py-2 border rounded bg-white hover:bg-gray-100"
        onClick={() => onSelect(r.value)}
      >
        {r.label}
      </button>
    ))}
  </div>
);

export default QuickReplyButtons;
