import { TeamMemberCardSkeleton } from "@/components/team/TeamMemberCardSkeleton";

export default function TeamLoading() {
  return (
    <div className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:px-10">
      <div className="mb-10 h-10 w-48 animate-pulse rounded-lg bg-white/10" />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <TeamMemberCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
