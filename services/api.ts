
const API_URL = process.env.NEXT_PUBLIC_API_URL
const UPLOAD_API_URL = process.env.NEXT_PUBLIC_UPLOAD_API_URL

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

const handleApiResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'An error occurred');
    }
    return response.json();
};

export const memoryService = {
    async getAll(page: number, sort: 'older' | 'newer'): Promise<MemoriesResponse> {
        const response = await fetch(
            `${API_URL}/memories?page=${page}&limit=5&sort=${sort}`
        )
        return handleApiResponse<MemoriesResponse>(response);
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
                await fetch(`${UPLOAD_API_URL}/delete?key=${imageKey}`, {
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