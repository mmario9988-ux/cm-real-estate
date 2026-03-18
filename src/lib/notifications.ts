import prisma from './prisma';

/**
 * Sends a push notification to all registered devices.
 * This is a foundation for Expo or FCM notifications.
 */
export async function broadcastNewProperty(property: { id: string; title: string, price: number }) {
  try {
    const tokens = await prisma.pushToken.findMany({
      select: { token: true, platform: true }
    });

    if (tokens.length === 0) return;

    console.log(`Broadcasting new property "${property.title}" to ${tokens.length} devices.`);

    // Integration with Expo Push API example:
    // const messages = tokens.map(t => ({
    //   to: t.token,
    //   sound: 'default',
    //   title: 'บ้านใหม่ในเชียงใหม่! 🏡',
    //   body: `${property.title} - ราคา ${property.price.toLocaleString()} บาท`,
    //   data: { propertyId: property.id },
    // }));
    // await fetch('https://exp.host/--/api/v2/push/send', { ... });
    
    // For now, we log the intent. In a real production setup, 
    // we would call the push service here.
  } catch (error) {
    console.error("Failed to broadcast push notifications:", error);
  }
}
