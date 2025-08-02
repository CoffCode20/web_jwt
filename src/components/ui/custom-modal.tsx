import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React from "react";

interface CustomModalProps {
  title: string;
  children: React.ReactElement<{ onClose: () => void }>;
}

export function CustomModal({ title, children }: CustomModalProps) {
  const [open, setOpen] = React.useState(true); 

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>
          {React.cloneElement(children, {
            onClose: () => setOpen(false),
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
