export interface User {
    id: string;
    nombre: string;
    email:string;
}

export interface Task {
    id: string;
    nombre: string;
    encargado: string;
    fecha: string;
    estado: string;
    desc:string
}
export interface Proyecto {
    id: string,
    name: string,
    idOwner: string
}
export interface Team{
    id:string,
    nombre:string,
}
export interface TeamMember {
    userId: string;
    nombre: string;
    email: string;
    role: string;
}