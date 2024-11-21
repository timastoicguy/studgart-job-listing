import { useEffect, useRef, useState } from "react";
import axios from "axios";
import useAuthStore from "@/stores/authStore";
import socket from '../../../service/socket';
import { X, Paperclip, Send, LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Worker, Viewer, ViewMode } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const ChatBot = ({ onClose }) => {
    const { user } = useAuthStore();
    const [defaultQuestions, setDefaultQuestions] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [attachment, setAttachment] = useState(null);
    const [attachmentPreview, setAttachmentPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef(null); // Ref for scrolling

    useEffect(() => {
        const fetchDefaultQuestions = async () => {
            const response = await axios.get("http://localhost:3000/api/chatbot-api");
            setDefaultQuestions(response.data?.data);
        };
        fetchDefaultQuestions();
        socket.emit('joinConversation', { userId: user?._id });
        socket.on('newMessage', (content) => {

            setChatMessages((prevMessages) => [...prevMessages,
            { text: content?.text, isUser: false, sender: content?.sender }
            ]);
            setIsTyping(false);
        });
        socket.on('typing', () => {
            setIsTyping(true);
        });

        return () => {
            socket.off('newMessage');
            socket.off("typing")
        };

    }, []);

    useEffect(() => {
        // Scroll to the bottom of the chat container
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [chatMessages, loading, isTyping]);


    const handleQuestionClick = async (question) => {
        setChatMessages(
            (prevMessages) => [...prevMessages,
            { text: question, isUser: true }
            ]
        );
        setLoading(true);
        setIsTyping(true);
        const response = await axios.post("http://localhost:3000/api/chatbot-api", {
            user_id: user?._id,
            message: question,
        });
        setChatMessages(
            (prevMessages) => [...prevMessages,
            { text: response.data.data, isUser: false, sender: "bot" }
            ]
        );
        setLoading(false);
        setIsTyping(false);
    };

    const handleSendMessage = async () => {
        if (!userInput && !attachment) return;

        setLoading(true);
        try {
            let fileUrl;
            if (attachment) {
                const formData = new FormData();

                if (attachmentPreview?.type === "image") {
                    formData.append("file", attachment);
                    const fileRespone = await axios.post(
                        "http://localhost:3000/api/upload/upload-single",
                        formData,
                        {
                            headers: { "Content-Type": "multipart/form-data" },
                        }
                    );
                    const url = fileRespone.data.data?.url;
                    fileUrl = url;
                    // response = await axios.post("http://localhost:3000/api/chatbot-api", {
                    //     user_id: user?._id,
                    //     message: userInput,
                    //     url: url,
                    // });

                    socket.emit('userMessage', {
                        user_id: user?._id,
                        message: userInput,
                        url: url,
                    });
                }
                if (attachmentPreview?.type === "pdf") {

                    formData.append('file', attachment);
                    formData.append('user_id', user?._id);
                    formData.append('message', userInput);

                    const response = await axios.post('http://localhost:3000/api/chatbot-api-pdf', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    fileUrl = attachmentPreview?.src;
                }
            }
            else {
                socket.emit('userMessage', {
                    user_id: user?._id,
                    message: userInput,
                });
            }


            setChatMessages([
                ...chatMessages,
                {
                    text: userInput,
                    isUser: true,
                    fileUrl: fileUrl,
                    fileType: attachmentPreview?.type,
                },
            ]);
            setUserInput("");
            setAttachment(null);
            setAttachmentPreview(null);
            setLoading(false);
        } catch (error) {
            setChatMessages([
                ...chatMessages,
                { text: "Something went wrong", isUser: false, sender: "bot" },
            ]);
            setUserInput("");
            setAttachment(null);
            setAttachmentPreview(null);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const removeFile = () => {
        setAttachment(null);
        setAttachmentPreview(null);
    };

    const handleFileChange = (e) => {
        const uploadedFile = e.target.files[0];
        setAttachment(uploadedFile);

        if (uploadedFile && uploadedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => {
                setAttachmentPreview({
                    type: "image",
                    src: URL.createObjectURL(uploadedFile),
                });
            };
            reader.readAsDataURL(uploadedFile);
        } else if (uploadedFile && uploadedFile.type === "application/pdf") {
            setAttachmentPreview({
                type: "pdf",
                src: URL.createObjectURL(uploadedFile),
            });
        }
    };

    const handlePaste = (event) => {
        const clipboardItems = event.clipboardData.items;
        for (const item of clipboardItems) {
            if (item.type.startsWith("image")) {
                const file = item.getAsFile();
                if (file) {
                    setAttachment(file);
                    setAttachmentPreview({
                        type: "image",
                        src: URL.createObjectURL(file),
                    });
                }
            } else if (item.type === "application/pdf") {
                const file = item.getAsFile();
                if (file) {
                    console.log(URL.createObjectURL(file))
                    setAttachment(file);
                    setAttachmentPreview({ type: "pdf", src: URL.createObjectURL(file) });
                }
            }
        }
    };

    return (
        <div className="fixed bottom-20 right-20 w-96 bg-white shadow-lg  rounded-lg p-4 border border-gray-200">
            <div className="flex justify-end mb-2">
                <button onClick={() => {
                    socket.off('newMessage');
                    onClose();

                }} className="text-gray-500">
                    <X className="w-6 h-6 text-gray-600 hover:text-red-500" />
                </button>
            </div>

            <div
                className="h-96 flex flex-col overflow-y-scroll mb-4 space-y-2 p-2 border border-gray-300 rounded-lg scrollbar-hidden"
                ref={chatContainerRef}
            >
                {/* Default Questions */}
                <div className="text-lg font-semibold mb-2 text-gray-800">
                    Câu hỏi mặc định
                </div>
                <ul className="space-y-1 mb-4">
                    {defaultQuestions.map((q, index) => (
                        <li
                            key={index}
                            className="cursor-pointer bg-gray-100 text-gray-800 self-start mr-auto p-2 rounded-lg hover:underline"
                            dangerouslySetInnerHTML={{ __html: q }}
                            onClick={() => handleQuestionClick(q)}
                        ></li>
                    ))}
                </ul>

                {/* Chat Messages */}
                {chatMessages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-lg ${msg.isUser
                            ? "bg-primary text-white self-end"
                            : "bg-gray-100 text-gray-800 self-start"
                            } max-w-[75%]`}
                    >
                        <div dangerouslySetInnerHTML={{ __html: msg.text }}></div>


                        {msg.fileUrl && (
                            <div className="mt-2">
                                {msg.fileType.startsWith("image") && (
                                    <img
                                        src={msg.fileUrl}
                                        alt="uploaded"
                                        className="max-w-40"
                                    />
                                )}
                                {msg.fileType === "pdf" && (
                                    <Worker
                                        workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                                    >
                                        <Viewer fileUrl={msg.fileUrl} initialPage={1}
                                            viewMode={ViewMode.SinglePage}
                                        />
                                    </Worker>
                                )}
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && <div className="p-2 rounded-lg bg-gray-100 text-gray-600 italic self-start mr-auto max-w-[75%]">Bot is typing...</div>}
            </div>

            <div className="flex items-center gap-2 mb-2">
                <Input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                />
                <label htmlFor="file-input" className="cursor-pointer">
                    <Paperclip className="text-gray-500 hover:text-gray-800" />
                </label>

                <Textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}

                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (e.ctrlKey) {
                                e.preventDefault();
                                setUserInput((prev) => prev + '\n');
                            } else {
                                e.preventDefault();
                                handleSendMessage();
                            }

                        }
                    }}
                    onPaste={handlePaste}
                    placeholder="Nhập câu hỏi của bạn..."
                />
                <Button
                    disabled={(!userInput.trim() && !attachment) || loading}
                    onClick={handleSendMessage}
                    className="text-white"
                >
                    {loading ? <LoaderCircle className="animate-spin" /> : <Send />}
                </Button>
            </div>

            {attachmentPreview && (
                <div className="mb-2 relative">
                    <div className="flex items-center justify-between p-2 border border-gray-300 rounded-lg bg-gray-50">
                        {attachmentPreview && attachmentPreview.type === "image" && (
                            <div className="mt-4">
                                <img
                                    src={attachmentPreview.src}
                                    alt="preview"
                                    className="max-h-15 rounded-lg"
                                />
                            </div>
                        )}
                        {attachmentPreview && attachmentPreview.type === "pdf" && (
                            <div className="mt-4">
                                <Worker
                                    workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
                                >
                                    <Viewer fileUrl={attachmentPreview.src} />
                                </Worker>
                            </div>
                        )}
                        <button
                            onClick={removeFile}
                            className="text-gray-500 hover:text-red-500 absolute top-2 right-2"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
