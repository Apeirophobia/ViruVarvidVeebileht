import type { User, UserSummary } from '../types/User'

const API_URL = import.meta.env.VITE_BACKEND_URL

async function request<T>(endpoint: string): Promise<T> {
    const response = await fetch(API_URL + endpoint)
    if(!response.ok) {
        throw new Error(
            `Request has failed, status is: ${response.status}`
        )
    }
    return response.json() as Promise<T>
}

export const usersServices = {
    getAll(): Promise<UserSummary[]> {
        return request<UserSummary[]>("/users")
    },
    getById(id: string): Promise<User> {
        return request<User>(`/users/${id}`)
    }
}