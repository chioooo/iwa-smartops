import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export type ChatAction = {
  type: 'navigate' | 'highlight' | 'trigger';
  section?: string;
  elementId?: string;
  triggerAction?: string;
};

type ChatbotContextType = {
  highlightedElement: string | null;
  pendingAction: string | null;
  consumeAction: () => void;
  executeAction: (action: ChatAction) => void;
};

const ChatbotContext = createContext<ChatbotContextType | null>(null);

type ChatbotProviderProps = {
  children: ReactNode;
  onNavigate: (section: string) => void;
};

export function ChatbotProvider({ children, onNavigate }: ChatbotProviderProps) {
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const consumeAction = useCallback(() => {
    setPendingAction(null);
  }, []);

  const executeAction = useCallback((action: ChatAction) => {
    if (action.section) {
      onNavigate(action.section);
    }
    if (action.elementId || action.triggerAction) {
      setTimeout(() => {
        if (action.triggerAction) setPendingAction(action.triggerAction);
        if (action.elementId) {
          setHighlightedElement(action.elementId);
          setTimeout(() => setHighlightedElement(null), 3000);
        }
      }, 100);
    }
  }, [onNavigate]);

  return (
    <ChatbotContext.Provider value={{ highlightedElement, pendingAction, consumeAction, executeAction }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
}
