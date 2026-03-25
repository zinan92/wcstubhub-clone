import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from '@/app/api/vip-tiers/route';

// Mock Prisma
const mockFindMany = vi.fn();

vi.mock('@/lib/prisma', () => ({
  default: {
    vipTier: {
      findMany: () => mockFindMany(),
    },
  },
}));

describe('GET /api/vip-tiers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns all VIP tiers in ascending order by level', async () => {
    const mockTiers = [
      { id: '1', level: 1, name: 'VIP1', threshold: 1000 },
      { id: '2', level: 2, name: 'VIP2', threshold: 5000 },
      { id: '3', level: 3, name: 'VIP3', threshold: 10000 },
      { id: '4', level: 4, name: 'VIP4', threshold: 50000 },
      { id: '5', level: 5, name: 'VIP5', threshold: 100000 },
      { id: '6', level: 6, name: 'VIP6', threshold: 500000 },
      { id: '7', level: 7, name: 'VIP7', threshold: 1000000 },
      { id: '8', level: 8, name: 'VIP8', threshold: 10000000 },
    ];

    mockFindMany.mockResolvedValue(mockTiers);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(8);
    expect(data[0].level).toBe(1);
    expect(data[7].level).toBe(8);
  });

  it('returns empty array when no tiers exist', async () => {
    mockFindMany.mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
  });

  it('handles database errors gracefully', async () => {
    mockFindMany.mockRejectedValue(new Error('Database error'));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch VIP tiers');
  });
});
