// 代码生成时间: 2025-10-07 21:19:11
 * - It includes error handling and comments for clarity and maintainability.
 */

import { PrismaClient } from '@prisma/client';

// Initialize the Prisma client
const prisma = new PrismaClient();

// Define the GameResource interface based on the expected database schema
interface GameResource {
    id: number;
    name: string;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}

// GameResourceManager class responsible for managing game resources
class GameResourceManager {
    private prisma: PrismaClient;

    constructor(prismaClient: PrismaClient) {
        this.prisma = prismaClient;
    }

    // Retrieve a list of all game resources
    public async getAllResources(): Promise<GameResource[]> {
        try {
            const resources = await this.prisma.gameResource.findMany();
            return resources;
        } catch (error) {
            console.error('Failed to retrieve game resources:', error);
            throw new Error('Failed to retrieve game resources');
        }
    }

    // Retrieve a single game resource by ID
    public async getResourceById(id: number): Promise<GameResource | null> {
        try {
            const resource = await this.prisma.gameResource.findUnique({ where: { id } });
            return resource;
        } catch (error) {
            console.error('Failed to retrieve game resource by ID:', error);
            throw new Error('Failed to retrieve game resource by ID');
        }
    }

    // Create a new game resource
    public async createResource(resourceData: Omit<GameResource, 'id' | 'createdAt' | 'updatedAt'>): Promise<GameResource> {
        try {
            const resource = await this.prisma.gameResource.create({
                data: resourceData,
            });
            return resource;
        } catch (error) {
            console.error('Failed to create game resource:', error);
            throw new Error('Failed to create game resource');
        }
    }

    // Update an existing game resource
    public async updateResource(id: number, updateData: Partial<GameResource>): Promise<GameResource> {
        try {
            const resource = await this.prisma.gameResource.update({
                where: { id },
                data: updateData,
            });
            return resource;
        } catch (error) {
            console.error('Failed to update game resource:', error);
            throw new Error('Failed to update game resource');
        }
    }

    // Delete a game resource by ID
    public async deleteResource(id: number): Promise<GameResource> {
        try {
            const resource = await this.prisma.gameResource.delete({
                where: { id },
            });
            return resource;
        } catch (error) {
            console.error('Failed to delete game resource:', error);
            throw new Error('Failed to delete game resource');
        }
    }
}

// Example usage of the GameResourceManager
(async () => {
    const gameResourceManager = new GameResourceManager(prisma);
    try {
        const allResources = await gameResourceManager.getAllResources();
        console.log('All Resources:', allResources);

        const newResource = await gameResourceManager.createResource({ name: 'Gold', quantity: 100 });
        console.log('New Resource:', newResource);

        const updatedResource = await gameResourceManager.updateResource(newResource.id, { quantity: 150 });
        console.log('Updated Resource:', updatedResource);

        const resourceToDelete = await gameResourceManager.getResourceById(newResource.id);
        if (resourceToDelete) {
            await gameResourceManager.deleteResource(resourceToDelete.id);
            console.log('Resource deleted:', resourceToDelete.id);
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();