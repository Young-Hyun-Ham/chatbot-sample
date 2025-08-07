import { useEffect, useMemo, useRef, useState } from 'react';
import { useScenarioStore } from '../store/useScenarioStore';
import MessageBubble from './MessageBubble';
import QuickReplyButtons from './QuickReplyButtons';
import type { ConditionNode, TextNode } from '../types/scenario';

const ChatBot = () => {
  const scenarioData = useScenarioStore((state) => state.scenarioData);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([]);
  const [slotValues, setSlotValues] = useState<Record<string, string>>({});
  const [isAwaitingCondition, setIsAwaitingCondition] = useState(false);

  // input 객체 선언
  const chatInputRef = useRef<HTMLInputElement>(null); // 선언

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

  const replaceTemplateVariables = (text: string, slots: Record<string, string>) => {
    return text.replace(/\{(\w+)\}/g, (_, key) => slots[key] ?? `{${key}}`);
  };

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

    // 사용자 메시지 추가
    setMessages((prev) => [...prev, { sender: 'user', text: value }]);

    // 슬롯 저장 (비동기 상태 업데이트 회피 → 직접 업데이트된 값을 사용)
    const slotKey = (currentNode.data as any).slotKey;
    const newSlotValues = slotKey
      ? { ...slotValues, [slotKey]: value }
      : slotValues;

    if (slotKey) {
      setSlotValues(newSlotValues);
    }

    // 다음 노드 찾기
    const nextEdge = scenarioData.edges.find((e) => e.source === currentNode.id);
    const nextNode = scenarioData.nodes.find((n) => n.id === nextEdge?.target);

    if (nextNode) {
      // 컨디션 노드면 텍스트만 출력하고 버튼 대기
      if (nextNode.type === 'conditionNode') {
        const replaced = replaceTemplateVariables(nextNode.data.value, newSlotValues);
        setMessages((prev) => [...prev, { sender: 'bot', text: replaced }]);
        setCurrentNodeId(nextNode.id);
        setIsAwaitingCondition(true);
        return;
      }

      // 일반 노드 처리
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
        <button
          onClick={initializeChat}
          className="px-3 py-1 border rounded-full text-sm hover:bg-gray-100"
        >
          다시 시작
        </button>
      </div>

      {/* 채팅 메시지 영역 */}
      <div className="flex-1 bg-blue-100 overflow-auto px-4 py-2">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} text={msg.text} sender={msg.sender} />
        ))}
      </div>

      {/* 하단 입력 UI */}
      <div className="p-4 bg-white border-t">
        {isAwaitingCondition ? (
          <div className="flex space-x-2">
            <button
              className="w-full py-2 border rounded-full hover:bg-gray-100"
              onClick={() => handleConditionReply(true)}
            >
              확인
            </button>
            <button
              className="w-full py-2 border rounded-full hover:bg-gray-100"
              onClick={() => handleConditionReply(false)}
            >
              취소
            </button>
          </div>
        ) : currentNodeId && !isEndOfConversation ? (
          quickReplies?.length ? (
            <QuickReplyButtons replies={quickReplies} onSelect={handleReply} />
          ) : (
            <div className="flex items-center gap-[2px] mt-2 px-[2px]">
            <input
              ref={chatInputRef}
              type="text"
              className="flex-1 px-[6px] py-[2px] border rounded text-sm"
              placeholder="메시지를 입력하세요..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value) {
                  handleReply(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              className="px-[12px] py-[6px] bg-blue-500 text-white rounded text-sm whitespace-nowrap mr-[2px]"
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
            className="w-full py-2 border rounded-full hover:bg-gray-100"
          >
            대화 다시 시작하기
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
