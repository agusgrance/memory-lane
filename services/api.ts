const API_URL = 'http://localhost:4001'

export interface Memory {
    id?: number
    name: string
    description: string
    timestamp: string
    image?: string
}

export interface MemoriesResponse {
    memories: Memory[]
    total: number
    hasMore: boolean
}

export interface User {
    id: number
    name: string
    description: string
}

export const memoryService = {
    async getAll(page: number, sort: 'older' | 'newer'): Promise<MemoriesResponse> {
        const response = await fetch(
            `${API_URL}/memories?page=${page}&limit=5&sort=${sort}`
        )
        return await response.json()
    },

    async create(memory: Memory): Promise<void> {
        await fetch(`${API_URL}/memories`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memory),
        })
    },

    async update(id: number, memory: Memory): Promise<void> {
        await fetch(`${API_URL}/memories/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(memory),
        })
    },

    async delete(id: number, imageKey?: string): Promise<void> {
        if (imageKey) {
            try {
                await fetch(`/api/uploadthing/delete?key=${imageKey}`, {
                    method: 'DELETE',
                })
            } catch (error) {
                console.error('Error deleting image:', error)
            }
        }

        await fetch(`${API_URL}/memories/${id}`, {
            method: 'DELETE',
        })
    },

    async getCurrent(): Promise<User> {
        const response = await fetch(`${API_URL}/users/current`)
        console.log(response)
        return await response.json()
    },
}

export const userService = {
    async getCurrent(): Promise<User> {
        const response = await fetch(`${API_URL}/users/current`)
        return await response.json()
    },

    async update(user: Partial<User>): Promise<void> {
        await fetch(`${API_URL}/users/current`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        })
    }
} 