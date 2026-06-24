"use client";

import React, { useMemo } from "react";
import { useValidatorAudit } from "@/app/hooks/useValidatorAudit";
import {
  ValidatorListSkeleton,
  ValidatorMetricsSkeleton,
} from "@/components/skeletons";
import type { ValidatorNode } from "@/types/validators";
import {
  VALIDATOR_METRIC_CARD_MIN_HEIGHT_PX,
  VALIDATOR_TABLE_HEADER_HEIGHT_PX,
  VALIDATOR_TABLE_ROW_HEIGHT_PX,
} from "@/types/validators";

const COLUMN_WIDTHS = [
  "w-[18%]",
  "w-[16%]",
  "w-[13%]",
  "w-[14%]",
  "w-[13%]",
  "w-[14%]",
  "w-[12%]",
] as const;

function ValidatorOverviewMetrics({ validators }: { validators: ValidatorNode[] }) {
  const activeCount = validators.filter((v) => v.status === "active").length;
  const totalStaked = validators.reduce((sum, v) => sum + v.stakedXlm, 0);
  const totalSlashEvents = validators.reduce((sum, v) => sum + v.slashingEvents, 0);
  const heartbeatIndex =
    validators.length === 0
      ? 0
      : validators.reduce((sum, v) => sum + v.uptime, 0) / validators.length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div
        style={{ contain: "layout paint", minHeight: VALIDATOR_METRIC_CARD_MIN_HEIGHT_PX }}
        className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
      >
        <span className="text-xs font-mono text-neutral-400 block mb-1">
          TOTAL ACTIVE VALIDATORS
        </span>
        <span className="text-2xl font-bold font-mono text-neutral-100 tabular-nums">
          {activeCount} / {validators.length}
        </span>
      </div>
      <div
        style={{ contain: "layout paint", minHeight: VALIDATOR_METRIC_CARD_MIN_HEIGHT_PX }}
        className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
      >
        <span className="text-xs font-mono text-neutral-400 block mb-1">
          TOTAL CAPITAL STAKED
        </span>
        <span className="text-2xl font-bold font-mono text-lime-400 tabular-nums">
          {totalStaked.toLocaleString()} XLM
        </span>
      </div>
      <div
        style={{ contain: "layout paint", minHeight: VALIDATOR_METRIC_CARD_MIN_HEIGHT_PX }}
        className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
      >
        <span className="text-xs font-mono text-neutral-400 block mb-1">
          CUMULATIVE SLASH EVENTS
        </span>
        <span className="text-2xl font-bold font-mono text-red-400 tabular-nums">
          {totalSlashEvents} Infracs
        </span>
      </div>
      <div
        style={{ contain: "layout paint", minHeight: VALIDATOR_METRIC_CARD_MIN_HEIGHT_PX }}
        className="bg-neutral-900 border border-neutral-800 rounded-xl p-4"
      >
        <span className="text-xs font-mono text-neutral-400 block mb-1">
          NETWORK HEARTBEAT INDEX
        </span>
        <span className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
          {heartbeatIndex.toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

function ValidatorAuditTable({ validators }: { validators: ValidatorNode[] }) {
  const tableMinHeight =
    VALIDATOR_TABLE_HEADER_HEIGHT_PX +
    Math.max(validators.length, 1) * VALIDATOR_TABLE_ROW_HEIGHT_PX;

  return (
    <div
      className="overflow-x-auto"
      style={{ contain: "layout paint", minHeight: tableMinHeight }}
    >
      <table className="w-full table-fixed text-left border-collapse">
        <thead>
          <tr
            className="border-b border-neutral-800 text-xs text-neutral-400 uppercase font-mono tracking-wider"
            style={{ height: VALIDATOR_TABLE_HEADER_HEIGHT_PX }}
          >
            <th className={`py-3 px-4 ${COLUMN_WIDTHS[0]}`}>Validator Identity</th>
            <th className={`py-3 px-4 ${COLUMN_WIDTHS[1]}`}>Stellar Account Handle</th>
            <th className={`py-3 px-4 text-right ${COLUMN_WIDTHS[2]}`}>Heartbeat Uptime</th>
            <th className={`py-3 px-4 text-right ${COLUMN_WIDTHS[3]}`}>Missed Checkpoints</th>
            <th className={`py-3 px-4 text-right ${COLUMN_WIDTHS[4]}`}>Slashing History</th>
            <th className={`py-3 px-4 text-right ${COLUMN_WIDTHS[5]}`}>Active Security Bond</th>
            <th className={`py-3 px-4 text-center ${COLUMN_WIDTHS[6]}`}>Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/50 text-sm font-mono">
          {validators.map((val) => (
            <tr
              key={val.id}
              className="hover:bg-neutral-800/20 transition-colors"
              style={{ contain: "layout paint", height: VALIDATOR_TABLE_ROW_HEIGHT_PX }}
            >
              <td className="py-4 px-4 font-bold text-neutral-200 font-sans truncate">
                {val.name}
              </td>
              <td className="py-4 px-4 text-xs text-neutral-500 font-mono select-all truncate">
                {val.address}
              </td>
              <td
                className={`py-4 px-4 text-right font-bold tabular-nums ${
                  val.uptime > 95
                    ? "text-emerald-400"
                    : val.uptime > 80
                      ? "text-amber-500"
                      : "text-red-500"
                }`}
              >
                {val.uptime.toFixed(2)}%
              </td>
              <td className="py-4 px-4 text-right text-neutral-300 tabular-nums">
                {val.missedBlocks}
              </td>
              <td
                className={`py-4 px-4 text-right font-bold tabular-nums ${
                  val.slashingEvents > 0 ? "text-red-400" : "text-neutral-500"
                }`}
              >
                {val.slashingEvents}
              </td>
              <td className="py-4 px-4 text-right text-neutral-100 tabular-nums">
                {val.stakedXlm.toLocaleString()} XLM
              </td>
              <td className="py-4 px-4 text-center">
                <span
                  className={`inline-flex min-w-16 justify-center px-2.5 py-1 rounded text-xs uppercase tracking-wider font-sans font-bold ${
                    val.status === "active"
                      ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                      : val.status === "jailed"
                        ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                        : "bg-neutral-950 text-neutral-500 border border-neutral-800"
                  }`}
                >
                  {val.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ValidatorAuditPage() {
  const { data: validators = [], isLoading } = useValidatorAudit();
  const [filter, setFilter] = React.useState<"all" | "active" | "jailed">("all");

  const filteredValidators = useMemo(() => {
    if (filter === "all") return validators;
    return validators.filter((v) => v.status === filter);
  }, [validators, filter]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 font-sans selection:bg-lime-500 selection:text-black">
      <div className="mb-8 border-b border-neutral-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Validator Slashing & Heartbeat Audit
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            Real-time consensus verification, uptime audits, and economic slashing metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-lg p-1 text-xs font-mono">
          {(["all", "active", "jailed"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-md uppercase transition-all ${
                filter === type
                  ? "bg-neutral-800 text-lime-400 font-bold border border-neutral-700"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <ValidatorMetricsSkeleton />
      ) : (
        <ValidatorOverviewMetrics validators={validators} />
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-2xl">
        <h2 className="text-lg font-semibold mb-4 text-neutral-200 flex items-center gap-2">
          <span>🛡️</span> Security Infrastructure Node Matrix
        </h2>
        {isLoading ? (
          <ValidatorListSkeleton />
        ) : (
          <ValidatorAuditTable validators={filteredValidators} />
        )}
      </div>
    </div>
  );
}
