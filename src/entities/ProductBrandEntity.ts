export interface payloadProductBrand{
    page:number
    take:number
    sortField?:string
    sortDirection?: 'ASC'|'DESC'
    search?:string
    company:string
    isActive?:null|boolean
}

export interface productBrandEx{
    productBrandId: string;
    company: string;
    productBrandName: string;
    productBrandLogo: string;
    isActive: boolean | null;
    createdAt: string;
    createBy: string | null;
    updatedAt: string;
    updateBy: string | null;
}