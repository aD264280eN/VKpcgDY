// 代码生成时间: 2025-09-15 18:31:25
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

// Database client instance
const prisma = new PrismaClient();

// Interface for log entry
interface LogEntry {
  // Define the structure of a log entry
  timestamp: Date;
  level: string;
  message: string;
}

// Function to parse a single log line
function parseLogLine(line: string): LogEntry | null {
  try {
    // Assuming the log line format is "timestamp level: message"
    const parts = line.split(/: | /);
    if (parts.length !== 3) return null;
    const [timestamp, level, message] = parts;
    return {
      timestamp: new Date(timestamp),
      level,
      message,
    };
  } catch (error) {
    console.error('Error parsing log line:', error);
    return null;
  }
}

// Function to read and parse log file
async function parseLogFile(filePath: string): Promise<LogEntry[]> {
  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    throw new Error('Log file does not exist.');
  }
  
  const logEntries: LogEntry[] = [];
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const lines = fileContent.split('
');
  
  for (const line of lines) {
    if (line.trim() === '') continue;
    const logEntry = parseLogLine(line);
    if (logEntry) logEntries.push(logEntry);
  }

  return logEntries;
}

// Function to save parsed log entries to the database
async function saveLogEntries(entries: LogEntry[]): Promise<void> {
  for (const entry of entries) {
    await prisma.logEntry.create({
      data: {
        timestamp: entry.timestamp,
        level: entry.level,
        message: entry.message,
      },
    });
  }
}

// Main function to execute the log parsing tool
async function main(): Promise<void> {
  try {
    const logFilePath = path.join(__dirname, 'logs', 'logfile.log');
    const logEntries = await parseLogFile(logFilePath);
    await saveLogEntries(logEntries);
    console.log('Log parsing completed successfully.');
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Execute the main function
main();