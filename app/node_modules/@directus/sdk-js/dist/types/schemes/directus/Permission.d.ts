declare type CreatePermission = "none" | "full" | null;
declare type ReadPermission = "none" | "mine" | "role" | "full" | null;
declare type UpdatePermission = "none" | "mine" | "full" | null;
declare type DeletePermission = "none" | "mine" | "role" | "full" | null;
declare type CommentPermission = "none" | "read" | "update" | "create" | "full" | null;
declare type ExplainPermission = "none" | "update" | "create" | "always" | null;
/**
 * @see https://docs.directus.io/api/reference.html#permission-object
 */
export interface IPermission {
    id: number;
    collection: string;
    role: number;
    status: string;
    create: CreatePermission;
    read: ReadPermission;
    update: UpdatePermission;
    delete: DeletePermission;
    comment: CommentPermission;
    explain: ExplainPermission;
    read_field_blacklist: string[];
    write_field_blacklist: string[];
    status_blacklist: string[];
}
export {};
//# sourceMappingURL=Permission.d.ts.map