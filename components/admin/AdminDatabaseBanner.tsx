import type { AdminDatabaseInfo } from "@/lib/api/types";
import { cn } from "@/lib/utils";

export function AdminDatabaseBanner({
  database,
  totalServices,
  totalProjects,
}: {
  database: AdminDatabaseInfo;
  totalServices: number;
  totalProjects: number;
}) {
  const showWarning =
    database.isWrongDatabase ||
    (totalServices === 0 &&
      totalProjects === 0 &&
      database.connectedDatabase === "test");

  if (!showWarning && !database.hint) {
    return (
      <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-muted-foreground">
        <span className="text-white/80">Database:</span>{" "}
        <code className="text-primary">{database.connectedDatabase}</code>
        {database.clusterHost ? (
          <>
            {" "}
            · <span className="text-white/50">{database.clusterHost}</span>
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mb-6 rounded-xl border px-4 py-4 text-sm",
        showWarning
          ? "border-amber-500/40 bg-amber-500/10 text-amber-50"
          : "border-white/10 bg-white/[0.03] text-muted-foreground",
      )}
      role="status"
    >
      <p className="font-medium text-white">
        {showWarning
          ? "This deployment may be using a different database than your local CMS"
          : "Database connection"}
      </p>
      <ul className="mt-2 space-y-1 text-xs sm:text-sm">
        <li>
          Connected:{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5">
            {database.connectedDatabase ?? "unknown"}
          </code>
        </li>
        <li>
          Expected:{" "}
          <code className="rounded bg-black/30 px-1.5 py-0.5">
            {database.configuredDatabase}
          </code>
        </li>
        {database.databaseInUri ? (
          <li>
            Name in MONGODB_URI:{" "}
            <code className="rounded bg-black/30 px-1.5 py-0.5">
              {database.databaseInUri}
            </code>
          </li>
        ) : null}
        {database.clusterHost ? (
          <li>Cluster: {database.clusterHost}</li>
        ) : null}
      </ul>
      {database.hint ? (
        <p className="mt-3 leading-relaxed text-amber-100/90">{database.hint}</p>
      ) : null}
      {showWarning ? (
        <p className="mt-3 leading-relaxed text-amber-100/80">
          On Vercel → Settings → Environment Variables, set{" "}
          <code className="rounded bg-black/30 px-1">MONGODB_URI</code> to the
          same value as local (including <code>/AivraSol</code>) and add{" "}
          <code className="rounded bg-black/30 px-1">
            MONGODB_DB_NAME=AivraSol
          </code>
          , then redeploy. Content you added on Vercel while on the wrong DB
          will not appear until you migrate it or re-create it in{" "}
          <code>AivraSol</code>.
        </p>
      ) : null}
    </div>
  );
}
