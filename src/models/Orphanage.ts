import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	JoinColumn,
} from "typeorm";
import Images from "./Images";

@Entity("orphanages")
export default class Orphanage {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column()
	name: string;

	@Column()
	latitude: string;

	@Column()
	longitude: string;

	@Column()
	about: string;

	@Column()
	instructions: string;

	@Column()
	opening_hours: string;

	@Column()
	open_on_weekends: true;

	@Column()
	status: string;

	@OneToMany(() => Images, (image) => image.orphanage, {
		cascade: ["insert", "update"],
	})
	@JoinColumn({ name: "orphanage_id" })
	images: Images[];
}
