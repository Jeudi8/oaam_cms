import { ITranslation } from "./Translation";
interface IRequiredFieldData {
    field: string;
    type: string;
    datatype: string;
    interface: string;
}
interface IOptionalFieldData {
    unique: boolean;
    primary_key: boolean;
    auto_increment: boolean;
    default_value: any;
    note: string;
    signed: boolean;
    sort: number;
    hidden_detail: boolean;
    hidden_browse: boolean;
    required: boolean;
    options: object;
    locked: boolean;
    translation: ITranslation;
    readonly: boolean;
    width: number;
    validation: string;
    group: number;
    length: number;
}
/**
 * @see https://docs.directus.io/api/reference.html#field-object
 */
export interface IField extends IRequiredFieldData, Partial<IOptionalFieldData> {
}
export {};
//# sourceMappingURL=Field.d.ts.map