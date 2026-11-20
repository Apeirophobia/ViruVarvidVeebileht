export interface UserSummary {
    CustomerID: string,
    FirstName: string,
    LastName: string,
    DisplayName: string,
    Email: string, 
}

export interface User extends UserSummary {
    OrderIDList: JSON | null
    Password: string
    PasswordConfirmation: string | null
}


export interface UserRegister {
    UserName: string
    EmailAddress: string
    UserStatus: string | null
    SignupDate: string
    UserCollectionID: string | null
    ReviewListID: string | null
    ProfileID: string | null
    CredentialID: string | null
    Password: string
    PasswordConfirmation: string | null 
}