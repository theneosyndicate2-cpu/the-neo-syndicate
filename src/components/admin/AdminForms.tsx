"use client";

import { useActionState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { TIERS } from "@/lib/tiers";
import { createAnnouncement, createTrade, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { FieldShell, Input, Select, Textarea } from "@/components/forms/Field";

/*
 * React resets a form after its action runs. Fields use `defaultValue` from the
 * echoed `state.values`, so on a validation error the reset restores what the
 * admin typed; on success `values` is empty and the form clears.
 */

const initial: ActionState = { ok: false };

function Result({ state, pending }: { state: ActionState; pending: boolean }) {
  if (pending || !state.message) return <span className="min-h-5" />;
  return (
    <p role="status" className={`flex min-h-5 items-center gap-2 text-sm ${state.ok ? "text-up" : "text-down"}`}>
      {state.ok && <CheckCircle2 className="size-4" aria-hidden />}
      {state.message}
    </p>
  );
}

function Submit({ pending, label }: { pending: boolean; label: string }) {
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <span className="flex items-center gap-2">
          <LoaderCircle className="size-4 animate-spin" aria-hidden /> Saving
        </span>
      ) : (
        label
      )}
    </Button>
  );
}

/** Post a new elite trade to members. */
export function TradeForm() {
  const [state, action, pending] = useActionState(createTrade, initial);
  const e = state.errors ?? {};
  const v = state.values ?? {};

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" noValidate>
      <FieldShell id="t-asset" label="Asset" error={e.asset}>
        <Select id="t-asset" name="asset" defaultValue={v.asset ?? "XAUUSD"} key={`a-${v.asset}`} invalid={!!e.asset}>
          <option value="XAUUSD">XAUUSD</option>
          <option value="BTCUSD">BTCUSD</option>
        </Select>
      </FieldShell>
      <FieldShell id="t-direction" label="Direction" error={e.direction}>
        <Select id="t-direction" name="direction" defaultValue={v.direction ?? "BUY"} key={`d-${v.direction}`} invalid={!!e.direction}>
          <option value="BUY">BUY</option>
          <option value="SELL">SELL</option>
        </Select>
      </FieldShell>
      <FieldShell id="t-entry" label="Entry" error={e.entry}>
        <Input id="t-entry" name="entry" inputMode="decimal" placeholder="4139.20" defaultValue={v.entry} invalid={!!e.entry} />
      </FieldShell>
      <FieldShell id="t-sl" label="Stop loss" error={e.stopLoss}>
        <Input id="t-sl" name="stopLoss" inputMode="decimal" defaultValue={v.stopLoss} invalid={!!e.stopLoss} />
      </FieldShell>
      <FieldShell id="t-tp1" label="TP1" error={e.tp1}>
        <Input id="t-tp1" name="tp1" inputMode="decimal" defaultValue={v.tp1} invalid={!!e.tp1} />
      </FieldShell>
      <FieldShell id="t-tp2" label="TP2" optional>
        <Input id="t-tp2" name="tp2" inputMode="decimal" defaultValue={v.tp2} />
      </FieldShell>
      <FieldShell id="t-tp3" label="TP3" optional>
        <Input id="t-tp3" name="tp3" inputMode="decimal" defaultValue={v.tp3} />
      </FieldShell>
      <div className="hidden lg:block" />
      <FieldShell id="t-note" label="Desk note" optional className="sm:col-span-2 lg:col-span-4">
        <Textarea id="t-note" name="note" className="min-h-20" placeholder="Context, invalidation, management plan…" defaultValue={v.note} />
      </FieldShell>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between lg:col-span-4">
        <Result state={state} pending={pending} />
        <Submit pending={pending} label="Post trade" />
      </div>
    </form>
  );
}

/** Publish an announcement to a tier and above. */
export function AnnouncementForm() {
  const [state, action, pending] = useActionState(createAnnouncement, initial);
  const e = state.errors ?? {};
  const v = state.values ?? {};

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-3" noValidate>
      <FieldShell id="a-title" label="Title" error={e.title} className="sm:col-span-2">
        <Input id="a-title" name="title" defaultValue={v.title} invalid={!!e.title} />
      </FieldShell>
      <FieldShell id="a-tier" label="Visible to" error={e.minTier}>
        <Select id="a-tier" name="minTier" defaultValue={v.minTier ?? "observer"} key={`t-${v.minTier}`} invalid={!!e.minTier}>
          {TIERS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label} & above
            </option>
          ))}
        </Select>
      </FieldShell>
      <FieldShell id="a-body" label="Message" error={e.body} className="sm:col-span-3">
        <Textarea id="a-body" name="body" defaultValue={v.body} invalid={!!e.body} />
      </FieldShell>
      <label className="flex items-center gap-3 text-sm text-mist sm:col-span-3">
        <input type="checkbox" name="pinned" defaultChecked={v.pinned === "on"} className="size-4 accent-[#d4af5f]" /> Pin to the top of
        members&apos; dashboards
      </label>
      <div className="flex flex-col gap-3 sm:col-span-3 sm:flex-row sm:items-center sm:justify-between">
        <Result state={state} pending={pending} />
        <Submit pending={pending} label="Publish" />
      </div>
    </form>
  );
}
