// components/MessageDialog.tsx
"use client";

import {
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Slide,
    Box,
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { TransitionProps } from "@mui/material/transitions";
import { useEffect, useState, useRef, forwardRef } from "react";
import { useAuth } from "@/context/authContext";
import Image from "next/image";

type Message = {
    id: string;
    senderId: string;
    content: string;
    timestamp: any;
};

type Props = {
    open: boolean;
    onClose: () => void;
    receiverId: string;
    recieverImage: string;
    recieverName: string;
};

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement },
    ref: React.Ref<unknown>
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function MessageDialog({ open, onClose, receiverId, recieverImage, recieverName }: Props) {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/message/get-messages?user1=${user?.id}&user2=${receiverId}`);
            const data = await res.json();

            const sortedMessages = (data.messages || []).sort((a: Message, b: Message) => {
                const aTime = a.timestamp.seconds * 1_000_000_000 + a.timestamp.nanoseconds;
                const bTime = b.timestamp.seconds * 1_000_000_000 + b.timestamp.nanoseconds;
                return aTime - bTime;
            });

            setMessages(sortedMessages);
        } catch (err) {
            console.error("Mesajlar alınamadı:", err);
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/message/send-message", {
                method: "POST",
                body: JSON.stringify({
                    senderId: user?.id,
                    receiverId,
                    messageContent: input.trim(),
                }),
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();
            if (data.success) {
                setInput("");
                fetchMessages();
            }
        } catch (err) {
            console.error("Mesaj gönderilemedi:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchMessages();
        }
    }, [open, receiverId]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
            <AppBar sx={{ position: "relative" }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                    <div className="flex flex-row w-full p-2 items-center">
                        <div className="w-18 h-18 rounded-full border-4 border-white shadow-lg overflow-hidden">
                            <Image
                                src={recieverImage}
                                alt="Üretici"
                                width={80}
                                height={80}
                                className="object-cover"
                            />
                        </div>
                        <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                            {recieverName}
                        </Typography>
                    </div>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    height: "calc(100% - 64px)",
                    px: 2,
                    py: 1,
                }}
            >
                {/* Mesaj Listesi */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        pb: 2,

                    }}
                >
                    {messages.map((msg) => (
                        <div className="flex flex-col items-start">
                            <Box
                                key={msg.id}
                                sx={{
                                    // alignSelf: msg.senderId === user?.id ? "flex-end" : "flex-start",
                                    bgcolor: msg.senderId === user?.id ? "primary.light" : "grey.300",
                                    color: "black",
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    maxWidth: "70%",
                                }}
                            >
                                {msg.content}
                            </Box>
                            <p className={`${"text-start"} text-[9px]`}>{msg.senderId === user?.id ? "Siz" : `${recieverName}`}</p>

                        </div>
                    ))}
                    <div ref={bottomRef} />
                </Box>

                {/* Mesaj Gönderme Alanı */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        pt: 1,
                        borderTop: "1px solid #ccc",
                    }}
                >
                    <TextField
                        fullWidth
                        placeholder="Mesaj yaz..."
                        variant="outlined"
                        size="small"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button variant="contained" disabled={loading || !input.trim()} onClick={sendMessage}>
                        {loading ? <CircularProgress size={20} /> : "Gönder"}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
}
