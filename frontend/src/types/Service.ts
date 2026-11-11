//getall
export interface ServiceSummary {
  id: string
  name: string
}

//getbyid/modifybyid
export interface Service {
    ServiceId: string,
    ServiceName: string,
    Price: number,
    Category: string,
    Description: string | null,
}

//create
export interface ServiceInput {
    ServiceName: string,
    Price: number,
    Category: string,
    Description?: string | null,
}