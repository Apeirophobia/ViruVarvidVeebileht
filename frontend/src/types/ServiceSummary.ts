//getall
export interface ServiceSummary {
  ServiceID: string
  ServiceName: string
}

//getbyid/modifybyid
export interface Service {
    ServiceID: string,
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