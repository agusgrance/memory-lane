const API_URL = 'http://localhost:4001'

export interface Memory {
    id?: number
    name: string
    description: string
    timestamp: string
    image?: string
}

export const memoryService = {
    async getAll(): Promise<Memory[]> {
        const response = await fetch(`${API_URL}/memories`)
        const data = await response.json()
        return data.memories
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

    async delete(id: number): Promise<void> {
        await fetch(`${API_URL}/memories/${id}`, {
            method: 'DELETE',
        })
    },
} 