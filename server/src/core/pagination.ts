export interface IPagination {
    page: Number;
    pages: number;
    limit: number;
    total: number;
    from: number;
    to: number;
}

export default class Pagination {
    public static filters(fields: any, validated: any) {
        if (!validated.search) {
            return {};
        }

        if (validated.search === '') {
            return {};
        }

        const filters: any[] = fields.map((field: string) => {
            return {
                [field]: { $regex: new RegExp(validated.search, 'i') },
            };
        });

        return {
            $or: filters,
        };
    }

    public static sort(validated: any): any[] {
        const sort_col: string = validated.sort_col || '_id';
        const sort_dir: string = validated.sort_dir || 'ASC';

        return [[sort_col, sort_dir]];
    }

    public static async paginate(Model: any, validated: any) {
        const page: number = parseInt(validated.page || 1);
        const limit: number = parseInt(validated.limit || 10);
        const skip: number = (page - 1) * limit;

        return {
            search: validated.search || '',
            sort: this.sort(validated),
            limit: limit,
            skip: skip,
            pagination: await this.pagination(Model, validated),
        };
    }

    public static async pagination(Model: any, validated: any) {
        const page: number = parseInt(validated.page || 1);
        const limit: number = parseInt(validated.limit || 10);
        const total: number = await Model.countDocuments({});
        const from: number = total > 0 && Math.ceil(total / limit) >= page ? (page - 1) * limit + 1 : 0;
        const to: number = page * limit > total ? total : page * limit;
        const pages: number = Math.ceil(total / limit);

        return {
            page: page,
            pages: pages,
            limit: limit,
            total: total,
            from: from,
            to: to,
        };
    }
}
