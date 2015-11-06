export interface Section {
    name: string;
    description: string;
    chartIds: string[];
    data: any;
    orderId: number;
    sectionType: string;
}

export function sectionFrom(
    name: string,
    description: string,
    chartIds: string[],
    data: any,
    orderId: number,
    sectionType: string
) : Section {
    return {
        name: name,
        description: description,
        chartIds: chartIds,
        data: data,
        orderId: orderId,
        sectionType: sectionType
    };
} 