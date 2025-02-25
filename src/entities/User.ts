import { Entity,Column,PrimaryGeneratedColumn,BaseEntity } from "typeorm";

@Entity()
class UserTable{
    @PrimaryGeneratedColumn()
    id:number | undefined

    @Column({type:"text",unique:true})
    name:string | undefined

    @Column({type:"text",unique:true})
    email:string | undefined

    @Column({type:"text"})
    password:string | undefined



}
export default UserTable