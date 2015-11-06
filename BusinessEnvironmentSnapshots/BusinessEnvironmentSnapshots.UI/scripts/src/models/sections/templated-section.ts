export interface TemplatedSection {
    name: string;
    description: string;
    discriminator: string;
    data: any;
}

export function toTemplatedSection(name: string, description: string, discriminator: string, data: any) : TemplatedSection {
    var result : any = {
        name: name,
        description: description,
        discriminator: discriminator,
        data: {}
    };
    result.data[discriminator] = data;
    return result;
}