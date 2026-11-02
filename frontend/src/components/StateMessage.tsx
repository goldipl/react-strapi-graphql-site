import { ReactNode } from "react";
import { AlertIcon, InboxIcon } from "./icons";

interface StateMessageProps {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  variant?: "empty" | "error";
}

const StateMessage = ({ title, description, action, variant = "empty" }: StateMessageProps) => {
  const isError = variant === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center animate-fade-in"
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
          isError
            ? "bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        }`}
      >
        {isError ? <AlertIcon className="h-6 w-6" /> : <InboxIcon className="h-6 w-6" />}
      </div>
      <h2 className="text-lg font-bold">{title}</h2>
      {description && (
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default StateMessage;
