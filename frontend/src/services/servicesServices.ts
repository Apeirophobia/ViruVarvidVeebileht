import type { Service, ServiceInput, ServiceSummary } from '../types/Service'
const API_URL = import.meta.env.VITE_BACKEND_URL

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(API_URL + endpoint, options) 

    if (!response.ok) {
        throw new Error(
            `Request has failed status is: ${response.status}`
        )
    }
    if (response.status === 204) {
        return undefined as T
    }
    return response.json() as Promise<T>
}
/* Service */

export const servicesServices = {
    getAll(): Promise<ServiceSummary[]> {
        return request<ServiceSummary[]>('/services')
    },
    getbyId(id: string): Promise<Service> {
        return request<Service>(`/services/${id}`)
    },
    create(service: ServiceInput): Promise<void> {
        return request<void>('/services', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(service)
        })
    },
    update (id: string, service: ServiceInput): Promise<void> {
        return request<void>(`/services/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(service)
        })
    },
    delete (id: string): Promise<void> {
        return request<void>(`/services/${id}`, {
            method: 'DELETE'
        })
    }
}
