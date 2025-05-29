import { Chat, Message } from "@/types/chat";

const createMessage = (
  id: string,
  text: string,
  type: "sent" | "received",
  timestamp: Date,
  showTip?: boolean
): Message => ({
  id,
  text,
  type,
  timestamp,
  showTip,
});

export const mockChats: Chat[] = [
  {
    id: "1",
    vendorName: "Haley James",
    vendorId: "vendor-1",
    lastMessage: "Stand up for what you believe in",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unreadCount: 9,
    messages: [
      createMessage(
        "1-1",
        "Hey Lucas!",
        "received",
        new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        false
      ),
      createMessage(
        "1-2",
        "How's your project going?",
        "received",
        new Date(Date.now() - 1000 * 60 * 60 * 2 + 1000 * 30), // 1.5 hours ago
        true
      ),
      createMessage(
        "1-3",
        "Hi Haley!",
        "sent",
        new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        false
      ),
      createMessage(
        "1-4",
        "It's going well. Thanks for asking!",
        "sent",
        new Date(Date.now() - 1000 * 60 * 60 + 1000 * 30), // 30 minutes ago
        true
      ),
      createMessage(
        "1-5",
        "No worries. Let me know if you need any help 😉",
        "received",
        new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        true
      ),
    ],
  },
  {
    id: "2",
    vendorName: "Nathan Scott",
    vendorId: "vendor-2",
    lastMessage:
      "One day you're seventeen and planning for someday. And then quietly and without...",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    unreadCount: 0,
    messages: [
      createMessage(
        "2-1",
        "Hey Nathan! How's the basketball training going?",
        "sent",
        new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        false
      ),
      createMessage(
        "2-2",
        "One day you're seventeen and planning for someday. And then quietly and without you ever really noticing, someday is today.",
        "received",
        new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        true
      ),
    ],
  },
  {
    id: "3",
    vendorName: "Brooke Davis",
    vendorId: "vendor-3",
    lastMessage: "I am who I am. No excuses.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    unreadCount: 2,
    messages: [
      createMessage(
        "3-1",
        "Hey Brooke! Love your latest fashion designs!",
        "sent",
        new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        false
      ),
      createMessage(
        "3-2",
        "I am who I am. No excuses.",
        "received",
        new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        true
      ),
    ],
  },
  {
    id: "4",
    vendorName: "Jamie Scott",
    vendorId: "vendor-4",
    lastMessage: "Some people are a little different. I think that's cool.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    unreadCount: 0,
    messages: [
      createMessage(
        "4-1",
        "Jamie! How's the music coming along?",
        "sent",
        new Date(Date.now() - 1000 * 60 * 60 * 9), // 9 hours ago
        false
      ),
      createMessage(
        "4-2",
        "Some people are a little different. I think that's cool.",
        "received",
        new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        true
      ),
    ],
  },
  {
    id: "5",
    vendorName: "Marvin McFadden",
    vendorId: "vendor-5",
    lastMessage:
      "Last night in the NBA the Charlotte Bobcats quietly made a move that most sports fans...",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    unreadCount: 0,
    messages: [
      createMessage(
        "5-1",
        "Hey Marvin! What's the latest sports news?",
        "sent",
        new Date(Date.now() - 1000 * 60 * 60 * 13), // 13 hours ago
        false
      ),
      createMessage(
        "5-2",
        "Last night in the NBA the Charlotte Bobcats quietly made a move that most sports fans probably missed.",
        "received",
        new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
        true
      ),
    ],
  },
  {
    id: "6",
    vendorName: "Antwon Taylor",
    vendorId: "vendor-6",
    lastMessage: "Meet me at the Rivercourt",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 0,
    messages: [
      createMessage(
        "6-1",
        "Antwon! Want to play some basketball?",
        "sent",
        new Date(Date.now() - 1000 * 60 * 60 * 25), // 25 hours ago
        false
      ),
      createMessage(
        "6-2",
        "Meet me at the Rivercourt",
        "received",
        new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        true
      ),
    ],
  },
  {
    id: "7",
    vendorName: "Jake Jagielski",
    vendorId: "vendor-7",
    lastMessage:
      "In your life, you're gonna go to some great places, and do some wonderful things.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    unreadCount: 0,
    messages: [
      createMessage(
        "7-1",
        "Jake! How's life treating you?",
        "sent",
        new Date(Date.now() - 1000 * 60 * 60 * 49), // 49 hours ago
        false
      ),
      createMessage(
        "7-2",
        "In your life, you're gonna go to some great places, and do some wonderful things.",
        "received",
        new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
        true
      ),
    ],
  },
  {
    id: "8",
    vendorName: "Peyton Sawyer",
    vendorId: "vendor-8",
    lastMessage: "Every song ends, is that any reason not to enjoy the music?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    unreadCount: 0,
    messages: [
      createMessage(
        "8-1",
        "Peyton! Love your art work!",
        "sent",
        new Date(Date.now() - 1000 * 60 * 60 * 73), // 73 hours ago
        false
      ),
      createMessage(
        "8-2",
        "Every song ends, is that any reason not to enjoy the music?",
        "received",
        new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
        true
      ),
    ],
  },
];
