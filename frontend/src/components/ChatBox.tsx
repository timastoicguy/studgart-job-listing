import { useState } from "react";
import { FaPaperPlane, FaRegSmileBeam, FaTimes, FaImage } from "react-icons/fa"; // Import image icon

export default function ChatBox({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<{ user: string; message: string; image?: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState<File | null>(null); // State to store the selected image
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State to store the image preview URL

  const handleSendMessage = () => {
    if (newMessage.trim() || image) {
      const message = { user: "You", message: newMessage };
      if (image) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMessages([...messages, { ...message, image: reader.result as string }]);
        };
        if (image) {
          reader.readAsDataURL(image); // Read image as base64
        }
      } else {
        setMessages([...messages, message]); // Only text message
      }
      setNewMessage(""); // Clear the input after sending the message
      setImage(null); // Clear the selected image after sending
      setImagePreview(null); // Clear the preview
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Set image preview
      };
      reader.readAsDataURL(selectedImage); // Read image as base64 for preview
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result as string); // Set image preview
            setImage(file); // Set image to be sent
          };
          reader.readAsDataURL(file); // Read image as base64 for preview
        }
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg w-[380px] h-[500px] max-h-[80vh] flex flex-col">
      {/* Title */}
      <div className="bg-custom-gradient text-white p-3 rounded-t-md text-lg font-bold">
        Chat
      </div>

      {/* Close Button */}
      <button onClick={onClose} className="absolute top-0 right-2 text-xl text-gray-500 hover:text-gray-700">
        <FaTimes />
      </button>

      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        <div className="flex flex-col space-y-2">
          {messages.length > 0 ? (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.user === "You" ? "justify-end" : "justify-start"}`}>
                <div className={`bg-gray-200 p-3 rounded-lg max-w-[70%] break-words ${msg.user === "You" ? "bg-green-100" : "bg-gray-100"}`}>
                  <p className="font-semibold text-sm">{msg.user}</p>
                  <p>{msg.message}</p>
                  {msg.image && <img src={msg.image} alt="message" className="mt-2 rounded-lg max-w-full" />}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400">No messages yet.</div>
          )}
        </div>
      </div>

      {/* Image preview placed above the message input */}
      {imagePreview && (
        <div className="relative mb-2"> {/* Add margin bottom for spacing */}
          <img
            src={imagePreview}
            alt="preview"
            className="h-32 w-32 object-cover rounded-md" // Adjust size here
          />
          <button
            onClick={() => {
              setImage(null);
              setImagePreview(null);
            }}
            className="absolute top-0 right-0 text-white text-xl bg-black bg-opacity-50 rounded-full p-1"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div className="flex items-center space-x-3 mt-2">
        <button className="text-xl text-gray-500 hover:text-gray-700">
          <FaRegSmileBeam />
        </button>

        {/* Image upload button */}
        <label className="text-xl text-gray-500 cursor-pointer">
          <FaImage />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden" // Hide the default file input
          />
        </label>

        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onPaste={handlePaste} // Handle paste event
          className="w-full p-2 border rounded-md text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Type a message..."
        />

        <button
          onClick={handleSendMessage}
          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
