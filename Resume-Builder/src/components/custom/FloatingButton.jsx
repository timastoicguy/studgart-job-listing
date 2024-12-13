import { useState } from 'react';
import { MessageCircleCode } from 'lucide-react';
import ChatBot from './ChatBot';

const FloatingButton = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);


    const toggleChat = () => {
        if (isChatOpen) {
            setIsHidden(!isHidden);
        } else {
            setIsChatOpen(true);
        }
    };

    const closeChat = () => {
        setIsChatOpen(false);
    }

    return (
        <div className="fixed bottom-4 right-4">
            <button
                onClick={toggleChat}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg focus:outline-none"
            >
                <MessageCircleCode className="w-6 h-6" />
            </button>
            {isChatOpen && (
                <div
                    className={`transition-opacity duration-300 ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
                >
                    <ChatBot onClose={closeChat} />
                </div>
            )}
        </div>
    );
};

export default FloatingButton;
