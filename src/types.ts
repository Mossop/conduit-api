/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GenericAPI {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (params?: Record<string, unknown>): Promise<any>;
  [K: string]: GenericAPI;
}

export const enum RevisionStatus {
  Draft = "draft",
  NeedsReview = "needs-review",
  NeedsRevision = "needs-revision",
  ChangesPlanned = "changes-planned",
  Accepted = "accepted",
  Closed = "published",
  Abandoned = "abandoned",
}

export function isClosed(status: RevisionStatus): boolean {
  return status == RevisionStatus.Closed || status == RevisionStatus.Abandoned;
}

export function isOpen(status: RevisionStatus): boolean {
  return !isClosed(status);
}

export type PaginatedRequest<R> = R & {
  before?: string | null;
  after?: string | null;
  order?: string | null;
  limit?: number;
};

export interface PaginatedResult<R> {
  data: R[];
  cursor: {
    limit: number;
    after: string | null;
    before: string | null;
    order: string | null;
  };
}

export type SimpleApiMethod<R> = () => Promise<R>;
export type ApiMethod<R, A> = (arg: A) => Promise<R>;
export type PaginatedApiMethod<R, A> = ApiMethod<PaginatedResult<R>, PaginatedRequest<A>>;

export interface Conduit {
  user: User;
  differential: Differential;
  project: Project;

  [K: string]: GenericAPI;
}

export type User = GenericAPI & {
  whoami: SimpleApiMethod<User$Result>;
};

export interface User$Result {
  phid: string;
  userName: string;
  realName: string;
  image: string;
  uri: string;
  roles: string[];
  primaryEmail: string;
}

export type Differential = GenericAPI & {
  revision: Differential$Revision;
};

export type Differential$Revision = GenericAPI & {
  search: PaginatedApiMethod<
    Differential$Revision$Search$Result,
    Differential$Revision$Search$Params
  >;
};

export interface Differential$Revision$Search$Params {
  queryKey?: string;
  constraints?: Differential$Revision$Search$Constraints;
  attachments?: Differential$Revision$Search$Attachments;
}

export interface Differential$Revision$Search$Constraints {
  ids?: number[];
  phids?: string[];
  responsiblePHIDs?: string[];
  authorPHIDs?: string[];
  reviewerPHIDs?: string[];
  repositoryPHIDs?: string[];
  statuses?: string[];
  createdStart?: number;
  createdEnd?: number;
  modifiedStart?: number;
  modifiedEnd?: number;
  affectedPaths?: string[];
  query?: string;
  subscribers?: string[];
  projects?: string[];
}

export interface Differential$Revision$Search$Attachments {
  reviewers?: boolean;
  subscribers?: boolean;
  projects?: boolean;
  "reviewers-extra"?: boolean;
}

export interface Differential$Revision$Search$Result {
  id: number;
  type: "DREV";
  phid: string;
  fields: {
    title: string;
    uri: string;
    authorPHID: string;
    status: {
      value: RevisionStatus;
      name: string;
      closed: boolean;
      "color.ansi": string;
    };
    repositoryPHID: string;
    diffPHID: string;
    summary: string;
    testPlan: string;
    isDraft: boolean;
    holdAsDraft: boolean;
    dateCreated: number;
    dateModified: number;
    policy: {
      view: string;
      edit: string;
    };
  };
  attachments: {
    subscribers?: {
      subscriberPHIDs: string[];
      subscriberCount: number;
      viewerIsSubscribed: boolean;
    };
    reviewers?: {
      reviewers: {
        reviewerPHID: string;
        status: string;
        isBlocking: boolean;
        actorPHID: string | null;
      }[];
    };
    projects?: {
      projectPHIDs: string[];
    };
    "reviewers-extra"?: {
      "reviewers-extra": {
        reviewerPHID: string;
        voidedPHID: string | null;
        diffPHID: string | null;
      }[];
    };
  };
}

export type Project = GenericAPI & {
  search: PaginatedApiMethod<
    Project$Search$Result,
    Project$Search$Params
  >;
};

export interface Project$Search$Params {
  queryKey?: string;
  constraints?: Project$Search$Params$Constraints;
  attachments?: Project$Search$Params$Attachments;
}

export interface Project$Search$Params$Constraints {
  ids?: number[];
  phids?: string[];
  name?: string; // @deprecated
  slugs?: string[];
  members?: string[];
  watchers?: string[];
  isMilestone?: boolean;
  isRoot?: boolean;
  minDepth?: number;
  maxDepth?: number;
  subtypes?: string[];
  icons?: string[];
  colors?: string[];
  parents?: string[];
  ancestors?: string;
  query?: string;
}

export interface Project$Search$Params$Attachments {
  members?: boolean;
  watchers?: boolean;
  ancestors?: boolean;
}

export interface Project$Search$Result {
  id: number;
  type: "PROJ";
  phid: string;
  fields: {
    name: string;
    slug: string;
    subtype: string;
    milestone: number | null;
    depth: number;
    parent: Record<string, string> | null;
    icon: {
      key: string;
      name: string;
      icon: string;
    };
    color: {
      key: string;
      name: string;
    };
    spacePHID: string;
    dateCreated: number;
    dateModified: number;
    policy: Record<string, string>;
    description: string;
  };
  attachments: {
    members?: {
      members: {
        phid: string;
      }[];
    };
    watchers?: {
      watchers: {
        phid: string;
      }[];
    };
    ancestors?: {
      ancestors: {
        phid: string;
      }[];
    };
  };
}
