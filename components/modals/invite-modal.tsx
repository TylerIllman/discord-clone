"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Input } from "../ui/input";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

export const InviteModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === "invite";
    const { server } = data;

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const onNew = async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(
                `/api/servers/${server?.id}/invite-code`
            );

            onOpen("invite", { server: response.data });
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>
                    <div className="p-6">
                        <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                            Sever Invite Link
                        </Label>
                        <div className="flex items-center mt-2 gap-x-2">
                            <Input
                                readOnly
                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                value={inviteUrl}
                                disabled={isLoading}
                            />
                            <Button
                                disabled={isLoading}
                                size="icon"
                                onClick={onCopy}
                            >
                                {copied ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    <Copy className="h-5 w-5" />
                                )}
                            </Button>
                        </div>
                        <Button
                            onClick={onNew}
                            disabled={isLoading}
                            variant="link"
                            size="sm"
                            className="text-xs text-zinc-500 mt-4"
                        >
                            Generate a new link
                            <RefreshCw className="h-4 w-4 ml-2" />
                        </Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
