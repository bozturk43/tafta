"use client";

import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import {
    Avatar,
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import MessageDialog from "@/components/MessageDialog";

type Conversation = {
    id: string;
    other: {
        id: string;
        name: string;
        avatar: string | null;
    };
    lastMessage: string;
    lastMessageDate: string;
};

export default function MessagesInner() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch("/api/message/get-conversations", {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                });
                const data = await res.json();
                setConversations(data.conversations || []);
            } catch (err) {
                console.error("Mesajlar alınamadı:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.token) {
            fetchConversations();
        }
    }, [user]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    console.log(conversations);

    return (
        <>
            <Box display="flex" height="100vh">
                {/* Sol: Conversation List */}
                <Box
                    width="100%"
                    overflow="auto"
                    p={2}
                >
                    <Typography variant="h6" mb={2}>
                        Mesajlar
                    </Typography>
                    <List>
                        {conversations.map((conv) => (
                            <Box key={conv.id} sx={{ backgroundColor: "#a9a9a9", borderRadius: "20px", marginBottom: 2 }}>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => setSelectedConversation(conv)}>

                                        <ListItemAvatar>
                                            <Avatar src={conv.other.avatar || undefined}>
                                                {conv.other.name?.[0] || "?"}
                                            </Avatar>
                                        </ListItemAvatar>

                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {conv.other.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body2" color="text.secondary" noWrap>
                                                    {conv.lastMessage}
                                                </Typography>
                                            }
                                        />

                                        <Typography variant="caption" color="text.secondary" ml={1} whiteSpace="nowrap">
                                            {conv.updatedAt}
                                        </Typography>
                                    </ListItemButton>
                                </ListItem>
                                <MessageDialog
                                    open={isModalOpen}
                                    recieverImage={conv.other.avatar}
                                    recieverName={conv.other.name}
                                    onClose={() => setIsModalOpen(false)}
                                    receiverId={conv.other.id}
                                />
                            </Box>
                        ))}
                    </List>
                </Box>
            </Box>
            {selectedConversation && (
                <MessageDialog
                    open={true}
                    recieverImage={selectedConversation.other.avatar || ""}
                    recieverName={selectedConversation.other.name}
                    receiverId={selectedConversation.other.id || ""}
                    onClose={() => setSelectedConversation(null)}
                />
            )}
        </>
    );
}
