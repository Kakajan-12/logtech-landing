"use client";

import {
  createContext,
  useActionState,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { Link } from "@/app/i18n/navigation";
import { requestDemo } from "@/app/actions/requestDemo";
import { DEMO_FIELDS, type DemoField, type DemoState } from "@/lib/demoRequest";

const DemoModalContext = createContext<{ open: () => void } | null>(null);

/** Opens the "request a demo" dialog from any button on the site. */
export function useDemoModal() {
  const ctx = useContext(DemoModalContext);
  if (!ctx)
    throw new Error("useDemoModal must be used inside DemoModalProvider");
  return ctx;
}

const INPUT: Record<
  DemoField,
  { type: string; autoComplete: string; inputMode?: "tel" | "email" }
> = {
  firstName: { type: "text", autoComplete: "given-name" },
  lastName: { type: "text", autoComplete: "family-name" },
  phone: { type: "tel", autoComplete: "tel", inputMode: "tel" },
  email: { type: "email", autoComplete: "email", inputMode: "email" },
  position: { type: "text", autoComplete: "organization-title" },
  company: { type: "text", autoComplete: "organization" },
};

export function DemoModalProvider({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  // remount the form on every opening so a sent form starts fresh next time
  const [session, setSession] = useState(0);

  const open = useCallback(() => {
    setSession((s) => s + 1);
    dialog.current?.showModal();
  }, []);

  const close = useCallback(() => dialog.current?.close(), []);

  return (
    <DemoModalContext.Provider value={{ open }}>
      {children}
      <dialog
        ref={dialog}
        aria-labelledby="demo-title"
        className="demo-dialog m-auto w-[calc(100%-2rem)] max-w-xl overflow-visible rounded-3xl bg-transparent p-0 backdrop:bg-[#02150c]/60 backdrop:backdrop-blur-sm"
        // click on the backdrop (the dialog element itself) closes it
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {session > 0 && <DemoForm key={session} onClose={close} />}
      </dialog>
    </DemoModalContext.Provider>
  );
}

function DemoForm({ onClose }: { onClose: () => void }) {
  const t = useTranslations("DemoForm");
  const [state, action, pending] = useActionState<DemoState, FormData>(
    requestDemo,
    {
      status: "idle",
    },
  );
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInput.current?.focus();
  }, []);

  const fields = state.status === "error" ? state.fields : undefined;
  const values = state.status === "error" ? state.values : undefined;

  return (
    <div className="relative max-h-[calc(100svh-2rem)] overflow-y-auto rounded-3xl bg-white shadow-2xl">
      <div className="bg-[linear-gradient(177deg,#0F833F_0.23%,#08945A_96.91%)] px-6 pt-7 pb-6 text-white sm:px-8">
        <h2
          id="demo-title"
          className="font-play text-2xl font-bold sm:text-3xl"
        >
          {t("title")}
        </h2>
        <p className="mt-2 max-w-md text-sm text-white/80">{t("subtitle")}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          className="absolute top-4 right-4 inline-flex size-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/15 hover:text-white"
        >
          <X className="size-5" aria-hidden />
        </button>
      </div>

      {state.status === "ok" ? (
        <div className="flex flex-col items-center px-6 py-12 text-center sm:px-8">
          <CheckCircle2 className="size-14 text-brand" aria-hidden />
          <p className="mt-4 font-play text-xl font-bold text-[#04331D]">
            {t("successTitle")}
          </p>
          <p className="mt-2 max-w-sm text-sm text-neutral-500">
            {t("successText")}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-8 inline-flex h-11 items-center justify-center rounded-full border border-neutral-200 px-8 text-sm font-bold text-neutral-800 transition-colors hover:bg-neutral-50"
          >
            {t("close")}
          </button>
        </div>
      ) : (
        <form action={action} noValidate className="px-6 pt-6 pb-7 sm:px-8">
          <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
            {DEMO_FIELDS.map((name, i) => {
              const error = fields?.[name];
              const id = `demo-${name}`;
              return (
                <div key={name} className="flex flex-col gap-1.5">
                  <label
                    htmlFor={id}
                    className="text-sm font-semibold text-neutral-700"
                  >
                    {t(`fields.${name}`)}
                  </label>
                  <input
                    ref={i === 0 ? firstInput : undefined}
                    id={id}
                    name={name}
                    required
                    maxLength={120}
                    defaultValue={values?.[name] ?? ""}
                    placeholder={t(`placeholders.${name}`)}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                    {...INPUT[name]}
                    className={`h-11 rounded-xl border bg-neutral-50 px-3.5 text-[15px] text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:bg-white focus:ring-3 ${
                      error
                        ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
                        : "border-neutral-200 focus:border-brand focus:ring-brand/15"
                    }`}
                  />
                  {error && (
                    <p
                      id={`${id}-error`}
                      className="text-xs font-medium text-red-600"
                    >
                      {t(`errors.${error}`)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* honeypot for bots: hidden from people and screen readers */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          {state.status === "error" && state.reason === "send" && (
            <p
              role="alert"
              className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {t("sendError")}{" "}
              <a
                href="mailto:info@hebent.tech"
                className="font-semibold underline"
              >
                info@hebent.tech
              </a>
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(177deg,#0F833F_0.23%,#08945A_96.91%)] text-base font-bold text-white shadow-lg shadow-brand/25 transition-[transform,opacity] hover:-translate-y-px disabled:translate-y-0 disabled:opacity-70"
          >
            {pending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {pending ? t("sending") : t("submit")}
          </button>
          <p className="mt-3 text-center text-xs text-neutral-400">
            {t.rich("consent", {
              link: (chunks) => (
                <Link
                  href="/privacy-policy"
                  onClick={onClose}
                  className="underline hover:text-brand"
                >
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </form>
      )}
    </div>
  );
}
