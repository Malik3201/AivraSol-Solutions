export function BlogArticle({ content }: { content: string }) {
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return (
      <article
        className="prose prose-invert prose-lg max-w-none prose-headings:font-semibold prose-a:text-primary prose-p:text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <article className="max-w-none space-y-4 text-base leading-relaxed text-muted-foreground">
      {content.split(/\n\n+/).map((para, i) => (
        <p key={i}>{para.trim()}</p>
      ))}
    </article>
  );
}
