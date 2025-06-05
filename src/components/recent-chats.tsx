"use client";

import Image from "next/image";

interface RecentChatsProps {
  agentId: string;
}

const recentChats = [
  {
    id: "1",
    user: "Alice Cooper",
    message: "Hey, are you available for a call tomorrow?",
    time: "10:22 AM",
    avatar: "/avatars/alice.jpg",
    agentId: "agent-1",
  },
  {
    id: "2",
    user: "Bob Marley",
    message: "Sent the docs. Please check your inbox.",
    time: "11:01 AM",
    avatar: "/avatars/bob.jpg",
    agentId: "agent-2",
  },
  {
    id: "3",
    user: "Carol King",
    message: "Thanks for the update!",
    time: "11:45 AM",
    avatar: "/avatars/carol.jpg",
    agentId: "agent-1",
  },
  {
    id: "4",
    user: "David Bowie",
    message: "Can we reschedule the meeting?",
    time: "1:09 PM",
    avatar: "/avatars/david.jpg",
    agentId: "agent-3",
  },
];

export default function RecentChats({ agentId }: RecentChatsProps) {
  const filteredChats = !agentId
    ? recentChats
    : recentChats.filter((chat) => chat.agentId === agentId);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-6">Recent Chats</h2>
      <ul role="list" className="divide-y divide-gray-200">
        {filteredChats.map((chat) => (
          <li
            key={chat.id}
            className="flex items-center py-4 hover:bg-gray-50 rounded-md cursor-pointer"
          >
            <Image
              src={chat.avatar}
              alt={`${chat.user} avatar`}
              width={48}
              height={48}
              className="rounded-full"
              unoptimized={true}
            />
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-900">{chat.user}</p>
              <p className="text-sm text-gray-500 truncate max-w-xs">
                {chat.message}
              </p>
            </div>
            <div className="text-xs text-gray-400 whitespace-nowrap ml-4">
              {chat.time}
            </div>
          </li>
        ))}
        {filteredChats.length === 0 && (
          <li className="text-center text-sm text-gray-500 py-6">
            No chats found.
          </li>
        )}
      </ul>
    </div>
  );
}
