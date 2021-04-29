export interface UserData {
    token: Token;
    user: User;
}

export interface Token {
    access_token: string;
    access_token_application: string;
    access_token_expiration: string;
    scope: string;
}

export interface User {
    address: string;
    user_birthdate: string;
    user_email: string;
    user_first_name: string;
    user_gender: string;
    user_id: number;
    user_identity_number: string;
    user_last_name: string;
    user_phone_number: string;
}
