// 代码生成时间: 2025-10-12 01:37:22
import { PrismaClient } from '@prisma/client';
import { ServiceRegistry } from './service_registry';

// Define a basic structure for a Service
interface IService {
  id: string;
  name: string;
  host: string;
  port: number;
}

// Define the ServiceRegistry class which handles service registration and discovery
class ServiceDiscoveryAndRegistration {
  private prisma: PrismaClient;
  private registry: ServiceRegistry;

  constructor(prismaClient: PrismaClient, registry: ServiceRegistry) {
    this.prisma = prismaClient;
    this.registry = registry;
  }

  // Register a new service
  async registerService(service: IService): Promise<void> {
    try {
      await this.prisma.service.create({
        data: service,
      });

      // Add the service to the registry
      this.registry.register(service);

      console.log(`Service ${service.name} registered successfully.`);
    } catch (error) {
      console.error(`Failed to register service: ${error}`);
      throw error;
    }
  }

  // Discover registered services
  async discoverServices(): Promise<IService[]> {
    try {
      const services = await this.prisma.service.findMany();
      return services;
    } catch (error) {
      console.error(`Failed to discover services: ${error}`);
      throw error;
    }
  }
}

// Example usage
(async () => {
  const prisma = new PrismaClient();
  const registry = new ServiceRegistry();
  const serviceDiscovery = new ServiceDiscoveryAndRegistration(prisma, registry);

  // Register a new service
  await serviceDiscovery.registerService({
    id: '1234',
    name: 'MyService',
    host: 'localhost',
    port: 8080,
  });

  // Discover registered services
  const services = await serviceDiscovery.discoverServices();
  console.log('Discovered services:', services);

  await prisma.$disconnect();
})();