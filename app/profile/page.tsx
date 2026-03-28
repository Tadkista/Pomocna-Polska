import Image from "next/image";
import Link from "next/link";
import BottomNav from "@/components/layout/BottomNav";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const CURRENT_USER_ID = "u1";

export default async function ProfilePage() {
  // Fetch current user from DB
  const currentUser = await prisma.user.findUnique({
    where: { id: CURRENT_USER_ID },
  });

  // Fetch all IN_PROGRESS requests where this user is author or volunteer
  const activeChats = await prisma.helpRequest.findMany({
    where: {
      status: "IN_PROGRESS",
      OR: [
        { authorId: CURRENT_USER_ID },
        { volunteerId: CURRENT_USER_ID },
      ],
    },
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true },
      },
      volunteer: {
        select: { id: true, name: true, avatarUrl: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const userName = currentUser?.name ?? "Użytkownik";
  const avatarUrl = currentUser?.avatarUrl ?? null;

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen pb-32 w-full max-w-[390px] md:max-w-full mx-auto relative">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#FBFBE2] shadow-sm w-full max-w-[390px] md:max-w-full">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#8F000D] text-2xl">
            volunteer_activism
          </span>
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-xl text-[#8F000D] tracking-tight">
            Mój profil
          </h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F5DC] transition-colors active:scale-95 duration-150">
          <span className="material-symbols-outlined text-[#1B1D0E]">edit</span>
        </button>
      </header>

      <main className="pt-20 px-4">
        {/* Avatar + name */}
        <section className="mt-4 flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-highest shadow-xl">
              {avatarUrl ? (
                <Image
                  alt="Avatar użytkownika"
                  className="w-full h-full object-cover"
                  src={avatarUrl}
                  width={128}
                  height={128}
                />
              ) : (
                <div className="w-full h-full bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-5xl">
                    person
                  </span>
                </div>
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-secondary rounded-full p-2 border-4 border-surface shadow-lg">
              <span
                className="material-symbols-outlined text-on-secondary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
          </div>
          <div className="text-center mt-6">
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">
              {userName}
            </h2>
          </div>
        </section>

        {/* Active Chats */}
        <section className="mt-8 mb-6">
          <h3 className="text-lg font-extrabold text-on-surface px-2 mb-4">
            Aktywne rozmowy
          </h3>
          {activeChats.length === 0 ? (
            <div className="bg-surface-container-lowest p-6 rounded-2xl text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">
                chat_bubble_outline
              </span>
              <p className="text-on-surface-variant font-medium text-sm">
                Brak aktywnych rozmów
              </p>
              <Link
                href="/feed"
                className="inline-block mt-3 px-4 py-2 bg-primary text-on-primary rounded-xl font-bold text-sm"
              >
                Przeglądaj prośby
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeChats.map((chat) => {
                // Determine who the partner is
                const partner =
                  chat.authorId === CURRENT_USER_ID
                    ? chat.volunteer
                    : chat.author;
                const partnerName = partner?.name ?? "Rozmówca";
                const isVolunteer = chat.volunteerId === CURRENT_USER_ID;

                return (
                  <Link
                    key={chat.id}
                    href={`/chat/${chat.id}`}
                    className="bg-surface-container-lowest p-4 rounded-2xl flex items-center justify-between hover:bg-surface-container-low transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl">
                        {isVolunteer ? "😇" : "🤝"}
                      </div>
                      <div>
                        <p className="font-bold text-on-surface leading-tight">
                          {chat.title}
                        </p>
                        <p className="text-[12px] text-on-surface-variant">
                          Z: {partnerName}
                        </p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-primary">
                      chat
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
