import { trpc } from '../utils/trpc';

export async function seedDatabase() {
  try {
    await trpc.seed.mutate();
    console.log('✓ Database seeded successfully');
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
}