

export interface Posts {
    id: number;
    title: string;
    content: string;
    authorName: string;
    createdAt: Date;
    updatedAt?: Date;
}