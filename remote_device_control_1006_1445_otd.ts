// 代码生成时间: 2025-10-06 14:45:02
import { PrismaClient } from '@prisma/client';

// Initialize the Prisma client
const prisma = new PrismaClient();

// Interface to represent the device
interface Device {
  id: number;
  name: string;
  status: 'ON' | 'OFF';
}

class RemoteDeviceControl {
  /**
   * Fetches a device by ID
   * @param deviceId The ID of the device to fetch
   * @returns The device object if found, otherwise null
   */
  async getDeviceById(deviceId: number): Promise<Device | null> {
    try {
      const device = await prisma.device.findUnique({
        where: {
          id: deviceId,
        },
      });
      return device;
    } catch (error) {
      console.error('Error fetching device:', error);
      throw error;
    }
  }

  /**
   * Toggles the device status between ON and OFF
   * @param deviceId The ID of the device to toggle
   * @returns The updated device object
   */
  async toggleDeviceStatus(deviceId: number): Promise<Device> {
    try {
      const device = await this.getDeviceById(deviceId);
      if (!device) {
        throw new Error('Device not found');
      }
      const newStatus = device.status === 'ON' ? 'OFF' : 'ON';
      const updatedDevice = await prisma.device.update({
        where: {
          id: deviceId,
        },
        data: {
          status: newStatus,
        },
      });
      return updatedDevice;
    } catch (error) {
      console.error('Error toggling device status:', error);
      throw error;
    }
  }
}

// Example usage:
const deviceController = new RemoteDeviceControl();
deviceController.toggleDeviceStatus(1)
  .then((updatedDevice) => {
    console.log('Updated device:', updatedDevice);
  }).catch((error) => {
    console.error('Failed to toggle device status:', error);
  });