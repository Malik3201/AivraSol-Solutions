export default function TeamProfileLoading() {
  return (
    <div className="animate-pulse border-b border-white/[0.06] bg-[#060a08]">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-4 py-12 md:grid-cols-12 md:py-16 lg:px-10">
        <div className="md:col-span-5">
          <div className="aspect-[4/5] rounded-[1.75rem] bg-white/[0.06]" />
        </div>
        <div className="space-y-6 md:col-span-7">
          <div className="h-4 w-24 rounded bg-white/10" />
          <div className="h-12 w-3/4 rounded-lg bg-white/10" />
          <div className="h-6 w-1/2 rounded bg-white/[0.06]" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-white/[0.06]" />
            <div className="h-4 w-full rounded bg-white/[0.06]" />
            <div className="h-4 w-2/3 rounded bg-white/[0.06]" />
          </div>
        </div>
      </div>
    </div>
  );
}
