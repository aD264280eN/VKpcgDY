// 代码生成时间: 2025-08-05 17:14:43
import { PrismaClient } from '@prisma/client';
import { scheduleJob, Job } from 'node-schedule';

// Define the Prisma client for database operations
const prisma = new PrismaClient();

// Interface to define the structure of a scheduled task
interface ScheduledTask {
  id: number;
  taskName: string;
  schedule: string;
  command: string;
}

// Class to handle the scheduling of tasks
class Scheduler {
  private tasks: ScheduledTask[] = [];

  constructor() {
    this.loadTasks();
  }

  // Load tasks from the database
  private async loadTasks(): Promise<void> {
    try {
      this.tasks = await prisma.scheduledTask.findMany();
      this.tasks.forEach(task => {
        this.scheduleTask(task);
      });
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  }

  // Schedule a single task
  private scheduleTask(task: ScheduledTask): void {
    const job = scheduleJob(task.schedule, () => {
      this.executeCommand(task.command);
    });

    console.log(\`Scheduled task \${task.taskName} to run at \${task.schedule}\);
  }

  // Execute the command associated with the task
  private executeCommand(command: string): void {
    console.log(\`Executing command: \${command}\);
    // Here you would have the logic to execute the actual command
    // For now, it's just logged to the console
  }

  // Add a new task to the scheduler
  public async addTask(task: Omit<ScheduledTask, 'id'>): Promise<void> {
    try {
      const newTask = await prisma.scheduledTask.create({
        data: task,
      });
      this.tasks.push(newTask);
      this.scheduleTask(newTask);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  }

  // Remove a task from the scheduler
  public async removeTask(taskId: number): Promise<void> {
    try {
      const task = this.tasks.find(t => t.id === taskId);
      if (task) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        await prisma.scheduledTask.delete({
          where: { id: taskId },
        });
        console.log(\`Task \${taskId} removed from scheduler\);
      } else {
        console.error(\`Task with ID \${taskId} not found\);
      }
    } catch (error) {
      console.error('Failed to remove task:', error);
    }
  }
}

// Initialize the scheduler
const scheduler = new Scheduler();

// Example usage:
// scheduler.addTask({ taskName: 'Example Task', schedule: '*/5 * * * *', command: 'echo Hello World' });
// scheduler.removeTask(1);