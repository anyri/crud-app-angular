export class User {
    id: number;    
    login: string;
    role: string;
    name: string;
    status?: string;

    constructor(user?: User) {
        if(user)
            Object.assign(this, user);
    }
}