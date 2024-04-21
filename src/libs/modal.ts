export const showModal = (modalId: string) => {
  const modal = document.getElementById(modalId) as HTMLDialogElement | null;
  if (modal) {
    modal.showModal();
  }
};

export const hideModal = (modalId: string) => {
  const modal = document.getElementById(modalId) as HTMLDialogElement | null;
  if (modal) {
    modal.close();
  }
};
