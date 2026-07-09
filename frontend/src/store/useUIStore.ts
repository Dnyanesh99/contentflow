import { create } from "zustand";

interface ToastState {
  text: string;
  isError: boolean;
}

interface UIState {
  selectedNodeId: string | null;
  toast: ToastState | null;
  nodeExecutionStatus: Record<string, "Success" | "Failed" | "Pending">;
  setSelectedNodeId: (id: string | null) => void;
  showToast: (text: string, isError?: boolean) => void;
  hideToast: () => void;
  setNodeExecutionStatus: (
    status: Record<string, "Success" | "Failed" | "Pending">
  ) => void;
}

let _toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

export const useUIStore = create<UIState>((set) => ({
  selectedNodeId: null,
  toast: null,
  nodeExecutionStatus: {},

  setSelectedNodeId: (id) => {
    set({ selectedNodeId: id });
  },

  showToast: (text, isError = false) => {
    if (_toastTimeoutId !== null) {
      clearTimeout(_toastTimeoutId);
      _toastTimeoutId = null;
    }

    _toastTimeoutId = setTimeout(() => {
      _toastTimeoutId = null;
      useUIStore.setState({ toast: null });
    }, 3000);

    set({ toast: { text, isError } });
  },

  hideToast: () => {
    if (_toastTimeoutId !== null) {
      clearTimeout(_toastTimeoutId);
      _toastTimeoutId = null;
    }
    set({ toast: null });
  },

  setNodeExecutionStatus: (status) => {
    set({ nodeExecutionStatus: status });
  },
}));
