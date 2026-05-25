import type { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

type ModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  children: ReactNode;
  className?: string;
};

function Modal({ open, setOpen, title, children, className = "" }: ModalProps) {
  return (
    <Dialog modal open={open} onOpenChange={setOpen}>
      <DialogContent
        aria-describedby={undefined}
        className={`${className} max-h-[90dvh] flex flex-col overflow-y-auto`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
