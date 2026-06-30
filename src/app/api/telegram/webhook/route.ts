import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Telegram webhook payload structure:
    // { message: { chat: { id }, text: "/verify 123456", from: { ... } } }
    if (!data || !data.message || !data.message.text) {
      return NextResponse.json({ ok: true }); // Ignore non-text messages
    }

    const chatId = data.message.chat.id;
    const text = data.message.text.trim();

    // Check if the message is a verification command (/start 123456 or /verify 123456)
    if (text.startsWith('/verify ') || text.startsWith('/start ')) {
      const otpCode = text.split(' ')[1];

      if (!otpCode || otpCode.length !== 6) {
        await sendTelegramMessage(chatId, '❌ Invalid format. Please send the exact code shown on the screen (e.g. /verify 123456).');
        return NextResponse.json({ ok: true });
      }

      // Find the phone verification record
      const verification = await prisma.phoneVerification.findFirst({
        where: {
          otpCode,
          isVerified: false,
          expiresAt: { gt: new Date() }
        }
      });

      if (!verification) {
        await sendTelegramMessage(chatId, '❌ Verification code is invalid, expired, or already used.');
        return NextResponse.json({ ok: true });
      }

      // Update verification status
      await prisma.phoneVerification.update({
        where: { id: verification.id },
        data: { 
          isVerified: true,
          telegramChatId: chatId.toString()
        }
      });

      // Send success message
      await sendTelegramMessage(chatId, `✅ Success! Your phone number (${verification.phoneNumber}) is now verified. You can return to the website to place your order.`);
      
    } else {
      // For any other messages, just reply with a helpful text
      await sendTelegramMessage(chatId, 'Welcome to Stitcher! To verify your account, please send the code provided on the website. (e.g., /verify 123456)');
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    // Always return 200 OK so Telegram doesn't retry infinitely
    return NextResponse.json({ ok: true });
  }
}

async function sendTelegramMessage(chatId: string | number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });
  } catch (err) {
    console.error('Failed to send telegram reply:', err);
  }
}
