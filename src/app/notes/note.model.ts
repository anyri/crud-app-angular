
export class Note {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    text: string;
    pending?: boolean;

    constructor(noteSource: Note) {
        Object.assign(this, noteSource);
    };
    
}