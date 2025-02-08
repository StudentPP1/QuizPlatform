export class AuthService {
    /*
    TODO: зробити api запроси
    */
    public static register(username: string, email: string, password: string) {
        console.log(username, email, password)
    }

    public static login(email: string, password: string) {
        console.log(email, password)
    }

    public static google() {
        console.log("google")
    }
}