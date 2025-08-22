import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ReactNode } from "react";
import { ConnectIcon, SelectFolderIcon, PlayIcon } from './Icons';

interface HowToUseDialogProps {
  children?: ReactNode;
}

const InstructionStep = ({ icon, title, description }: { icon: ReactNode, title: string, description: string }) => (
    <div className="flex flex-col items-center text-center gap-4">
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary">
            {icon}
        </div>
        <div className="space-y-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);

const HowToUseDialog = ({ children }: HowToUseDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">How to Use Drive Slideshow</DialogTitle>
          <DialogDescription className="text-center">
            Creating a slideshow is as easy as 1-2-3!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-8 py-8 sm:grid-cols-3">
            <InstructionStep 
                icon={<ConnectIcon />}
                title="1. Connect Account"
                description="Click 'Connect Google Drive' and sign in to securely link your account."
            />
            <InstructionStep 
                icon={<SelectFolderIcon />}
                title="2. Select Folders"
                description="Browse your folders and click on one or more that contain your favorite pictures."
            />
             <InstructionStep 
                icon={<PlayIcon />}
                title="3. Play Slideshow"
                description="Hit the 'Start Slideshow' button and enjoy your personalized photo journey!"
            />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Got it!</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HowToUseDialog;