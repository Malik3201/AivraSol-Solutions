export function SkillCloud({ skills }: { skills?: string[] }) {
  const list = skills?.length
    ? skills
    : ["Product strategy", "UX", "Next.js", "AI workflows", "Automation"];

  return (
    <div className="flex flex-wrap gap-2">
      {list.map((skill) => (
        <span
          key={skill}
          className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm text-foreground/90"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
