// Floating RAG-powered chat widget.
//
// Renders a Fab button fixed at the bottom-right corner of every page.
// Clicking it opens a Drawer with a full conversation interface.
// Messages are sent to POST /chat (FastAPI RAG endpoint) via chatApi.ts.
//
// Theme rules (MUI v9):
//   - All colors use theme tokens via useTheme() / sx props.
//   - No hardcoded hex values in sx props.
//   - Inline style props (where sx is not available) use conditional:
//       dark ? "#lightHex" : "#darkHex"
//   - InputProps is deprecated in MUI v9 — slotProps is used throughout.

import { useState, useRef, useEffect } from "react";
import {
  Box,
  Drawer,
  Fab,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
  Divider,
  useTheme,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";

import { sendChatMessage } from "../../api/chatApi";
import type { ChatMessage } from "../../api/chatApi";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DRAWER_WIDTH = 380;

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "¡Hola! Soy tu guía turístico virtual de TUI. " +
    "Puedo ayudarte a descubrir destinos sostenibles en España, " +
    "comparar precios, niveles de congestión o puntuaciones de sostenibilidad. " +
    "¿En qué puedo ayudarte hoy?",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface MessageBubbleProps {
  message: ChatMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  const theme = useTheme();
  const isUser = message.role === "user";
  const dark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isUser ? "row-reverse" : "row",
        alignItems: "flex-start",
        gap: 1,
        mb: 1.5,
      }}
    >
      {/* Avatar icon */}
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          bgcolor: isUser ? "primary.main" : "secondary.main",
          color: "primary.contrastText",
        }}
      >
        {isUser ? (
          <PersonIcon sx={{ fontSize: 18 }} />
        ) : (
          <SmartToyIcon sx={{ fontSize: 18 }} />
        )}
      </Box>

      {/* Bubble */}
      <Box
        sx={{
          maxWidth: "78%",
          px: 1.5,
          py: 1,
          borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
          bgcolor: isUser ? "primary.main" : "action.hover",
          color: isUser ? "primary.contrastText" : "text.primary",
        }}
      >
        <Typography
          variant="body2"
          sx={{ whiteSpace: "pre-wrap", lineHeight: 1.55 }}
          style={{
            // pre-wrap wraps correctly but we need the font colour right for
            // inline style context (not an sx prop — conditional is fine here)
            color: isUser
              ? undefined // inherited from sx bgcolor contrast
              : dark
              ? "#E2E8F0"
              : "#0F172A",
          }}
        >
          {message.content}
        </Typography>
      </Box>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------

export default function ChatWidget() {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: ChatMessage = { role: "user", content: trimmed };

    // Optimistic UI — show user message immediately
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      // Build history (exclude the welcome message from API history to keep
      // context clean — only real back-and-forth exchanges)
      const apiHistory = updatedMessages.slice(1); // skip welcome
      const reply = await sendChatMessage(trimmed, apiHistory.slice(0, -1));

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Lo siento, ha ocurrido un error al conectar con el servidor. " +
            "Por favor, inténtalo de nuevo. ¿Puedo ayudarte con algo más?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Floating action button                                               */}
      {/* ------------------------------------------------------------------ */}
      <Fab
        color="primary"
        aria-label="Abrir chat de asistencia"
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1300,
          boxShadow: 6,
        }}
      >
        <ChatIcon />
      </Fab>

      {/* ------------------------------------------------------------------ */}
      {/* Chat drawer                                                          */}
      {/* ------------------------------------------------------------------ */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: DRAWER_WIDTH,
            maxWidth: "100vw",
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.paper",
            borderLeft: "1px solid",
            borderColor: "divider",
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1.5,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            flexShrink: 0,
          }}
        >
          <SmartToyIcon />
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
              Asistente TUI
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              Guía de destinos sostenibles en España
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setOpen(false)}
            aria-label="Cerrar chat"
            sx={{ color: "primary.contrastText" }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider />

        {/* Messages area */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            px: 2,
            py: 2,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((msg, idx) => (
            <MessageBubble key={idx} message={msg} />
          ))}

          {/* Loading indicator */}
          {loading && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "secondary.main",
                  color: "primary.contrastText",
                  flexShrink: 0,
                }}
              >
                <SmartToyIcon sx={{ fontSize: 18 }} />
              </Box>
              <Box
                sx={{
                  px: 1.5,
                  py: 1,
                  borderRadius: "4px 16px 16px 16px",
                  bgcolor: "action.hover",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CircularProgress size={14} thickness={5} color="inherit" />
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", fontStyle: "italic" }}
                >
                  Buscando destinos…
                </Typography>
              </Box>
            </Box>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </Box>

        <Divider />

        {/* Input area */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            flexShrink: 0,
            bgcolor: "background.paper",
          }}
        >
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Pregunta sobre destinos, precios, sostenibilidad…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            size="small"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleSend}
                      disabled={!input.trim() || loading}
                      edge="end"
                      color="primary"
                      aria-label="Enviar mensaje"
                      size="small"
                    >
                      <SendIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 3,
                  bgcolor: dark ? "action.hover" : "grey.100",
                },
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "divider" },
                "&:hover fieldset": { borderColor: "primary.main" },
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{ color: "text.disabled", mt: 0.5, display: "block" }}
          >
            Presiona Enter para enviar · Shift+Enter para nueva línea
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}
