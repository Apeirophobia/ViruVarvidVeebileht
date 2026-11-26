//getall
export interface ContactSummary {
  ContactID: string
  Name: string
}

//getbyid/modifybyid
export interface Contact {
    ContactID: string,
    Name: string,
    Email: string,
    PhoneNumber: string,
}

//create
export interface ContactInput {
    Name: string,
    Email: string,
    PhoneNumber: string | null,
}