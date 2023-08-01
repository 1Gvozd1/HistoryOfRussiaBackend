export class UserDto {
    accessToken;
    user;

    constructor(model) {
        this.accessToken = model.accessToken;
        this.user = {...model.user};
    }

    json() {
        return {...this}
    }
}