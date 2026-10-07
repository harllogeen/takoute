/**
 * Generate a unique order number
 * Format: ORD-YYYYMMDD-XXX
 * Example: ORD-20261006-001
 */
export const generateOrderNumber = (orderCount: number): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const sequence = String(orderCount + 1).padStart(3, '0');
  
  return `ORD-${year}${month}${day}-${sequence}`;
};

/**
 * Get today's order count for generating next order number
 */
export const getTodayOrderCount = async (prisma: any): Promise<number> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const count = await prisma.order.count({
    where: {
      createdAt: {
        gte: today,
        lt: tomorrow
      }
    }
  });
  
  return count;
};
