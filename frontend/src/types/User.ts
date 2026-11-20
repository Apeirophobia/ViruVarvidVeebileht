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