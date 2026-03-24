"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full border border-[rgba(173,104,79,0.4)] bg-[rgba(173,104,79,0.12)] px-6 py-3 text-sm text-[var(--foreground)] transition hover:bg-[rgba(173,104,79,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "提交中..." : "提交审核"}
    </button>
  );
}
