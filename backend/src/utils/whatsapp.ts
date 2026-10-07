interface WhatsAppOrderData {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  paymentMethod: string;
}

export const formatOrderForWhatsApp = (orderData: WhatsAppOrderData): string => {
  const itemsList = orderData.items
    .map((item, index) => {
      const itemTotal = item.price * item.quantity;
      return `${index + 1}. ${item.name}\n   Qty: ${item.quantity} x ₦${item.price.toLocaleString()} = ₦${itemTotal.toLocaleString()}`;
    })
    .join('\n\n');

  const message = `🍽️ *NEW ORDER FROM TAKEOUTE*

📝 *ORDER DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Order Number: *${orderData.orderNumber}*

*ITEMS:*
${itemsList}

━━━━━━━━━━━━━━━━━━━━━━━━━━━
*TOTAL: ₦${orderData.total.toLocaleString()}*

👤 *CUSTOMER DETAILS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${orderData.customerName}
Phone: ${orderData.customerPhone}

📍 *DELIVERY ADDRESS*
━━━━━━━━━━━━━━━━━━━━━━━━━━━
${orderData.deliveryAddress}

💳 *PAYMENT METHOD*
${orderData.paymentMethod.replace('_', ' ')}

Please confirm this order. Thank you! 🙏`;

  // Format WhatsApp URL
  const whatsappNumber = process.env.WHATSAPP_BUSINESS_NUMBER || '2348012345678';
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const formattedNumber = cleanNumber.startsWith('234') 
    ? cleanNumber 
    : `234${cleanNumber.substring(1)}`;
  
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${formattedNumber}?text=${encodedMessage}`;
};
