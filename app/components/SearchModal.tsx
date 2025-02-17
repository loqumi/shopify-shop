import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import styles from '~/styles/search/search.module.css';

type ModalType = 'search' | 'closed';
type ModalContextValue = {
  type: ModalType;
  open: (mode: ModalType) => void;
  close: () => void;
};

export function Modal({
  children,
  type,
}: {
  children?: React.ReactNode;
  type: ModalType;
}) {
  const {type: activeType, close} = useSearchModal();
  const expanded = type === activeType;

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`${styles.modal} ${expanded ? `${styles.show}` : ''}`}
      role="dialog"
    >
      {children}
    </div>
  );
}

const ModalSearchContext = createContext<ModalContextValue | null>(null);

Modal.Provider = function SearchModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [type, setType] = useState<ModalType>('closed');

  return (
    <ModalSearchContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </ModalSearchContext.Provider>
  );
};

export function useSearchModal() {
  const modal = useContext(ModalSearchContext);
  if (!modal) {
    throw new Error('useSearchModal must be used within a SearchModalProvider');
  }
  return modal;
}
