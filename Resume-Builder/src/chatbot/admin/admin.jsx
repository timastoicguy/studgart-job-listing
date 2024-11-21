// // frontend/src/components/AdminChat.js
// import  { useState, useEffect } from 'react';
// import { io } from 'socket.io-client';

// const socket = io(import.meta.env.VITE_BACKEND_API);

// const AdminChat = () => {
//   const [chatList, setChatList] = useState([]);
//   const [currentChat, setCurrentChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');

//   useEffect(() => {
//     // Fetch active chats
//     const fetchChatList = async () => {
//       const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/admin/chat-list`);
//       const data = await response.json();
//       setChatList(data);
//     };
//     fetchChatList();

//     socket.on('admin-message', (data) => {
//       setMessages((prev) => [...prev, { sender: 'user', content: data.message }]);
//     });
//   }, []);

//   const selectChat = async (userId) => {
//     const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/api/chat-history?userId=${userId}`);
//     const data = await response.json();
//     setCurrentChat(userId);
//     setMessages(data.messages);
//     await fetch(`${import.meta.env.VITE_BACKEND_API}/api/admin/pause-chatbot`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId }),
//     });
//   };

//   const sendMessage = async () => {
//     await fetch(`${import.meta.env.VITE_BACKEND_API}/api/admin-message`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ userId: currentChat, message: input }),
//     });
//     setMessages((prev) => [...prev, { sender: 'admin', content: input }]);
//     setInput('');
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="w-1/3 border-r p-4 bg-gray-100">
//         <h2 className="text-lg font-semibold mb-4">Customer Chats</h2>
//         {chatList.map((chat) => (
//           <button
//             key={chat.userId}
//             onClick={() => selectChat(chat.userId)}
//             className="block w-full text-left px-4 py-2 mb-2 bg-white rounded-lg shadow-sm hover:bg-gray-200"
//           >
//             Chat with {chat.userId} ({chat.activeResponder === 'admin' ? '👤' : '🤖'})
//           </button>
//         ))}
//       </div>
//       <div className="w-2/3 p-4">
//         {currentChat ? (
//           <>
//             <h2 className="text-lg font-semibold mb-4">Chat with {currentChat}</h2>
//             <div className="flex flex-col h-full">
//               <div className="flex-grow overflow-y-auto bg-gray-50 p-4 rounded-lg mb-4">
//                 {messages.map((msg, index) => (
//                   <div key={index} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
//                     <div className={`p-2 rounded-lg ${msg.sender === 'admin' ? 'bg-blue-200' : 'bg-gray-200'}`}>
//                       <span>{msg.sender === 'admin' ? '👤' : '🤖'}: {msg.content}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex">
//                 <input
//                   type="text"
//                   value={input}
//                   onChange={(e) => setInput(e.target.value)}
//                   className="flex-grow p-2 border rounded-l-lg"
//                   placeholder="Type a message..."
//                 />
//                 <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">Send</button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <p>Select a chat to view messages</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminChat;
