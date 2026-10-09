import { randomUUID } from "crypto";
import { storeGet, storePut } from "@/lib/store";

export type JobStatus = "queued" | "running" | "succeeded" | "failed";

export type JobRecord = {
  id: string;
  walletId: string;
  provider: string;
  providerJobId: string;
  status: JobStatus;
  effectSlug: string;
  templateId: string;
  videoUrl?: string;
  message?: string;
  creditRefunded: boolean;
  /** FAL queue URLs */
  falStatusUrl?: string;
  falResponseUrl?: string;
  /** Demo: become ready after this timestamp */
  demoReadyAt?: number;
  createdAt: string;
  updatedAt: string;
};

function jobKey(id: string) {
  return `job:${id}`;
}

export async function createJob(
  partial: Omit<JobRecord, "id" | "createdAt" | "updatedAt" | "creditRefunded"> & {
    creditRefunded?: boolean;
  },
): Promise<JobRecord> {
  const now = new Date().toISOString();
  const job: JobRecord = {
    ...partial,
    id: randomUUID(),
    creditRefunded: partial.creditRefunded ?? false,
    createdAt: now,
    updatedAt: now,
  };
  await storePut(jobKey(job.id), job);
  return job;
}

export async function getJob(id: string): Promise<JobRecord | null> {
  return storeGet<JobRecord>(jobKey(id));
}

export async function saveJob(job: JobRecord): Promise<JobRecord> {
  job.updatedAt = new Date().toISOString();
  await storePut(jobKey(job.id), job);
  return job;
}

export function publicJobView(job: JobRecord) {
  return {
    id: job.id,
    status: job.status,
    provider: job.provider,
    effectSlug: job.effectSlug,
    videoUrl: job.videoUrl,
    message: job.message,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
}
