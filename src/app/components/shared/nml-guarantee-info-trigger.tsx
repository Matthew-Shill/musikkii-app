"use client";

import * as Popover from "@radix-ui/react-popover";
import * as Tooltip from "@radix-ui/react-tooltip";
import { CircleHelp } from "lucide-react";
import { useId, useSyncExternalStore } from "react";
import { cn } from "@/app/components/ui/utils";

export const NML_GUARANTEE_TITLE = "Never Miss A Lesson™ Guarantee";

export const NML_GUARANTEE_BODY =
  "If you can't attend live, miss the rescheduling window, or prefer a video lesson, your teacher will record a custom lesson video instead of the live session. Updated notes and the video will be sent to you just like normal lesson deliverables.";

const TRIGGER_ARIA_LABEL =
  "More about the Never Miss A Lesson guarantee and NML video lessons";

const panelSurface =
  "max-w-[min(20rem,calc(100vw-1.5rem))] rounded-xl border border-gray-200/90 bg-white px-4 py-3.5 text-left shadow-lg shadow-gray-900/5";

const iconButtonClassDefault =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100/90 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

const iconButtonClassInPrimary =
  "inline-flex h-full min-h-[2.25rem] w-9 shrink-0 items-center justify-center text-purple-100/90 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/45";

function usePreferPopoverForGuaranteeInfo() {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      const mq = window.matchMedia("(hover: none), (pointer: coarse)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: none), (pointer: coarse)").matches,
    () => false,
  );
}

function GuaranteeCopy({ titleId, bodyId }: { titleId: string; bodyId: string }) {
  return (
    <div className="space-y-2.5">
      <p id={titleId} className="text-sm font-semibold leading-snug tracking-tight text-gray-900">
        {NML_GUARANTEE_TITLE}
      </p>
      <p id={bodyId} className="text-xs leading-relaxed text-gray-600">
        {NML_GUARANTEE_BODY}
      </p>
    </div>
  );
}

function NmlGuaranteeTooltipTrigger({ iconButtonClass }: { iconButtonClass: string }) {
  const uid = useId();
  const titleId = `${uid}-nml-title`;
  const bodyId = `${uid}-nml-body`;

  return (
    <Tooltip.Provider delayDuration={220} skipDelayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button type="button" className={iconButtonClass} aria-label={TRIGGER_ARIA_LABEL}>
            <CircleHelp className="h-4 w-4" strokeWidth={1.65} aria-hidden />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            align="center"
            sideOffset={8}
            className={cn(
              panelSurface,
              "z-[100] origin-[var(--radix-tooltip-content-transform-origin)]",
              "animate-in fade-in-0 zoom-in-95 duration-150",
              "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            )}
          >
            <GuaranteeCopy titleId={titleId} bodyId={bodyId} />
            <Tooltip.Arrow className="fill-white drop-shadow-[0_1px_0_rgba(15,23,42,0.06)]" width={11} height={5} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

function NmlGuaranteePopoverTrigger({ iconButtonClass }: { iconButtonClass: string }) {
  const uid = useId();
  const titleId = `${uid}-nml-title`;
  const bodyId = `${uid}-nml-body`;

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={iconButtonClass}
          aria-label={TRIGGER_ARIA_LABEL}
          aria-haspopup="dialog"
        >
          <CircleHelp className="h-4 w-4" strokeWidth={1.65} aria-hidden />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="end"
          sideOffset={8}
          collisionPadding={16}
          className={cn(
            panelSurface,
            "z-[100] origin-[var(--radix-popover-content-transform-origin)] outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          )}
          aria-labelledby={titleId}
          aria-describedby={bodyId}
        >
          <GuaranteeCopy titleId={titleId} bodyId={bodyId} />
          <div className="mt-3 flex justify-end border-t border-gray-100 pt-2.5">
            <Popover.Close
              type="button"
              className="rounded-md px-2 py-1 text-xs font-semibold text-purple-800 hover:bg-purple-50 hover:text-purple-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300/70"
            >
              Done
            </Popover.Close>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export type NmlGuaranteeInfoTriggerProps = {
  className?: string;
  /** Placed inside the purple NML primary control (lighter icon, inset focus). */
  variant?: "default" | "inPrimary";
};

/**
 * Subtle info control for the NML / “Never Miss A Lesson” guarantee.
 * Uses a rich tooltip on hover-capable pointers; tap opens the same copy in a popover (touch-first devices).
 */
export function NmlGuaranteeInfoTrigger({ className, variant = "default" }: NmlGuaranteeInfoTriggerProps) {
  const preferPopover = usePreferPopoverForGuaranteeInfo();
  const iconButtonClass = variant === "inPrimary" ? iconButtonClassInPrimary : iconButtonClassDefault;
  return (
    <span
      className={cn(
        "inline-flex shrink-0",
        variant === "inPrimary" ? "h-full min-h-0" : "items-center self-center",
        className,
      )}
    >
      {preferPopover ? (
        <NmlGuaranteePopoverTrigger iconButtonClass={iconButtonClass} />
      ) : (
        <NmlGuaranteeTooltipTrigger iconButtonClass={iconButtonClass} />
      )}
    </span>
  );
}
