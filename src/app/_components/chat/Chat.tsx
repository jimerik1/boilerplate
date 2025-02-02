"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { formatDistanceToNow } from "date-fns";
import { PencilIcon, TrashIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";

export function Chat() {
  const { data: messages, refetch } = api.post.getMessages.useQuery();
  const createMessage = api.post.createMessage.useMutation({
    onSuccess: () => {
      setMessage("");
      void refetch();  // Added void operator to handle the Promise
    },
  });

  const [message, setMessage] = useState("");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await createMessage.mutateAsync({ content: message });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <div className="flex-1 overflow-y-auto">
        {messages?.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 my-2 rounded-lg shadow-sm 
              ${msg.createdById === "YOUR_SESSION_USER_ID" ? "bg-blue-100 self-end" : "bg-gray-100 self-start"}`}
          >
            <div className="flex justify-between items-center">
              <div className="font-bold">{msg.createdBy.name ?? "Anonymous"}</div>
              <div className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(msg.createdAt))} ago
                {msg.editedAt && <span> (edited)</span>}
              </div>
            </div>
            <p className="mt-1">{msg.name}</p>
            <div className="flex space-x-2 mt-2">
              <button 
                type="button"
                className="text-gray-500 hover:text-gray-700"
                aria-label="Edit message"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button 
                type="button"
                className="text-gray-500 hover:text-gray-700"
                aria-label="Delete message"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              <button 
                type="button"
                className="text-gray-500 hover:text-gray-700"
                aria-label="Like message"
              >
                <HandThumbUpIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={createMessage.status === "pending"}
          className="px-4 py-2 rounded-full bg-blue-500 text-white disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}