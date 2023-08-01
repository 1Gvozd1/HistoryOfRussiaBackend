export class AuthUserDto {
    username;
    email;
    id;
    activated;
    roles;

    constructor(model) {
        this.username = model.username;
        this.email = model.email;
        this.id = model.user_id;
        this.activated = model.activated;
        this.roles = model.roles.map(el => el.name);
    }
}