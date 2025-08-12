import { useEffect, useMemo, useRef, useState } from 'react';
import { useScenarioStore } from '../store/useScenarioStore';
import MessageBubble from './MessageBubble';
import QuickReplyButtons from './QuickReplyButtons';

const ChatBot = () => {
  const scenarioData = useScenarioStore((state) => state.scenarioData);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([]);
  const [slotValues, setSlotValues] = useState<Record<string, string>>({});
  const [isAwaitingCondition, setIsAwaitingCondition] = useState(false);

  const chatInputRef = useRef<HTMLInputElement>(null);

  const isEndOfConversation = useMemo(() => {
    if (!currentNodeId) return false;
    return !scenarioData.edges.some((e) => e.source === currentNodeId);
  }, [currentNodeId, scenarioData.edges]);

  const stableScenario = useMemo(() => {
    return {
      nodes: scenarioData.nodes.map(({ id, type, data }) => ({ id, type, data })),
      edges: scenarioData.edges,
    };
  }, [scenarioData.nodes, scenarioData.edges]);

  const replaceTemplateVariables = (text: string, slots: Record<string, string>) =>
    text.replace(/\{(\w+)\}/g, (_, key) => slots[key] ?? `{${key}}`);

  const initializeChat = () => {
    const { nodes, edges } = stableScenario;
    const startNode = nodes.find((node) => !edges.some((edge) => edge.target === node.id));
    if (startNode) {
      setCurrentNodeId(startNode.id);
      const firstMessage = replaceTemplateVariables((startNode.data as any).value, slotValues);
      setMessages([{ sender: 'bot', text: firstMessage }]);
      setSlotValues({});
      setIsAwaitingCondition(false);
    }
  };

  useEffect(() => {
    initializeChat();
  }, []);

  const handleReply = (value: string) => {
    const currentNode = scenarioData.nodes.find((n) => n.id === currentNodeId);
    if (!currentNode) return;

    setMessages((prev) => [...prev, { sender: 'user', text: value }]);

    const slotKey = (currentNode.data as any).slotKey;
    const newSlotValues = slotKey ? { ...slotValues, [slotKey]: value } : slotValues;
    if (slotKey) setSlotValues(newSlotValues);

    const nextEdge = scenarioData.edges.find((e) => e.source === currentNode.id);
    const nextNode = scenarioData.nodes.find((n) => n.id === nextEdge?.target);

    if (nextNode) {
      if (nextNode.type === 'conditionNode') {
        const replaced = replaceTemplateVariables(nextNode.data.value, newSlotValues);
        setMessages((prev) => [...prev, { sender: 'bot', text: replaced }]);
        setCurrentNodeId(nextNode.id);
        setIsAwaitingCondition(true);
        return;
      }
      const replaced = replaceTemplateVariables((nextNode.data as any).value, newSlotValues);
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: 'bot', text: replaced }]);
        setCurrentNodeId(nextNode.id);
      }, 300);
    } else {
      setCurrentNodeId(null);
    }
  };

  const handleConditionReply = (isTrue: boolean) => {
    const currentNode = scenarioData.nodes.find(n => n.id === currentNodeId);
    if (!currentNode) return;

    const edge = scenarioData.edges.find(
      (e: any) => e.source === currentNode.id && e.sourceHandle === (isTrue ? 'true' : 'false')
    );
    const nextNode = scenarioData.nodes.find((n) => n.id === edge?.target);

    if (nextNode) {
      const replaced = replaceTemplateVariables((nextNode.data as any).value, slotValues);
      setMessages((prev) => [...prev, { sender: 'user', text: isTrue ? '확인' : '취소' }]);
      setMessages((prev) => [...prev, { sender: 'bot', text: replaced }]);
      setCurrentNodeId(nextNode.id);
    } else {
      setCurrentNodeId(null);
    }
    setIsAwaitingCondition(false);
  };

  const currentNode = scenarioData.nodes.find((n) => n.id === currentNodeId);
  const quickReplies = (currentNode?.data as any)?.quickReplies;

  return (
    <div className="flex flex-col h-screen">
      {/* 상단 바 */}
      <div className="flex justify-between items-center px-4 py-2 bg-white border-b">
        <span className="font-bold text-lg">챗봇</span>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 bg-blue-100 overflow-auto px-4 py-2">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} text={msg.text} sender={msg.sender} />
        ))}
      </div>

      {/* 하단 입력 UI */}
      <div className="bg-white border-t p-[5px]">
        {isAwaitingCondition ? (
          <div className="flex gap-[5px]">
            <button
              className="w-full h-10 border rounded-md hover:bg-gray-100"
              onClick={() => handleConditionReply(true)}
            >
              확인
            </button>
            <button
              className="w-full h-10 border rounded-md hover:bg-gray-100"
              onClick={() => handleConditionReply(false)}
            >
              취소
            </button>
          </div>
        ) : currentNodeId && !isEndOfConversation ? (
          quickReplies?.length ? (
            <QuickReplyButtons replies={quickReplies} onSelect={handleReply} />
          ) : (
            <div className="flex items-center gap-[5px]">
              <input
                ref={chatInputRef}
                type="text"
                className="flex-1 h-10 px-3 border rounded-md text-sm"
                placeholder="메시지를 입력하세요..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    handleReply(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              <button
                className="h-10 px-4 bg-blue-500 text-white rounded-md text-sm whitespace-nowrap"
                onClick={() => {
                  const input = chatInputRef.current;
                  if (input && input.value) {
                    handleReply(input.value);
                    input.value = '';
                  }
                }}
              >
                전송
              </button>
            </div>
          )
        ) : (
          <button
            onClick={initializeChat}
            className="w-full h-10 border rounded-md hover:bg-gray-100"
          >
            대화 다시 시작하기
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
