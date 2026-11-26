import type { Contact, ContactInput, ContactSummary } from '../types/ContactSummary'
const API_URL = import.meta.env.VITE_BACKEND_URL

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch("http://localhost:8080" + endpoint, options) 

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
/* Contact */

export const contactsServices = {
    getAll(): Promise<ContactSummary[]> {
        return request<ContactSummary[]>('/contacts')
    },
    getByID(ContactID: string): Promise<Contact> {
        return request<Contact>(`/contacts/${ContactID}`)
    },
    create(contact: ContactInput): Promise<void> {
        return request<void>('/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        })
    },
    update (id: string, contact: ContactInput): Promise<void> {
        return request<void>(`/contacts/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contact)
        })
    }
}
